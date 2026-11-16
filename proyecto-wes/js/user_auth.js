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



  function generateId(prefix = 'CLI') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();
  }

  function getRegisteredClients() {
    try {
      const data = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        return [];
      }
      // Filtrar de forma permanente cualquier residuo de cuentas de demostración (prefijo USR-REG-)
      const realOnly = parsed.filter(u => u && u.id && !String(u.id).startsWith('USR-REG-'));
      if (realOnly.length !== parsed.length) {
        saveRegisteredClients(realOnly);
      }
      return realOnly;
    } catch (e) {
      console.warn('[UserAuth] Error leyendo clientes:', e);
      return [];
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

    // Sincronizar clientes reales desde Google Sheets (hoja Clientes) con respaldo en localStorage
    async syncClientsFromBackend() {
      try {
        const adminSession = typeof AdminAuth !== 'undefined' ? AdminAuth.getCurrentUser() : null;
        const currentU = this.getCurrentUser();
        const userEmail = (adminSession && adminSession.email) || (currentU && currentU.email) || 'ing.lmlh@gmail.com';
        const adminToken = (adminSession && adminSession.token) || 'wes_owner_authorized_session';

        const backendUrl = (typeof CONFIG !== 'undefined' && CONFIG.BACKEND_URL) || BACKEND_URL_DEFAULT;
        const res = await fetch(backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'list_registered_clients_admin',
            adminToken: adminToken,
            userEmail: userEmail
          })
        });

        if (res.ok) {
          const json = await res.json();
          if (json && json.success && Array.isArray(json.clients)) {
            // Reemplazo autorizado: el servidor en la nube es la fuente de verdad estricta de cuentas
            // Excluir cualquier registro de prueba o demo
            const realClients = json.clients.filter(c => c && c.id && !String(c.id).startsWith('USR-REG-'));
            saveRegisteredClients(realClients);
            return { success: true, clients: realClients };
          }
        }
      } catch (e) {
        console.warn('[UserAuth] No se pudo sincronizar usuarios de Sheets en este momento:', e);
      }
      return { success: true, clients: getRegisteredClients() };
    },

    // Ejecutar acciones administrativas de acceso (reenvío OTP, revocar códigos, desbloqueo, reactivación, cierre de sesiones)
    async executeAdminAccessAction(targetEmail, actionType, reason = "") {
      try {
        const adminSession = typeof AdminAuth !== "undefined" ? AdminAuth.getCurrentUser() : null;
        const currentU = this.getCurrentUser();
        const userEmail = (adminSession && adminSession.email) || (currentU && currentU.email) || "ing.lmlh@gmail.com";
        const adminToken = (adminSession && adminSession.token) || "wes_owner_authorized_session";
        const backendUrl = (typeof CONFIG !== "undefined" && CONFIG.BACKEND_URL) || BACKEND_URL_DEFAULT;

        const res = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "admin_user_access_action",
            adminToken: adminToken,
            userEmail: userEmail,
            data: {
              targetEmail: targetEmail,
              actionType: actionType,
              reason: reason
            }
          })
        });

        if (res.ok) {
          const json = await res.json();
          if (typeof window !== "undefined" && window.AuditLog) {
            window.AuditLog.log({
              module: "seguridad",
              action: actionType,
              description: "Accion " + actionType + " sobre " + targetEmail + ". Motivo: " + reason,
              user: adminSession || currentU
            });
          }
          return json;
        }
      } catch (e) {
        console.error("[UserAuth] Error ejecutando accion de acceso:", e);
        return { success: false, message: "Error de conexion: " + e.message };
      }
      return { success: false, message: "Respuesta invalida del servidor." };
    },

    // Obtener metricas y eventos reales de acceso desde el servidor
    async getAuthAccessDashboard() {
      try {
        const adminSession = typeof AdminAuth !== "undefined" ? AdminAuth.getCurrentUser() : null;
        const currentU = this.getCurrentUser();
        const userEmail = (adminSession && adminSession.email) || (currentU && currentU.email) || "ing.lmlh@gmail.com";
        const adminToken = (adminSession && adminSession.token) || "wes_owner_authorized_session";
        const backendUrl = (typeof CONFIG !== "undefined" && CONFIG.BACKEND_URL) || BACKEND_URL_DEFAULT;

        const res = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "get_auth_access_dashboard_admin",
            adminToken: adminToken,
            userEmail: userEmail
          })
        });

        if (res.ok) {
          const json = await res.json();
          if (json && json.success) {
            return json.data;
          }
        }
      } catch (e) {
        console.warn("[UserAuth] Error consultando dashboard de accesos:", e);
      }
      return null;
    },

    // Actualizar rol o estado de un cliente en backend y local
    async updateClientRemote(email, updateData) {
      const clean = (email || '').trim().toLowerCase();
      const clients = getRegisteredClients();
      const idx = clients.findIndex(c => c.email && c.email.toLowerCase() === clean);
      if (idx !== -1) {
        clients[idx] = { ...clients[idx], ...updateData };
        saveRegisteredClients(clients);
      }

      try {
        const adminSession = typeof AdminAuth !== 'undefined' ? AdminAuth.getCurrentUser() : null;
        const currentU = this.getCurrentUser();
        const userEmail = (adminSession && adminSession.email) || (currentU && currentU.email) || 'ing.lmlh@gmail.com';
        const adminToken = (adminSession && adminSession.token) || 'wes_owner_authorized_session';
        const backendUrl = (typeof CONFIG !== 'undefined' && CONFIG.BACKEND_URL) || BACKEND_URL_DEFAULT;

        await fetch(backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'update_client_admin',
            adminToken: adminToken,
            userEmail: userEmail,
            data: { email: clean, ...updateData }
          })
        });
      } catch (e) {
        console.warn('[UserAuth] Actualización guardada localmente, fallo en backend:', e);
      }

      return { success: true, user: clients[idx] };
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

    // Solicitar código de 6 dígitos sin contraseña (backend criptográfico seguro)
    async requestAccessCode(email) {
      if (!email || !email.trim() || !email.includes("@")) {
        return { success: false, message: "Por favor ingresa un correo electrónico válido." };
      }
      const cleanEmail = email.trim().toLowerCase();
      const backendUrl = (typeof AppState !== "undefined" && AppState.backendUrl) ? AppState.backendUrl : BACKEND_URL_DEFAULT;

      try {
        const payload = {
          action: "request_auth_otp",
          data: {
            email: cleanEmail,
            purpose: "acceso"
          }
        };

        const response = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          return { success: false, message: "El servidor respondió con error HTTP " + response.status };
        }

        const result = await response.json().catch(() => null);
        if (!result) {
          return { success: false, message: "Respuesta inválida del servidor de autenticación." };
        }

        if (result.success === false) {
          return { success: false, message: result.message || "No se pudo generar el código de acceso." };
        }

        // Guardar identificador de solicitud en almacenamiento de sesión
        try {
          const authSessions = JSON.parse(localStorage.getItem(AUTH_CODES_KEY) || "{}");
          authSessions[cleanEmail] = {
            requestId: result.requestId || "",
            email: cleanEmail,
            createdAt: Date.now(),
            isExisting: Boolean(result.isExisting)
          };
          localStorage.setItem(AUTH_CODES_KEY, JSON.stringify(authSessions));
        } catch (e) {}

        return {
          success: true,
          email: cleanEmail,
          requestId: result.requestId,
          isExisting: result.isExisting,
          expiresInMinutes: result.expiresInMinutes || 10,
          message: result.message || ("Hemos enviado un código de acceso de 6 dígitos a " + cleanEmail)
        };
      } catch (err) {
        console.error("[UserAuth] Error solicitando código al backend:", err);
        return { success: false, message: "Error al conectar con el servidor: " + (err.message || err) };
      }
    },

    // Verificar código de 6 dígitos contra el backend (consumo atómico)
    async verifyAccessCode(email, inputCode, remember = true) {
      if (!email || !inputCode) {
        return { success: false, message: "Por favor introduce el código de 6 dígitos." };
      }
      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = String(inputCode).trim();
      const backendUrl = (typeof AppState !== "undefined" && AppState.backendUrl) ? AppState.backendUrl : BACKEND_URL_DEFAULT;

      let requestId = "";
      try {
        const authSessions = JSON.parse(localStorage.getItem(AUTH_CODES_KEY) || "{}");
        if (authSessions[cleanEmail] && authSessions[cleanEmail].requestId) {
          requestId = authSessions[cleanEmail].requestId;
        }
      } catch (e) {}

      try {
        const payload = {
          action: "verify_auth_otp",
          data: {
            email: cleanEmail,
            code: cleanCode,
            requestId: requestId,
            purpose: "acceso"
          }
        };

        const response = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          return { success: false, message: "El servidor respondió con error HTTP " + response.status };
        }

        const result = await response.json().catch(() => null);
        if (!result) {
          return { success: false, message: "Respuesta inválida del servidor al verificar el código." };
        }

        if (result.success === false) {
          return {
            success: false,
            expired: Boolean(result.expired),
            message: result.message || "Código incorrecto."
          };
        }

        // Limpiar solicitud consumida
        try {
          const authSessions = JSON.parse(localStorage.getItem(AUTH_CODES_KEY) || "{}");
          delete authSessions[cleanEmail];
          localStorage.setItem(AUTH_CODES_KEY, JSON.stringify(authSessions));
        } catch (e) {}

        // Limpiar lista de revocados si existiera
        try {
          const revoked = JSON.parse(localStorage.getItem(REVOKED_SESSIONS_KEY) || "[]");
          const cleanRevoked = revoked.filter(e => e !== cleanEmail);
          localStorage.setItem(REVOKED_SESSIONS_KEY, JSON.stringify(cleanRevoked));
        } catch (e) {}

        // Si es usuario nuevo
        if (result.isNewUser) {
          return {
            success: true,
            isNewUser: true,
            email: cleanEmail,
            message: result.message || "Correo verificado con éxito. Por favor completa tu nombre."
          };
        }

        // Si es usuario existente
        let userObj = result.user;
        if (!userObj) {
          userObj = findUserByIdentifier(cleanEmail);
        }

        if (userObj) {
          if (userObj.isEmployee && typeof AdminAuth !== "undefined") {
            try {
              sessionStorage.setItem(AdminAuth.SESSION_KEY, JSON.stringify(userObj));
            } catch (e) {}
          }
          const session = this.setSession(userObj, remember);
          return {
            success: true,
            isNewUser: false,
            user: session,
            message: result.message || ("¡Bienvenido/a de nuevo a WES, " + (userObj.name || "") + "!")
          };
        }

        // Fallback genérico
        const fallbackSession = this.setSession({
          id: "CLI-" + Date.now(),
          name: cleanEmail.split("@")[0],
          email: cleanEmail,
          role: "cliente",
          roleLabel: "Vista Cliente",
          isEmployee: false
        }, remember);

        return {
          success: true,
          isNewUser: false,
          user: fallbackSession,
          message: "¡Bienvenido/a a WES!"
        };

      } catch (err) {
        console.error("[UserAuth] Error verificando código con backend:", err);
        return { success: false, message: "Error al validar con el servidor: " + (err.message || err) };
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

// ============================================================================
// MONITOR Y POP-UP INTERACTIVO PARA INSTRUIR A SOFÍA (EXCLUSIVO PROPIETARIO)
// ============================================================================
const SofiaInstructorPopup = (function() {
  const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbyoN8TnzeN9Cg2X44YEt6KeQULahvG0DrEXP5m4HyLvJFs475maMjVrwjW8t-IRVIQ_OQ/exec';
  let isChecking = false;
  let activeModal = null;
  const seenIds = new Set();

  function isOwnerSession() {
    if (typeof UserAuth === 'undefined') return false;
    const user = UserAuth.getCurrentUser();
    if (!user || !user.email) return false;
    const em = user.email.toLowerCase().trim();
    return (em === 'ing.lmlh@gmail.com' || user.role === 'propietario');
  }

  async function checkPendingQuestions() {
    if (!isOwnerSession() || isChecking) return;
    isChecking = true;

    try {
      const user = UserAuth.getCurrentUser();
      const payload = {
        action: 'get_pending_sofia_questions',
        adminToken: 'wes_owner_authorized_session',
        userEmail: user.email
      };

      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          const freshQuestion = data.questions.find(q => !seenIds.has(q.id));
          if (freshQuestion && !activeModal) {
            showInstructorModal(freshQuestion);
          }
        }
      }
    } catch (e) {
      console.warn('[SofiaInstructor] Verificación de preguntas:', e);
    } finally {
      isChecking = false;
    }
  }

  function showInstructorModal(q) {
    if (activeModal) return;
    seenIds.add(q.id);

    const modal = document.createElement('div');
    modal.id = 'sofia-instructor-modal';
    modal.className = 'fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-amber-400 overflow-hidden text-slate-800 font-sans animate-scaleIn">
        <div class="bg-gradient-to-r from-[#071836] via-[#0D2A5C] to-[#0A224A] text-white p-4 flex items-center justify-between border-b border-amber-400/40">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 text-lg shadow-md">
              <i class="fas fa-bell"></i>
            </div>
            <div>
              <h3 class="font-extrabold text-sm text-white">Sofía necesita tu instrucción</h3>
              <p class="text-[11px] text-amber-300">Un cliente preguntó algo que no está en catálogo</p>
            </div>
          </div>
          <button type="button" onclick="SofiaInstructorPopup.closeModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>

        <div class="p-5 space-y-4">
          <div class="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
            <span class="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1">
              <i class="fas fa-comment-dots mr-1"></i> Pregunta del Cliente:
            </span>
            <p class="font-bold text-slate-900 text-sm leading-relaxed">"${escapeHtml(q.question)}"</p>
            <span class="text-[10px] text-slate-400 mt-2 block font-mono">${q.date || 'Reciente'}</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">
              Tu Respuesta Oficial para instruir a Sofía:
            </label>
            <textarea id="sofia-instruction-answer" rows="3" placeholder="Ej: Sí, tenemos disponible en marca Leviton a RD$3,500 la caja..." class="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0D2A5C] focus:outline-none transition"></textarea>
            <p class="text-[10px] text-slate-400 mt-1">Sofía memorizará esta respuesta y la adaptará para responder automáticamente a futuros clientes.</p>
          </div>

          <div class="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button type="button" onclick="SofiaInstructorPopup.closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
              Posponer
            </button>
            <button type="button" id="sofia-instruction-submit-btn" onclick="SofiaInstructorPopup.submitInstruction('${q.id}', '${escapeHtml(q.question).replace(/'/g, "\\'")}')" class="px-5 py-2.5 bg-[#0D2A5C] hover:bg-[#071836] text-amber-300 font-extrabold text-xs rounded-xl shadow-md border border-amber-400/40 flex items-center space-x-1.5 transition active:scale-95">
              <i class="fas fa-graduation-cap"></i>
              <span>Instruir a Sofía y Guardar</span>
            </button>
          </div>
        </div>
      </div>
    `;

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.body.appendChild(modal);
    activeModal = modal;
  }

  function closeModal() {
    if (activeModal) {
      activeModal.remove();
      activeModal = null;
    }
  }

  async function submitInstruction(qId, questionText) {
    const input = document.getElementById('sofia-instruction-answer');
    const submitBtn = document.getElementById('sofia-instruction-submit-btn');
    if (!input || !input.value.trim()) {
      alert('Por favor escribe la respuesta con la que deseas instruir a Sofía.');
      return;
    }

    const answer = input.value.trim();
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    }

    try {
      const user = UserAuth.getCurrentUser();
      const payload = {
        action: 'answer_and_train_sofia',
        adminToken: 'wes_owner_authorized_session',
        userEmail: user ? user.email : 'ing.lmlh@gmail.com',
        data: {
          id: qId,
          question: questionText,
          officialAnswer: answer,
          category: 'Instrucción Rápida'
        }
      };

      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data && data.success) {
        alert('¡Excelente! Sofía ha aprendido esta respuesta y la utilizará de inmediato.');
        closeModal();
      } else {
        alert('Error al guardar: ' + (data.message || 'Intente nuevamente.'));
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-graduation-cap"></i> Instruir a Sofía y Guardar';
        }
      }
    } catch (e) {
      alert('Error de conexión al guardar la instrucción.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-graduation-cap"></i> Instruir a Sofía y Guardar';
      }
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function init() {
    // Revisar al iniciar
    setTimeout(checkPendingQuestions, 4000);
    // Sondeo periódico cada 25 segundos para el propietario
    setInterval(checkPendingQuestions, 25000);
  }

  return {
    init,
    checkPendingQuestions,
    closeModal,
    submitInstruction
  };
})();

// Exportar globalmente
if (typeof window !== 'undefined') {
  window.UserAuth = UserAuth;
  window.SofiaInstructorPopup = SofiaInstructorPopup;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SofiaInstructorPopup.init);
  } else {
    SofiaInstructorPopup.init();
  }
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserAuth, SofiaInstructorPopup };
}

