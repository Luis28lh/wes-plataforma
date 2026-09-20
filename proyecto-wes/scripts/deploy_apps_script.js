const fs = require('fs');
const os = require('os');
const path = require('path');

async function deployToAppsScript() {
  console.log('=== DESPLIEGUE A GOOGLE APPS SCRIPT (ESTÁNDAR AIDET v2.0) ===\n');

  // 1. Cargar credenciales y renovar token
  const claspRc = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.clasprc.json'), 'utf8'));
  const def = claspRc.tokens.default;

  console.log('1. Autenticando con Google OAuth...');
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: def.client_id,
      client_secret: def.client_secret,
      refresh_token: def.refresh_token,
      grant_type: 'refresh_token'
    })
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error('No se pudo obtener access_token: ' + JSON.stringify(tokenData));
  }
  const accessToken = tokenData.access_token;
  console.log('✓ Token de acceso obtenido con éxito.');

  // 2. Leer configuración de clasp
  const ROOT_DIR = path.join(__dirname, '..');
  const claspConfig = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, '.clasp.json'), 'utf8'));
  const scriptId = claspConfig.scriptId;
  console.log(`✓ ID de Proyecto Apps Script: ${scriptId}`);

  // 3. Preparar archivos para Apps Script
  console.log('\n2. Empaquetando interfaz web y backend...');
  
  // Base64 del logotipo oficial
  const logoB64 = fs.readFileSync(path.join(ROOT_DIR, 'assets', 'logo-wes.png')).toString('base64');
  const logoDataUri = `data:image/png;base64,${logoB64}`;

  // Leer scripts frontend
  const productsJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'products.js'), 'utf8');
  const featureFlagsJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'feature_flags.js'), 'utf8');
  const appJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'app.js'), 'utf8');

  // Leer HTML base y reemplazar las rutas relativas de assets y scripts por versiones autocontenidas
  let htmlContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  
  // Reemplazar rutas de logo
  htmlContent = htmlContent.split('assets/logo-wes.png').join(logoDataUri);

  // Inyectar scripts directamente antes del cierre del body
  const scriptsBundle = `
  <script>
    // Inyección de Productos WES
    ${productsJs}

    // Inyección de Feature Flags WES
    ${featureFlagsJs}

    // Inyección de Lógica Frontend WES
    ${appJs}
  </script>
  `;

  // Remover scripts externos que apuntan a js/... y poner el bundle
  htmlContent = htmlContent.replace(/<script src="js\/products\.js"><\/script>[\s\S]*?<script src="js\/app\.js"><\/script>/, scriptsBundle);

  // Leer Code.js y appsscript.json
  const codeJs = fs.readFileSync(path.join(ROOT_DIR, 'Code.js'), 'utf8');
  const appsscriptJson = fs.readFileSync(path.join(ROOT_DIR, 'appsscript.json'), 'utf8');

  const filesPayload = [
    {
      name: 'appsscript',
      type: 'JSON',
      source: appsscriptJson
    },
    {
      name: 'Code',
      type: 'SERVER_JS',
      source: codeJs
    },
    {
      name: 'index',
      type: 'HTML',
      source: htmlContent
    }
  ];

  console.log(`✓ Preparados ${filesPayload.length} archivos (appsscript.json, Code.gs, index.html).`);

  // 4. Subir contenido al proyecto vía Apps Script API
  console.log('\n3. Sincronizando archivos con Google Apps Script...');
  const uploadRes = await fetch(`https://script.googleapis.com/v1/projects/${scriptId}/content`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ files: filesPayload })
  });

  const uploadResult = await uploadRes.json();
  if (uploadResult.error) {
    throw new Error('Error subiendo contenido: ' + JSON.stringify(uploadResult.error));
  }
  console.log('✓ Código e interfaz sincronizados en la nube.');

  // 5. Crear una nueva versión inmutable
  console.log('\n4. Creando versión controlada del proyecto...');
  const versionRes = await fetch(`https://script.googleapis.com/v1/projects/${scriptId}/versions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'Publicación Web App v1.0 - AIDET Taller 2'
    })
  });

  const versionData = await versionRes.json();
  const versionNumber = versionData.versionNumber || 1;
  console.log(`✓ Versión creada: #${versionNumber}`);

  // 6. Crear despliegue productivo (Deployment)
  console.log('\n5. Publicando Web App en producción...');
  const deployRes = await fetch(`https://script.googleapis.com/v1/projects/${scriptId}/deployments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      versionNumber: versionNumber,
      manifestFileName: 'appsscript',
      description: 'Producción Web WES v1.0'
    })
  });

  const deployData = await deployRes.json();
  if (deployData.error) {
    throw new Error('Error en deployment: ' + JSON.stringify(deployData.error));
  }

  const deploymentId = deployData.deploymentId;
  const webAppEntry = (deployData.entryPoints || []).find(ep => ep.entryPointType === 'WEB_APP');
  const webAppUrl = webAppEntry ? webAppEntry.webApp.url : `https://script.google.com/macros/s/${deploymentId}/exec`;

  console.log('\n======================================================');
  console.log('🎉 ¡PLATAFORMA WEB WES PUBLICADA CON ÉXITO!');
  console.log(`URL DE PRODUCCIÓN: ${webAppUrl}`);
  console.log(`DEPLOYMENT ID: ${deploymentId}`);
  console.log('======================================================\n');

  // Guardar datos de despliegue en un archivo local para registro
  const deployInfo = {
    scriptId: scriptId,
    deploymentId: deploymentId,
    versionNumber: versionNumber,
    webAppUrl: webAppUrl,
    publishedAt: new Date().toISOString()
  };
  fs.writeFileSync(path.join(ROOT_DIR, 'deployment_info.json'), JSON.stringify(deployInfo, null, 2));

  return deployInfo;
}

deployToAppsScript().catch(err => {
  console.error('Fallo en el despliegue:', err);
  process.exit(1);
});
