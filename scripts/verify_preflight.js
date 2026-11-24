const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('====================================================');
console.log('🛡️  SUITE DE BLOQUEOS AUTOMÁTICOS PRE-DESPLIEGUE WES');
console.log('====================================================\n');

let errors = [];
let warnings = [];

const ROOT_DIR = path.join(__dirname, '..');
const SUB_DIR = path.join(ROOT_DIR, 'proyecto-wes');

// 1. COMPROBACIÓN DE FUENTE Y HTML
console.log('1. Verificando integridad de HTML y fuentes...');
const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  errors.push('Falta index.html en la raíz.');
} else {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  if (!html.includes('<!DOCTYPE html>')) errors.push('index.html no tiene DOCTYPE válido.');
  if (!html.includes('charset="UTF-8"')) errors.push('index.html no contiene meta charset="UTF-8".');
  if (!html.includes('name="viewport"')) errors.push('index.html no contiene meta viewport.');
  if (!html.includes('<title>')) errors.push('index.html no contiene etiqueta title.');
  if (!html.includes('manifest.json')) warnings.push('index.html no referencia manifest.json.');
  if (!html.includes('tailwind.min.css')) errors.push('index.html no referencia css/tailwind.min.css compilado.');
}

// 2. COMPROBACIÓN DE CSS COMPILADO
console.log('2. Verificando CSS compilado para producción...');
const cssPath = path.join(ROOT_DIR, 'css', 'tailwind.min.css');
if (!fs.existsSync(cssPath)) {
  errors.push('No existe css/tailwind.min.css compilado.');
} else {
  const cssStat = fs.statSync(cssPath);
  if (cssStat.size < 30 * 1024) {
    errors.push(`css/tailwind.min.css está incompleto o vacío (${(cssStat.size / 1024).toFixed(1)} KB < 30 KB).`);
  } else {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    if (!cssContent.includes('#0d2a5c') && !cssContent.includes('#0D2A5C')) {
      errors.push('css/tailwind.min.css no contiene el color corporativo #0D2A5C.');
    }
    if (!cssContent.includes('#f5b300') && !cssContent.includes('#F5B300')) {
      errors.push('css/tailwind.min.css no contiene el color corporativo #F5B300.');
    }
  }
}

// 3. COMPROBACIÓN DE SINTAXIS JAVASCRIPT
console.log('3. Verificando sintaxis JavaScript de todos los módulos...');
const jsFiles = [
  'js/app.js', 'js/user_auth.js', 'js/admin_auth.js', 'js/admin_app.js',
  'js/products.js', 'js/feature_flags.js', 'js/servicio_tecnico.js', 'js/chat_cliente.js',
  'proyecto-wes/Code.js'
];

jsFiles.forEach(f => {
  const fullP = path.join(ROOT_DIR, f);
  if (!fs.existsSync(fullP)) {
    errors.push(`Falta archivo crítico: ${f}`);
  } else {
    try {
      execSync(`node --check "${fullP}"`, { stdio: 'pipe' });
    } catch (syntaxErr) {
      errors.push(`Error de sintaxis en ${f}: ${syntaxErr.message}`);
    }
  }
});

// 4. COMPROBACIÓN DE SEGURIDAD Y BLINDAJE RBAC
console.log('4. Verificando blindaje RBAC y ausencia de vulnerabilidades...');
const codeJsPath = path.join(SUB_DIR, 'Code.js');
if (fs.existsSync(codeJsPath)) {
  const code = fs.readFileSync(codeJsPath, 'utf8');
  if (code.includes('wes_owner_authorized_session')) {
    errors.push('Vulnerabilidad detectada: Code.js contiene el bypass estático "wes_owner_authorized_session".');
  }
  if (!code.includes('verifyAdminAuthorization_')) {
    errors.push('Falta función de seguridad centralizada verifyAdminAuthorization_ en Code.js.');
  }
  if (!code.includes('logout_user_session')) {
    errors.push('Falta endpoint de revocación logout_user_session en Code.js.');
  }
}

// 5. COMPROBACIÓN DE DESVINCULACIÓN DE CORREO
const allJsContent = jsFiles.map(f => {
  const p = path.join(ROOT_DIR, f);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}).join('\n');

if (allJsContent.includes("secondaryEmail: 'wes.inform@gmail.com'")) {
  errors.push('Vulnerabilidad detectada: wes.inform@gmail.com sigue asociado como secondaryEmail del propietario.');
}

// 6. COMPROBACIÓN DE IMÁGENES ESENCIALES
console.log('5. Verificando rutas e imágenes esenciales...');
const requiredAssets = [
  'assets/logo-wes.png',
  'assets/logo-buho.jpg',
  'assets/projects/sistema-respaldo-inversor-interstate-3600w.jpg'
];
requiredAssets.forEach(a => {
  const fullA = path.join(ROOT_DIR, a);
  if (!fs.existsSync(fullA)) {
    errors.push(`Falta asset esencial: ${a}`);
  }
});

// RESUMEN Y DECISIÓN
console.log('\n--- RESULTADOS DEL PREFLIGHT ---');
if (warnings.length > 0) {
  warnings.forEach(w => console.warn('⚠️  ADVERTENCIA:', w));
}

if (errors.length > 0) {
  console.error('\n❌ BLOQUEO DE DESPLIEGUE ACTIVADO: Se encontraron los siguientes errores críticos:');
  errors.forEach(e => console.error('  - ' + e));
  console.error('\n🛑 EL DESPLIEGUE HA SIDO CANCELADO PARA PROTEGER LA VERSIÓN ESTABLE EN PRODUCCIÓN.');
  process.exit(1);
} else {
  console.log('✅ TODAS LAS COMPROBACIONES PASARON EXITOSAMENTE.');
  console.log('La aplicación cumple con todos los estándares para ser desplegada en producción.');
  process.exit(0);
}
