// ============================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// CLIENTE Y SERVICIO DE BASE DE DATOS POSTGRESQL (VÍA SUPABASE)
// Diseñado para alta disponibilidad, seguridad RLS y resiliencia offline
// ============================================================================

const WesDB = (function() {
  const STORAGE_KEY_URL = 'wes_supabase_url';
  const STORAGE_KEY_ANON = 'wes_supabase_anon_key';

  const DEFAULT_SUPABASE_URL = 'https://tzvuloziazkbcfdwzzff.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dnVsb3ppYXprYmNmZHd6emZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNjQxNDMsImV4cCI6MjEwNTc0MDE0M30.ibLWFcEh--IsMYE5fjxm2SiaFPTprQs9gJm_eorI2mY';

  // Configuración predeterminada o almacenada en el navegador
  let supabaseUrl = localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_SUPABASE_URL;
  let supabaseAnonKey = localStorage.getItem(STORAGE_KEY_ANON) || DEFAULT_SUPABASE_ANON_KEY;
  let client = null;

  function initClient() {
    if (supabaseUrl && supabaseAnonKey && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        client = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
        console.log('[WesDB] Cliente PostgreSQL Supabase conectado con éxito.');
        return true;
      } catch (e) {
        console.warn('[WesDB] Error al inicializar cliente Supabase:', e);
      }
    }
    return false;
  }

  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Inicializar al cargar
  initClient();

  return {
    isConfigured: function() {
      return Boolean(supabaseUrl && supabaseAnonKey && client);
    },

    getCredentials: function() {
      return {
        url: supabaseUrl,
        key: supabaseAnonKey
      };
    },

    saveCredentials: function(url, anonKey) {
      if (!url || !anonKey) {
        throw new Error('Debe proporcionar la URL del proyecto y la Anon Key.');
      }
      supabaseUrl = url.trim().replace(/\/$/, '');
      supabaseAnonKey = anonKey.trim();
      localStorage.setItem(STORAGE_KEY_URL, supabaseUrl);
      localStorage.setItem(STORAGE_KEY_ANON, supabaseAnonKey);
      initClient();
      return true;
    },

    disconnect: function() {
      localStorage.removeItem(STORAGE_KEY_URL);
      localStorage.removeItem(STORAGE_KEY_ANON);
      supabaseUrl = '';
      supabaseAnonKey = '';
      client = null;
    },

    // ------------------------------------------------------------------------
    // PRODUCTOS (LECTURA Y GESTIÓN CON RLS)
    // ------------------------------------------------------------------------
    getProducts: async function() {
      if (this.isConfigured()) {
        try {
          const { data, error } = await client
            .from('productos')
            .select('*')
            .eq('activo', true)
            .order('destacado', { ascending: false });

          if (error) throw error;
          if (data && data.length > 0) {
            // Mapear campos si es necesario
            return data.map(p => ({
              id: p.id,
              name: p.nombre,
              code: p.codigo,
              brand: p.marca,
              category: p.categoria_id,
              description: p.descripcion,
              features: Array.isArray(p.caracteristicas) ? p.caracteristicas : [],
              price: Number(p.precio),
              availability: p.disponibilidad,
              stock: p.stock,
              image: p.imagen_url,
              active: p.activo
            }));
          }
        } catch (err) {
          console.warn('[WesDB] Fallo al consultar productos en PostgreSQL, usando fallback local:', err);
        }
      }
      // Fallback local seguro
      return StorageService.getProducts();
    },

    // ------------------------------------------------------------------------
    // REGISTRO DE COTIZACIONES
    // ------------------------------------------------------------------------
    createQuote: async function(quoteData) {
      if (this.isConfigured()) {
        try {
          const clienteId = generateUUID();
          const cotizacionId = generateUUID();

          // 1. Registrar cliente en PostgreSQL
          const { error: cliError } = await client
            .from('clientes')
            .insert([{
              id: clienteId,
              nombre: quoteData.clientName,
              empresa: quoteData.company || null,
              rnc_cedula: quoteData.taxId || null,
              telefono: quoteData.phone,
              email: quoteData.email,
              ciudad: quoteData.city || 'Moca',
              direccion: quoteData.address || null
            }]);

          if (cliError) throw cliError;

          // 2. Registrar cabecera de cotización
          const { error: cotError } = await client
            .from('cotizaciones')
            .insert([{
              id: cotizacionId,
              codigo_cotizacion: quoteData.id,
              cliente_id: clienteId,
              subtotal: quoteData.subtotal,
              itbis: quoteData.tax,
              total: quoteData.total,
              estado: 'pendiente',
              notas_cliente: quoteData.notes || ''
            }]);

          if (cotError) throw cotError;

          // 3. Registrar detalles
          if (quoteData.items && quoteData.items.length > 0) {
            const detalles = quoteData.items.map(item => ({
              id: generateUUID(),
              cotizacion_id: cotizacionId,
              producto_id: (item.id && String(item.id).startsWith('prod-')) ? item.id : null,
              nombre_producto: item.name,
              codigo_producto: item.code || '',
              precio_unitario: item.price,
              cantidad: item.quantity,
              subtotal: item.price * item.quantity
            }));

            const { error: detError } = await client
              .from('cotizacion_detalles')
              .insert(detalles);

            if (detError) console.warn('[WesDB] Error registrando items de cotización:', detError);
          }

          console.log('[WesDB] Cotización guardada en PostgreSQL:', quoteData.id);
          return { success: true, id: quoteData.id, pgId: cotizacionId };
        } catch (err) {
          console.warn('[WesDB] Error en createQuote PG, persistiendo localmente:', err);
        }
      }

      // Persistencia local + Google Apps Script fallback
      const quotes = StorageService.getQuotes();
      quotes.unshift(quoteData);
      StorageService.saveQuotes(quotes);
      return { success: true, id: quoteData.id, source: 'local' };
    },

    // ------------------------------------------------------------------------
    // REGISTRO DE TICKETS DE SOPORTE TÉCNICO CON FOTOS (STORAGE BUCKET)
    // ------------------------------------------------------------------------
    createSupportTicket: async function(ticketData, fileAttachments = []) {
      if (this.isConfigured()) {
        try {
          const clienteId = generateUUID();
          const ticketId = generateUUID();

          // 1. Registrar cliente
          const { error: cliError } = await client
            .from('clientes')
            .insert([{
              id: clienteId,
              nombre: ticketData.name,
              telefono: ticketData.phone,
              email: ticketData.email,
              ciudad: 'Moca',
              direccion: ticketData.location
            }]);

          if (cliError) throw cliError;

          // 2. Insertar ticket
          const { error: tktError } = await client
            .from('tickets_soporte')
            .insert([{
              id: ticketId,
              codigo_ticket: ticketData.ticketCode,
              cliente_id: clienteId,
              tipo_servicio: ticketData.serviceType,
              direccion_servicio: ticketData.location,
              descripcion_problema: ticketData.description,
              estado: 'abierto',
              prioridad: 'media'
            }]);

          if (tktError) throw tktError;

          // 3. Subir fotos a Supabase Storage (Bucket 'evidencias-soporte')
          if (fileAttachments && fileAttachments.length > 0) {
            for (let i = 0; i < fileAttachments.length; i++) {
              const file = fileAttachments[i];
              const ext = file.name.split('.').pop() || 'jpg';
              const filePath = `${ticketData.ticketCode}/${Date.now()}_${i}.${ext}`;

              const { data: uploadData, error: upError } = await client
                .storage
                .from('evidencias-soporte')
                .upload(filePath, file, {
                  cacheControl: '3600',
                  upsert: false
                });

              if (!upError && uploadData) {
                const { data: publicUrlData } = client
                  .storage
                  .from('evidencias-soporte')
                  .getPublicUrl(filePath);

                // Guardar referencia en tabla ticket_evidencias
                await client
                  .from('ticket_evidencias')
                  .insert([{
                    id: generateUUID(),
                    ticket_id: ticketId,
                    archivo_url: publicUrlData.publicUrl,
                    nombre_original: file.name,
                    tipo_mime: file.type,
                    tamano_bytes: file.size
                  }]);
              }
            }
          }

          console.log('[WesDB] Ticket y evidencias almacenados en PostgreSQL:', ticketData.ticketCode);
          return { success: true, ticketCode: ticketData.ticketCode };
        } catch (err) {
          console.warn('[WesDB] Error en createSupportTicket PG, persistiendo localmente:', err);
        }
      }

      // Persistencia local fallback
      const tickets = StorageService.getSupportTickets();
      tickets.unshift(ticketData);
      StorageService.saveSupportTickets(tickets);
      return { success: true, ticketCode: ticketData.ticketCode, source: 'local' };
    },

    // ------------------------------------------------------------------------
    // REGISTRO DE AUDITORÍA INMUTABLE
    // ------------------------------------------------------------------------
    logAudit: async function(action, moduleName, details = {}) {
      if (this.isConfigured()) {
        try {
          const user = (typeof AdminAuth !== 'undefined') ? AdminAuth.getCurrentUser() : null;
          await client
            .from('auditoria_logs')
            .insert([{
              usuario_id: null,
              usuario_email: user ? user.email : 'sistema@wes.com.do',
              accion: action,
              modulo: moduleName,
              detalles: details,
              user_agent: navigator.userAgent
            }]);
        } catch (err) {
          console.warn('[WesDB] No se pudo guardar log en PostgreSQL:', err);
        }
      }
      // Local fallback
      if (typeof AdminAudit !== 'undefined') {
        AdminAudit.log(action, moduleName, details);
      }
    }
  };
})();

window.WesDB = WesDB;
