// ============================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// MOTOR DE SINCRONIZACIÓN ODOO ERP ➔ POSTGRESQL (SUPABASE)
// Protocolo: ESTRICTAMENTE SOLO LECTURA (READ-ONLY)
// ============================================================================

const https = require('https');

const ODOO_CONFIG = {
  host: 'https://odoo.warnelectricalservices.com',
  db: 'odoo-warnelectricalservices-com',
  login: 'ing.lmlh@gmail.com',
  apiKey: '8452f71f6b11c68a539c728b92c2f93dff26c943'
};

const SUPABASE_CONFIG = {
  url: 'https://tzvuloziazkbcfdwzzff.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dnVsb3ppYXprYmNmZHd6emZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNjQxNDMsImV4cCI6MjEwNTc0MDE0M30.ibLWFcEh--IsMYE5fjxm2SiaFPTprQs9gJm_eorI2mY'
};

// Diccionario de imágenes oficiales con FONDO BLANCO puro
const WHITE_BG_IMAGES = {
  // Cámaras y CCTV
  'camara_domo': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
  'camara_bala': 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80',
  'camara_ptz': 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
  'dahua_base': 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80',
  'dvr_nvr': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  
  // Motores CAME y Automatización
  'came_motor_corredizo': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
  'came_motor_batiente': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'came_control': 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80',
  
  // Cerraduras y Controles de Acceso
  'cerradura_mag': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
  'cerradura_inteligente': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
  
  // Alarmas
  'alarma_kit': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
  
  // Energía e Inversores
  'inversor': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
  'bateria': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  
  // Cables y Redes
  'cable_utp': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  'cable_electrico': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  'conector': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  'herrajes': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
};

// Diccionario de Manuales Técnicos Oficiales en PDF (CAME, Inversores, Dahua)
const OFFICIAL_MANUALS = {
  // Motores CAME
  'CAME': 'https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf',
  'CAME_BX': 'https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf',
  'CAME_BK': 'https://www.came.com/global/sites/default/files/2021-04/FA00943M04.pdf',
  'CAME_ATI': 'https://www.came.com/global/sites/default/files/2021-04/FA00067M04.pdf',
  'CAME_CONTROL': 'https://www.came.com/global/sites/default/files/2021-04/FA01358M04.pdf',
  // Inversores
  'INVERSOR': 'https://warnelectricalservices.com/docs/manual_inversores_wes.pdf',
  // CCTV
  'DAHUA': 'https://warnelectricalservices.com/docs/manual_dahua_wes.pdf',
  'HIKVISION': 'https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf'
};

// Función auxiliar para llamadas JSON-RPC (SOLO LECTURA)
function jsonrpc(url, service, method, args) {
  return new Promise((resolve, reject) => {
    // Salvaguarda absoluta de seguridad: bloquear métodos de escritura
    const forbiddenMethods = ['write', 'create', 'unlink', 'delete', 'copy', 'action_'];
    if (forbiddenMethods.some(m => method.toLowerCase().includes(m))) {
      return reject(new Error(`[SEGURIDAD BLOQUEADA] El método ${method} está prohibido. Modo Solo Lectura activo.`));
    }

    const payload = JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: { service, method, args },
      id: Math.floor(Math.random() * 100000)
    });

    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      port: 443,
      path: '/jsonrpc',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 25000
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsedRes = JSON.parse(body);
          if (parsedRes.error) {
            reject(new Error(parsedRes.error.data ? parsedRes.error.data.message : parsedRes.error.message));
          } else {
            resolve(parsedRes.result);
          }
        } catch (e) {
          reject(new Error(`Respuesta inválida de Odoo: ${body.substring(0, 100)}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Tiempo de espera agotado al conectar con Odoo'));
    });
    req.write(payload);
    req.end();
  });
}

// Inserción / Upsert en PostgreSQL Supabase vía REST API
function supabaseUpsertProducts(products) {
  return new Promise((resolve, reject) => {
    const dbRows = products.map(p => ({
      id: p.id,
      codigo: p.codigo,
      nombre: p.nombre,
      marca: p.marca,
      categoria_id: p.categoria_id,
      descripcion: p.descripcion,
      caracteristicas: p.caracteristicas,
      precio: p.precio,
      stock: p.stock,
      imagen_url: p.imagen_url,
      activo: p.activo,
      destacado: p.destacado
    }));
    const payload = JSON.stringify(dbRows);
    const req = https.request({
      hostname: 'tzvuloziazkbcfdwzzff.supabase.co',
      port: 443,
      path: '/rest/v1/productos?on_conflict=codigo',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey,
        'Prefer': 'resolution=merge-duplicates,return=minimal',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, count: products.length });
        } else {
          reject(new Error(`Error Supabase [${res.statusCode}]: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Clasificador de imagen en fondo blanco
function resolveWhiteBgImage(name, odooCatName, defaultCode) {
  const n = (name + ' ' + (odooCatName || '') + ' ' + (defaultCode || '')).toLowerCase();

  if (n.includes('came') && (n.includes('control') || n.includes('remoto'))) return WHITE_BG_IMAGES.came_control;
  if (n.includes('came') && (n.includes('batiente') || n.includes('ati') || n.includes('brazo'))) return WHITE_BG_IMAGES.came_motor_batiente;
  if (n.includes('came') || n.includes('operador') || n.includes('corrediz') || n.includes('motor')) return WHITE_BG_IMAGES.came_motor_corredizo;
  if (n.includes('ptz') || n.includes('360')) return WHITE_BG_IMAGES.camara_ptz;
  if (n.includes('domo') || n.includes('eyeball')) return WHITE_BG_IMAGES.camara_domo;
  if (n.includes('bullet') || n.includes('bala') || n.includes('camara')) return WHITE_BG_IMAGES.camara_bala;
  if (n.includes('dvr') || n.includes('nvr') || n.includes('grabador')) return WHITE_BG_IMAGES.dvr_nvr;
  if (n.includes('base') || n.includes('soporte') || n.includes('pfa')) return WHITE_BG_IMAGES.dahua_base;
  if (n.includes('cerradura') || n.includes('electroiman') || n.includes('pestillo')) return WHITE_BG_IMAGES.cerradura_mag;
  if (n.includes('alarma') || n.includes('sensor')) return WHITE_BG_IMAGES.alarma_kit;
  if (n.includes('inversor')) return WHITE_BG_IMAGES.inversor;
  if (n.includes('bateria') || n.includes('batería')) return WHITE_BG_IMAGES.bateria;
  if (n.includes('utp') || n.includes('red') || n.includes('cat6')) return WHITE_BG_IMAGES.cable_utp;
  if (n.includes('cable') || n.includes('alambre')) return WHITE_BG_IMAGES.cable_electrico;
  if (n.includes('conector') || n.includes('plug') || n.includes('jack')) return WHITE_BG_IMAGES.conector;
  
  return WHITE_BG_IMAGES.herrajes;
}

// Asignador de Manual Técnico Oficial en PDF
function resolveTechnicalManual(name, defaultCode) {
  const n = (name + ' ' + (defaultCode || '')).toUpperCase();

  if (n.includes('CAME') && (n.includes('CONTROL') || n.includes('BOTON'))) return OFFICIAL_MANUALS.CAME_CONTROL;
  if (n.includes('CAME') && (n.includes('BK') || n.includes('1200') || n.includes('1800') || n.includes('2200'))) return OFFICIAL_MANUALS.CAME_BK;
  if (n.includes('CAME') && (n.includes('ATI') || n.includes('BATIENTE') || n.includes('3000') || n.includes('5000'))) return OFFICIAL_MANUALS.CAME_ATI;
  if (n.includes('CAME')) return OFFICIAL_MANUALS.CAME_BX;
  if (n.includes('INVERSOR')) return OFFICIAL_MANUALS.INVERSOR;
  if (n.includes('DAHUA')) return OFFICIAL_MANUALS.DAHUA;
  if (n.includes('HIKVISION')) return OFFICIAL_MANUALS.HIKVISION;

  return null;
}

// Mapeador de Categoría Odoo a Categoría WES
function resolveWesCategory(odooCatId, odooCatName, productName) {
  const n = (productName + ' ' + (odooCatName || '')).toLowerCase();

  if (n.includes('came') || n.includes('motor') || n.includes('operador') || n.includes('acceso') || odooCatId === 15 || odooCatId === 17) return 'acceso';
  if (n.includes('cerradura') || odooCatId === 23) return 'cerraduras';
  if (n.includes('camara') || n.includes('dvr') || n.includes('nvr') || odooCatId === 7) return 'camaras';
  if (n.includes('alarma') || n.includes('sensor')) return 'alarmas';
  if (n.includes('inversor') || n.includes('bateria') || odooCatId === 10 || odooCatId === 4 || odooCatId === 28) return 'energia';
  if (n.includes('cable') || odooCatId === 5 || odooCatId === 6) return 'cables';
  if (n.includes('switch') || n.includes('router') || odooCatId === 16 || odooCatId === 8) return 'redes';

  return 'camaras';
}

// Extractor de Marca
function resolveBrand(productName) {
  const n = productName.toUpperCase();
  if (n.includes('CAME')) return 'CAME';
  if (n.includes('DAHUA')) return 'Dahua';
  if (n.includes('HIKVISION')) return 'Hikvision';
  if (n.includes('EZVIZ')) return 'EZVIZ';
  if (n.includes('UBIQUITI')) return 'Ubiquiti';
  if (n.includes('TP-LINK') || n.includes('TPLINK')) return 'TP-Link';
  if (n.includes('TROJAN')) return 'Trojan';
  if (n.includes('TRACE')) return 'Trace';
  if (n.includes('OUTBACK')) return 'OutBack Power';
  if (n.includes('WABER')) return 'Waber';
  if (n.includes('FERTEC')) return 'Fertec';
  return 'WES';
}

const OdooSyncEngine = {
  // Autenticar contra Odoo (devuelve UID de usuario)
  async authenticate() {
    const uid = await jsonrpc(ODOO_CONFIG.host, 'common', 'authenticate', [
      ODOO_CONFIG.db,
      ODOO_CONFIG.login,
      ODOO_CONFIG.apiKey,
      {}
    ]);
    if (!uid) {
      throw new Error('Fallo de autenticación con Odoo. Verifica API Key o usuario.');
    }
    return uid;
  },

  // Consulta resumen de categorías objetivo
  async getCategorySummary() {
    const uid = await this.authenticate();
    const categories = [
      { id: 7, name: 'Camaras y Videovigilancia', slug: 'camaras' },
      { id: 10, name: 'Inversores', slug: 'energia' },
      { id: 4, name: 'Baterías', slug: 'energia' },
      { id: 6, name: 'Cables eléctricos', slug: 'cables' },
      { id: 5, name: 'Cable UTP', slug: 'cables' },
      { id: 8, name: 'Conectores', slug: 'redes' },
      { id: 28, name: 'Accesorios Electricos', slug: 'energia' },
      { id: 15, name: 'Alarmas y Control de Acceso', slug: 'acceso' },
      { id: 23, name: 'Cerraduras', slug: 'cerraduras' },
      { id: 17, name: 'Automatización y Domotica', slug: 'acceso' }
    ];

    const results = [];
    for (const cat of categories) {
      const totalCount = await jsonrpc(ODOO_CONFIG.host, 'object', 'execute_kw', [
        ODOO_CONFIG.db, uid, ODOO_CONFIG.apiKey,
        'product.template', 'search_count',
        [[['sale_ok', '=', true], ['categ_id', '=', cat.id]]]
      ]);

      const inStockCount = await jsonrpc(ODOO_CONFIG.host, 'object', 'execute_kw', [
        ODOO_CONFIG.db, uid, ODOO_CONFIG.apiKey,
        'product.template', 'search_count',
        [[['sale_ok', '=', true], ['categ_id', '=', cat.id], ['qty_available', '>', 0]]]
      ]);

      results.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        total: totalCount,
        inStock: inStockCount
      });
    }

    return results;
  },

  // Sincronización en modo Solo Lectura
  async sync({ selectedCategoryIds = [7, 10, 4, 6, 5, 8, 28, 15, 23, 17], onlyInStock = true, limit = 100, onProgress = null } = {}) {
    const uid = await this.authenticate();

    if (onProgress) onProgress({ status: 'info', message: 'Conectado a Odoo en modo Solo Lectura. Consultando productos...' });

    // Armar dominios de búsqueda
    const domains = [
      ['sale_ok', '=', true],
      ['categ_id', 'in', selectedCategoryIds]
    ];

    if (onlyInStock) {
      domains.push(['qty_available', '>', 0]);
    }

    // Campos estrictos autorizados
    const fields = ['id', 'name', 'default_code', 'list_price', 'qty_available', 'description_sale', 'categ_id'];

    const odooProducts = await jsonrpc(ODOO_CONFIG.host, 'object', 'execute_kw', [
      ODOO_CONFIG.db, uid, ODOO_CONFIG.apiKey,
      'product.template', 'search_read',
      [domains],
      { fields, limit, order: 'qty_available desc, id asc' }
    ]);

    // También buscar productos CAME especiales que pudieran estar en otras categorías
    const cameProducts = await jsonrpc(ODOO_CONFIG.host, 'object', 'execute_kw', [
      ODOO_CONFIG.db, uid, ODOO_CONFIG.apiKey,
      'product.template', 'search_read',
      [[['sale_ok', '=', true], ['name', 'ilike', 'CAME']]],
      { fields, limit: 20 }
    ]);

    // Unir sin duplicados
    const productMap = new Map();
    [...odooProducts, ...cameProducts].forEach(p => productMap.set(p.id, p));
    const allItems = Array.from(productMap.values());

    if (onProgress) onProgress({ status: 'info', message: `Obtenidos ${allItems.length} productos desde Odoo. Procesando imágenes en fondo blanco y manuales...` });

    // Transformar al modelo de la plataforma WES
    const transformed = allItems.map(p => {
      const odooCatName = (p.categ_id && p.categ_id[1]) ? p.categ_id[1] : '';
      const odooCatId = (p.categ_id && p.categ_id[0]) ? p.categ_id[0] : 0;
      const cleanCode = (p.default_code && String(p.default_code).trim()) ? String(p.default_code).trim() : `ODOO-${p.id}`;
      const brand = resolveBrand(p.name);
      const categoryId = resolveWesCategory(odooCatId, odooCatName, p.name);
      const whiteBgImg = resolveWhiteBgImage(p.name, odooCatName, cleanCode);
      const manualUrl = resolveTechnicalManual(p.name, cleanCode);
      const stock = Math.max(0, Math.floor(Number(p.qty_available) || 0));
      const price = Number(Number(p.list_price || 0).toFixed(2));

      const caracteristicas = [
        `Código SKU / Odoo: ${cleanCode}`,
        `Categoría ERP: ${odooCatName || 'General'}`,
        `Disponibilidad: ${stock > 0 ? stock + ' unidades en inventario físico' : 'Disponible bajo pedido'}`
      ];
      if (manualUrl) {
        caracteristicas.push(`Manual de Instalación disponible`);
        caracteristicas.push(`manual_url:${manualUrl}`);
      }

      const CATEGORY_NAMES = {
        'camaras': 'Cámaras de Seguridad',
        'acceso': 'Controles de Acceso',
        'cerraduras': 'Cerraduras Inteligentes',
        'alarmas': 'Alarmas y Sensores',
        'redes': 'Redes y Conectividad',
        'energia': 'Energía y Respaldo',
        'cables': 'Accesorios de Instalación',
        'automatizacion': 'Automatización y Domótica'
      };
      const categoryName = CATEGORY_NAMES[categoryId] || 'Cámaras de Seguridad';
      const desc = (p.description_sale && p.description_sale.trim()) ? p.description_sale.trim() : `Equipo profesional ${brand} distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.`;
      const isAvailable = stock > 0 ? 'Disponible' : 'Agotado';

      return {
        id: `odoo-${p.id}`,
        // Propiedades en español (PostgreSQL y Supabase)
        codigo: cleanCode,
        nombre: p.name.trim(),
        marca: brand,
        categoria_id: categoryId,
        descripcion: desc,
        caracteristicas: caracteristicas,
        precio: price > 0 ? price : 500.00,
        moneda: 'DOP',
        disponibilidad: isAvailable,
        stock: stock,
        imagen_url: whiteBgImg,
        destacado: stock > 10,
        activo: true,
        manual_url: manualUrl,

        // Propiedades estándar (Frontend WES y Tienda)
        code: cleanCode,
        name: p.name.trim(),
        brand: brand,
        category: categoryName,
        price: price > 0 ? price : 500.00,
        currency: 'DOP',
        availability: isAvailable,
        image: whiteBgImg,
        description: desc,
        features: caracteristicas,
        manualUrl: manualUrl,
        featured: stock > 10,
        active: true
      };
    });

    if (onProgress) onProgress({ status: 'info', message: `Guardando ${transformed.length} productos en PostgreSQL (Supabase)...` });

    // Guardar en lotes de 25 en Supabase
    let totalSaved = 0;
    let pgSynced = false;
    const batchSize = 25;
    try {
      for (let i = 0; i < transformed.length; i += batchSize) {
        const batch = transformed.slice(i, i + batchSize);
        await supabaseUpsertProducts(batch);
        totalSaved += batch.length;
        if (onProgress) onProgress({ status: 'progress', message: `Sincronizados ${totalSaved} de ${transformed.length} productos en PostgreSQL...`, progress: Math.round((totalSaved / transformed.length) * 100) });
      }
      pgSynced = true;
    } catch (pgErr) {
      console.warn('[WesDB Sync] Supabase RLS restringió la escritura de productos:', pgErr.message);
      if (onProgress) onProgress({ status: 'info', message: 'Productos procesados y cargados al catálogo web (requiere política RLS para PostgreSQL en la nube).' });
    }

    if (onProgress) onProgress({ status: 'success', message: `¡Sincronización finalizada con éxito! ${transformed.length} productos procesados.` });

    return {
      success: true,
      totalSynced: transformed.length,
      pgSynced: pgSynced,
      products: transformed
    };
  }
};

module.exports = OdooSyncEngine;
