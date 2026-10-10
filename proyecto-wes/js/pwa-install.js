// ==========================================
// WARN ELECTRICAL SERVICES (WES)
// Controlador Universal de Instalación PWA (Android & iOS)
// Estándar W3C / Apple WebKit v2.0
// ==========================================

let deferredInstallPrompt = null;

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const isStandaloneMode = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
};

function initPwaInstall() {
  if (isStandaloneMode()) {
    console.log('[WES PWA] Ejecutándose en modo App Standalone.');
    hideAllInstallUI();
    return;
  }

  const bannerDismissed = sessionStorage.getItem('wes_pwa_banner_dismissed') === 'true';
  const smartBanner = document.getElementById('pwa-smart-banner');
  if (smartBanner && !bannerDismissed) {
    smartBanner.classList.remove('hidden');
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('[WES PWA] Service Worker registrado:', reg.scope))
      .catch(err => console.warn('[WES PWA] Error registrando SW:', err));
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('[WES PWA] beforeinstallprompt capturado con éxito.');

    const navBtn = document.getElementById('pwa-install-btn');
    if (navBtn) navBtn.classList.remove('hidden');

    const drawerBtn = document.getElementById('pwa-drawer-install-btn');
    if (drawerBtn) drawerBtn.classList.remove('hidden');

    const banner = document.getElementById('pwa-smart-banner');
    if (banner && sessionStorage.getItem('wes_pwa_banner_dismissed') !== 'true') {
      banner.classList.remove('hidden');
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('[WES PWA] ¡App WES instalada satisfactoriamente!');
    deferredInstallPrompt = null;
    hideAllInstallUI();
    if (typeof showToast === 'function') {
      showToast('¡Gracias por instalar la App de WES en tu teléfono!', 'success');
    }
  });

  if (isIOS() && !isStandaloneMode()) {
    const navBtn = document.getElementById('pwa-install-btn');
    if (navBtn) navBtn.classList.remove('hidden');

    const drawerBtn = document.getElementById('pwa-drawer-install-btn');
    if (drawerBtn) drawerBtn.classList.remove('hidden');
  } else if (!isStandaloneMode()) {
    const navBtn = document.getElementById('pwa-install-btn');
    if (navBtn) navBtn.classList.remove('hidden');
  }
}

async function triggerPwaInstall() {
  if (isStandaloneMode()) {
    if (typeof showToast === 'function') {
      showToast('Ya estás utilizando la App instalada de WES.', 'info');
    }
    return;
  }

  // Caso 1: Android / PC con prompt nativo
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log('[WES PWA] Elección del usuario:', outcome);
    if (outcome === 'accepted') {
      hideAllInstallUI();
    }
    deferredInstallPrompt = null;
    return;
  }

  // Caso 2: Apple iOS (Safari / iPhone / iPad)
  if (isIOS()) {
    openPwaIosModal();
    return;
  }

  // Caso 3: Navegadores sin prompt directo
  openPwaAndroidGuideModal();
}

function dismissPwaBanner() {
  const banner = document.getElementById('pwa-smart-banner');
  if (banner) {
    banner.classList.add('hidden');
  }
  sessionStorage.setItem('wes_pwa_banner_dismissed', 'true');
}

function hideAllInstallUI() {
  const banner = document.getElementById('pwa-smart-banner');
  if (banner) banner.classList.add('hidden');

  const navBtn = document.getElementById('pwa-install-btn');
  if (navBtn) navBtn.classList.add('hidden');

  const drawerBtn = document.getElementById('pwa-drawer-install-btn');
  if (drawerBtn) {
    drawerBtn.innerHTML = '<i class="fas fa-check-circle mr-1 text-emerald-500"></i><span>App WES Instalada</span>';
    drawerBtn.classList.remove('bg-gradient-to-r', 'from-wes-gold', 'to-amber-500', 'text-wes-dark');
    drawerBtn.classList.add('bg-slate-100', 'text-slate-600');
    drawerBtn.disabled = true;
  }
}

function openPwaIosModal() {
  const modal = document.getElementById('pwa-ios-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closePwaIosModal() {
  const modal = document.getElementById('pwa-ios-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function openPwaAndroidGuideModal() {
  const modal = document.getElementById('pwa-guide-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closePwaGuideModal() {
  const modal = document.getElementById('pwa-guide-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPwaInstall);
} else {
  initPwaInstall();
}

window.triggerPwaInstall = triggerPwaInstall;
window.dismissPwaBanner = dismissPwaBanner;
window.closePwaIosModal = closePwaIosModal;
window.closePwaGuideModal = closePwaGuideModal;
