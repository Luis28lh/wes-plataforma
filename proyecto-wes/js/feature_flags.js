// ==========================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// Gestor de Conmutadores Públicos (Feature Toggles) - js/feature_flags.js
// ==========================================================================

const DEFAULT_FEATURE_FLAGS = {
  showPrices: true,
  enableQuotes: true,
  quotesNotice: "Las solicitudes de cotización se encuentran temporalmente pausadas por mantenimiento de inventario. Contáctanos por WhatsApp al (849) 207-5474.",
  enableSupport: true,
  supportNotice: "El módulo de soporte técnico en línea está en calibración. Por favor comunícate directamente al correo wes.inform@gmail.com o vía telefónica.",
  hideOutOfStock: false,
  showFounders: true,
  showMap: true,
  showWhatsAppButton: true,
  activeCategories: [
    "Cámaras de Seguridad",
    "Controles de Acceso",
    "Cerraduras Inteligentes",
    "Alarmas y Sensores",
    "Redes y Conectividad",
    "Energía y Respaldo",
    "Automatización y Domótica",
    "Accesorios de Instalación"
  ]
};

const FeatureFlags = {
  STORAGE_KEY: 'wes_feature_flags',

  getFlags() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return Object.assign({}, DEFAULT_FEATURE_FLAGS, JSON.parse(stored));
      }
    } catch (e) {
      console.warn('[WES Flags] Error leyendo feature flags de localStorage:', e);
    }
    return Object.assign({}, DEFAULT_FEATURE_FLAGS);
  },

  saveFlags(flags, user = 'Admin') {
    try {
      const current = this.getFlags();
      const updated = Object.assign({}, current, flags);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));

      // Disparar evento para componentes en la misma pestaña
      window.dispatchEvent(new CustomEvent('wes_flags_changed', { detail: updated }));

      // Registrar en auditoría si el módulo está disponible
      if (window.AuditLog && typeof window.AuditLog.log === 'function') {
        window.AuditLog.log({
          module: 'ajustes',
          action: 'actualizar_feature_toggles',
          description: 'Se actualizaron los conmutadores de funciones públicas (Feature Flags).',
          oldValue: current,
          newValue: updated
        });
      }

      return updated;
    } catch (e) {
      console.error('[WES Flags] Error guardando feature flags:', e);
      return null;
    }
  },

  isFeatureActive(featureKey) {
    const flags = this.getFlags();
    return Boolean(flags[featureKey]);
  },

  isCategoryActive(categoryName) {
    const flags = this.getFlags();
    if (!flags.activeCategories || !Array.isArray(flags.activeCategories)) return true;
    return flags.activeCategories.includes(categoryName);
  },

  resetDefaults() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_FEATURE_FLAGS));
    window.dispatchEvent(new CustomEvent('wes_flags_changed', { detail: DEFAULT_FEATURE_FLAGS }));
    return DEFAULT_FEATURE_FLAGS;
  }
};

window.FeatureFlags = FeatureFlags;

// Escuchar cambios entre pestañas (StorageEvent)
window.addEventListener('storage', (e) => {
  if (e.key === FeatureFlags.STORAGE_KEY) {
    try {
      const updated = JSON.parse(e.newValue || '{}');
      window.dispatchEvent(new CustomEvent('wes_flags_changed', { detail: updated }));
    } catch (err) {
      // ignore
    }
  }
});
