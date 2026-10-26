// ============================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// SISTEMA DE AUTENTICACIÓN UNIVERSAL (EMPLEADOS Y CLIENTES) - js/user_auth.js
// Soporta Login, Registro de Clientes, Código OTP de 4 dígitos y Recuperación
// ============================================================================

const UserAuth = (function() {
  const CLIENTS_STORAGE_KEY = 'wes_registered_clients';
  const SESSION_STORAGE_KEY = 'wes_user_session';
  const RESET_CODES_KEY = 'wes_password_reset_codes';
  const BACKEND_URL_DEFAULT = 'https://script.google.com/macros/s/AKfycbyoN8TnzeN9Cg2X44YEt6KeQULahvG0DrEXP5m4HyLvJFs475maMjVrwjW8t-IRVIQ_OQ/exec';

  // Empleados predefinidos del sistema (sincronizados con AdminAuth)
  const SYSTEM_EMPLOYEES = [
    {
      id: 'EMP-001',
      name: 'Luis Miguel Lizardo',
      email: 'ing.lmlh@gmail.com',
      secondaryEmail: 'wes.inform@gmail.com',
      username: 'propietario',
      password: 'Wes2026!',
      role: 'propietario',
      roleLabel: 'Propietario / Superadmin',
      isEmployee: true
    },
    {
      id: 'EMP-002',
      name: 'Admin General',
      email: 'admin@wes.com.do',
      username: 'admin',
      password: 'Wes2026!',
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
      return data ? JSON.parse(data) : [];
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

    // 1. Buscar en empleados
    const employees = getAllEmployees();
    const emp = employees.find(e => 
      (e.email && e.email.toLowerCase() === clean) ||
      (e.secondaryEmail && e.secondaryEmail.toLowerCase() === clean) ||
      (e.username && e.username.toLowerCase() === clean)
    );
    if (emp) return { ...emp, isEmployee: true };

    // 2. Buscar en clientes registrados
    const clients = getRegisteredClients();
    const cli = clients.find(c => 
      c.email && c.email.toLowerCase() === clean
    );
    if (cli) return { ...cli, isEmployee: false, role: 'cliente', roleLabel: 'Cliente WES' };

    return null;
  }

  function generate4DigitCode() {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  async function sendEmailCode(email, code, userName = '', purpose = 'recuperacion') {
    const backendUrl = (typeof AppState !== 'undefined' && AppState.backendUrl) ? AppState.backendUrl : BACKEND_URL_DEFAULT;
    
    const cleanEmail = email.trim();
    const cleanCode = String(code);
    const cleanName = userName || 'Usuario WES';

    let subjectText = `Código de Seguridad WES: ${cleanCode}`;
    let messageText = `Hola ${cleanName},\n\nTu código de verificación de 4 dígitos para tu cuenta en Warn Electrical Services (WES) es:\n\n${cleanCode}\n\nEste código es válido durante los próximos 15 minutos. Si no realizaste esta solicitud, puedes ignorar este mensaje con seguridad.\n\nWarn Electrical Services, SRL (WES)\nSeguridad Electrónica, Automatización e Instalaciones\nMoca, República Dominicana`;

    if (purpose === 'bienvenida') {
      subjectText = `¡Bienvenido/a a Warn Electrical Services (WES)!`;
      messageText = `Hola ${cleanName},\n\nTu cuenta ha sido creada exitosamente en Warn Electrical Services (WES). Ya puedes iniciar sesión para acceder a tus cotizaciones y servicios.\n\nWarn Electrical Services, SRL (WES)\nMoca, República Dominicana`;
    } else if (purpose === 'registro') {
      subjectText = `Configura tu Contraseña WES – Código: ${cleanCode}`;
      messageText = `Hola ${cleanName},\n\nTu código de 4 dígitos para completar el registro y configurar tu contraseña en Warn Electrical Services (WES) es:\n\n${cleanCode}\n\nIngresa este código en la pantalla de verificación. Es válido por 15 minutos.\n\nWarn Electrical Services, SRL (WES)`;
    }

    const payload = {
      action: 'nuevoMensaje',
      data: {
        name: cleanName,
        email: cleanEmail,
        phone: '8492075474',
        subject: subjectText,
        message: messageText
      }
    };

    console.log(`[UserAuth] ✉️ Enviando correo real con código de 4 dígitos [${cleanCode}] a: ${cleanEmail}`);

    try {
      await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      return { success: true };
    } catch (err) {
      console.warn('[UserAuth] Error al conectar con backend de correo:', err);
      return { success: true, localOnly: true };
    }
  }

  return {
    getCurrentUser() {
      try {
        const session = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
        return session ? JSON.parse(session) : null;
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

      window.dispatchEvent(new CustomEvent('wes_user_login', { detail: sessionData }));
      return sessionData;
    },

    logout() {
      const current = this.getCurrentUser();
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('wes_user_logout', { detail: current }));
      return true;
    },

    login(identifier, password, remember = true) {
      if (!identifier || !password) {
        return { success: false, message: 'Por favor completa todos los campos requeridos.' };
      }

      const user = findUserByIdentifier(identifier);
      if (!user) {
        return { 
          success: false, 
          message: 'No encontramos ninguna cuenta con ese correo. Si eres cliente nuevo, puedes registrarte fácilmente.' 
        };
      }

      if (user.password !== password) {
        return { 
          success: false, 
          message: 'La contraseña ingresada es incorrecta. Si la olvidaste, usa la opción "¿Olvidaste tu contraseña?".' 
        };
      }

      if (user.isEmployee && typeof AdminAuth !== 'undefined') {
        try {
          sessionStorage.setItem(AdminAuth.SESSION_KEY, JSON.stringify(user));
        } catch (e) {
          // ignore
        }
      }

      const session = this.setSession(user, remember);
      return {
        success: true,
        user: session,
        message: `¡Bienvenido/a de nuevo, ${user.name}!`
      };
    },

    registerClient({ name, email, phone, password }) {
      if (!name || !name.trim()) {
        return { success: false, message: 'Por favor ingresa tu nombre completo.' };
      }
      if (!email || !email.trim() || !email.includes('@')) {
        return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
      }
      if (!password || password.length < 6) {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres por seguridad.' };
      }

      const cleanEmail = email.trim().toLowerCase();

      if (findUserByIdentifier(cleanEmail)) {
        return { 
          success: false, 
          message: 'Este correo electrónico ya está registrado. Por favor inicia sesión o recupera tu contraseña.' 
        };
      }

      const newClient = {
        id: generateId('CLI'),
        name: name.trim(),
        email: cleanEmail,
        phone: (phone || '').trim(),
        password: password,
        role: 'cliente',
        roleLabel: 'Cliente WES',
        isEmployee: false,
        createdAt: new Date().toISOString(),
        verified: true
      };

      const clients = getRegisteredClients();
      clients.push(newClient);
      saveRegisteredClients(clients);

      const session = this.setSession(newClient, true);
      sendEmailCode(cleanEmail, '----', newClient.name, 'bienvenida');

      return {
        success: true,
        user: session,
        message: `¡Cuenta creada exitosamente! Bienvenido/a a Warn Electrical Services, ${newClient.name}.`
      };
    },

    async requestRegistrationOtp(name, email) {
      if (!name || !name.trim()) {
        return { success: false, message: 'Por favor ingresa tu nombre completo.' };
      }
      if (!email || !email.trim() || !email.includes('@')) {
        return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
      }

      const cleanEmail = email.trim().toLowerCase();
      if (findUserByIdentifier(cleanEmail)) {
        return { 
          success: false, 
          message: 'Este correo electrónico ya está registrado. Por favor inicia sesión o recupera tu contraseña.' 
        };
      }

      const code = generate4DigitCode();
      const expiresAt = Date.now() + (15 * 60 * 1000);

      try {
        const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY) || '{}');
        codes[cleanEmail] = {
          code: code,
          expiresAt: expiresAt,
          createdAt: Date.now(),
          userName: name.trim(),
          isRegistration: true
        };
        localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
      } catch (e) {
        console.warn('[UserAuth] Error guardando código:', e);
      }

      await sendEmailCode(cleanEmail, code, name.trim(), 'registro');

      return {
        success: true,
        email: cleanEmail,
        userName: name.trim(),
        codeDemo: code,
        message: `Código de seguridad de 4 dígitos enviado a ${cleanEmail}.`
      };
    },

    completeRegistration(email, code, password, passConfirm) {
      if (!email) {
        return { success: false, message: 'Falta el correo electrónico del registro.' };
      }
      if (!password || password.length < 6) {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres por seguridad.' };
      }
      if (passConfirm && password !== passConfirm) {
        return { success: false, message: 'Las contraseñas no coinciden. Por favor verifícalas.' };
      }

      const cleanEmail = email.trim().toLowerCase();
      const verify = this.verifyResetCode(cleanEmail, code);
      if (!verify.success) {
        return verify;
      }

      let clientName = 'Cliente WES';
      try {
        const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY) || '{}');
        if (codes[cleanEmail] && codes[cleanEmail].userName) {
          clientName = codes[cleanEmail].userName;
        }
      } catch (e) {}

      const newClient = {
        id: generateId('CLI'),
        name: clientName,
        email: cleanEmail,
        phone: '',
        password: password,
        role: 'cliente',
        roleLabel: 'Cliente WES',
        isEmployee: false,
        createdAt: new Date().toISOString(),
        verified: true
      };

      const clients = getRegisteredClients();
      clients.push(newClient);
      saveRegisteredClients(clients);

      // Limpiar código
      try {
        const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY) || '{}');
        delete codes[cleanEmail];
        localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
      } catch (e) {}

      const session = this.setSession(newClient, true);
      sendEmailCode(cleanEmail, '----', newClient.name, 'bienvenida');

      return {
        success: true,
        user: session,
        message: `¡Contraseña configurada con éxito! Bienvenido/a a Warn Electrical Services, ${newClient.name}.`
      };
    },

    async requestPasswordReset(email) {
      if (!email || !email.trim() || !email.includes('@')) {
        return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
      }

      const cleanEmail = email.trim().toLowerCase();
      const user = findUserByIdentifier(cleanEmail);

      if (!user) {
        return { 
          success: false, 
          message: 'No se encontró ninguna cuenta registrada con el correo ingresado.' 
        };
      }

      const code = generate4DigitCode();
      const expiresAt = Date.now() + (15 * 60 * 1000);

      try {
        const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY) || '{}');
        codes[cleanEmail] = {
          code: code,
          expiresAt: expiresAt,
          createdAt: Date.now(),
          userName: user.name,
          isEmployee: user.isEmployee
        };
        localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
      } catch (e) {
        console.warn('[UserAuth] Error guardando código:', e);
      }

      await sendEmailCode(cleanEmail, code, user.name, 'recuperacion');

      return {
        success: true,
        email: cleanEmail,
        codeDemo: code,
        message: `Hemos enviado un código de 4 dígitos a ${cleanEmail}. Revisa tu bandeja de entrada o spam.`
      };
    },

    verifyResetCode(email, inputCode) {
      if (!email || !inputCode) {
        return { success: false, message: 'Debes ingresar el código de 4 dígitos.' };
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = String(inputCode).trim();

      try {
        const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY) || '{}');
        const entry = codes[cleanEmail];

        if (!entry) {
          return { success: false, message: 'No hay ninguna solicitud activa para este correo. Solicita un nuevo código.' };
        }

        if (Date.now() > entry.expiresAt) {
          return { success: false, message: 'El código ha expirado (límite de 15 minutos). Por favor solicita uno nuevo.' };
        }

        if (entry.code !== cleanCode) {
          return { success: false, message: 'El código de 4 dígitos ingresado no es correcto. Verifica tu correo e inténtalo de nuevo.' };
        }

        return { success: true, message: 'Código verificado exitosamente.' };
      } catch (e) {
        return { success: false, message: 'Error al verificar el código.' };
      }
    },

    resetPassword(email, inputCode, newPassword, confirmPassword) {
      if (!newPassword || newPassword.length < 6) {
        return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' };
      }
      if (newPassword !== confirmPassword) {
        return { success: false, message: 'Las contraseñas no coinciden. Por favor verifícalas.' };
      }

      const verification = this.verifyResetCode(email, inputCode);
      if (!verification.success) {
        return verification;
      }

      const cleanEmail = email.trim().toLowerCase();
      let updated = false;

      // 1. Si es cliente
      const clients = getRegisteredClients();
      const cliIdx = clients.findIndex(c => c.email.toLowerCase() === cleanEmail);
      if (cliIdx !== -1) {
        clients[cliIdx].password = newPassword;
        clients[cliIdx].updatedAt = new Date().toISOString();
        saveRegisteredClients(clients);
        updated = true;
      }

      // 2. Si es empleado
      if (typeof AdminAuth !== 'undefined' && typeof AdminAuth.getUsers === 'function') {
        const adminUsers = AdminAuth.getUsers();
        const empIdx = adminUsers.findIndex(u => 
          (u.email && u.email.toLowerCase() === cleanEmail) ||
          (u.secondaryEmail && u.secondaryEmail.toLowerCase() === cleanEmail)
        );
        if (empIdx !== -1) {
          adminUsers[empIdx].passwordHash = newPassword;
          AdminAuth.saveUsers(adminUsers);
          updated = true;
        }
      }

      try {
        const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY) || '{}');
        delete codes[cleanEmail];
        localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));
      } catch (e) {
        // ignore
      }

      return {
        success: true,
        message: '¡Tu contraseña ha sido actualizada con éxito! Ya puedes iniciar sesión con tu nueva clave.'
      };
    }
  };
})();

// Exportar globalmente
window.UserAuth = UserAuth;
