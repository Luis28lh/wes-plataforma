// ==========================================
// WARN ELECTRICAL SERVICES (WES)
// Controlador Universal de Instalación PWA (Android & iOS)
// Estándar W3C / Apple WebKit v2.0
// ==========================================

// Estado de instalación detectada en el dispositivo/navegador actual
let isAppInstalledDetected = false;
let deferredInstallPrompt = null;

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const isStandaloneMode = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://') ||
         window.location.search.includes('source=pwa');
};

/**
 * Evalúa rigurosamente si el botón de instalación del encabezado debe mostrarse u ocultarse.
 * Reglas:
 * 1. Ocultar si el visitante ha iniciado sesión (UserAuth.isAuthenticated()).
 * 2. Ocultar si la página se está ejecutando en modo standalone (App instalada).
 * 3. Ocultar si el navegador ya disparó appinstalled en esta sesión.
 * 4. Mostrar solo cuando esté en el navegador, no haya sesión y exista método o instrucciones aplicables.
 */
function evaluatePwaInstallVisibility() {
  const headerBtn = document.getElementById('header-pwa-install-btn');
  const drawerBtn = document.getElementById('pwa-drawer-install-btn');

  // Si está en modo App Standalone o ya se detectó instalada:
  if (isStandaloneMode() || isAppInstalledDetected) {
    if (headerBtn) headerBtn.classList.add('hidden');
    if (drawerBtn) drawerBtn.classList.add('hidden');
    return;
  }

  // Si el usuario está autenticado en la plataforma:
  const isAuth = typeof UserAuth !== 'undefined' && typeof UserAuth.isAuthenticated === 'function' && UserAuth.isAuthenticated();
  if (isAuth) {
    if (headerBtn) headerBtn.classList.add('hidden');
    if (drawerBtn) drawerBtn.classList.add('hidden');
    return;
  }

  // Visitante no autenticado en navegador web:
  // Mostrar si hay prompt nativo disponible (beforeinstallprompt), es iOS (Safari) o navegador estándar con instrucciones
  const canInstall = Boolean(deferredInstallPrompt) || isIOS() || true;

  if (canInstall) {
    if (headerBtn) headerBtn.classList.remove('hidden');
    if (drawerBtn) drawerBtn.classList.remove('hidden');
  } else {
    if (headerBtn) headerBtn.classList.add('hidden');
    if (drawerBtn) drawerBtn.classList.add('hidden');
  }
}

function initPwaInstall() {
  if (isStandaloneMode()) {
    console.log('[WES PWA] Ejecutándose en modo App Standalone.');
    isAppInstalledDetected = true;
    hideAllInstallUI();
    return;
  }

  // Registrar Service Worker
  if ('serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('[WES PWA] Nueva versión activa, recargando aplicación móvil...');
        window.location.reload();
      }
    });

    navigator.serviceWorker.register('sw.js?v=20261104_1245')
      .then(reg => {
        console.log('[WES PWA] Service Worker registrado:', reg.scope);
        reg.update();

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[WES PWA] Actualización lista, forzando activación...');
                newWorker.postMessage({ action: 'skipWaiting' });
              }
            });
          }
        });
      })
      .catch(err => console.warn('[WES PWA] Error registrando SW:', err));

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg) reg.update();
        });
        evaluatePwaInstallVisibility();
      }
    });
  }

  // Captura de evento de instalación nativa programática (Chromium/Android/Edge)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('[WES PWA] beforeinstallprompt capturado con éxito.');
    evaluatePwaInstallVisibility();
  });

  // Detección real de app instalada por señal del navegador
  window.addEventListener('appinstalled', () => {
    console.log('[WES PWA] ¡App WES instalada satisfactoriamente!');
    isAppInstalledDetected = true;
    deferredInstallPrompt = null;
    hideAllInstallUI();
    if (typeof showToast === 'function') {
      showToast('¡Gracias por instalar la App de WES en tu dispositivo!', 'success');
    }
  });

  // Re-evaluar ante cambios de display-mode
  try {
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    if (displayModeQuery && displayModeQuery.addEventListener) {
      displayModeQuery.addEventListener('change', (evt) => {
        if (evt.matches) {
          isAppInstalledDetected = true;
          hideAllInstallUI();
        } else {
          evaluatePwaInstallVisibility();
        }
      });
    }
  } catch (e) {}

  // Escuchar eventos de sesión de usuario (login y logout)
  window.addEventListener('wes_user_login', () => evaluatePwaInstallVisibility());
  window.addEventListener('wes_user_logout', () => evaluatePwaInstallVisibility());

  // Evaluación inicial de visibilidad
  evaluatePwaInstallVisibility();
}

async function triggerPwaInstall() {
  if (isStandaloneMode() || isAppInstalledDetected) {
    if (typeof showToast === 'function') {
      showToast('Ya estás utilizando la App instalada de WES.', 'info');
    }
    return;
  }

  // Caso 1: Android / PC con prompt nativo capturado
  if (deferredInstallPrompt) {
    try {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      console.log('[WES PWA] Elección del usuario en diálogo nativo:', choice);
      if (choice && choice.outcome === 'accepted') {
        isAppInstalledDetected = true;
        hideAllInstallUI();
      }
      // Nota: Si el usuario canceló (outcome: 'dismissed'), deferredInstallPrompt se consume
      // pero NO se marca como instalada, permitiendo reintentar o ver la guía manual si pulsa otra vez.
      deferredInstallPrompt = null;
      return;
    } catch (err) {
      console.warn('[WES PWA] Error al invocar prompt nativo:', err);
    }
  }

  // Caso 2: Apple iOS (Safari / iPhone / iPad)
  if (isIOS()) {
    openPwaIosModal();
    return;
  }

  // Caso 3: Navegadores sin prompt programático directo o cuando no esté disponible
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

  const headerBtn = document.getElementById('header-pwa-install-btn');
  if (headerBtn) headerBtn.classList.add('hidden');

  const navBtn = document.getElementById('pwa-install-btn');
  if (navBtn) navBtn.classList.add('hidden');

  const drawerBtn = document.getElementById('pwa-drawer-install-btn');
  if (drawerBtn) drawerBtn.classList.add('hidden');
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
window.evaluatePwaInstallVisibility = evaluatePwaInstallVisibility;
window.hideAllInstallUI = hideAllInstallUI;
Object.defineProperty(window, 'isAppInstalledDetected', {
  get: () => isAppInstalledDetected,
  set: (v) => { isAppInstalledDetected = v; }
});
Object.defineProperty(window, 'deferredInstallPrompt', {
  get: () => deferredInstallPrompt,
  set: (v) => { deferredInstallPrompt = v; }
});
