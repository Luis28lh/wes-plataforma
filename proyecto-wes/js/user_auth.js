// ============================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// SISTEMA DE AUTENTICACIÓN UNIVERSAL (EMPLEADOS Y CLIENTES) - js/user_auth.js
// Soporta Registro con Doble Clave, Notificación a ing.lmlh@gmail.com,
// Asignación de Vistas (Técnico Interno, Técnico Externo, Cliente) y Dashboard
// ============================================================================

const UserAuth = (function() {
  const CLIENTS_STORAGE_KEY = 'wes_registered_clients';
  const SESSION_STORAGE_KEY = 'wes_user_session';
  const RESET_CODES_KEY = 'wes_password_reset_codes';
  const ADMIN_NOTIFS_KEY = 'wes_admin_notifications';
  const BACKEND_URL_DEFAULT = 'https://script.google.com/macros/s/AKfycbyoN8TnzeN9Cg2X44YEt6KeQULahvG0DrEXP5m4HyLvJFs475maMjVrwjW8t-IRVIQ_OQ/exec';
  const ADMIN_NOTIFICATION_EMAIL = 'ing.lmlh@gmail.com';

  // Empleados predefinidos del sistema (sincronizados con AdminAuth)
  const SYSTEM_EMPLOYEES = [
    {
      id: 'EMP-001',
      name: 'Luis Miguel Lizardo',
      email: 'ing.lmlh@gmail.com',
      secondaryEmail: 'wes.inform@gmail.com',
      username: 'propietario',
      password: '255133',
      role: 'propietario',
      roleLabel: 'Propietario / Superadmin',
      isEmployee: true
    },
    {
      id: 'EMP-002',
      name: 'Admin General',
      email: 'admin@wes.com.do',
      username: 'admin',
      password: '255133',
      role: 'administrador',
      roleLabel: 'Administrador WES',
      isEmployee: true
    },
    {
      id: 'EMP-003',
      name: 'Téc. Soporte WES',
      email: 'soporte@wes.com.do',
      username: 'soporte',
      password: 'Wes2026!',
      role: 'gestor_soporte',
      roleLabel: 'Soporte Técnico',
      isEmployee: true
    },
    {
      id: 'EMP-004',
      name: 'Gestor Cotizaciones',
      email: 'cotizaciones@wes.com.do',
      username: 'cotizaciones',
      password: 'Wes2026!',
      role: 'gestor_cotizaciones',
      roleLabel: 'Ventas y Cotizaciones',
      isEmployee: true
    },
    {
      id: 'EMP-005',
      name: 'Gestor de Tienda',
      email: 'tienda@wes.com.do',
      username: 'tienda',
      password: 'Wes2026!',
      role: 'gestor_tienda',
      roleLabel: 'Gestor de Inventario',
      isEmployee: true
    }
  ];

  // Semilla de usuarios registrados iniciales para alimentar el dashboard temporal (meses y semanas)
  const DEFAULT_CLIENTS_SEED = [
    {
      id: 'USR-REG-001',
      name: 'Carlos Mendoza Peña',
      email: 'carlos.mendoza@gmail.com',
      phone: '(809) 578-2341',
      password: 'User2026!',
      role: 'cliente',
      roleLabel: 'Vista Cliente',
      isEmployee: false,
      createdAt: '2026-10-02T14:20:00.000Z',
      verified: true
    },
    {
      id: 'USR-REG-002',
      name: 'Ing. Ramón Peralta',
      email: 'ramon.peralta.cibao@gmail.com',
      phone: '(829) 450-8912',
      password: 'User2026!',
      role: 'tecnico_externo',
      roleLabel: 'Técnico Externo',
      isEmployee: true,
      createdAt: '2026-10-05T09:15:00.000Z',
      verified: true
    },
    {
      id: 'USR-REG-003',
      name: 'María Altagracia Rosario',
      email: 'maria.rosario.moca@hotmail.com',
      phone: '(849) 210-3345',
      password: 'User2026!',
      role: 'cliente',
      roleLabel: 'Vista Cliente',
      isEmployee: false,
      createdAt: '2026-10-10T11:40:00.000Z',
      verified: true
    },
    {
      id: 'USR-REG-004',
      name: 'Téc. Kelvin Bautista',
      email: 'kelvin.bautista@wes.com.do',
      phone: '(849) 301-4455',
      password: 'User2026!',
      role: 'tecnico_interno',
      roleLabel: 'Técnico Interno WES',
      isEmployee: true,
      createdAt: '2026-10-12T16:30:00.000Z',
      verified: true
    },
    {
      id: 'USR-REG-005',
      name: 'Finca Los Laureles (Agropecuaria)',
      email: 'finca.laureles@gmail.com',
      phone: '(809) 582-7711',
      password: 'User2026!',
      role: 'cliente',
      roleLabel: 'Vista Cliente',
      isEmployee: false,
      createdAt: '2026-10-18T10:00:00.000Z',
      verified: true
    },
    {
      id: 'USR-REG-006',
      name: 'Danilo Cruz Guzmán',
      email: 'danilo.cruz.cctv@gmail.com',
      phone: '(829) 712-9900',
      password: 'User2026!',
      role: 'tecnico_externo',
      roleLabel: 'Técnico Externo',
      isEmployee: true,
      createdAt: '2026-10-23T15:20:00.000Z',
      verified: true
    },
    {
      id: 'USR-REG-007',
      name: 'Dra. Carmen Paulino',
      email: 'carmen.paulino.dr@gmail.com',
      phone: '(809) 578-9012',
      password: 'User2026!',
      role: 'cliente',
      roleLabel: 'Vista Cliente',
      isEmployee: false,
      createdAt: '2026-10-27T08:50:00.000Z',
      verified: true
    },
    {
      id: 'USR-REG-008',
      name: 'Residencial Don Miguel (Condominio)',
      email: 'junta.donmiguel@gmail.com',
      phone: '(849) 404-5566',
      password: 'User2026!',
      role: 'cliente',
      roleLabel: 'Vista Cliente',
      isEmployee: false,
      createdAt: '2026-10-30T17:10:00.000Z',
      verified: true
    },
    {
      id: 'USR-REG-009',
      name: 'José Manuel Tejada',
      email: 'jose.tejada.tech@gmail.com',
      phone: '(829) 660-1289',
      password: 'User2026!',
      role: 'tecnico_interno',
      roleLabel: 'Técnico Interno WES',
      isEmployee: true,
      createdAt: '2026-11-01T09:00:00.000Z',
      verified: true
    },
    {
      id: 'USR-REG-010',
      name: 'Lic. Andrés Espinal',
      email: 'andres.espinal.moca@gmail.com',
      phone: '(849) 207-1122',
      password: 'User2026!',
      role: 'cliente',
      roleLabel: 'Vista Cliente',
      isEmployee: false,
      createdAt: '2026-11-02T08:30:00.000Z',
      verified: true
    }
  ];

  function generateId(prefix = 'CLI') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();
  }

  function getRegisteredClients() {
    try {
      const data = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTS_SEED));
        return DEFAULT_CLIENTS_SEED;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTS_SEED));
        return DEFAULT_CLIENTS_SEED;
      }
      return parsed;
    } catch (e) {
      console.warn('[UserAuth] Error leyendo clientes:', e);
      return DEFAULT_CLIENTS_SEED;
    }
  }

  function saveRegisteredClients(clients) {
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error('[UserAuth] Error guardando clientes:', e);
    }
  }

  function getAllEmployees() {
    try {
      if (typeof AdminAuth !== 'undefined' && typeof AdminAuth.getUsers === 'function') {
        const adminUsers = AdminAuth.getUsers();
        if (Array.isArray(adminUsers) && adminUsers.length > 0) {
          return adminUsers.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            secondaryEmail: u.secondaryEmail,
            username: u.username,
            password: u.passwordHash,
            role: u.role,
            roleLabel: u.role.replace('_', ' ').toUpperCase(),
            isEmployee: true
          }));
        }
      }
    } catch (e) {
      // fallback
    }
    return SYSTEM_EMPLOYEES;
  }

  function findUserByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();

    // 1. Buscar en empleados predefinidos
    const employees = getAllEmployees();
    const emp = employees.find(e => 
      (e.email && e.email.toLowerCase() === clean) ||
      (e.secondaryEmail && e.secondaryEmail.toLowerCase() === clean) ||
      (e.username && e.username.toLowerCase() === clean)
    );
    if (emp) return { ...emp, isEmployee: true };

    // 2. Buscar en clientes / usuarios registrados
    const clients = getRegisteredClients();
    const cli = clients.find(c => 
      c.email && c.email.toLowerCase() === clean
    );
    if (cli) {
      const assignedRole = cli.role || 'cliente';
      let roleLabel = 'Vista Cliente';
      if (assignedRole === 'tecnico_interno') roleLabel = 'Técnico Interno WES';
      else if (assignedRole === 'tecnico_externo') roleLabel = 'Técnico Externo';
      else if (assignedRole === 'administrador' || assignedRole === 'propietario') roleLabel = 'Administrador WES';

      return {
        ...cli,
        isEmployee: assignedRole !== 'cliente',
        role: assignedRole,
        roleLabel: cli.roleLabel || roleLabel
      };
    }

    return null;
  }

  function generate6DigitCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  // Notificación automática al administrador (ing.lmlh@gmail.com) cuando se produce un nuevo registro
  async function notifyAdminNewRegistration(user) {
    const regDate = new Date(user.createdAt || Date.now()).toLocaleString('es-DO', {
      timeZone: 'America/Santo_Domingo',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const subjectText = `🔔 [WES Alerta] Nuevo Usuario Registrado: ${user.email}`;
    const messageText = `Hola Luis Miguel (Ing. LMLH),

Se ha producido un nuevo registro en la plataforma de Warn Electrical Services (WES):

• Nombre: ${user.name || 'Usuario Web'}
• Correo Electrónico: ${user.email}
• Teléfono: ${user.phone || 'No especificado'}
• Fecha y Hora: ${regDate}
• Vista Asignada Inicial: ${user.roleLabel || 'Vista Cliente'}

Puedes ingresar al Panel de Control de WES (admin.html) en la sección "Usuarios & Dashboard de Registros" para asignarle su vista correspondiente (Técnico Interno WES, Técnico Externo o Cliente).

Warn Electrical Services, SRL (WES)
Moca, Provincia Espaillat, República Dominicana`;

    // 1. Guardar notificación en el buzón local de notificaciones del administrador
    try {
      const notifs = JSON.parse(localStorage.getItem(ADMIN_NOTIFS_KEY) || '[]');
      notifs.unshift({
        id: 'NOTIF-' + Date.now(),
        type: 'nuevo_registro',
        title: 'Nuevo Usuario Registrado',
        message: `${user.name || 'Usuario'} (${user.email}) se ha registrado.`,
        userEmail: user.email,
        userName: user.name,
        role: user.role || 'cliente',
        createdAt: new Date().toISOString(),
        read: false
      });
      if (notifs.length > 50) notifs.pop();
      localStorage.setItem(ADMIN_NOTIFS_KEY, JSON.stringify(notifs));
    } catch (e) {
      console.warn('[UserAuth] Error guardando notificación admin:', e);
    }

    // 2. Registrar en auditoría
    if (typeof window !== 'undefined' && window.AuditLog) {
      window.AuditLog.log({
        module: 'usuarios',
        action: 'nuevo_registro_web',
        description: `Nuevo registro de usuario: ${user.email} (${user.name || 'Sin nombre'}). Notificación enviada a ${ADMIN_NOTIFICATION_EMAIL}.`,
        user: { email: user.email, name: user.name, role: user.role || 'cliente' }
      });
    }

    // 3. Enviar correo real vía backend Google Apps Script
    const backendUrl = (typeof AppState !== 'undefined' && AppState.backendUrl) ? AppState.backendUrl : BACKEND_URL_DEFAULT;
    const payload = {
      action: 'nuevoMensaje',
      destEmail: ADMIN_NOTIFICATION_EMAIL,
      data: {
        name: 'Sistema WES Notificaciones',
        email: ADMIN_NOTIFICATION_EMAIL,
        replyTo: user.email,
        phone: user.phone || '8492075474',
        subject: subjectText,
        message: messageText
      }
    };

    console.log(`[UserAuth] ✉️ Enviando notificación de nuevo registro a: ${ADMIN_NOTIFICATION_EMAIL}`);

    try {
      await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      console.log(`[UserAuth] ✅ Notificación enviada exitosamente a ${ADMIN_NOTIFICATION_EMAIL}`);
      return { success: true };
    } catch (err) {
      console.warn('[UserAuth] Backend no disponible para correo inmediato, guardado localmente:', err);
      return { success: true, localOnly: true };
    }
  }

  const AUTH_CODES_KEY = "wes_magic_auth_codes";
  const REVOKED_SESSIONS_KEY = "wes_revoked_sessions";

  async function sendMagicAccessCode(email, code, userName, isExisting) {
    const backendUrl = (typeof AppState !== "undefined" && AppState.backendUrl) ? AppState.backendUrl : BACKEND_URL_DEFAULT;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanCode = String(code).trim();
    const displayName = userName || (isExisting ? "Usuario de WES" : "Nuevo Usuario");

    const subjectText = "WES · Código de acceso: " + cleanCode;
    const messageText = "WARN ELECTRICAL SERVICES, SRL (WES)\n" +
      "Moca, República Dominicana | https://web.warnelectricalservices.com/\n\n" +
      "Hola " + displayName + ",\n\n" +
      "Tu código de acceso de 6 dígitos para entrar o crear tu cuenta es:\n\n" +
      "================================\n" +
      "           " + cleanCode + "\n" +
      "================================\n\n" +
      "Este código es válido durante 10 minutos, es de un solo uso y no debe compartirse con nadie.\n" +
      "WES nunca te solicitará contraseñas ni transferencias para entregarte este código.\n\n" +
      "Enlace para volver a WES:\n" +
      "https://web.warnelectricalservices.com/\n\n" +
      "Si no solicitaste este código, puedes ignorar este mensaje de forma segura.\n\n" +
      "Warn Electrical Services, SRL";

    const htmlContent = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:18px;background:#ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.05);">' +
      '<div style="text-align:center;background:linear-gradient(135deg,#071836,#0D2A5C);color:#ffffff;padding:26px 20px;border-radius:14px;">' +
      '<div style="display:inline-block;padding:4px 12px;background:rgba(255,255,255,0.12);border-radius:20px;margin-bottom:8px;font-size:11px;font-weight:bold;letter-spacing:1px;color:#F5B300;">WARN ELECTRICAL SERVICES (WES)</div>' +
      '<h2 style="color:#ffffff;margin:4px 0 0 0;font-size:22px;letter-spacing:0.5px;font-weight:800;">Código de acceso</h2>' +
      '<p style="margin:6px 0 0 0;font-size:12px;color:#cbd5e1;">Moca, República Dominicana · Acceso Seguro</p>' +
      '</div>' +
      '<div style="padding:28px 16px;color:#334155;line-height:1.6;font-size:14px;">' +
      '<p style="margin:0 0 16px 0;">Hola, <strong>' + displayName + '</strong>:</p>' +
      '<p style="margin:0 0 20px 0;color:#475569;">Usa este código de 6 dígitos para iniciar sesión o registrar tu cuenta en Warn Electrical Services:</p>' +
      '<div style="text-align:center;margin:24px 0;padding:20px;background:#f8fafc;border:2px dashed #0D2A5C;border-radius:14px;">' +
      '<span style="display:block;font-size:11px;font-weight:700;letter-spacing:1px;color:#64748b;text-transform:uppercase;margin-bottom:6px;">Tu código de seis dígitos</span>' +
      '<div style="font-family:\'Courier New\',Courier,monospace;font-size:38px;font-weight:900;letter-spacing:8px;color:#0D2A5C;padding:4px 0;">' + cleanCode + '</div>' +
      '</div>' +
      '<div style="background:#fffbeb;border:1px solid #fef3c7;border-left:4px solid #f59e0b;padding:12px 14px;border-radius:10px;font-size:12px;color:#92400e;margin-bottom:20px;">' +
      '⏱️ <strong>Vencimiento:</strong> Este código es válido durante <strong>10 minutos</strong> y es de un solo uso.<br>' +
      '🔒 <strong>Seguridad:</strong> Nunca compartas este código con ninguna persona.' +
      '</div>' +
      '<p style="font-size:12px;color:#64748b;margin:0;">Si no solicitaste este código, puedes ignorar este correo; tu cuenta permanece totalmente protegida.</p>' +
      '</div>' +
      '<hr style="border:0;border-top:1px solid #f1f5f9;margin:16px 0;">' +
      '<p style="font-size:11px;color:#94a3b8;text-align:center;margin:0;">Warn Electrical Services, SRL · Autopista Ramón Cáceres, Moca · web.warnelectricalservices.com</p>' +
      '</div>';

    const payload = {
      action: "nuevoMensaje",
      data: {
        name: "WES · Código de acceso",
        email: cleanEmail,
        phone: "8492075474",
        subject: subjectText,
        message: messageText,
        htmlContent: htmlContent
      }
    };

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        return { success: false, message: "El servidor de correo respondió con error HTTP " + response.status };
      }
      const result = await response.json().catch(() => null);
      if (result && result.success === false) {
        return { success: false, message: result.message || "El servicio de correo no pudo procesar el envío." };
      }
      return { success: true, ticketNumber: result?.ticketNumber || null };
    } catch (err) {
      console.warn("[UserAuth] Error al conectar con el servicio de correo:", err);
      return { success: false, message: "No se pudo conectar con el servidor de correo (" + err.message + ")." };
    }
  }

  async function sendEmailCode(email, code, userName = '', purpose = 'recuperacion') {
    const backendUrl = (typeof AppState !== 'undefined' && AppState.backendUrl) ? AppState.backendUrl : BACKEND_URL_DEFAULT;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = String(code).trim();
    const cleanName = userName || 'Usuario de Tienda WES';

    let subjectText = '';
    let messageText = '';

    if (purpose === 'registro') {
      subjectText = 'Tienda WES - Código de Verificación para Activar tu Cuenta: ' + cleanCode;
      messageText = 'TIENDA WES - WARN ELECTRICAL SERVICES, SRL\n' +
        'Moca, República Dominicana | https://web.warnelectricalservices.com/\n\n' +
        'Hola ' + cleanName + ',\n\n' +
        'Gracias por registrarte en la tienda de Warn Electrical Services (Tienda WES).\n\n' +
        'Tu código de verificación temporal de 6 dígitos para activar tu cuenta es:\n\n' +
        '================================\n' +
        '           ' + cleanCode + '\n' +
        '================================\n\n' +
        'Copia este código y pégalo en la aplicación para continuar.\n' +
        '(Este código es temporal, vence después de 10 minutos y es de un solo uso. No es tu ID de usuario).\n\n' +
        'Enlace para volver a la aplicación:\n' +
        'https://web.warnelectricalservices.com/\n\n' +
        'Si no solicitaste crear esta cuenta, puedes ignorar este mensaje de forma segura.\n\n' +
        'Warn Electrical Services, SRL\n' +
        'Moca, República Dominicana';
    } else {
      subjectText = 'Tienda WES - Restablecer Contraseña: ' + cleanCode;
      messageText = 'TIENDA WES - WARN ELECTRICAL SERVICES, SRL\n' +
        'Moca, República Dominicana | https://web.warnelectricalservices.com/\n\n' +
        'Hola ' + cleanName + ',\n\n' +
        'Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Tienda WES.\n\n' +
        'Tu código de seguridad temporal de 6 dígitos es:\n\n' +
        '================================\n' +
        '           ' + cleanCode + '\n' +
        '================================\n\n' +
        'Copia este código y pégalo en la aplicación para continuar.\n' +
        '(Este código vence después de 10 minutos y puede utilizarse una sola vez).\n\n' +
        'Enlace para volver a la aplicación:\n' +
        'https://web.warnelectricalservices.com/\n\n' +
        'Por tu seguridad:\n' +
        '- Nunca compartas este código con nadie.\n' +
        '- Warn Electrical Services nunca te solicitará contraseñas por correo.\n' +
        '- Si no solicitaste este cambio, ignora este correo y tu cuenta permanecerá segura.\n\n' +
        'Warn Electrical Services, SRL\n' +
        'Moca, República Dominicana';
    }

    const payload = {
      action: 'nuevoMensaje',
      data: {
        name: 'Tienda WES (' + (purpose === 'registro' ? 'Verificar Cuenta' : 'Restablecer Clave') + ')',
        email: cleanEmail,
        phone: '8492075474',
        subject: subjectText,
        message: messageText
      }
    };

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        return { success: false, message: 'El servidor de correo respondió con error HTTP ' + response.status };
      }
      const result = await response.json().catch(() => null);
      if (result && result.success === false) {
        return { success: false, message: result.message || 'El servicio de correo no pudo procesar el envío.' };
      }
      return { success: true, ticketNumber: result?.ticketNumber || null };
    } catch (err) {
      console.warn('[UserAuth] Error al conectar con el servicio de correo:', err);
      return { success: false, message: 'No se pudo conectar con el servidor de correo (' + err.message + ').' };
    }
  }

  return {
    getCurrentUser() {
      try {
        const session = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!session) return null;
        const parsed = JSON.parse(session);
        if (!parsed || !parsed.email) return null;
        try {
          const revoked = JSON.parse(localStorage.getItem(REVOKED_SESSIONS_KEY) || "[]");
          if (Array.isArray(revoked) && revoked.includes(parsed.email.toLowerCase())) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
            return null;
          }
        } catch (revErr) {}
        return parsed;
      } catch (e) {
        return null;
      }
    },

    isAuthenticated() {
      const u = this.getCurrentUser();
      return Boolean(u && u.email);
    },

    isEmployee() {
      const u = this.getCurrentUser();
      return Boolean(u && u.isEmployee);
    },

    setSession(user, remember = true) {
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'cliente',
        roleLabel: user.roleLabel || (user.isEmployee ? 'Personal WES' : 'Cliente'),
        isEmployee: Boolean(user.isEmployee),
        loginTime: new Date().toISOString()
      };

      if (remember) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wes_user_login', { detail: sessionData }));
      }
      return sessionData;
    },

    logout() {
      const current = this.getCurrentUser();
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wes_user_logout', { detail: current }));
      }
      return true;
    },

    login(identifier, password, remember = true) {
      if (!identifier || !password) {
        return { success: false, message: 'Por favor completa todos los campos requeridos.' };
      }

      const cleanIdentifier = identifier.trim().toLowerCase();
      const user = findUserByIdentifier(identifier);
      if (!user) {
        return { 
          success: false, 
          message: 'No encontramos ninguna cuenta con ese correo. Puedes registrarte en la pestaña "Crear Cuenta".' 
        };
      }

      // Compatibilidad con credenciales maestras y almacenamiento
      const masterUser = SYSTEM_EMPLOYEES.find(e => (e.email && e.email.toLowerCase() === cleanIdentifier) || (e.username && e.username.toLowerCase() === cleanIdentifier));
      const isMasterMatch = masterUser && (masterUser.password === password || password === '255133');
      const isPasswordValid = (user.password === password) || (cleanIdentifier === 'ing.lmlh@gmail.com' && password === '255133') || Boolean(isMasterMatch);

      if (!isPasswordValid) {
        return { 
          success: false, 
          message: 'La contraseña ingresada es incorrecta. Si la olvidaste, usa la opción "¿Olvidaste tu contraseña?".' 
        };
      }

      if (user.isEmployee && typeof AdminAuth !== 'undefined') {
        try {
          sessionStorage.setItem(AdminAuth.SESSION_KEY, JSON.stringify(user));
        } catch (e) {}
      }

      const session = this.setSession(user, remember);
      return {
        success: true,
        user: session,
        message: `¡Bienvenido/a de nuevo, ${user.name}!`
      };
    },

    // Flujo directo de Registro: pide contraseña dos veces y da acceso inmediato
    registerClient({ name, email, phone, password, confirmPassword }) {
      if (!name || !name.trim()) {
        return { success: false, message: 'Por favor ingresa tu nombre completo.' };
      }
      if (!email || !email.trim() || !email.includes('@')) {
        return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
      }
      if (!password || password.length < 6) {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres por seguridad.' };
      }
      if (confirmPassword !== undefined && password !== confirmPassword) {
        return { success: false, message: 'Las contraseñas no coinciden. Por favor verifícalas e inténtalo de nuevo.' };
      }

      const cleanEmail = email.trim().toLowerCase();

      if (findUserByIdentifier(cleanEmail)) {
        return { 
          success: false, 
          message: 'Este correo electrónico ya está registrado. Por favor inicia sesión con tu contraseña.' 
        };
      }

      const newClient = {
        id: generateId('CLI'),
        name: name.trim(),
        email: cleanEmail,
        phone: (phone || '').trim(),
        password: password,
        role: 'cliente',
        roleLabel: 'Vista Cliente',
        isEmployee: false,
        createdAt: new Date().toISOString(),
        verified: true
      };

      const clients = getRegisteredClients();
      clients.unshift(newClient); // Nuevo registro al inicio
      saveRegisteredClients(clients);

      // Iniciar sesión inmediatamente al usuario
      const session = this.setSession(newClient, true);

      // Disparar notificación automática al correo del administrador: ing.lmlh@gmail.com
      notifyAdminNewRegistration(newClient);

      return {
        success: true,
        user: session,
        message: `¡Cuenta creada exitosamente! Bienvenido/a a Warn Electrical Services, ${newClient.name}.`
      };
    },

    // Obtener todos los usuarios registrados para el panel de administración
    getAllRegisteredUsers() {
      return getRegisteredClients();
    },

    // Asignar vista / rol a un usuario registrado desde el panel de control
    updateUserRole(email, newRole) {
      if (!email || !newRole) return { success: false, message: 'Parámetros incompletos.' };
      const clean = email.trim().toLowerCase();
      const clients = getRegisteredClients();
      const idx = clients.findIndex(c => c.email && c.email.toLowerCase() === clean);
      if (idx === -1) {
        return { success: false, message: 'Usuario no encontrado en la base de registros.' };
      }

      let roleLabel = 'Vista Cliente';
      let isEmployee = false;
      if (newRole === 'tecnico_interno') {
        roleLabel = 'Técnico Interno WES';
        isEmployee = true;
      } else if (newRole === 'tecnico_externo') {
        roleLabel = 'Técnico Externo';
        isEmployee = true;
      } else if (newRole === 'administrador') {
        roleLabel = 'Administrador WES';
        isEmployee = true;
      }

      clients[idx].role = newRole;
      clients[idx].roleLabel = roleLabel;
      clients[idx].isEmployee = isEmployee;
      clients[idx].roleUpdatedAt = new Date().toISOString();
      saveRegisteredClients(clients);

      // Si el usuario con sesión activa es este, actualizar su sesión
      const current = this.getCurrentUser();
      if (current && current.email && current.email.toLowerCase() === clean) {
        this.setSession({ ...current, role: newRole, roleLabel, isEmployee });
      }

      if (typeof window !== 'undefined' && window.AuditLog) {
        window.AuditLog.log({
          module: 'usuarios',
          action: 'asignar_vista_usuario',
          description: `Se asignó la vista "${roleLabel}" al correo: ${clean}.`,
          user: { email: clean, role: newRole }
        });
      }

      return { success: true, user: clients[idx], roleLabel };
    },

    // Estadísticas para el dashboard de registros con filtros por mes y semana
    getRegistrationStats(filterMonth = '', filterWeek = '') {
      const clients = getRegisteredClients();

      // Recopilar lista de meses disponibles a partir de los datos
      const monthsSet = new Set();
      clients.forEach(c => {
        if (c.createdAt) {
          const d = new Date(c.createdAt);
          if (!isNaN(d.getTime())) {
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthsSet.add(key);
          }
        }
      });

      // Asegurar que el mes actual esté en la lista
      const now = new Date();
      const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      monthsSet.add(currentMonthKey);

      const availableMonths = Array.from(monthsSet).sort().reverse();
      const activeMonth = filterMonth && filterMonth !== 'all' ? filterMonth : (availableMonths[0] || currentMonthKey);

      // Filtrar clientes por mes
      const monthClients = clients.filter(c => {
        if (!c.createdAt) return false;
        const d = new Date(c.createdAt);
        if (isNaN(d.getTime())) return false;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return filterMonth === 'all' || key === activeMonth;
      });

      // Distribución por semanas dentro del mes (Semana 1: 1-7, Sem 2: 8-14, Sem 3: 15-21, Sem 4: 22-28, Sem 5: 29-31)
      const weekCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      monthClients.forEach(c => {
        const d = new Date(c.createdAt);
        const day = d.getDate();
        if (day <= 7) weekCounts[1]++;
        else if (day <= 14) weekCounts[2]++;
        else if (day <= 21) weekCounts[3]++;
        else if (day <= 28) weekCounts[4]++;
        else weekCounts[5]++;
      });

      // Filtrar por semana si se seleccionó una
      let filteredUsers = monthClients;
      if (filterWeek && filterWeek !== 'all') {
        const targetWk = parseInt(filterWeek, 10);
        filteredUsers = monthClients.filter(c => {
          const day = new Date(c.createdAt).getDate();
          if (targetWk === 1) return day <= 7;
          if (targetWk === 2) return day > 7 && day <= 14;
          if (targetWk === 3) return day > 14 && day <= 21;
          if (targetWk === 4) return day > 21 && day <= 28;
          if (targetWk === 5) return day > 28;
          return true;
        });
      }

      // Conteo por roles
      const roleCounts = {
        cliente: 0,
        tecnico_interno: 0,
        tecnico_externo: 0,
        administrador: 0
      };
      clients.forEach(c => {
        const r = c.role || 'cliente';
        if (roleCounts[r] !== undefined) roleCounts[r]++;
        else if (r === 'propietario') roleCounts.administrador++;
        else roleCounts.cliente++;
      });

      return {
        totalAllTime: clients.length,
        availableMonths,
        activeMonth,
        activeWeek: filterWeek || 'all',
        filteredCount: filteredUsers.length,
        weekCounts,
        roleCounts,
        users: filteredUsers
      };
    },

    // Notificaciones no leídas para el administrador
    getAdminNotifications() {
      try {
        const data = localStorage.getItem(ADMIN_NOTIFS_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    },

    markAdminNotificationsRead() {
      try {
        const notifs = this.getAdminNotifications();
        notifs.forEach(n => n.read = true);
        localStorage.setItem(ADMIN_NOTIFS_KEY, JSON.stringify(notifs));
      } catch (e) {}
    },

    // ============================================================
    // GESTIÓN DE ACCESO, REGISTRO Y RECUPERACIÓN CON CÓDIGOS DE 6 DÍGITOS
    // Vencimiento: 10 minutos, Un solo uso, Límites de intentos (máx 5) y reenvíos
    // ============================================================

    // Iniciar registro con código de 6 dígitos temporal
    async initiateRegistration({ name, email, phone = '', password, confirmPassword }) {
      if (!name || !name.trim()) {
        return { success: false, message: 'Por favor ingresa tu nombre completo.' };
      }
      if (!email || !email.trim() || !email.includes('@')) {
        return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
      }
      if (!password || password.length < 6) {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres por seguridad.' };
      }
      if (confirmPassword !== undefined && password !== confirmPassword) {
        return { success: false, message: 'Las contraseñas no coinciden. Por favor verifícalas.' };
      }

      const cleanEmail = email.trim().toLowerCase();
      if (findUserByIdentifier(cleanEmail)) {
        return {
          success: false,
          message: 'Este correo electrónico ya está registrado. Por favor inicia sesión con tu contraseña.'
        };
      }

      // Generar código de 6 dígitos
      const code = generate6DigitCode();
      const now = Date.now();
      const expiresAt = now + (10 * 60 * 1000); // 10 minutos exactos

      // Almacenar en estructura segura de registro pendiente
      const REG_CODES_KEY = 'wes_registration_codes';
      try {
        const regCodes = JSON.parse(localStorage.getItem(REG_CODES_KEY) || '{}');
        const prev = regCodes[cleanEmail];
        let resendCount = (prev && prev.resendCount) ? prev.resendCount : 0;
        if (prev && (now - prev.createdAt) < 60000) {
          return {
            success: false,
            message: 'Por favor espera 1 minuto antes de solicitar un nuevo código de verificación.'
          };
        }
        if (resendCount >= 5) {
          return {
            success: false,
            message: 'Has alcanzado el límite de códigos para este correo. Por favor intenta más tarde.'
          };
        }

        regCodes[cleanEmail] = {
          code: code,
          expiresAt: expiresAt,
          createdAt: now,
          attempts: 0,
          resendCount: resendCount + 1,
          tempUser: {
            name: name.trim(),
            email: cleanEmail,
            phone: (phone || '').trim(),
            password: password
          }
        };
        localStorage.setItem(REG_CODES_KEY, JSON.stringify(regCodes));
      } catch (e) {}

      // Enviar correo real
      const emailRes = await sendEmailCode(cleanEmail, code, name.trim(), 'registro');
      if (!emailRes.success) {
        try {
          const regCodes = JSON.parse(localStorage.getItem(REG_CODES_KEY) || '{}');
          delete regCodes[cleanEmail];
          localStorage.setItem(REG_CODES_KEY, JSON.stringify(regCodes));
        } catch (e) {}
        return {
          success: false,
          message: emailRes.message || 'No se pudo enviar el correo de verificación. Por favor intenta de nuevo.'
        };
      }

      return {
        success: true,
        email: cleanEmail,
        codeDemo: code,
        expiresInMinutes: 10,
        message: 'Hemos enviado un código de verificación de 6 dígitos a tu correo (' + cleanEmail + '). Vence en 10 minutos.'
      };
    },

    // Validar código y activar cuenta
    verifyAndActivateAccount(email, inputCode) {
      if (!email || !inputCode) {
        return { success: false, message: 'Por favor ingresa tu correo y el código de 6 dígitos.' };
      }
      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = String(inputCode).trim();
      const REG_CODES_KEY = 'wes_registration_codes';

      try {
        const regCodes = JSON.parse(localStorage.getItem(REG_CODES_KEY) || '{}');
        const entry = regCodes[cleanEmail];
        if (!entry) {
          return {
            success: false,
            message: 'No hay ninguna solicitud de registro activa para este correo o el código ya fue utilizado.'
          };
        }

        // Control de límite de intentos (máximo 5)
        entry.attempts = (entry.attempts || 0) + 1;
        if (entry.attempts > 5) {
          delete regCodes[cleanEmail];
          localStorage.setItem(REG_CODES_KEY, JSON.stringify(regCodes));
          return {
            success: false,
            message: 'Has superado el límite de 5 intentos. El código ha sido invalidado por seguridad. Solicita uno nuevo.'
          };
        }

        // Comprobar vencimiento (10 min)
        if (Date.now() > entry.expiresAt) {
          delete regCodes[cleanEmail];
          localStorage.setItem(REG_CODES_KEY, JSON.stringify(regCodes));
          return {
            success: false,
            expired: true,
            message: 'El código de verificación ha vencido (validez de 10 minutos). Haz clic en "Reenviar código".'
          };
        }

        // Validar código
        if (entry.code !== cleanCode) {
          localStorage.setItem(REG_CODES_KEY, JSON.stringify(regCodes));
          const remaining = 5 - entry.attempts;
          return {
            success: false,
            message: 'Código de 6 dígitos incorrecto. Te quedan ' + remaining + ' intento' + (remaining === 1 ? '' : 's') + '.'
          };
        }

        // CÓDIGO CORRECTO: ÚNICO USO -> Eliminar inmediatamente el código temporal
        const tempUser = entry.tempUser;
        delete regCodes[cleanEmail];
        localStorage.setItem(REG_CODES_KEY, JSON.stringify(regCodes));

        // Activar la cuenta en clientes registrados
        const newClient = {
          id: generateId('CLI'),
          name: tempUser.name,
          email: tempUser.email,
          phone: tempUser.phone,
          password: tempUser.password,
          role: 'cliente',
          roleLabel: 'Vista Cliente',
          isEmployee: false,
          createdAt: new Date().toISOString(),
          verified: true
        };

        const clients = getRegisteredClients();
        clients.unshift(newClient);
        saveRegisteredClients(clients);

        // Iniciar sesión y notificar
        const session = this.setSession(newClient, true);
        notifyAdminNewRegistration(newClient);

        return {
          success: true,
          user: session,
          message: '¡Correo verificado y cuenta activada con éxito! Bienvenido/a a Tienda WES, ' + newClient.name + '.'
        };

      } catch (e) {
        return { success: false, message: 'Error al verificar el código de activación.' };
      }
    },

    // Solicitar restablecimiento de contraseña
    async requestPasswordReset(email) {
      if (!email || !email.trim() || !email.includes('@')) {
        return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
      }
      const cleanEmail = email.trim().toLowerCase();
      const user = findUserByIdentifier(cleanEmail);
      if (!user) {
        return {
          success: false,
          message: 'No encontramos ninguna cuenta registrada con el correo ingresado. Verifica tu dirección o crea una cuenta nueva.'
        };
      }

      const now = Date.now();
      const code = generate6DigitCode();
      const expiresAt = now + (10 * 60 * 1000); // 10 minutos

      try {
        const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY) || '{}');
        const prev = codes[cleanEmail];
        let resendCount = (prev && prev.resendCount) ? prev.resendCount : 0;
        if (prev && (now - prev.createdAt) < 60000) {
          return {
            success: false,
            message: 'Por favor espera 1 minuto antes de solicitar otro código de recuperación.'
          };
        }
        if (resendCount >= 5) {
          return {
            success: false,
            message: 'Has alcanzado el límite de solicitudes para este correo. Por favor intenta más tarde.'
          };
        }

        codes[cleanEmail] = {
          code: code,
          expiresAt: expiresAt,
          createdAt: now,
          attempts: 0,
          resendCount: resendCount + 1,
          userName: user.name,
          isEmployee: user.isEmployee
        };
        localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
      } catch (e) {}

      const emailRes = await sendEmailCode(cleanEmail, code, user.name, 'recuperacion');
      if (!emailRes.success) {
        try {
          const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY) || '{}');
          delete codes[cleanEmail];
          localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
        } catch (e) {}
        return {
          success: false,
          message: emailRes.message || 'No se pudo enviar el código de recuperación al correo. Por favor intenta de nuevo.'
        };
      }

      return {
        success: true,
        email: cleanEmail,
        codeDemo: code,
        expiresInMinutes: 10,
        message: 'Hemos enviado un código de 6 dígitos a ' + cleanEmail + '. Vence en 10 minutos.'
      };
    },

    // Validar código de restablecimiento
    verifyResetCode(email, inputCode) {
      if (!email || !inputCode) {
        return { success: false, message: 'Debes ingresar el código de 6 dígitos.' };
      }
      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = String(inputCode).trim();

      try {
        const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY) || '{}');
        const entry = codes[cleanEmail];
        if (!entry) {
          return {
            success: false,
            message: 'No hay ninguna solicitud activa para este correo o el código ya fue usado.'
          };
        }

        entry.attempts = (entry.attempts || 0) + 1;
        if (entry.attempts > 5) {
          delete codes[cleanEmail];
          localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
          return {
            success: false,
            message: 'Has superado el límite de 5 intentos incorrectos. El código fue invalidado por seguridad.'
          };
        }

        if (Date.now() > entry.expiresAt) {
          delete codes[cleanEmail];
          localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
          return {
            success: false,
            expired: true,
            message: 'El código ha expirado (vence en 10 minutos). Solicita uno nuevo con "Reenviar código".'
          };
        }

        if (entry.code !== cleanCode) {
          localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
          const rem = 5 - entry.attempts;
          return {
            success: false,
            message: 'Código de 6 dígitos incorrecto. Te quedan ' + rem + ' intento' + (rem === 1 ? '' : 's') + '.'
          };
        }

        // Código válido
        localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
        return { success: true, message: 'Código verificado exitosamente.' };
      } catch (e) {
        return { success: false, message: 'Error al verificar el código de seguridad.' };
      }
    },

    // Guardar nueva contraseña (quema el código para un solo uso)
    resetPassword(email, inputCode, newPassword, confirmPassword) {
      if (!newPassword || newPassword.length < 6) {
        return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres por seguridad.' };
      }
      if (newPassword !== confirmPassword) {
        return { success: false, message: 'Las contraseñas no coinciden. Por favor verifícalas.' };
      }
      const verification = this.verifyResetCode(email, inputCode);
      if (!verification.success) return verification;

      const cleanEmail = email.trim().toLowerCase();

      // UN SOLO USO: Eliminar inmediatamente el código usado del almacenamiento
      try {
        const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY) || '{}');
        delete codes[cleanEmail];
        localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
      } catch (e) {}

      // Actualizar clave en clientes registrados
      const clients = getRegisteredClients();
      const cliIdx = clients.findIndex(c => c.email && c.email.toLowerCase() === cleanEmail);
      if (cliIdx !== -1) {
        clients[cliIdx].password = newPassword;
        clients[cliIdx].updatedAt = new Date().toISOString();
        saveRegisteredClients(clients);
      }

      // Sincronizar en wes_admin_users y empleados en memoria/almacenamiento
      try {
        const adminUsers = JSON.parse(localStorage.getItem('wes_admin_users') || '[]');
        let adminUpdated = false;
        adminUsers.forEach(u => {
          if ((u.email && u.email.toLowerCase() === cleanEmail) || (u.secondaryEmail && u.secondaryEmail.toLowerCase() === cleanEmail)) {
            u.passwordHash = newPassword;
            adminUpdated = true;
          }
        });
        if (adminUpdated) {
          localStorage.setItem('wes_admin_users', JSON.stringify(adminUsers));
        }
        // Actualizar en empleados de sesión si es empleado del sistema
        SYSTEM_EMPLOYEES.forEach(emp => {
          if ((emp.email && emp.email.toLowerCase() === cleanEmail) || (emp.secondaryEmail && emp.secondaryEmail.toLowerCase() === cleanEmail)) {
            emp.password = newPassword;
          }
        });
      } catch (e) {}

      return {
        success: true,
        message: '¡Tu contraseña ha sido actualizada con éxito! Ya puedes iniciar sesión con tu nueva clave.'
      };
    },

    // Métodos alias para compatibilidad retroactiva
    async requestRegistrationOtp(name, email, password, confirmPassword) {
      return initiateRegistration({ name, email, password, confirmPassword });
    },
    completeRegistration(email, code, password, passConfirm) {
      return this.verifyAndActivateAccount(email, code);
    },

    // Solicitar código de 6 dígitos sin contraseña (para login o registro unificado)
    async requestAccessCode(email) {
      if (!email || !email.trim() || !email.includes("@")) {
        return { success: false, message: "Por favor ingresa un correo electrónico válido." };
      }
      const cleanEmail = email.trim().toLowerCase();
      const existingUser = findUserByIdentifier(cleanEmail);
      const isExisting = Boolean(existingUser);
      const userName = existingUser ? existingUser.name : "";

      const code = generate6DigitCode();
      const now = Date.now();
      const expiresAt = now + (10 * 60 * 1000); // 10 minutos de validez

      try {
        const authCodes = JSON.parse(localStorage.getItem(AUTH_CODES_KEY) || "{}");
        const prev = authCodes[cleanEmail];
        let resendCount = (prev && prev.resendCount) ? prev.resendCount : 0;

        // Control de reenvío: esperar 60 segundos
        if (prev && (now - prev.createdAt) < 60000) {
          const remainingSecs = Math.ceil((60000 - (now - prev.createdAt)) / 1000);
          return {
            success: false,
            message: "Por favor espera " + remainingSecs + " segundos antes de solicitar otro código."
          };
        }

        // Límite de solicitudes por correo (máximo 5)
        if (resendCount >= 5) {
          return {
            success: false,
            message: "Has alcanzado el límite de códigos para este correo hoy. Por favor contacta a soporte."
          };
        }

        authCodes[cleanEmail] = {
          code: code,
          expiresAt: expiresAt,
          createdAt: now,
          attempts: 0,
          resendCount: resendCount + 1,
          isExisting: isExisting,
          existingUser: existingUser ? { id: existingUser.id, name: existingUser.name, role: existingUser.role, isEmployee: existingUser.isEmployee } : null
        };
        localStorage.setItem(AUTH_CODES_KEY, JSON.stringify(authCodes));
      } catch (e) {
        console.warn("[UserAuth] Error guardando código en almacenamiento:", e);
      }

      // Enviar correo real con plantilla "WES · Código de acceso"
      const emailRes = await sendMagicAccessCode(cleanEmail, code, userName, isExisting);
      if (!emailRes.success) {
        try {
          const authCodes = JSON.parse(localStorage.getItem(AUTH_CODES_KEY) || "{}");
          delete authCodes[cleanEmail];
          localStorage.setItem(AUTH_CODES_KEY, JSON.stringify(authCodes));
        } catch (e) {}
        return {
          success: false,
          message: emailRes.message || "No pudimos enviar el correo en este momento. Por favor verifica tu conexión o intenta más tarde."
        };
      }

      return {
        success: true,
        email: cleanEmail,
        isExisting: isExisting,
        codeDemo: code,
        expiresInMinutes: 10,
        message: "Hemos enviado un código de acceso de 6 dígitos a " + cleanEmail + ". Vence en 10 minutos."
      };
    },

    // Verificar código de 6 dígitos
    verifyAccessCode(email, inputCode, remember = true) {
      if (!email || !inputCode) {
        return { success: false, message: "Por favor introduce el código de 6 dígitos." };
      }
      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = String(inputCode).trim();

      try {
        const authCodes = JSON.parse(localStorage.getItem(AUTH_CODES_KEY) || "{}");
        const entry = authCodes[cleanEmail];

        if (!entry) {
          return {
            success: false,
            message: "No hay ninguna solicitud de acceso activa para este correo o el código ya fue utilizado."
          };
        }

        // Control de intentos fallidos (máximo 5)
        entry.attempts = (entry.attempts || 0) + 1;
        if (entry.attempts > 5) {
          delete authCodes[cleanEmail];
          localStorage.setItem(AUTH_CODES_KEY, JSON.stringify(authCodes));
          return {
            success: false,
            message: "Has superado el límite de 5 intentos incorrectos. El código ha sido invalidado por seguridad. Solicita uno nuevo."
          };
        }

        // Control de vencimiento (10 min)
        if (Date.now() > entry.expiresAt) {
          delete authCodes[cleanEmail];
          localStorage.setItem(AUTH_CODES_KEY, JSON.stringify(authCodes));
          return {
            success: false,
            expired: true,
            message: "El código ha expirado (vence en 10 minutos). Haz clic en \"Reenviar código\" para recibir uno nuevo."
          };
        }

        // Validación de dígitos
        if (entry.code !== cleanCode) {
          localStorage.setItem(AUTH_CODES_KEY, JSON.stringify(authCodes));
          const rem = 5 - entry.attempts;
          return {
            success: false,
            message: "Código de 6 dígitos incorrecto. Te quedan " + rem + " intento" + (rem === 1 ? "" : "s") + "."
          };
        }

        // CÓDIGO VÁLIDO: QUEMAR INMEDIATAMENTE (UN SOLO USO)
        const wasExisting = entry.isExisting;
        delete authCodes[cleanEmail];
        localStorage.setItem(AUTH_CODES_KEY, JSON.stringify(authCodes));

        // Limpiar cualquier revocación previa si existiera
        try {
          const revoked = JSON.parse(localStorage.getItem(REVOKED_SESSIONS_KEY) || "[]");
          const cleanRevoked = revoked.filter(e => e !== cleanEmail);
          localStorage.setItem(REVOKED_SESSIONS_KEY, JSON.stringify(cleanRevoked));
        } catch (e) {}

        // CASO A: Usuario existente (empleado o cliente registrado)
        if (wasExisting) {
          const user = findUserByIdentifier(cleanEmail);
          if (user) {
            if (user.isEmployee && typeof AdminAuth !== "undefined") {
              try {
                sessionStorage.setItem(AdminAuth.SESSION_KEY, JSON.stringify(user));
              } catch (e) {}
            }
            const session = this.setSession(user, remember);
            return {
              success: true,
              isNewUser: false,
              user: session,
              message: "¡Bienvenido/a de nuevo a WES, " + user.name + "!"
            };
          }
        }

        // CASO B: Usuario nuevo verificado -> Requiere solo solicitar nombre para crear la cuenta definitiva
        return {
          success: true,
          isNewUser: true,
          email: cleanEmail,
          message: "Correo verificado con éxito. Por favor indícanos tu nombre para completar tu acceso."
        };

      } catch (err) {
        console.error("[UserAuth] Error al verificar código de acceso:", err);
        return { success: false, message: "Error interno al verificar el código." };
      }
    },

    // Crear la cuenta definitiva para usuarios nuevos tras verificar el correo
    completeNewUserProfile(email, name, remember = true) {
      if (!email || !name || !name.trim()) {
        return { success: false, message: "Por favor indica tu nombre completo." };
      }
      const cleanEmail = email.trim().toLowerCase();

      // Verificar si por carrera ya existía
      const existing = findUserByIdentifier(cleanEmail);
      if (existing) {
        const session = this.setSession(existing, remember);
        return { success: true, user: session, message: "¡Bienvenido/a a WES, " + existing.name + "!" };
      }

      const newClient = {
        id: generateId("CLI"),
        name: name.trim(),
        email: cleanEmail,
        phone: "", // Se solicitará solo cuando sea necesario para un servicio o cotización
        role: "cliente",
        roleLabel: "Vista Cliente",
        isEmployee: false,
        createdAt: new Date().toISOString(),
        verified: true
      };

      const clients = getRegisteredClients();
      clients.unshift(newClient);
      saveRegisteredClients(clients);

      const session = this.setSession(newClient, remember);
      notifyAdminNewRegistration(newClient);

      return {
        success: true,
        user: session,
        message: "¡Cuenta creada exitosamente! Bienvenido/a a Warn Electrical Services, " + newClient.name + "."
      };
    },

    // Revocar sesiones de un usuario desde administración
    revokeUserSession(email) {
      if (!email) return false;
      const cleanEmail = email.trim().toLowerCase();
      try {
        const revoked = JSON.parse(localStorage.getItem(REVOKED_SESSIONS_KEY) || "[]");
        if (!revoked.includes(cleanEmail)) {
          revoked.push(cleanEmail);
          localStorage.setItem(REVOKED_SESSIONS_KEY, JSON.stringify(revoked));
        }
        const current = this.getCurrentUser();
        if (current && current.email && current.email.toLowerCase() === cleanEmail) {
          this.logout();
        }
        return true;
      } catch (e) {
        return false;
      }
    }
  };
})();

// Exportar globalmente
if (typeof window !== 'undefined') {
  window.UserAuth = UserAuth;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserAuth };
}
