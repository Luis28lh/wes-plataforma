const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const SUB_DIR = path.join(ROOT_DIR, 'proyecto-wes');

console.log('=== SINCRONIZACIÓN DE FUENTE OFICIAL WES ===\n');

// 1. Archivo maestro index.html -> proyecto-wes/index.html
const masterHtml = path.join(ROOT_DIR, 'index.html');
const subHtml = path.join(SUB_DIR, 'index.html');

if (!fs.existsSync(masterHtml)) {
  console.error('❌ Falta archivo fuente principal:', masterHtml);
  process.exit(1);
}

fs.copyFileSync(masterHtml, subHtml);
console.log('✓ index.html (fuente oficial) sincronizado a proyecto-wes/index.html');

// 2. CSS compilado
const masterCss = path.join(ROOT_DIR, 'css', 'tailwind.min.css');
const subCss = path.join(SUB_DIR, 'css', 'tailwind.min.css');
if (fs.existsSync(masterCss)) {
  fs.mkdirSync(path.join(SUB_DIR, 'css'), { recursive: true });
  fs.copyFileSync(masterCss, subCss);
  console.log('✓ css/tailwind.min.css sincronizado a proyecto-wes/css/');
}

// 3. Sincronizar scripts frontend esenciales hacia proyecto-wes/js/
const jsFiles = [
  'app.js', 'user_auth.js', 'admin_auth.js', 'admin_app.js',
  'products.js', 'feature_flags.js', 'servicio_tecnico.js',
  'chat_cliente.js', 'pwa-install.js'
];

jsFiles.forEach(f => {
  const src = path.join(ROOT_DIR, 'js', f);
  const dst = path.join(SUB_DIR, 'js', f);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.join(SUB_DIR, 'js'), { recursive: true });
    fs.copyFileSync(src, dst);
  }
});
console.log('✓ Scripts frontend sincronizados con proyecto-wes/js/');
