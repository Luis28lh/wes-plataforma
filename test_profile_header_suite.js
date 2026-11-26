/**
 * Suite de Verificación para Encabezado de Perfil WES
 * test_profile_header_suite.js
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\ed0acbda-4949-4816-a6fc-3e44a8cbbf24';
const HTML_FILE = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

async function runProfileHeaderSuite() {
  console.log('=== INICIANDO SUITE DE COMPROBACIÓN DE ENCABEZADO DE PERFIL WES ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Viewport móvil (390 x 844 px)
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(HTML_FILE, { waitUntil: 'networkidle0' });
  console.log('✓ Plataforma WES cargada en viewport móvil (390x844)');

  // -------------------------------------------------------------
  // TEST 1: Cuenta Administradora (ing.lmlh@gmail.com)
  // -------------------------------------------------------------
  console.log('\n--- TEST 1: Cuenta Administradora ---');
  await page.evaluate(() => {
    const adminUser = {
      id: 'USR-001',
      name: 'Luis Miguel Lizardo',
      email: 'ing.lmlh@gmail.com',
      phone: '8299935133',
      role: 'propietario',
      roleLabel: 'Propietario / Superadmin',
      isEmployee: true
    };
    if (typeof UserAuth !== 'undefined') {
      UserAuth.setSession(adminUser, true);
    }
    openUserProfileModal();
  });
  await new Promise(r => setTimeout(r, 600));

  const adminHeaderData = await page.evaluate(() => {
    const roleEl = document.getElementById('profile-modal-role');
    const clientIdEl = document.getElementById('profile-modal-client-id');
    const adminBtn = document.getElementById('profile-view-admin');
    const avatarEl = document.getElementById('profile-modal-avatar');
    const nameEl = document.getElementById('profile-modal-name');
    const emailEl = document.getElementById('profile-modal-email');

    return {
      name: nameEl ? nameEl.innerText.trim() : '',
      email: emailEl ? emailEl.innerText.trim() : '',
      roleText: roleEl ? roleEl.innerText.trim() : '',
      roleClass: roleEl ? roleEl.className : '',
      hasClientIdInHeader: Boolean(clientIdEl),
      isAdminBtnVisible: adminBtn ? !adminBtn.classList.contains('hidden') : false,
      avatarText: avatarEl ? avatarEl.innerText.trim() : ''
    };
  });

  console.log('Datos de encabezado admin:', adminHeaderData);

  if (!adminHeaderData.roleText.includes('Propietario / Superadmin') && !adminHeaderData.roleText.includes('Administrador General')) {
    throw new Error('FAIL TEST 1: El rol no refleja la cuenta administradora: ' + adminHeaderData.roleText);
  }
  // Verificar que NO tenga apariencia de botón o badge con fondo / borde
  if (adminHeaderData.roleClass.includes('bg-') || adminHeaderData.roleClass.includes('border') || adminHeaderData.roleClass.includes('rounded-full')) {
    throw new Error('FAIL TEST 1: El rol todavía tiene apariencia de botón/cápsula: ' + adminHeaderData.roleClass);
  }
  if (adminHeaderData.hasClientIdInHeader) {
    throw new Error('FAIL TEST 1: El ID sigue visible en el encabezado principal');
  }
  if (!adminHeaderData.isAdminBtnVisible) {
    throw new Error('FAIL TEST 1: El botón Panel Administrativo debe estar visible para administradores');
  }
  console.log('✓ Encabezado de Administrador limpio: sin cápsula, sin fondo, sin ID en vista principal, con botón Admin');

  // Abrir formulario de edición (lápiz)
  await page.evaluate(() => toggleEditProfileMode(true));
  await new Promise(r => setTimeout(r, 400));

  const editDataAdmin = await page.evaluate(() => {
    const editContainer = document.getElementById('profile-edit-container');
    const idInput = document.getElementById('profile-edit-id-input');
    return {
      isEditVisible: editContainer ? !editContainer.classList.contains('hidden') : false,
      idValue: idInput ? idInput.value : '',
      isReadOnly: idInput ? idInput.hasAttribute('readonly') : false
    };
  });

  console.log('Datos de edición admin:', editDataAdmin);
  if (!editDataAdmin.isEditVisible) throw new Error('FAIL TEST 1: El formulario de edición no se abrió');
  if (!editDataAdmin.idValue.includes('USR-001')) throw new Error('FAIL TEST 1: El ID no se mostró en el formulario: ' + editDataAdmin.idValue);
  if (!editDataAdmin.isReadOnly) throw new Error('FAIL TEST 1: El ID en el formulario debe ser de solo lectura (readonly)');
  console.log('✓ ID visible dentro del formulario de edición como dato de solo lectura');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'profile_admin_header_mobile.png') });

  // -------------------------------------------------------------
  // TEST 2: Cuenta Cliente (cliente@ejemplo.com)
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: Cuenta Cliente ---');
  await page.evaluate(() => {
    const clientUser = {
      id: 'CLI-9921',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@gmail.com',
      phone: '8095551234',
      role: 'cliente',
      isEmployee: false
    };
    if (typeof UserAuth !== 'undefined') {
      UserAuth.setSession(clientUser, true);
    }
    openUserProfileModal();
  });
  await new Promise(r => setTimeout(r, 600));

  const clientHeaderData = await page.evaluate(() => {
    const roleEl = document.getElementById('profile-modal-role');
    const clientIdEl = document.getElementById('profile-modal-client-id');
    const adminBtn = document.getElementById('profile-view-admin');
    const nameEl = document.getElementById('profile-modal-name');
    const emailEl = document.getElementById('profile-modal-email');

    return {
      name: nameEl ? nameEl.innerText.trim() : '',
      email: emailEl ? emailEl.innerText.trim() : '',
      roleText: roleEl ? roleEl.innerText.trim() : '',
      roleClass: roleEl ? roleEl.className : '',
      hasClientIdInHeader: Boolean(clientIdEl),
      isAdminBtnVisible: adminBtn ? !adminBtn.classList.contains('hidden') : false
    };
  });

  console.log('Datos de encabezado cliente:', clientHeaderData);

  if (clientHeaderData.roleText !== 'Cliente Registrado') {
    throw new Error('FAIL TEST 2: El rol del cliente no es "Cliente Registrado": ' + clientHeaderData.roleText);
  }
  if (clientHeaderData.roleClass.includes('bg-') || clientHeaderData.roleClass.includes('border') || clientHeaderData.roleClass.includes('rounded-full')) {
    throw new Error('FAIL TEST 2: El rol de cliente tiene fondo/cápsula: ' + clientHeaderData.roleClass);
  }
  if (clientHeaderData.hasClientIdInHeader) {
    throw new Error('FAIL TEST 2: El ID sigue visible en la vista principal del cliente');
  }
  if (clientHeaderData.isAdminBtnVisible) {
    throw new Error('FAIL TEST 2: El botón Panel Administrativo NO debe ser visible para un cliente');
  }
  console.log('✓ Encabezado de Cliente limpio: rol "Cliente Registrado" sin cápsula, sin ID principal, sin botón Admin');

  // Abrir formulario de edición para cliente
  await page.evaluate(() => toggleEditProfileMode(true));
  await new Promise(r => setTimeout(r, 400));

  const editDataClient = await page.evaluate(() => {
    const idInput = document.getElementById('profile-edit-id-input');
    return {
      idValue: idInput ? idInput.value : '',
      isReadOnly: idInput ? idInput.hasAttribute('readonly') : false
    };
  });

  if (!editDataClient.idValue.includes('CLI-9921')) {
    throw new Error('FAIL TEST 2: El ID del cliente no apareció en el formulario: ' + editDataClient.idValue);
  }
  if (!editDataClient.isReadOnly) {
    throw new Error('FAIL TEST 2: El ID en edición cliente no es readonly');
  }
  console.log('✓ ID del cliente visible dentro del formulario de edición como solo lectura');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'profile_client_header_mobile.png') });

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE ENCABEZADO DE PERFIL FUERON SUPERADAS CON ÉXITO!');
  await browser.close();
}

runProfileHeaderSuite().catch(err => {
  console.error('\n❌ ERROR EN LA SUITE DE PRUEBAS:', err);
  process.exit(1);
});
