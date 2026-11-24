const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'docs', 'respaldos', 'v1.96_build96');
const ROOT_DIR = path.join(__dirname, '..');
const SUB_DIR = path.join(ROOT_DIR, 'proyecto-wes');

if (!fs.existsSync(BACKUP_DIR)) {
  console.error('❌ Directorio de respaldo no encontrado:', BACKUP_DIR);
  process.exit(1);
}

console.log('=== RESTAURACIÓN DESDE RESPALDO ESTABLE (v1.96 / Build 96) ===\n');

const manifestPath = path.join(BACKUP_DIR, 'MANIFEST.json');
if (fs.existsSync(manifestPath)) {
  const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`ℹ Información de Respaldo: Versión ${m.version} (Build ${m.build}), Tag: ${m.gitTag}`);
}

const restoreMap = [
  { src: 'index.html', dst: 'index.html' },
  { src: 'index.html', dst: 'proyecto-wes/index.html' },
  { src: 'admin.html', dst: 'admin.html' },
  { src: 'admin.html', dst: 'proyecto-wes/admin.html' },
  { src: 'panel.html', dst: 'panel.html' },
  { src: 'panel.html', dst: 'proyecto-wes/panel.html' },
  { src: 'control.html', dst: 'control.html' },
  { src: 'control.html', dst: 'proyecto-wes/control.html' },
  { src: 'servicio-tecnico.html', dst: 'servicio-tecnico.html' },
  { src: 'servicio-tecnico.html', dst: 'proyecto-wes/servicio-tecnico.html' },
  { src: 'app.js', dst: 'js/app.js' },
  { src: 'app.js', dst: 'proyecto-wes/js/app.js' },
  { src: 'user_auth.js', dst: 'js/user_auth.js' },
  { src: 'user_auth.js', dst: 'proyecto-wes/js/user_auth.js' },
  { src: 'admin_auth.js', dst: 'js/admin_auth.js' },
  { src: 'admin_auth.js', dst: 'proyecto-wes/js/admin_auth.js' },
  { src: 'admin_app.js', dst: 'js/admin_app.js' },
  { src: 'admin_app.js', dst: 'proyecto-wes/js/admin_app.js' },
  { src: 'products.js', dst: 'js/products.js' },
  { src: 'products.js', dst: 'proyecto-wes/js/products.js' },
  { src: 'feature_flags.js', dst: 'js/feature_flags.js' },
  { src: 'feature_flags.js', dst: 'proyecto-wes/js/feature_flags.js' },
  { src: 'servicio_tecnico.js', dst: 'js/servicio_tecnico.js' },
  { src: 'servicio_tecnico.js', dst: 'proyecto-wes/js/servicio_tecnico.js' },
  { src: 'chat_cliente.js', dst: 'js/chat_cliente.js' },
  { src: 'chat_cliente.js', dst: 'proyecto-wes/js/chat_cliente.js' },
  { src: 'Code.js', dst: 'proyecto-wes/Code.js' },
  { src: 'deployment_info.json', dst: 'proyecto-wes/deployment_info.json' }
];

let restoredCount = 0;
restoreMap.forEach(item => {
  const fullSrc = path.join(BACKUP_DIR, item.src);
  const fullDst = path.join(ROOT_DIR, item.dst);
  if (fs.existsSync(fullSrc)) {
    fs.mkdirSync(path.dirname(fullDst), { recursive: true });
    fs.copyFileSync(fullSrc, fullDst);
    restoredCount++;
  } else {
    console.warn('⚠️ No se encontró en respaldo:', item.src);
  }
});

console.log(`\n✓ ${restoredCount} archivos restaurados exitosamente.`);
console.log('Siguiente paso: Ejecutar "node scripts/verify_preflight.js" antes de redesplegar.');
