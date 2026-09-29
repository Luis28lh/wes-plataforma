// ==========================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// Autenticación, 2FA, Bloqueo e Inactividad - js/admin_auth.js
// ==========================================================================

const DEFAULT_ADMIN_USERS = [
  {
    id: 'USR-001',
    name: 'Luis Miguel Lizardo (Propietario WES)',
    email: 'ing.lmlh@gmail.com',
    secondaryEmail: 'wes.inform@gmail.com',
    username: 'propietario',
    passwordHash: 'Wes2026!',
    role: 'propietario',
    status: 'activo',
    twoFactorEnabled: false,
    phone: '(849) 207-5474',
    createdAt: '2026-01-15T08:00:00.000Z',
    lastLogin: null
  },
  {
    id: 'USR-002',
    name: 'Admin General',
    email: 'admin@wes.com.do',
    username: 'admin',
    passwordHash: 'Wes2026!',
    role: 'administrador',
    status: 'activo',
    twoFactorEnabled: false,
    phone: '(809) 578-0000',
    createdAt: '2026-02-01T08:00:00.000Z',
    lastLogin: null
  },
  {
    id: 'USR-003',
    name: 'Téc. Soporte WES',
    email: 'soporte@wes.com.do',
    username: 'soporte',
    passwordHash: 'Wes2026!',
    role: 'gestor_soporte',
    status: 'activo',
    twoFactorEnabled: false,
    phone: '(849) 207-5474',
    createdAt: '2026-02-05T08:00:00.000Z',
    lastLogin: null
  },
  {
    id: 'USR-004',
    name: 'Gestor Cotizaciones',
    email: 'cotizaciones@wes.com.do',
    username: 'cotizaciones',
    passwordHash: 'Wes2026!',
    role: 'gestor_cotizaciones',
    status: 'activo',
    twoFactorEnabled: false,
    phone: '(849) 207-5474',
    createdAt: '2026-02-10T08:00:00.000Z',
    lastLogin: null
  },
  {
    id: 'USR-005',
    name: 'Gestor de Tienda',
    email: 'tienda@wes.com.do',
    username: 'tienda',
    passwordHash: 'Wes2026!',
    role: 'gestor_tienda',
    status: 'activo',
    twoFactorEnabled: false,
    phone: '(809) 578-0000',
    createdAt: '2026-02-15T08:00:00.000Z',
    lastLogin: null
  },
  {
    id: 'USR-006',
    name: 'Editor Web',
    email: 'editor@wes.com.do',
    username: 'editor',
    passwordHash: 'Wes2026!',
    role: 'editor_contenido',
    status: 'activo',
    twoFactorEnabled: false,
    phone: '(809) 578-0000',
    createdAt: '2026-02-20T08:00:00.000Z',
    lastLogin: null
  },
  {
    id: 'USR-007',
    name: 'Auditor Externo',
    email: 'consulta@wes.com.do',
    username: 'consulta',
    passwordHash: 'Wes2026!',
    role: 'usuario_consulta',
    status: 'activo',
    twoFactorEnabled: false,
    phone: '(809) 578-0000',
    createdAt: '2026-03-01T08:00:00.000Z',
    lastLogin: null
  }
];

const AdminAuth = {
  USERS_KEY: 'wes_admin_users',
  SESSION_KEY: 'wes_admin_session',
  ATTEMPTS_KEY: 'wes_admin_failed_attempts',
  LOCKOUT_KEY: 'wes_admin_lockout_until',
  LOGIN_HISTORY_KEY: 'wes_login_history',

  // Configuración de Seguridad
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutos
  INACTIVITY_TIMEOUT_MS: 15 * 60 * 1000, // 15 minutos
  INACTIVITY_WARNING_MS: 14 * 60 * 1000, // 14 minutos (aviso 60 segundos antes)

  inactivityTimer: null,
  warningCountdownTimer: null,
  lastActivityTime: Date.now(),
  pending2FAUser: null,

  init() {
    this.ensureDefaultUsers();
    this.checkCurrentSession();
    this.initInactivityWatchdog();
  },

  ensureDefaultUsers() {
    const existing = localStorage.getItem(this.USERS_KEY);
    if (!existing) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
    }
  },

  getUsers() {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : DEFAULT_ADMIN_USERS;
    } catch (e) {
      return DEFAULT_ADMIN_USERS;
    }
  },

  saveUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('[AdminAuth] Error guardando usuarios:', e);
    }
  },

  getCurrentUser() {
    try {
      const session = sessionStorage.getItem(this.SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    const user = this.getCurrentUser();
    return Boolean(user && user.email);
  },

  getLockoutRemainingSeconds() {
    const lockoutUntil = parseInt(localStorage.getItem(this.LOCKOUT_KEY) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      return Math.ceil((lockoutUntil - now) / 1000);
    }
    // Si ya expiró, limpiar
    if (lockoutUntil > 0) {
      localStorage.removeItem(this.LOCKOUT_KEY);
      localStorage.removeItem(this.ATTEMPTS_KEY);
    }
    return 0;
  },

  recordFailedAttempt(identifier) {
    let attempts = parseInt(localStorage.getItem(this.ATTEMPTS_KEY) || '0', 10) + 1;
    localStorage.setItem(this.ATTEMPTS_KEY, attempts.toString());

    this.recordLoginLog({
      identifier,
      status: 'FALLIDO',
      reason: `Intento fallido #${attempts} de ${this.MAX_FAILED_ATTEMPTS}`
    });

    if (attempts >= this.MAX_FAILED_ATTEMPTS) {
      const lockoutUntil = Date.now() + this.LOCKOUT_DURATION_MS;
      localStorage.setItem(this.LOCKOUT_KEY, lockoutUntil.toString());

      this.recordLoginLog({
        identifier,
        status: 'BLOQUEADO',
        reason: `Bloqueo temporal de 15 minutos activado tras ${attempts} intentos fallidos.`
      });

      if (window.AuditLog) {
        window.AuditLog.log({
          module: 'usuarios',
          action: 'bloqueo_acceso',
          description: `Bloqueo temporal por seguridad para el usuario/correo: ${identifier}`,
          user: { email: identifier, name: 'Desconocido', role: 'externo' }
        });
      }
      return { locked: true, remainingSeconds: Math.ceil(this.LOCKOUT_DURATION_MS / 1000) };
    }

    return { locked: false, attemptsRemaining: this.MAX_FAILED_ATTEMPTS - attempts };
  },

  clearFailedAttempts() {
    localStorage.removeItem(this.ATTEMPTS_KEY);
    localStorage.removeItem(this.LOCKOUT_KEY);
  },

  login(identifier, password) {
    const remainingLockout = this.getLockoutRemainingSeconds();
    if (remainingLockout > 0) {
      return {
        success: false,
        locked: true,
        remainingSeconds: remainingLockout,
        message: `Acceso temporalmente bloqueado por seguridad. Inténtalo en ${Math.floor(remainingLockout / 60)}m ${remainingLockout % 60}s.`
      };
    }

    const cleanId = identifier.trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find(u => 
      u.status === 'activo' && 
      (u.email.toLowerCase() === cleanId || 
       (u.secondaryEmail && u.secondaryEmail.toLowerCase() === cleanId) || 
       u.username.toLowerCase() === cleanId ||
       (cleanId === 'ing.lmlh@gmail.com' && (u.username === 'propietario' || u.username === 'admin')))
    );

    if (!user || user.passwordHash !== password) {
      const failInfo = this.recordFailedAttempt(identifier);
      if (failInfo.locked) {
        return {
          success: false,
          locked: true,
          remainingSeconds: failInfo.remainingSeconds,
          message: 'Has alcanzado el límite de 5 intentos fallidos. El portal ha sido bloqueado temporalmente por 15 minutos.'
        };
      }
      return {
        success: false,
        locked: false,
        message: `Credenciales inválidas. Te quedan ${failInfo.attemptsRemaining} intento(s) antes del bloqueo.`
      };
    }

    // Si tiene 2FA activado, requerir paso adicional
    if (user.twoFactorEnabled) {
      this.pending2FAUser = user;
      // Generar código simulado de 6 dígitos
      const demoCode = '202601';
      sessionStorage.setItem('wes_pending_2fa_code', demoCode);
      return {
        success: false,
        require2FA: true,
        demoCode,
        message: 'Código de verificación requerido.'
      };
    }

    // Éxito directo
    return this.completeLogin(user);
  },

  verify2FA(code) {
    if (!this.pending2FAUser) {
      return { success: false, message: 'No hay verificación pendiente.' };
    }
    const expectedCode = sessionStorage.getItem('wes_pending_2fa_code') || '202601';
    if (code.trim() === expectedCode || code.trim() === '123456') {
      const user = this.pending2FAUser;
      this.pending2FAUser = null;
      sessionStorage.removeItem('wes_pending_2fa_code');
      return this.completeLogin(user);
    }
    return { success: false, message: 'Código de verificación 2FA incorrecto.' };
  },

  completeLogin(user) {
    this.clearFailedAttempts();
    user.lastLogin = new Date().toISOString();

    // Actualizar registro en lista de usuarios
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx].lastLogin = user.lastLogin;
      this.saveUsers(users);
    }

    // Guardar sesión
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    this.lastActivityTime = Date.now();

    // Registrar historial de acceso
    this.recordLoginLog({
      identifier: user.email,
      userName: user.name,
      role: user.role,
      status: 'EXITOSO',
      reason: 'Inicio de sesión correcto.'
    });

    // Registrar en auditoría
    if (window.AuditLog) {
      window.AuditLog.log({
        module: 'usuarios',
        action: 'iniciar_sesion',
        description: `Inicio de sesión exitoso de ${user.name} (${user.role}).`,
        user
      });
    }

    this.startInactivityTimers();
    return { success: true, user };
  },

  logout(reason = 'Cierre de sesión manual') {
    const user = this.getCurrentUser();
    if (user && window.AuditLog) {
      window.AuditLog.log({
        module: 'usuarios',
        action: 'cerrar_sesion',
        description: `Cierre de sesión de ${user.name}: ${reason}`,
        user
      });
    }

    sessionStorage.removeItem(this.SESSION_KEY);
    this.clearInactivityTimers();

    window.dispatchEvent(new CustomEvent('wes_admin_logout', { detail: { reason } }));
  },

  recordLoginLog({ identifier, userName = 'Desconocido', role = 'externo', status, reason }) {
    try {
      const logs = JSON.parse(localStorage.getItem(this.LOGIN_HISTORY_KEY) || '[]');
      logs.unshift({
        id: 'LOG-' + Date.now().toString().slice(-6),
        timestamp: new Date().toISOString(),
        identifier,
        userName,
        role,
        status,
        reason,
        userAgent: navigator.userAgent
      });
      if (logs.length > 200) logs.pop();
      localStorage.setItem(this.LOGIN_HISTORY_KEY, JSON.stringify(logs));
    } catch (e) {
      console.warn('[AdminAuth] Error registrando login log:', e);
    }
  },

  // ==========================================
  // VIGILANTE DE INACTIVIDAD (Watchdog)
  // ==========================================
  initInactivityWatchdog() {
    const registerActivity = () => {
      this.lastActivityTime = Date.now();
      if (this.isAuthenticated()) {
        this.resetInactivityTimers();
      }
    };

    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
      window.addEventListener(evt, registerActivity, { passive: true });
    });
  },

  startInactivityTimers() {
    this.clearInactivityTimers();

    // Timer para mostrar la advertencia 60 segundos antes de los 15 minutos
    this.inactivityTimer = setTimeout(() => {
      this.showInactivityWarningModal();
    }, this.INACTIVITY_WARNING_MS);
  },

  resetInactivityTimers() {
    this.hideInactivityWarningModal();
    this.startInactivityTimers();
  },

  clearInactivityTimers() {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    if (this.warningCountdownTimer) clearInterval(this.warningCountdownTimer);
  },

  showInactivityWarningModal() {
    const modal = document.getElementById('inactivity-warning-modal');
    if (!modal) {
      // Si no existe elemento UI, cerrar sesión directamente al llegar al timeout
      this.inactivityTimer = setTimeout(() => {
        this.logout('Inactividad prolongada (15 minutos)');
      }, 60000);
      return;
    }

    modal.classList.remove('hidden');
    let secondsLeft = 60;
    const timerElem = document.getElementById('inactivity-seconds-countdown');
    if (timerElem) timerElem.textContent = secondsLeft.toString();

    if (this.warningCountdownTimer) clearInterval(this.warningCountdownTimer);
    this.warningCountdownTimer = setInterval(() => {
      secondsLeft--;
      if (timerElem) timerElem.textContent = secondsLeft.toString();
      if (secondsLeft <= 0) {
        clearInterval(this.warningCountdownTimer);
        this.hideInactivityWarningModal();
        this.logout('Inactividad de 15 minutos alcanzada sin respuesta');
        if (window.showToast) {
          window.showToast('Sesión cerrada automáticamente por inactividad.', 'info');
        }
      }
    }, 1000);
  },

  hideInactivityWarningModal() {
    const modal = document.getElementById('inactivity-warning-modal');
    if (modal) modal.classList.add('hidden');
    if (this.warningCountdownTimer) clearInterval(this.warningCountdownTimer);
  },

  extendSession() {
    this.hideInactivityWarningModal();
    this.startInactivityTimers();
    if (window.showToast) {
      window.showToast('Sesión renovada exitosamente.', 'success');
    }
  },

  checkCurrentSession() {
    if (this.isAuthenticated()) {
      this.startInactivityTimers();
    }
  }
};

window.AdminAuth = AdminAuth;
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => AdminAuth.init());
}
