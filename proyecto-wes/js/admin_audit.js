// ==========================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// Sistema de Historial de Auditoría (Audit Log) - js/admin_audit.js
// ==========================================================================

const AuditLog = {
  STORAGE_KEY: 'wes_audit_log',

  getLogs() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('[AuditLog] Error al leer logs:', e);
    }
    return this.getInitialLogs();
  },

  getInitialLogs() {
    const initial = [
      {
        id: 'AUD-1001',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        userEmail: 'wes.inform@gmail.com',
        userName: 'Propietario General',
        role: 'propietario',
        module: 'sistema',
        action: 'despliegue_inicial',
        description: 'Despliegue e inicialización de la plataforma corporativa WES v2.0.',
        oldValue: null,
        newValue: 'Versión 2.0 activa'
      },
      {
        id: 'AUD-1002',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        userEmail: 'wes.inform@gmail.com',
        userName: 'Propietario General',
        role: 'propietario',
        module: 'ajustes',
        action: 'configuracion_contacto',
        description: 'Verificación de datos de contacto corporativo: Teléfono (849) 207-5474 y correo wes.inform@gmail.com.',
        oldValue: null,
        newValue: 'Contacto verificado'
      },
      {
        id: 'AUD-1003',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        userEmail: 'admin@wes.com.do',
        userName: 'Admin Operativo',
        role: 'administrador',
        module: 'productos',
        action: 'actualizar_catalogo',
        description: 'Sincronización del catálogo base con 12 soluciones de seguridad y automatización.',
        oldValue: '0 productos',
        newValue: '12 productos'
      }
    ];
    this.saveLogs(initial);
    return initial;
  },

  saveLogs(logs) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('[AuditLog] Error guardando logs:', e);
    }
  },

  log({ module, action, description, oldValue = null, newValue = null, user = null }) {
    try {
      const logs = this.getLogs();
      const currentUser = user || (window.AdminAuth ? window.AdminAuth.getCurrentUser() : null) || {
        email: 'sistema@wes.com.do',
        name: 'Sistema / Automático',
        role: 'sistema'
      };

      const entry = {
        id: 'AUD-' + Date.now().toString().slice(-6),
        timestamp: new Date().toISOString(),
        userEmail: currentUser.email,
        userName: currentUser.name || currentUser.user,
        role: currentUser.role || 'desconocido',
        module,
        action,
        description,
        oldValue: typeof oldValue === 'object' && oldValue !== null ? JSON.stringify(oldValue) : oldValue,
        newValue: typeof newValue === 'object' && newValue !== null ? JSON.stringify(newValue) : newValue
      };

      logs.unshift(entry);
      // Mantener últimos 500 registros para optimización de almacenamiento
      if (logs.length > 500) logs.pop();

      this.saveLogs(logs);

      // Sincronizar en segundo plano con Google Apps Script si está disponible
      if (window.WES_API_URL) {
        fetch(window.WES_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'record_audit',
            data: entry
          })
        }).catch(() => {});
      }

      return entry;
    } catch (e) {
      console.error('[AuditLog] Error al registrar evento:', e);
      return null;
    }
  },

  exportCSV() {
    const logs = this.getLogs();
    if (!logs.length) return '';

    const headers = ['ID', 'Fecha y Hora', 'Usuario', 'Correo', 'Rol', 'Módulo', 'Acción', 'Descripción', 'Valor Anterior', 'Valor Nuevo'];
    const rows = logs.map(l => [
      l.id,
      `"${new Date(l.timestamp).toLocaleString('es-DO')}"`,
      `"${l.userName || ''}"`,
      `"${l.userEmail || ''}"`,
      `"${l.role || ''}"`,
      `"${l.module || ''}"`,
      `"${l.action || ''}"`,
      `"${(l.description || '').replace(/"/g, '""')}"`,
      `"${(l.oldValue || '').toString().replace(/"/g, '""')}"`,
      `"${(l.newValue || '').toString().replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `WES_Auditoria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

window.AuditLog = AuditLog;
