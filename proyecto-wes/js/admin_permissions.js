// ==========================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// Matriz de Roles y Permisos RBAC - js/admin_permissions.js
// ==========================================================================

const ROLE_DEFINITIONS = {
  propietario: {
    id: 'propietario',
    name: 'Propietario',
    description: 'Acceso total e irrestricto a todos los módulos, ajustes y operaciones.',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    color: '#6B21A8'
  },
  administrador: {
    id: 'administrador',
    name: 'Administrador',
    description: 'Gestión operativa integral: productos, cotizaciones, soporte y usuarios.',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    color: '#1D4ED8'
  },
  gestor_tienda: {
    id: 'gestor_tienda',
    name: 'Gestor de Tienda',
    description: 'Control de catálogo, productos, categorías, inventario y precios.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    color: '#047857'
  },
  gestor_cotizaciones: {
    id: 'gestor_cotizaciones',
    name: 'Gestor de Cotizaciones',
    description: 'Atención y seguimiento de solicitudes de cotización comercial.',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    color: '#B45309'
  },
  gestor_soporte: {
    id: 'gestor_soporte',
    name: 'Gestor de Soporte',
    description: 'Atención de tickets de averías, diagnóstico, asignación técnica y fotos.',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    color: '#BE123C'
  },
  editor_contenido: {
    id: 'editor_contenido',
    name: 'Editor de Contenido',
    description: 'Edición de textos corporativos, secciones, fundadores e información.',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    color: '#4338CA'
  },
  usuario_consulta: {
    id: 'usuario_consulta',
    name: 'Usuario de Consulta',
    description: 'Acceso en modo solo lectura para auditorías y revisiones de información.',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    color: '#475569'
  }
};

const MODULE_DEFINITIONS = [
  { id: 'productos', name: 'Productos', icon: 'fa-boxes' },
  { id: 'categorias', name: 'Categorías', icon: 'fa-tags' },
  { id: 'cotizaciones', name: 'Cotizaciones', icon: 'fa-file-invoice-dollar' },
  { id: 'soportes', name: 'Soporte Técnico', icon: 'fa-tools' },
  { id: 'contactos', name: 'Mensajes Contacto', icon: 'fa-envelope-open-text' },
  { id: 'contenido', name: 'Contenido Web', icon: 'fa-edit' },
  { id: 'usuarios', name: 'Usuarios y Roles', icon: 'fa-users-cog' },
  { id: 'ajustes', name: 'Ajustes & Toggles', icon: 'fa-sliders-h' },
  { id: 'auditoria', name: 'Historial Auditoría', icon: 'fa-history' }
];

const ACTION_DEFINITIONS = [
  { id: 'ver', name: 'Ver' },
  { id: 'crear', name: 'Crear' },
  { id: 'editar', name: 'Editar' },
  { id: 'desactivar', name: 'Desactivar' },
  { id: 'eliminar', name: 'Eliminar' },
  { id: 'exportar', name: 'Exportar' },
  { id: 'configurar', name: 'Configurar' }
];

// Matriz por defecto para cada uno de los 7 roles
const DEFAULT_PERMISSIONS_MATRIX = {
  propietario: {
    productos: ['ver', 'crear', 'editar', 'desactivar', 'eliminar', 'exportar', 'configurar'],
    categorias: ['ver', 'crear', 'editar', 'desactivar', 'eliminar', 'exportar', 'configurar'],
    cotizaciones: ['ver', 'crear', 'editar', 'desactivar', 'eliminar', 'exportar', 'configurar'],
    soportes: ['ver', 'crear', 'editar', 'desactivar', 'eliminar', 'exportar', 'configurar'],
    contactos: ['ver', 'crear', 'editar', 'desactivar', 'eliminar', 'exportar', 'configurar'],
    contenido: ['ver', 'crear', 'editar', 'desactivar', 'eliminar', 'exportar', 'configurar'],
    usuarios: ['ver', 'crear', 'editar', 'desactivar', 'eliminar', 'exportar', 'configurar'],
    ajustes: ['ver', 'crear', 'editar', 'desactivar', 'eliminar', 'exportar', 'configurar'],
    auditoria: ['ver', 'exportar', 'configurar']
  },
  administrador: {
    productos: ['ver', 'crear', 'editar', 'desactivar', 'eliminar', 'exportar'],
    categorias: ['ver', 'crear', 'editar', 'desactivar', 'eliminar', 'exportar'],
    cotizaciones: ['ver', 'crear', 'editar', 'desactivar', 'exportar'],
    soportes: ['ver', 'crear', 'editar', 'desactivar', 'exportar'],
    contactos: ['ver', 'editar', 'desactivar', 'exportar'],
    contenido: ['ver', 'crear', 'editar', 'desactivar'],
    usuarios: ['ver', 'crear', 'editar', 'desactivar', 'exportar'],
    ajustes: ['ver', 'configurar'],
    auditoria: ['ver', 'exportar']
  },
  gestor_tienda: {
    productos: ['ver', 'crear', 'editar', 'desactivar', 'exportar'],
    categorias: ['ver', 'crear', 'editar', 'desactivar'],
    cotizaciones: ['ver'],
    soportes: [],
    contactos: [],
    contenido: ['ver'],
    usuarios: [],
    ajustes: ['ver'],
    auditoria: []
  },
  gestor_cotizaciones: {
    productos: ['ver'],
    categorias: ['ver'],
    cotizaciones: ['ver', 'crear', 'editar', 'exportar'],
    soportes: ['ver'],
    contactos: ['ver', 'editar'],
    contenido: [],
    usuarios: [],
    ajustes: [],
    auditoria: []
  },
  gestor_soporte: {
    productos: ['ver'],
    categorias: ['ver'],
    cotizaciones: ['ver'],
    soportes: ['ver', 'crear', 'editar', 'exportar'],
    contactos: ['ver'],
    contenido: [],
    usuarios: [],
    ajustes: [],
    auditoria: []
  },
  editor_contenido: {
    productos: ['ver'],
    categorias: ['ver'],
    cotizaciones: [],
    soportes: [],
    contactos: [],
    contenido: ['ver', 'crear', 'editar'],
    usuarios: [],
    ajustes: ['ver'],
    auditoria: []
  },
  usuario_consulta: {
    productos: ['ver'],
    categorias: ['ver'],
    cotizaciones: ['ver'],
    soportes: ['ver'],
    contactos: ['ver'],
    contenido: ['ver'],
    usuarios: [],
    ajustes: ['ver'],
    auditoria: ['ver']
  }
};

const PermissionsManager = {
  STORAGE_KEY: 'wes_permissions_matrix',

  getMatrix() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[Permissions] Error leyendo matriz:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS_MATRIX));
  },

  saveMatrix(matrix) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(matrix));
      if (window.AuditLog) {
        window.AuditLog.log({
          module: 'usuarios',
          action: 'modificar_permisos',
          description: 'Se modificó la matriz interactiva de roles y permisos.'
        });
      }
      return true;
    } catch (e) {
      console.error('[Permissions] Error guardando matriz:', e);
      return false;
    }
  },

  hasPermission(module, action, userOverride = null) {
    const user = userOverride || (window.AdminAuth ? window.AdminAuth.getCurrentUser() : null);
    if (!user) return false;

    // El Propietario siempre tiene autorización irrestricta
    if (user.role === 'propietario') return true;

    // Permisos personalizados específicos del usuario si los tuviera
    if (user.customPermissions && user.customPermissions[module]) {
      return user.customPermissions[module].includes(action);
    }

    // Matriz del rol
    const matrix = this.getMatrix();
    const rolePermissions = matrix[user.role];
    if (!rolePermissions || !rolePermissions[module]) return false;

    return rolePermissions[module].includes(action);
  },

  // Método guardián de autorización con notificación requerida
  checkOrAlert(module, action) {
    if (this.hasPermission(module, action)) {
      return true;
    }
    if (window.showToast) {
      window.showToast('No tienes autorización para realizar esta acción', 'error');
    } else {
      alert('No tienes autorización para realizar esta acción');
    }
    return false;
  },

  resetDefaults() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_PERMISSIONS_MATRIX));
    return JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS_MATRIX));
  }
};

window.PermissionsManager = PermissionsManager;
window.ROLE_DEFINITIONS = ROLE_DEFINITIONS;
