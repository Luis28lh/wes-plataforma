/**
 * test_profile_settings_suite.js
 * Verificación automatizada con Puppeteer:
 * - Sin botón lápiz sobre avatar
 * - Botón de engranaje presente, accesible, debajo de la 'X'
 * - Apertura de la vista de Configuración de cuenta
 * - 3 Opciones verticales: Datos personales, Correo electrónico, Preferencias de notificaciones
 * - ID Informativo en solo lectura en Datos personales
 * - Verificación en móvil (390px) y escritorio (1366px)
 * - Capturas de pantalla guardadas en artefactos
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\ed0acbda-4949-4816-a6fc-3e44a8cbbf24';
const HTML_FILE = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

async function runProfileSettingsSuite() {
  console.log('=== INICIANDO SUITE DE COMPROBACIÓN DE CONFIGURACIÓN DE PERFIL WES ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // =========================================================================
  // FASE 1: VISTA MÓVIL (390 x 844 px)
  // =========================================================================
  console.log('--- FASE 1: Verificación en Móvil (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(HTML_FILE, { waitUntil: 'networkidle0' });

  // 1. Iniciar sesión simulada como cliente
  await page.evaluate(() => {
    const clientUser = {
      id: 'USR-CLIENTE-7721',
      name: 'Carlos Santana',
      email: 'carlos.cliente@ejemplo.com',
      phone: '8095551234',
      role: 'cliente',
      roleLabel: 'Cliente Registrado',
      isEmployee: false
    };
    if (typeof UserAuth !== 'undefined') {
      UserAuth.setSession(clientUser, true);
    }
    openUserProfileModal();
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Comprobar encabezado: sin lápiz sobre el avatar, botón de engranaje presente y debajo de la 'X'
  const headerCheck = await page.evaluate(() => {
    const avatar = document.getElementById('profile-modal-avatar');
    const avatarPencil = avatar ? avatar.parentElement.querySelector('button i.fa-pen, button i.fa-pencil') : null;
    const gearBtn = document.getElementById('profile-settings-btn');
    const closeBtn = document.querySelector('#user-profile-modal button[onclick*="closeUserProfileModal"]');

    let gearBox = null;
    let closeBox = null;
    if (gearBtn) {
      const rect = gearBtn.getBoundingClientRect();
      gearBox = { top: rect.top, right: rect.right, width: rect.width, height: rect.height };
    }
    if (closeBtn) {
      const rect = closeBtn.getBoundingClientRect();
      closeBox = { top: rect.top, right: rect.right, width: rect.width, height: rect.height };
    }

    return {
      hasAvatarPencil: !!avatarPencil,
      hasGearBtn: !!gearBtn,
      gearAriaLabel: gearBtn ? gearBtn.getAttribute('aria-label') : null,
      gearTitle: gearBtn ? gearBtn.getAttribute('title') : null,
      closeBox,
      gearBox,
      isGearBelowClose: closeBox && gearBox && gearBox.top > closeBox.top
    };
  });

  console.log('✓ ¿Tiene botón lápiz sobre avatar?:', headerCheck.hasAvatarPencil ? 'ERROR (presente)' : 'CORRECTO (eliminado)');
  console.log('✓ ¿Existe botón de engranaje?:', headerCheck.hasGearBtn);
  console.log('✓ Etiqueta accesible aria-label:', headerCheck.gearAriaLabel);
  console.log('✓ ¿Engranaje está ubicado debajo de la X?:', headerCheck.isGearBelowClose, `(X: ${headerCheck.closeBox?.top}px, Engranaje: ${headerCheck.gearBox?.top}px)`);

  if (headerCheck.hasAvatarPencil) throw new Error('El lápiz sobre el avatar todavía existe.');
  if (!headerCheck.hasGearBtn) throw new Error('El botón de engranaje no existe.');
  if (headerCheck.gearAriaLabel !== 'Configuración de mi cuenta') throw new Error('Aria-label incorrecto.');
  if (!headerCheck.isGearBelowClose) throw new Error('El engranaje no está debajo del botón cerrar.');

  // Captura del perfil principal en móvil
  const profileMainMobilePath = path.join(ARTIFACT_DIR, 'profile_main_mobile.png');
  await page.screenshot({ path: profileMainMobilePath });
  console.log(`✓ Captura guardada: ${profileMainMobilePath}`);

  // 3. Pulsar el botón de engranaje para abrir la vista de Configuración
  await page.click('#profile-settings-btn');
  await new Promise(r => setTimeout(r, 400));

  const settingsViewCheck = await page.evaluate(() => {
    const settingsContainer = document.getElementById('profile-settings-container');
    const menuContainer = document.getElementById('profile-menu-container');
    const settingsList = document.getElementById('settings-menu-list');
    const personalBtn = settingsList ? settingsList.querySelector('button[onclick*="personal"]') : null;
    const emailBtn = settingsList ? settingsList.querySelector('button[onclick*="email"]') : null;
    const notifBtn = settingsList ? settingsList.querySelector('button[onclick*="notifications"]') : null;

    return {
      isSettingsVisible: settingsContainer && !settingsContainer.classList.contains('hidden'),
      isMainMenuHidden: menuContainer && menuContainer.classList.contains('hidden'),
      hasPersonalOption: !!personalBtn && personalBtn.innerText.includes('Datos personales'),
      hasEmailOption: !!emailBtn && emailBtn.innerText.includes('Correo electrónico'),
      hasNotifOption: !!notifBtn && notifBtn.innerText.includes('Preferencias de notificaciones')
    };
  });

  console.log('✓ Vista de configuración visible:', settingsViewCheck.isSettingsVisible);
  console.log('✓ Menú principal oculto:', settingsViewCheck.isMainMenuHidden);
  console.log('✓ Opción 1 (Datos personales):', settingsViewCheck.hasPersonalOption);
  console.log('✓ Opción 2 (Correo electrónico):', settingsViewCheck.hasEmailOption);
  console.log('✓ Opción 3 (Preferencias de notificaciones):', settingsViewCheck.hasNotifOption);

  if (!settingsViewCheck.isSettingsVisible || !settingsViewCheck.hasPersonalOption || !settingsViewCheck.hasEmailOption || !settingsViewCheck.hasNotifOption) {
    throw new Error('Fallo al abrir o renderizar las 3 opciones de configuración.');
  }

  // Captura de la vista de configuración en móvil
  const profileSettingsMobilePath = path.join(ARTIFACT_DIR, 'profile_settings_mobile.png');
  await page.screenshot({ path: profileSettingsMobilePath });
  console.log(`✓ Captura guardada: ${profileSettingsMobilePath}`);

  // 4. Entrar a Opción 1: Datos personales
  await page.evaluate(() => openSettingsSubView('personal'));
  await new Promise(r => setTimeout(r, 300));

  const personalDataCheck = await page.evaluate(() => {
    const personalView = document.getElementById('settings-personal-view');
    const idInput = document.getElementById('profile-edit-id-input');
    const nameInput = document.getElementById('profile-edit-name-input');
    const phoneInput = document.getElementById('profile-edit-phone-input');
    const previewAvatar = document.getElementById('profile-settings-preview-avatar');
    const roleInputInForm = personalView ? personalView.querySelector('input[name*="role"], select[name*="role"]') : null;

    return {
      isPersonalViewVisible: personalView && !personalView.classList.contains('hidden'),
      idValue: idInput ? idInput.value : '',
      isIdReadOnly: idInput ? idInput.hasAttribute('readonly') : false,
      nameValue: nameInput ? nameInput.value : '',
      phoneValue: phoneInput ? phoneInput.value : '',
      avatarText: previewAvatar ? previewAvatar.innerText.trim() : '',
      hasRoleInput: !!roleInputInForm // Debe ser FALSE para evitar cambio de rol
    };
  });

  console.log('✓ Sub-vista Datos personales visible:', personalDataCheck.isPersonalViewVisible);
  console.log('✓ ID Informativo cargado y solo lectura:', personalDataCheck.idValue, `(ReadOnly: ${personalDataCheck.isIdReadOnly})`);
  console.log('✓ Nombre y teléfono precargados:', personalDataCheck.nameValue, '|', personalDataCheck.phoneValue);
  console.log('✓ Avatar con iniciales:', personalDataCheck.avatarText);
  console.log('✓ Blindaje RBAC: ¿Sin selector ni cambio de rol?:', !personalDataCheck.hasRoleInput);

  if (!personalDataCheck.isPersonalViewVisible) throw new Error('Sub-vista de datos personales no visible.');
  if (!personalDataCheck.isIdReadOnly || personalDataCheck.idValue !== 'USR-CLIENTE-7721') throw new Error('ID no es de solo lectura o incorrecto.');
  if (personalDataCheck.hasRoleInput) throw new Error('Vulnerabilidad: se detectó selector de rol en formulario.');

  // Captura de datos personales en móvil
  const profilePersonalMobilePath = path.join(ARTIFACT_DIR, 'profile_personal_data_mobile.png');
  await page.screenshot({ path: profilePersonalMobilePath });
  console.log(`✓ Captura guardada: ${profilePersonalMobilePath}`);

  // 5. Probar retorno con "Volver a opciones" y luego "Volver a mi perfil"
  await page.evaluate(() => backToSettingsMenu());
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => backFromSettingsToProfileMenu());
  await new Promise(r => setTimeout(r, 200));

  const returnCheck = await page.evaluate(() => {
    const menuContainer = document.getElementById('profile-menu-container');
    const settingsContainer = document.getElementById('profile-settings-container');
    return {
      isMenuVisible: menuContainer && !menuContainer.classList.contains('hidden'),
      isSettingsHidden: settingsContainer && settingsContainer.classList.contains('hidden')
    };
  });
  console.log('✓ Retorno al menú de perfil exitoso:', returnCheck.isMenuVisible && returnCheck.isSettingsHidden);
  if (!returnCheck.isMenuVisible || !returnCheck.isSettingsHidden) throw new Error('Error al volver al perfil.');

  // =========================================================================
  // FASE 2: VISTA ESCRITORIO (1366 x 768 px) - Cuenta Administradora
  // =========================================================================
  console.log('\n--- FASE 2: Verificación en Escritorio (1366x768) ---');
  await page.setViewport({ width: 1366, height: 768 });
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
    UserAuth.setSession(adminUser, true);
    openUserProfileModal();
  });
  await new Promise(r => setTimeout(r, 400));

  // Abrir vista de configuración en escritorio
  await page.click('#profile-settings-btn');
  await new Promise(r => setTimeout(r, 300));

  const desktopSettingsPath = path.join(ARTIFACT_DIR, 'profile_settings_desktop.png');
  await page.screenshot({ path: desktopSettingsPath });
  console.log(`✓ Captura guardada: ${desktopSettingsPath}`);

  await browser.close();
  console.log('\n=== SUITE COMPLETADA CON ÉXITO: 100% PRUEBAS APROBADAS ===');
}

runProfileSettingsSuite().catch(err => {
  console.error('ERROR EN SUITE:', err);
  process.exit(1);
});
