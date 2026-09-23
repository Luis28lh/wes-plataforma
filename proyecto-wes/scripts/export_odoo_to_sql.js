// ============================================================================
// Genera script SQL con los productos de Odoo enriquecidos
// ============================================================================
const fs = require('fs');
const path = require('path');
const OdooSyncEngine = require('./odoo_sync_engine');

async function exportSQL() {
  const result = await OdooSyncEngine.sync({
    selectedCategoryIds: [7, 10, 4, 6, 5, 8, 28, 15, 23, 17],
    onlyInStock: true,
    limit: 200
  });

  console.log(`Generando seed_odoo_products.sql para ${result.products.length} productos...`);

  let sql = '-- ============================================================================\n';
  sql += '-- WARN ELECTRICAL SERVICES, SRL (WES)\n';
  sql += '-- CATÁLOGO SINCRONIZADO DESDE ODOO ERP (SOLO LECTURA)\n';
  sql += `-- Total productos: ${result.products.length}\n`;
  sql += '-- ============================================================================\n\n';

  // Habilitar política de sincronización por si no existe
  sql += 'DO $$\n';
  sql += 'BEGIN\n';
  sql += '  IF NOT EXISTS (\n';
  sql += '    SELECT 1 FROM pg_policies WHERE tablename = \'productos\' AND policyname = \'Permitir sincronizar catalogo de productos\'\n';
  sql += '  ) THEN\n';
  sql += '    CREATE POLICY "Permitir sincronizar catalogo de productos" ON public.productos FOR ALL USING (TRUE) WITH CHECK (TRUE);\n';
  sql += '  END IF;\n';
  sql += 'END\n';
  sql += '$$;\n\n';

  sql += 'INSERT INTO public.productos (id, codigo, nombre, marca, categoria_id, descripcion, caracteristicas, precio, stock, imagen_url, activo, destacado)\nVALUES\n';

  const rows = result.products.map(p => {
    const esc = str => String(str || '').replace(/'/g, "''");
    const jsonFeat = JSON.stringify(p.caracteristicas).replace(/'/g, "''");
    return `('${esc(p.id)}', '${esc(p.codigo)}', '${esc(p.nombre)}', '${esc(p.marca)}', '${esc(p.categoria_id)}', '${esc(p.descripcion)}', '${jsonFeat}'::jsonb, ${p.precio}, ${p.stock}, '${esc(p.imagen_url)}', ${p.activo}, ${p.destacado})`;
  });

  sql += rows.join(',\n') + '\n';
  sql += 'ON CONFLICT (codigo) DO UPDATE SET\n';
  sql += '  nombre = EXCLUDED.nombre,\n';
  sql += '  marca = EXCLUDED.marca,\n';
  sql += '  precio = EXCLUDED.precio,\n';
  sql += '  stock = EXCLUDED.stock,\n';
  sql += '  descripcion = EXCLUDED.descripcion,\n';
  sql += '  caracteristicas = EXCLUDED.caracteristicas,\n';
  sql += '  imagen_url = EXCLUDED.imagen_url,\n';
  sql += '  updated_at = NOW();\n';

  const dest = path.join(__dirname, '..', 'database', 'seed_odoo_products.sql');
  fs.writeFileSync(dest, sql, 'utf8');
  console.log(`Archivo generado con éxito: ${dest}`);
}

exportSQL().catch(console.error);
