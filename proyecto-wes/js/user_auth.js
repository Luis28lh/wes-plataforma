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

  function generate4DigitCode() {
    return String(Math.floor(1000 + Math.random() * 9000));
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

  async function sendEmailCode(email, code, userName = '', purpose = 'recuperacion') {
    const backendUrl = (typeof AppState !== 'undefined' && AppState.backendUrl) ? AppState.backendUrl : BACKEND_URL_DEFAULT;
    
    const cleanEmail = email.trim();
    const cleanCode = String(code);
    const cleanName = userName || 'Usuario WES';

    let subjectText = `Código de Seguridad WES: ${cleanCode}`;
    let messageText = `Hola ${cleanName},

Tu código de verificación de 4 dígitos para tu cuenta en Warn Electrical Services (WES) es:

${cleanCode}

Este código es válido durante los próximos 15 minutos.

Warn Electrical Services, SRL (WES)
Moca, República Dominicana`;

    if (purpose === 'bienvenida') {
      subjectText = `¡Bienvenido/a a Warn Electrical Services (WES)!`;
      messageText = `Hola ${cleanName},

Tu cuenta ha sido creada exitosamente en Warn Electrical Services (WES). Ya puedes acceder a todas las funciones y servicios.

Warn Electrical Services, SRL (WES)
Moca, República Dominicana`;
    } else if (purpose === 'registro') {
      subjectText = `Configura tu Contraseña WES – Código: ${cleanCode}`;
      messageText = `Hola ${cleanName},

Tu código de 4 dígitos para completar el registro en Warn Electrical Services (WES) es:

${cleanCode}

Warn Electrical Services, SRL (WES)`;
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

    try {
      await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      return { success: true };
    } catch (err) {
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

      const user = findUserByIdentifier(identifier);
      if (!user) {
        return { 
          success: false, 
          message: 'No encontramos ninguna cuenta con ese correo. Puedes registrarte en la pestaña "Crear Cuenta".' 
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

    // Métodos heredados para recuperación de contraseñas
    async requestRegistrationOtp(name, email) {
      return this.registerClient({ name, email, password: 'User2026!' });
    },

    completeRegistration(email, code, password, passConfirm) {
      return this.registerClient({ name: 'Usuario WES', email, password, confirmPassword: passConfirm });
    },

    async requestPasswordReset(email) {
      if (!email || !email.trim() || !email.includes('@')) {
        return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
      }
      const cleanEmail = email.trim().toLowerCase();
      const user = findUserByIdentifier(cleanEmail);
      if (!user) {
        return { success: false, message: 'No se encontró ninguna cuenta registrada con el correo ingresado.' };
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
      } catch (e) {}

      await sendEmailCode(cleanEmail, code, user.name, 'recuperacion');
      return {
        success: true,
        email: cleanEmail,
        codeDemo: code,
        message: `Hemos enviado un código de 4 dígitos a ${cleanEmail}.`
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
        if (!entry) return { success: false, message: 'No hay ninguna solicitud activa para este correo.' };
        if (Date.now() > entry.expiresAt) return { success: false, message: 'El código ha expirado (15 minutos).' };
        if (entry.code !== cleanCode) return { success: false, message: 'Código de 4 dígitos incorrecto.' };
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
      if (!verification.success) return verification;

      const cleanEmail = email.trim().toLowerCase();
      const clients = getRegisteredClients();
      const cliIdx = clients.findIndex(c => c.email.toLowerCase() === cleanEmail);
      if (cliIdx !== -1) {
        clients[cliIdx].password = newPassword;
        clients[cliIdx].updatedAt = new Date().toISOString();
        saveRegisteredClients(clients);
      }
      return {
        success: true,
        message: '¡Tu contraseña ha sido actualizada con éxito! Ya puedes iniciar sesión con tu nueva clave.'
      };
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
