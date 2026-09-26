// ============================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// SINCRONIZADOR DIRECTO Y SÍNCRONO A SUPABASE (POSTGRESQL)
// Uso de Service Role Key para eludir RLS e inyectar el catálogo completo
// ============================================================================

const https = require('https');
const path = require('path');
const fs = require('fs');

const SUPABASE_URL = 'https://tzvuloziazkbcfdwzzff.supabase.co';

// Intentar leer la key desde argumento, variable de entorno o archivo local
const SERVICE_KEY = process.argv[2] || process.env.SUPABASE_SERVICE_ROLE_KEY || (() => {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/);
    if (match) return match[1].trim();
  }
  return null;
})();

if (!SERVICE_KEY) {
  console.error('\n❌ ERROR: Se requiere la clave "service_role" de Supabase.');
  console.error('Uso: node scripts/sync_direct_to_supabase.js <SERVICE_ROLE_KEY>');
  process.exit(1);
}

// Cargar catálogo enriquecido desde products.js
const { INITIAL_PRODUCTS } = require('../js/products.js');

if (!Array.isArray(INITIAL_PRODUCTS) || INITIAL_PRODUCTS.length === 0) {
  console.error('❌ ERROR: No se pudieron cargar los productos desde js/products.js');
  process.exit(1);
}

console.log(`\n📦 Preparando ${INITIAL_PRODUCTS.length} productos para sincronización directa...`);

const rows = INITIAL_PRODUCTS.map(p => ({
  id: p.id || ('odoo-' + (p.codigo || p.code)),
  codigo: String(p.codigo || p.code || ''),
  nombre: p.nombre || p.name || '',
  marca: p.marca || p.brand || 'WES',
  categoria_id: p.categoria_id || 'acceso',
  descripcion: p.descripcion || p.description || '',
  caracteristicas: p.caracteristicas || p.features || [],
  precio: Number(p.precio || p.price || 0),
  stock: Number(p.stock !== undefined ? p.stock : 0),
  imagen_url: p.imagen_url || p.image || '',
  activo: p.activo !== undefined ? p.activo : true,
  destacado: p.destacado !== undefined ? p.destacado : false
}));

async function sendBatch(batch, batchNum, totalBatches) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(batch);
    const req = https.request({
      hostname: 'tzvuloziazkbcfdwzzff.supabase.co',
      port: 443,
      path: '/rest/v1/productos?on_conflict=codigo',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Prefer': 'resolution=merge-duplicates,return=minimal',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`  ✅ Lote ${batchNum}/${totalBatches} (${batch.length} productos) sincronizado.`);
          resolve(true);
        } else {
          reject(new Error(`Supabase error [${res.statusCode}]: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  const batchSize = 50;
  const totalBatches = Math.ceil(rows.length / batchSize);
  console.log(`🚀 Iniciando transmisión síncrona en ${totalBatches} lotes...\n`);

  for (let i = 0; i < totalBatches; i++) {
    const chunk = rows.slice(i * batchSize, (i + 1) * batchSize);
    await sendBatch(chunk, i + 1, totalBatches);
  }

  console.log(`\n🎉 ¡ÉXITO TOTAL! Los ${rows.length} productos han sido sincronizados directamente en Supabase.`);
}

run().catch(err => {
  console.error('\n❌ Fallo en la sincronización:', err.message);
  process.exit(1);
});
