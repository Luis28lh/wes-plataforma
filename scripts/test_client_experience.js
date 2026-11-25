const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\ed0acbda-4949-4816-a6fc-3e44a8cbbf24';

async function runClientTests() {
  console.log('--- Iniciando prueba de cliente con Puppeteer ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const indexPath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  console.log('Navegando a:', indexPath);
  await page.goto(indexPath, { waitUntil: 'networkidle0' });

  // 1. Simular sesión de cliente mediante UserAuth.setSession
  console.log('Configurando sesión de cliente cliente@ejemplo.com...');
  await page.evaluate(() => {
    const testUser = {
      id: 'CLI-TEST-001',
      name: 'Luis Lizardo (Cliente)',
      email: 'cliente@ejemplo.com',
      phone: '(809) 555-0199',
      role: 'cliente',
      isEmployee: false
    };
    if (typeof UserAuth !== 'undefined' && typeof UserAuth.setSession === 'function') {
      UserAuth.setSession(testUser, true);
    } else {
      localStorage.setItem('wes_user_session', JSON.stringify(testUser));
    }
    window.location.reload();
  });

  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Captura 1: Vista principal con cliente autenticado
  const file1 = path.join(ARTIFACT_DIR, 'test_client_home.png');
  await page.screenshot({ path: file1 });
  console.log('Captura 1 guardada:', file1);

  // 2. Abrir Menú Mi Cuenta
  console.log('Abriendo dropdown Mi cuenta...');
  await page.evaluate(() => {
    if (typeof toggleMyAccountDropdown === 'function') toggleMyAccountDropdown();
  });
  await new Promise(r => setTimeout(r, 600));

  const file2 = path.join(ARTIFACT_DIR, 'test_client_dropdown.png');
  await page.screenshot({ path: file2 });
  console.log('Captura 2 guardada:', file2);

  // 3. Abrir Subpanel "Mis Servicios"
  console.log('Abriendo modal Mis Servicios...');
  await page.evaluate(() => {
    if (typeof openClientServicesModal === 'function') openClientServicesModal();
  });
  await new Promise(r => setTimeout(r, 600));

  const file3 = path.join(ARTIFACT_DIR, 'test_client_services_modal.png');
  await page.screenshot({ path: file3 });
  console.log('Captura 3 guardada:', file3);

  // 4. Abrir "Mis Cotizaciones"
  console.log('Abriendo Mis Cotizaciones...');
  await page.evaluate(() => {
    if (typeof openClientQuotesModal === 'function') openClientQuotesModal();
  });
  await new Promise(r => setTimeout(r, 800));

  const file4 = path.join(ARTIFACT_DIR, 'test_client_quotes_modal.png');
  await page.screenshot({ path: file4 });
  console.log('Captura 4 guardada:', file4);

  // 5. Abrir "Mis Solicitudes de Soporte"
  console.log('Abriendo Mis Solicitudes de Soporte...');
  await page.evaluate(() => {
    if (typeof closeClientQuotesModal === 'function') closeClientQuotesModal();
    if (typeof openClientSupportModal === 'function') openClientSupportModal();
  });
  await new Promise(r => setTimeout(r, 800));

  const file5 = path.join(ARTIFACT_DIR, 'test_client_support_modal.png');
  await page.screenshot({ path: file5 });
  console.log('Captura 5 guardada:', file5);

  // 6. Abrir "Mis Reparaciones de Taller" y verificar filtrado seguro
  console.log('Abriendo Mis Reparaciones de Taller...');
  await page.evaluate(() => {
    if (typeof closeClientSupportModal === 'function') closeClientSupportModal();
    if (typeof openOngoingSupportModal === 'function') openOngoingSupportModal();
  });
  await new Promise(r => setTimeout(r, 800));

  const file6 = path.join(ARTIFACT_DIR, 'test_client_workshop_filtered.png');
  await page.screenshot({ path: file6 });
  console.log('Captura 6 guardada:', file6);

  // 7. Prueba en Vista Móvil (390 x 844)
  console.log('Probando vista móvil...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    if (typeof closeOngoingSupportModal === 'function') closeOngoingSupportModal();
    if (typeof openClientServicesModal === 'function') openClientServicesModal();
  });
  await new Promise(r => setTimeout(r, 600));

  const file7 = path.join(ARTIFACT_DIR, 'test_client_services_mobile.png');
  await page.screenshot({ path: file7 });
  console.log('Captura 7 guardada:', file7);

  await browser.close();
  console.log('=== Pruebas de cliente completadas exitosamente ===');
}

runClientTests().catch(err => {
  console.error('Error durante las pruebas:', err);
  process.exit(1);
});
