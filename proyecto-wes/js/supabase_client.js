// ============================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// CLIENTE Y SERVICIO DE BASE DE DATOS POSTGRESQL (VÍA SUPABASE)
// Diseñado para alta disponibilidad, seguridad RLS y resiliencia offline
// ============================================================================

const WesDB = (function() {
  const STORAGE_KEY_URL = 'wes_supabase_url';
  const STORAGE_KEY_ANON = 'wes_supabase_anon_key';

  // Configuración predeterminada o almacenada en el navegador
  let supabaseUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  let supabaseAnonKey = localStorage.getItem(STORAGE_KEY_ANON) || '';
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
          // 1. Registrar o recuperar cliente
          const { data: cliente, error: cliError } = await client
            .from('clientes')
            .insert([{
              nombre: quoteData.clientName,
              empresa: quoteData.company || null,
              rnc_cedula: quoteData.taxId || null,
              telefono: quoteData.phone,
              email: quoteData.email,
              ciudad: quoteData.city || 'Moca',
              direccion: quoteData.address || null
            }])
            .select()
            .single();

          if (cliError) throw cliError;

          // 2. Registrar cabecera de cotización
          const { data: cotizacion, error: cotError } = await client
            .from('cotizaciones')
            .insert([{
              codigo_cotizacion: quoteData.id,
              cliente_id: cliente.id,
              subtotal: quoteData.subtotal,
              itbis: quoteData.tax,
              total: quoteData.total,
              estado: 'pendiente',
              notas_cliente: quoteData.notes || ''
            }])
            .select()
            .single();

          if (cotError) throw cotError;

          // 3. Registrar detalles
          if (quoteData.items && quoteData.items.length > 0) {
            const detalles = quoteData.items.map(item => ({
              cotizacion_id: cotizacion.id,
              producto_id: item.id.startsWith('prod-') ? item.id : null,
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
          return { success: true, id: quoteData.id, pgId: cotizacion.id };
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
          // 1. Registrar cliente
          const { data: cliente, error: cliError } = await client
            .from('clientes')
            .insert([{
              nombre: ticketData.name,
              telefono: ticketData.phone,
              email: ticketData.email,
              ciudad: 'Moca',
              direccion: ticketData.location
            }])
            .select()
            .single();

          if (cliError) throw cliError;

          // 2. Insertar ticket
          const { data: ticket, error: tktError } = await client
            .from('tickets_soporte')
            .insert([{
              codigo_ticket: ticketData.ticketCode,
              cliente_id: cliente.id,
              tipo_servicio: ticketData.serviceType,
              direccion_servicio: ticketData.location,
              descripcion_problema: ticketData.description,
              estado: 'abierto',
              prioridad: 'media'
            }])
            .select()
            .single();

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
                    ticket_id: ticket.id,
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
