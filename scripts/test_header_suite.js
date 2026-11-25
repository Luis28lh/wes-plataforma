const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\ed0acbda-4949-4816-a6fc-3e44a8cbbf24';

const VIEWPORTS = [
  { name: 'mobile_360', width: 360, height: 740, isMobile: true, hasTouch: true },
  { name: 'mobile_390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'tablet_768', width: 768, height: 1024, isMobile: false, hasTouch: false },
  { name: 'desktop_1024', width: 1024, height: 768, isMobile: false, hasTouch: false },
  { name: 'desktop_1366', width: 1366, height: 768, isMobile: false, hasTouch: false },
  { name: 'desktop_1366_zoom125', width: 1093, height: 614, isMobile: false, hasTouch: false } // Simula 1366 con zoom 125%
];

async function runHeaderSuite() {
  console.log('--- Iniciando Suite Exhaustiva de Encabezado WES ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const indexPath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

  // Función para establecer sesión de usuario
  async function setUserRole(role, name, isEmployee) {
    await page.evaluate((r, n, emp) => {
      if (!r) {
        localStorage.removeItem('wes_user_session');
        sessionStorage.removeItem('wes_user_session');
      } else {
        const u = {
          id: 'TEST-' + r.toUpperCase(),
          name: n,
          email: r + '@wes.com.do',
          phone: '(809) 555-0199',
          role: r,
          isEmployee: emp
        };
        if (typeof UserAuth !== 'undefined' && typeof UserAuth.setSession === 'function') {
          UserAuth.setSession(u, true);
        } else {
          localStorage.setItem('wes_user_session', JSON.stringify(u));
        }
      }
      if (typeof updateAuthHeaderUI === 'function') updateAuthHeaderUI();
    }, role, name, isEmployee);
    await new Promise(res => setTimeout(res, 300));
  }

  // 1. Probar en todas las resoluciones solicitadas como VISITANTE
  console.log('--- Probando rol VISITANTE en múltiples resoluciones ---');
  await page.goto(indexPath, { waitUntil: 'networkidle0' });
  await setUserRole(null, null, false);

  for (const vp of VIEWPORTS) {
    await page.setViewport(vp);
    await new Promise(r => setTimeout(r, 400));
    const ssPath = path.join(ARTIFACT_DIR, `header_visitor_${vp.name}.png`);
    await page.screenshot({ path: ssPath });
    console.log(`✓ Captura visitante [${vp.name}]: ${ssPath}`);
  }

  // 2. Probar rol CLIENTE (Escritorio 1366 y Móvil 390 con Dropdown abierto)
  console.log('--- Probando rol CLIENTE ---');
  await setUserRole('cliente', 'Luis Lizardo (Cliente)', false);
  
  // Desktop 1366 Cliente
  await page.setViewport({ width: 1366, height: 768 });
  await page.evaluate(() => {
    if (typeof openMyAccountDropdown === 'function') openMyAccountDropdown();
    else if (typeof toggleMyAccountDropdown === 'function') toggleMyAccountDropdown();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'header_client_desktop_dropdown.png') });
  console.log('✓ Captura Cliente Desktop con menú ⋮ abierto');

  // Mobile 390 Cliente con Drawer Abierto
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    if (typeof closeMyAccountDropdown === 'function') closeMyAccountDropdown();
    if (typeof openMobileMenu === 'function') openMobileMenu();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'header_client_mobile_drawer.png') });
  console.log('✓ Captura Cliente Móvil con Drawer ☰ abierto');

  // Mobile 390 Cliente con Dropdown de Cuenta ⋮ Abierto
  await page.evaluate(() => {
    if (typeof closeMobileMenu === 'function') closeMobileMenu();
    if (typeof toggleMyAccountDropdown === 'function') toggleMyAccountDropdown();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'header_client_mobile_dropdown.png') });
  console.log('✓ Captura Cliente Móvil con Menú ⋮ abierto');

  // 3. Probar rol TÉCNICO AUTORIZADO (Desktop y Dropdown)
  console.log('--- Probando rol TÉCNICO AUTORIZADO ---');
  await setUserRole('tecnico_interno', 'Carlos Gómez (Técnico)', true);
  await page.setViewport({ width: 1366, height: 768 });
  await page.evaluate(() => {
    if (typeof toggleMyAccountDropdown === 'function') toggleMyAccountDropdown();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'header_tech_desktop_dropdown.png') });
  console.log('✓ Captura Técnico Desktop con menú ⋮ (Servicio Técnico visible)');

  // 4. Probar rol ADMINISTRADOR (Desktop y Dropdown)
  console.log('--- Probando rol ADMINISTRADOR ---');
  await setUserRole('administrador', 'Ing. Luis Miguel Lizardo', true);
  await page.setViewport({ width: 1366, height: 768 });
  await page.evaluate(() => {
    if (typeof toggleMyAccountDropdown === 'function') toggleMyAccountDropdown();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'header_admin_desktop_dropdown.png') });
  console.log('✓ Captura Admin Desktop con menú ⋮ (Panel Admin + Servicio Técnico)');

  // 5. Verificación de NO duplicados en el DOM
  const domCheck = await page.evaluate(() => {
    return {
      hasNavKdsLink: Boolean(document.getElementById('nav-service-kds-link')),
      hasHeaderKdsChip: Boolean(document.getElementById('header-service-kds-chip')),
      hasDrawerKdsLink: Boolean(document.getElementById('drawer-service-kds-link')),
      visibleServiceCount: Array.from(document.querySelectorAll('header a, header button')).filter(el => {
        const text = (el.textContent || '').trim().toLowerCase();
        return text.includes('servicio técnico') && el.offsetParent !== null;
      }).length
    };
  });
  console.log('Comprobación de DOM:', domCheck);

  await browser.close();
  console.log('=== Suite de Encabezado Completada Exitosamente ===');
}

runHeaderSuite().catch(err => {
  console.error('Error en pruebas de encabezado:', err);
  process.exit(1);
});
