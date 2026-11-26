/**
 * ============================================================================
 * WARN ELECTRICAL SERVICES, SRL (WES)
 * CATÁLOGO OFICIAL DE CATEGORÍAS Y SUBCATEGORÍAS ESTRUCTURADAS
 * ============================================================================
 */

const INITIAL_CATEGORIES = [
  // 1. REDES Y CONECTIVIDAD
  {
    id: "cat-redes",
    nombre: "Redes y Conectividad",
    slug: "redes-conectividad",
    parent_id: null,
    imagen_url: "assets/products/leviton-utp6m-mlb-caja-azul.jpg",
    icono: "fa-network-wired",
    orden: 1,
    activo: true,
    descripcion: "Equipos activos de red, conmutadores, enrutadores, cableado estructurado y puntos de acceso Wi-Fi empresarial."
  },
  {
    id: "sub-red-switches",
    nombre: "Switches",
    slug: "switches",
    parent_id: "cat-redes",
    imagen_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
    icono: "fa-server",
    orden: 1,
    activo: true,
    descripcion: "Switches Fast Ethernet, Gigabit y PoE para cámaras IP y redes corporativas."
  },
  {
    id: "sub-red-routers",
    nombre: "Routers",
    slug: "routers",
    parent_id: "cat-redes",
    imagen_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    icono: "fa-route",
    orden: 2,
    activo: true,
    descripcion: "Enrutadores balanceadores de carga, VPN y gestión de ancho de banda."
  },
  {
    id: "sub-red-ap",
    nombre: "Puntos de Acceso",
    slug: "puntos-de-acceso",
    parent_id: "cat-redes",
    imagen_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    icono: "fa-wifi",
    orden: 3,
    activo: true,
    descripcion: "Access Points de largo alcance para interiores y exteriores Wi-Fi 6."
  },
  {
    id: "sub-red-cables-utp",
    nombre: "Cables de Red UTP",
    slug: "cables-red-utp",
    parent_id: "cat-redes",
    imagen_url: "assets/products/dahua-pfm920i-6u-u-caja.png",
    icono: "fa-ethernet",
    orden: 4,
    activo: true,
    descripcion: "Bobinas Cat5e y Cat6 100% cobre y CCA para exteriores e interiores."
  },
  {
    id: "sub-red-patch-cords",
    nombre: "Patch Cords",
    slug: "patch-cords",
    parent_id: "cat-redes",
    imagen_url: "assets/products/dahua-pfm922i-6un-c-gris-caja.png",
    icono: "fa-plug",
    orden: 5,
    activo: true,
    descripcion: "Cables de conexión directa armados de fábrica en 1m, 2m y medidas estándar."
  },
  {
    id: "sub-red-conectores",
    nombre: "Conectores RJ45",
    slug: "conectores-rj45",
    parent_id: "cat-redes",
    imagen_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
    icono: "fa-link",
    orden: 6,
    activo: true,
    descripcion: "Conectores plug RJ45 Cat5e/Cat6, botas de protección y jacks hembra."
  },

  // 2. CÁMARAS DE SEGURIDAD
  {
    id: "cat-camaras",
    nombre: "Cámaras de Seguridad",
    slug: "camaras-seguridad",
    parent_id: null,
    imagen_url: "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=400&q=80",
    icono: "fa-video",
    orden: 2,
    activo: true,
    descripcion: "Sistemas de videovigilancia CCTV, cámaras IP, cámaras Wi-Fi y domos motorizados."
  },
  {
    id: "sub-cam-ip",
    nombre: "Cámaras IP",
    slug: "camaras-ip",
    parent_id: "cat-camaras",
    imagen_url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80",
    icono: "fa-network-wired",
    orden: 1,
    activo: true,
    descripcion: "Cámaras digitales de alta resolución con alimentación PoE y analíticas inteligentes."
  },
  {
    id: "sub-cam-wifi",
    nombre: "Cámaras Wi-Fi",
    slug: "camaras-wifi",
    parent_id: "cat-camaras",
    imagen_url: "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=400&q=80",
    icono: "fa-wifi",
    orden: 2,
    activo: true,
    descripcion: "Cámaras inalámbricas residenciales con audio bidireccional y visión nocturna."
  },
  {
    id: "sub-cam-domos",
    nombre: "Cámaras Domo",
    slug: "camaras-domo",
    parent_id: "cat-camaras",
    imagen_url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80",
    icono: "fa-dot-circle",
    orden: 3,
    activo: true,
    descripcion: "Cámaras en formato domo antivandálico para techo e interiores."
  },
  {
    id: "sub-cam-bullet",
    nombre: "Cámaras Bullet",
    slug: "camaras-bullet",
    parent_id: "cat-camaras",
    imagen_url: "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=400&q=80",
    icono: "fa-video",
    orden: 4,
    activo: true,
    descripcion: "Cámaras tipo bala de largo alcance preparadas para exteriores (IP67)."
  },
  {
    id: "sub-cam-accesorios",
    nombre: "Bases y Accesorios",
    slug: "accesorios-cctv",
    parent_id: "cat-camaras",
    imagen_url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80",
    icono: "fa-boxes",
    orden: 5,
    activo: true,
    descripcion: "Bases de montaje estancas, fuentes de poder centralizadas, memorias MicroSD y letreros."
  },

  // 3. CONTROLES DE ACCESO Y AUTOMATIZACIÓN
  {
    id: "cat-acceso",
    nombre: "Controles de Acceso",
    slug: "controles-acceso",
    parent_id: null,
    imagen_url: "assets/came-bxv1000kg.jpg",
    icono: "fa-id-card",
    orden: 3,
    activo: true,
    descripcion: "Operadores automáticos de portón CAME, controles remotos, cremalleras y repuestos originales."
  },
  {
    id: "sub-acc-motores",
    nombre: "Motores de Portón",
    slug: "motores-porton",
    parent_id: "cat-acceso",
    imagen_url: "assets/products/came-bkv-2000kg-kit.jpg",
    icono: "fa-cogs",
    orden: 1,
    activo: true,
    descripcion: "Motores corredizos residenciales e industriales CAME de 600kg, 800kg, 1000kg, 1800kg y 2000kg."
  },
  {
    id: "sub-acc-controles",
    nombre: "Controles Remotos",
    slug: "controles-remotos",
    parent_id: "cat-acceso",
    imagen_url: "assets/came-top44rbn-front.jpg",
    icono: "fa-broadcast-tower",
    orden: 2,
    activo: true,
    descripcion: "Emisores de radiofrecuencia originales CAME de 2 y 4 canales código fijo y rolling code."
  },
  {
    id: "sub-acc-repuestos",
    nombre: "Repuestos y Accesorios",
    slug: "repuestos-came",
    parent_id: "cat-acceso",
    imagen_url: "assets/came-bxv1000kg.jpg",
    icono: "fa-tools",
    orden: 3,
    activo: true,
    descripcion: "Cremalleras de acero y nylon, fotoceldas DIR10, tarjetas electrónicas ZBX y lámparas LED."
  },

  // 4. ENERGÍA Y RESPALDO
  {
    id: "cat-energia",
    nombre: "Energía y Respaldo",
    slug: "energia-respaldo",
    parent_id: null,
    imagen_url: "assets/products/bateria-12v-7a-frontal.png",
    icono: "fa-bolt",
    orden: 4,
    activo: true,
    descripcion: "Sistemas ininterrumpidos de potencia (UPS), inversores senoidales, baterías AGM y medición inteligente."
  },
  {
    id: "sub-ene-baterias",
    nombre: "Baterías AGM",
    slug: "baterias-agm",
    parent_id: "cat-energia",
    imagen_url: "assets/products/bateria-12v-7a-frontal.png",
    icono: "fa-car-battery",
    orden: 1,
    activo: true,
    descripcion: "Baterías selladas libres de mantenimiento 12V 4.5Ah y 7.0Ah para alarmas, UPS y controles."
  },
  {
    id: "sub-ene-inversores",
    nombre: "Inversores y UPS",
    slug: "inversores-ups",
    parent_id: "cat-energia",
    imagen_url: "assets/products/inversor-prostec-1-5kw-aluminio.jpg",
    icono: "fa-charging-station",
    orden: 2,
    activo: true,
    descripcion: "Inversores onda senoidal pura y equipos UPS con conectividad Wi-Fi para respaldo crítico."
  },
  {
    id: "sub-ene-cables",
    nombre: "Cables y Conexión",
    slug: "cables-bateria",
    parent_id: "cat-energia",
    imagen_url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80",
    icono: "fa-plug",
    orden: 3,
    activo: true,
    descripcion: "Cables de potencia para batería calibre #2, #2/0, #4 y terminales de cobre de alta resistencia."
  },
  {
    id: "sub-ene-smart",
    nombre: "Medición Inteligente",
    slug: "medicion-inteligente",
    parent_id: "cat-energia",
    imagen_url: "assets/products/sonoff-pow-elite-20a-front.webp",
    icono: "fa-tachometer-alt",
    orden: 4,
    activo: true,
    descripcion: "Medidores inteligentes Sonoff con pantalla LCD y monitoreo de consumo en tiempo real."
  },

  // 5. CABLES Y ACCESORIOS DE INSTALACIÓN
  {
    id: "cat-accesorios",
    nombre: "Accesorios de Instalación",
    slug: "accesorios-instalacion",
    parent_id: null,
    imagen_url: "assets/products/dahua-pfm922i-6un-c-gris-caja.png",
    icono: "fa-tools",
    orden: 5,
    activo: true,
    descripcion: "Tubería EMT y PVC, conectores industriales LQT/EMT/BX, cables eléctricos THHN y herramientas."
  },
  {
    id: "sub-acc-conductores",
    nombre: "Cables Eléctricos",
    slug: "cables-electricos",
    parent_id: "cat-accesorios",
    imagen_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
    icono: "fa-bezier-curve",
    orden: 1,
    activo: true,
    descripcion: "Conductores de cobre Phelps Dodge THHN calibres #8, #10, #12, #14 y cables de vinil/goma."
  },
  {
    id: "sub-acc-conectores-ind",
    nombre: "Conectores y Empalmes",
    slug: "conectores-empalmes",
    parent_id: "cat-accesorios",
    imagen_url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80",
    icono: "fa-compress-arrows-alt",
    orden: 2,
    activo: true,
    descripcion: "Conectores LQT curvos y rectos, EMT, conectores de compresión, sillas y varillas de tierra."
  },
  {
    id: "sub-acc-tuberia",
    nombre: "Tubería y Canalización",
    slug: "tuberia-canalizacion",
    parent_id: "cat-accesorios",
    imagen_url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80",
    icono: "fa-shield-alt",
    orden: 3,
    activo: true,
    descripcion: "Tubos EMT y PVC, sierras copa para metal, organizadores de cables y elementos de fijación."
  }
];

// Helper global para el manejo y consulta de categorías estructuradas
const CategoriesCatalog = {
  STORAGE_KEY: 'wes_categories_structured_catalog_v1',

  getAll: function() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch(e) {}
    return INITIAL_CATEGORIES;
  },

  saveAll: function(categoriesList) {
    if (!Array.isArray(categoriesList)) return;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categoriesList));
      }
    } catch(e) {}
  },

  getMainCategories: function() {
    return this.getAll()
      .filter(c => c.activo !== false && !c.parent_id)
      .sort((a, b) => (a.orden || 99) - (b.orden || 99));
  },

  getSubcategories: function(parentId) {
    if (!parentId) return [];
    return this.getAll()
      .filter(c => c.activo !== false && c.parent_id === parentId)
      .sort((a, b) => (a.orden || 99) - (b.orden || 99));
  },

  getById: function(id) {
    if (!id) return null;
    return this.getAll().find(c => c.id === id) || null;
  },

  getBySlug: function(slug) {
    if (!slug) return null;
    const clean = String(slug).toLowerCase().trim();
    return this.getAll().find(c => (c.slug && c.slug.toLowerCase() === clean) || c.id.toLowerCase() === clean) || null;
  }
};

if (typeof window !== 'undefined') {
  window.INITIAL_CATEGORIES = INITIAL_CATEGORIES;
  window.CategoriesCatalog = CategoriesCatalog;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INITIAL_CATEGORIES, CategoriesCatalog };
}
