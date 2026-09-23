// ============================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// Script Ejecutable de Sincronización Odoo ➔ PostgreSQL (Supabase)
// ============================================================================

const OdooSyncEngine = require('./odoo_sync_engine');

async function run() {
  console.log('================================================================');
  console.log('  WARN ELECTRICAL SERVICES - SINCRONIZADOR ODOO ERP (SOLO LECTURA)');
  console.log('================================================================');

  try {
    console.log('[1/3] Conectando y obteniendo métricas por categoría en Odoo...');
    const summary = await OdooSyncEngine.getCategorySummary();
    console.table(summary.map(s => ({
      ID: s.id,
      Categoria: s.name,
      'Total Odoo': s.total,
      'En Stock (>0)': s.inStock
    })));

    console.log('[2/3] Iniciando sincronización de productos...');
    const result = await OdooSyncEngine.sync({
      selectedCategoryIds: [7, 10, 4, 6, 5, 8, 28, 15, 23, 17],
      onlyInStock: true,
      limit: 150,
      onProgress: (p) => {
        console.log(`[SYNC] ${p.message}`);
      }
    });

    console.log('================================================================');
    console.log(`[3/3] ¡ÉXITO! Sincronizados ${result.totalSynced} productos en PostgreSQL.`);
    console.log('Las imágenes en fondo blanco y manuales CAME quedaron vinculados.');
    console.log('================================================================');
  } catch (err) {
    console.error('[ERROR CRÍTICO EN SINCRONIZACIÓN]:', err.message);
    process.exit(1);
  }
}

run();
