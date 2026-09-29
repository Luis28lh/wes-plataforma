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
    // GESTIÓN DE PRODUCTOS E INVENTARIO
    // ------------------------------------------------------------------------
    getProducts: async function() {
      const CATEGORY_NAMES = {
        'energia': 'Energía y Respaldo',
        'cables': 'Accesorios de Instalación',
        'redes': 'Redes y Conectividad',
        'camaras': 'Cámaras de Seguridad',
        'acceso': 'Controles de Acceso',
        'cerraduras': 'Cerraduras Inteligentes',
        'alarmas': 'Alarmas y Sensores',
        'automatizacion': 'Automatización y Domótica',
        'grabadores': 'Grabadores DVR y NVR',
        'intercom': 'Videoporteros e Intercomunicadores',
        'accesorios': 'Accesorios de Instalación',
        'otros': 'Accesorios de Instalación'
      };

      if (this.isConfigured()) {
        try {
          const { data, error } = await client
            .from('productos')
            .select('*')
            .eq('activo', true)
            .order('destacado', { ascending: false });

          if (error) throw error;
          if (data && data.length >= 200) {
            // Mapear campos garantizando que category sea legible y categoria_id sea el slug
            return data.map(p => {
              const catName = CATEGORY_NAMES[p.categoria_id] || p.categoria_id || 'Accesorios de Instalación';
              return {
                id: p.id,
                name: p.nombre,
                nombre: p.nombre,
                code: p.codigo,
                codigo: p.codigo,
                brand: p.marca,
                marca: p.marca,
                category: catName,
                categoria_id: p.categoria_id,
                description: p.descripcion,
                descripcion: p.descripcion,
                const localRef = (typeof INITIAL_PRODUCTS !== 'undefined' && Array.isArray(INITIAL_PRODUCTS))
                  ? INITIAL_PRODUCTS.find(i => (i.codigo && (i.codigo === p.codigo || i.codigo === p.code)) || (i.code && (i.code === p.codigo || i.code === p.code)) || i.id === p.id)
                  : null;

                const rawImg = p.imagen_url || '';
                const chosenImg = (localRef && (localRef.image || localRef.imagen_url || '').startsWith('assets/'))
                  ? (localRef.image || localRef.imagen_url)
                  : (rawImg.startsWith('assets/') ? rawImg : ((localRef && localRef.image) || rawImg));

                const chosenGallery = (localRef && Array.isArray(localRef.gallery_images) && localRef.gallery_images.length > 0 && (!p.gallery_images || p.gallery_images.length === 0 || p.gallery_images.some(g => (g.url || '').includes('unsplash'))))
                  ? localRef.gallery_images
                  : (Array.isArray(p.gallery_images) && p.gallery_images.length > 0 ? p.gallery_images : ((localRef && localRef.gallery_images) || []));

                const chosenAttributes = (localRef && localRef.key_attributes && Object.keys(localRef.key_attributes).length > 0)
                  ? Object.assign({}, p.key_attributes || {}, localRef.key_attributes)
                  : (p.key_attributes || {});

                const chosenManual = (localRef && (localRef.manualUrl || localRef.manual_url))
                  ? (localRef.manualUrl || localRef.manual_url)
                  : (p.manual_url || (Array.isArray(p.caracteristicas) && (p.caracteristicas.find(f => typeof f === 'string' && f.startsWith('manual_url:')) || '').replace('manual_url:', '')) || null);

                return {
                  id: p.id,
                  name: (localRef && localRef.name && localRef.name.length > (p.nombre || '').length) ? localRef.name : (p.nombre || 'Producto WES'),
                  nombre: (localRef && localRef.nombre && localRef.nombre.length > (p.nombre || '').length) ? localRef.nombre : (p.nombre || 'Producto WES'),
                  code: p.codigo,
                  codigo: p.codigo,
                  brand: (localRef && localRef.brand && localRef.brand !== 'WES') ? localRef.brand : (p.marca || 'WES'),
                  marca: (localRef && localRef.marca && localRef.marca !== 'WES') ? localRef.marca : (p.marca || 'WES'),
                  category: catName,
                  categoria_id: p.categoria_id,
                  description: (localRef && localRef.description && localRef.description.length > (p.descripcion || '').length) ? localRef.description : (p.descripcion || ''),
                  descripcion: (localRef && localRef.descripcion && localRef.descripcion.length > (p.descripcion || '').length) ? localRef.descripcion : (p.descripcion || ''),
                  features: Array.isArray(p.caracteristicas) && p.caracteristicas.length > 0 ? p.caracteristicas : ((localRef && localRef.features) || []),
                  caracteristicas: Array.isArray(p.caracteristicas) && p.caracteristicas.length > 0 ? p.caracteristicas : ((localRef && localRef.caracteristicas) || []),
                  manualUrl: chosenManual,
                  manual_url: chosenManual,
                  price: Number(p.precio),
                  precio: Number(p.precio),
                  currency: p.moneda || 'DOP',
                  moneda: p.moneda || 'DOP',
                  availability: p.disponibilidad || 'Disponible',
                  disponibilidad: p.disponibilidad || 'Disponible',
                  stock: Number(p.stock || 0),
                  image: chosenImg,
                  imagen_url: chosenImg,
                  active: p.activo !== false,
                  activo: p.activo !== false,
                  featured: Boolean(p.destacado),
                  destacado: Boolean(p.destacado),
                  en_oferta: Boolean(p.en_oferta || (localRef && localRef.en_oferta)),
                  is_offer: Boolean(p.en_oferta || (localRef && localRef.en_oferta)),
                  novedad: Boolean(p.novedad || (localRef && localRef.novedad)),
                  is_new: Boolean(p.novedad || (localRef && localRef.novedad)),
                  precio_anterior: p.precio_anterior ? Number(p.precio_anterior) : ((localRef && localRef.precio_anterior) || null),
                  tipo_promocion: p.tipo_promocion || (localRef && localRef.tipo_promocion) || (p.en_oferta ? 'oferta' : 'normal'),
                  gallery_images: chosenGallery,
                  key_attributes: chosenAttributes
                };
              });
            }
        } catch (err) {
          console.warn('[WesDB] Fallo al consultar productos en PostgreSQL, usando fallback local:', err);
        }
      }
      // Fallback local seguro con los 237 productos iniciales
      return StorageService.getProducts();
    },

    saveProduct: async function(productData) {
      if (this.isConfigured()) {
        try {
          const row = {
            id: String(productData.id),
            codigo: String(productData.code || productData.codigo || productData.id),
            nombre: productData.name || productData.nombre || 'Producto WES',
            marca: productData.brand || productData.marca || 'WES',
            categoria_id: productData.category || productData.categoria_id || 'otros',
            descripcion: productData.description || productData.descripcion || '',
            caracteristicas: productData.features || productData.caracteristicas || [],
            precio: Number(productData.price || productData.precio || 0),
            moneda: productData.currency || productData.moneda || 'DOP',
            disponibilidad: productData.availability || productData.disponibilidad || 'Disponible',
            stock: Number(productData.stock !== undefined ? productData.stock : 0),
            imagen_url: productData.image || productData.imagen_url || '',
            destacado: Boolean(productData.featured || productData.destacado),
            activo: productData.active !== false && productData.activo !== false,
            en_oferta: Boolean(productData.en_oferta || productData.is_offer),
            novedad: Boolean(productData.novedad || productData.is_new),
            precio_anterior: productData.precio_anterior ? Number(productData.precio_anterior) : null,
            tipo_promocion: productData.tipo_promocion || (productData.en_oferta ? 'oferta' : 'normal'),
            manual_url: productData.manualUrl || productData.manual_url || null,
            gallery_images: Array.isArray(productData.gallery_images) ? productData.gallery_images : [],
            key_attributes: (productData.key_attributes && typeof productData.key_attributes === 'object') ? productData.key_attributes : {},
            updated_at: new Date().toISOString()
          };

          const { error } = await client
            .from('productos')
            .upsert([row], { onConflict: 'id' });

          if (error) throw error;
          console.log('[WesDB] Producto guardado en Supabase:', row.id);
          return { success: true };
        } catch (err) {
          console.warn('[WesDB] Error al guardar producto en Supabase:', err);
          return { success: false, error: err };
        }
      }
      return { success: false, reason: 'unconfigured' };
    },

    deleteProduct: async function(productId) {
      if (this.isConfigured()) {
        try {
          const { error } = await client
            .from('productos')
            .update({ activo: false, updated_at: new Date().toISOString() })
            .eq('id', String(productId));
          if (error) throw error;
          return { success: true };
        } catch (err) {
          console.warn('[WesDB] Error al desactivar producto en Supabase:', err);
        }
      }
      return { success: false };
    },

    syncAllProducts: async function(productsList) {
      if (!this.isConfigured()) return { success: false, message: 'Supabase no conectado' };
      const items = Array.isArray(productsList) ? productsList : StorageService.getProducts();
      let successCount = 0;
      const batchSize = 40;

      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize).map(p => ({
          id: String(p.id),
          codigo: String(p.code || p.codigo || p.id),
          nombre: p.name || p.nombre || 'Producto WES',
          marca: p.brand || p.marca || 'WES',
          categoria_id: p.category || p.categoria_id || 'otros',
          descripcion: p.description || p.descripcion || '',
          caracteristicas: p.features || p.caracteristicas || [],
          precio: Number(p.price || p.precio || 0),
          moneda: p.currency || p.moneda || 'DOP',
          disponibilidad: p.availability || p.disponibilidad || 'Disponible',
          stock: Number(p.stock !== undefined ? p.stock : 0),
          imagen_url: p.image || p.imagen_url || '',
          destacado: Boolean(p.featured || p.destacado),
          activo: p.active !== false && p.activo !== false,
          en_oferta: Boolean(p.en_oferta || p.is_offer),
          novedad: Boolean(p.novedad || p.is_new),
          precio_anterior: p.precio_anterior ? Number(p.precio_anterior) : null,
          tipo_promocion: p.tipo_promocion || (p.en_oferta ? 'oferta' : 'normal'),
          manual_url: p.manualUrl || p.manual_url || null,
          gallery_images: Array.isArray(p.gallery_images) ? p.gallery_images : [],
          key_attributes: (p.key_attributes && typeof p.key_attributes === 'object') ? p.key_attributes : {},
          updated_at: new Date().toISOString()
        }));

        try {
          const { error } = await client.from('productos').upsert(batch, { onConflict: 'id' });
          if (!error) successCount += batch.length;
          else console.warn('[WesDB] Error en lote Supabase:', error);
        } catch (e) {
          console.warn('[WesDB] Excepción en lote Supabase:', e);
        }
      }
      return { success: true, count: successCount, total: items.length };
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
    // REGISTRO DE MENSAJES DE CONTACTO
    // ------------------------------------------------------------------------
    createContactMessage: async function(contactData) {
      if (this.isConfigured()) {
        try {
          const { error } = await client
            .from('mensajes_contacto')
            .insert([{
              id: generateUUID(),
              nombre_remitente: contactData.name,
              email: contactData.email,
              telefono: contactData.phone || null,
              asunto: contactData.subject,
              mensaje: contactData.message,
              leido: false,
              respondido: false
            }]);
          if (error) throw error;
          console.log('[WesDB] Mensaje de contacto persistido en PostgreSQL.');
          return { success: true };
        } catch (err) {
          console.warn('[WesDB] Error en createContactMessage PG:', err);
        }
      }
      return { success: false, source: 'local' };
    },

    // ------------------------------------------------------------------------
    // GESTIÓN DE RESEÑAS Y VALORACIONES DE PRODUCTOS
    // ------------------------------------------------------------------------
    getReviews: async function(productId) {
      if (this.isConfigured()) {
        try {
          const { data, error } = await client
            .from('resenas_productos')
            .select('*')
            .eq('producto_id', productId)
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            return data.map(r => ({
              id: r.id,
              productId: r.producto_id,
              author: r.cliente_nombre,
              location: r.cliente_ciudad,
              rating: parseFloat(r.calificacion_general),
              productQuality: parseFloat(r.calidad_producto),
              shippingQuality: parseFloat(r.calidad_envio),
              serviceQuality: parseFloat(r.calidad_servicio),
              comment: r.comentario,
              verified: r.verificado,
              date: new Date(r.created_at).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' })
            }));
          }
        } catch (err) {
          console.warn('[WesDB] Error al consultar reseñas en PostgreSQL, usando fallback local:', err);
        }
      }
      return StorageService.getProductReviews(productId);
    },

    createReview: async function(reviewData) {
      if (this.isConfigured()) {
        try {
          const reviewId = generateUUID();
          const { error } = await client
            .from('resenas_productos')
            .insert([{
              id: reviewId,
              producto_id: reviewData.productId,
              cliente_nombre: reviewData.author,
              cliente_ciudad: reviewData.location || 'Moca, Rep. Dom.',
              calificacion_general: reviewData.rating || 5.0,
              calidad_producto: reviewData.productQuality || 5.0,
              calidad_envio: reviewData.shippingQuality || 5.0,
              calidad_servicio: reviewData.serviceQuality || 5.0,
              comentario: reviewData.comment,
              verificado: true
            }]);

          if (!error) {
            console.log('[WesDB] Reseña guardada con éxito en PostgreSQL Supabase');
          } else {
            console.warn('[WesDB] Error al insertar reseña en PostgreSQL:', error);
          }
        } catch (err) {
          console.warn('[WesDB] Error de conexión al guardar reseña en PostgreSQL:', err);
        }
      }

      // Persistencia local para disponibilidad offline inmediata
      const savedReview = Object.assign({ id: 'local-' + Date.now(), date: 'Hoy' }, reviewData);
      StorageService.saveProductReview(savedReview);
      return { success: true, review: savedReview };
    },

    // ------------------------------------------------------------------------
    // GESTIÓN DE MANUALES TÉCNICOS PDF
    // ------------------------------------------------------------------------
    getManual: async function(productId, sku) {
      if (this.isConfigured()) {
        try {
          const query = client
            .from('manuales_productos')
            .select('*')
            .eq('activo', true);

          if (productId && sku) {
            query.or(`producto_id.eq.${productId},sku.eq.${sku}`);
          } else if (productId) {
            query.eq('producto_id', productId);
          } else if (sku) {
            query.eq('sku', sku);
          }

          const { data, error } = await query.limit(1);
          if (!error && data && data.length > 0) {
            return data[0];
          }
        } catch (err) {
          console.warn('[WesDB] Error al consultar manuales en PostgreSQL:', err);
        }
      }
      return null;
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
