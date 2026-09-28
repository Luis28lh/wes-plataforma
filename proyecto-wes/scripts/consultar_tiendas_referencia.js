#!/usr/bin/env node
/**
 * CLI de Consulta y Búsqueda en Tiendas de Referencia WES
 * Uso:
 *   node scripts/consultar_tiendas_referencia.js <termino_o_sku>
 *   node scripts/consultar_tiendas_referencia.js --list
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'reference_stores.json');

if (!fs.existsSync(CONFIG_PATH)) {
  console.error('Error: No se encontró config/reference_stores.json');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

const args = process.argv.slice(2);
const query = args.join(' ').trim();

if (!query || query === '--help' || query === '-h') {
  console.log(`
=== BUSCADOR EN TIENDAS DE REFERENCIA WES ===
Uso:
  node scripts/consultar_tiendas_referencia.js <termino_o_sku>
  node scripts/consultar_tiendas_referencia.js --list

Ejemplos:
  node scripts/consultar_tiendas_referencia.js "bateria 12v"
  node scripts/consultar_tiendas_referencia.js "fub-1245"
  node scripts/consultar_tiendas_referencia.js "came bx"
  node scripts/consultar_tiendas_referencia.js "cat6 utp"
`);
  process.exit(0);
}

if (query === '--list') {
  console.log('\n=== DIRECTORIO DE TIENDAS Y PROVEEDORES REGISTRADOS ===');
  config.stores.forEach((st, idx) => {
    console.log(`${idx + 1}. [${st.name}] (${st.country})`);
    console.log(`   Base: ${st.baseUrl}`);
    console.log(`   Especialidad: ${st.specialties.join(', ')}\n`);
  });
  process.exit(0);
}

console.log(`\n🔍 Consultando tiendas de referencia para: "${query}"...\n`);

config.stores.forEach(st => {
  const searchUrl = st.searchUrlTemplate.replace('{query}', encodeURIComponent(query));
  console.log(`📦 ${st.name}`);
  console.log(`   🔗 Enlace de búsqueda: ${searchUrl}`);
  if (st.specialties) {
    console.log(`   💡 Especialidad: ${st.specialties.slice(0, 3).join(', ')}`);
  }
  console.log('');
});

console.log('---');
console.log('📌 Procedimiento WES:');
console.log('1. Abre el enlace de la tienda según la categoría.');
console.log('2. Extrae las especificaciones (dimensiones, voltajes, modelo de parte OEM).');
console.log('3. Descarga la imagen oficial a assets/products/.');
console.log('4. Aplica la estructura Alibaba con Key Attributes y reseñas verificadas.');
