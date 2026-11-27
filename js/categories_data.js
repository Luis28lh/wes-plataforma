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
    imagen_url: "https://eo-sgp-cos.ruijie.com/FU/Upload/Product/2022/4-15/20224154252470.png",
    icono: "fa-route",
    orden: 2,
    activo: true,
    descripcion: "Enrutadores balanceadores de carga Multi-WAN, VPN y gestión en nube."
  },
  {
    id: "sub-red-ap",
    nombre: "Puntos de Acceso",
    slug: "puntos-de-acceso",
    parent_id: "cat-redes",
    imagen_url: "https://eo-sgp-cos.ruijie.com/FU/Upload/Product/2022/5-18/202251826473299.jpg",
    icono: "fa-wifi",
    orden: 3,
    activo: true,
    descripcion: "Access Points de techo Wi-Fi 6 de ultra alto rendimiento y Reyee Mesh."
  },
  {
    id: "sub-red-cables-utp",
    nombre: "Cables UTP",
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
    descripcion: "Cables de conexión directa armados de fábrica en 1ft, 1m y 2m."
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
    descripcion: "Conectores plug RJ45 Cat5e/Cat6, RJ11 para telefonía y tomas UTP."
  },

  // 2. CÁMARAS DE SEGURIDAD
  {
    id: "cat-camaras",
    nombre: "Cámaras de Seguridad",
    slug: "camaras-seguridad",
    parent_id: null,
    imagen_url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80",
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
    nombre: "Bases y Soportes",
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
    nombre: "Motores Portón",
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
    nombre: "Repuestos CAME",
    slug: "repuestos-came",
    parent_id: "cat-acceso",
    imagen_url: "https://sc04.alicdn.com/kf/H40ce806651c9492c984e5c95483f02c0J.jpg",
    icono: "fa-tools",
    orden: 3,
    activo: true,
    descripcion: "Cremalleras de acero y nylon, fotoceldas DIR10, tarjetas electrónicas ZBX y accesorios."
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
    nombre: "Inversores & UPS",
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
    nombre: "Cables Potencia",
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
    nombre: "Medición Smart",
    slug: "medicion-inteligente",
    parent_id: "cat-energia",
    imagen_url: "assets/products/sonoff-pow-elite-20a-front.webp",
    icono: "fa-tachometer-alt",
    orden: 4,
    activo: true,
    descripcion: "Medidores inteligentes Sonoff con pantalla LCD y monitoreo de consumo en tiempo real."
  },

  // 5. MATERIAL ELÉCTRICO
  {
    id: "cat-electrico",
    nombre: "Material Eléctrico",
    slug: "material-electrico",
    parent_id: null,
    imagen_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
    icono: "fa-plug",
    orden: 5,
    activo: true,
    descripcion: "Conductores eléctricos Phelps Dodge THHN, cables de goma y vinil, conectores industriales, breakers y tableros."
  },
  {
    id: "sub-elec-cables",
    nombre: "Cables Eléctricos",
    slug: "cables-electricos",
    parent_id: "cat-electrico",
    imagen_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
    icono: "fa-bezier-curve",
    orden: 1,
    activo: true,
    descripcion: "Conductores THHN #6 al #14 Phelps Dodge, cables de goma #8 al #14 y vinil de 2, 3 y 4 hilos."
  },
  {
    id: "sub-elec-conectores",
    nombre: "Conectores & Empalmes",
    slug: "conectores-empalmes",
    parent_id: "cat-electrico",
    imagen_url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80",
    icono: "fa-compress-arrows-alt",
    orden: 2,
    activo: true,
    descripcion: "Conectores LQT rectos/curvos, BX, EMT, conectores de compresión y empalmes."
  },
  {
    id: "sub-elec-breakers",
    nombre: "Breakers y Tableros",
    slug: "breakers-tableros",
    parent_id: "cat-electrico",
    imagen_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
    icono: "fa-bolt",
    orden: 3,
    activo: true,
    descripcion: "Cajas de breaker empotrables de 24 circuitos, contactores 110V y protección eléctrica."
  },
  {
    id: "sub-elec-canalizacion",
    nombre: "Tubería & Canalización",
    slug: "tuberia-canalizacion",
    parent_id: "cat-electrico",
    imagen_url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80",
    icono: "fa-shield-alt",
    orden: 4,
    activo: true,
    descripcion: "Tubería metálica EMT, tubería plástica PVC para canalizaciones eléctricas y de datos."
  },

  // 6. ILUMINACIÓN
  {
    id: "cat-iluminacion",
    nombre: "Iluminación",
    slug: "iluminacion",
    parent_id: null,
    imagen_url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80",
    icono: "fa-lightbulb",
    orden: 6,
    activo: true,
    descripcion: "Tubos LED de alta eficiencia, luminarias lineales y bases de montaje."
  },
  {
    id: "sub-ilum-tubos",
    nombre: "Tubos LED",
    slug: "tubos-led",
    parent_id: "cat-iluminacion",
    imagen_url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80",
    icono: "fa-lightbulb",
    orden: 1,
    activo: true,
    descripcion: "Tubos LED 24\" y 48\", 9W, 18W y 45W Silvania y Sylvania en 6500K y 4100K."
  },
  {
    id: "sub-ilum-accesorios",
    nombre: "Bases y Accesorios",
    slug: "bases-accesorios-iluminacion",
    parent_id: "cat-iluminacion",
    imagen_url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80",
    icono: "fa-layer-group",
    orden: 2,
    activo: true,
    descripcion: "Bases para tubo LED 2-pin 40W y componentes de fijación para luminarias."
  },

  // 7. ACCESORIOS Y HERRAMIENTAS
  {
    id: "cat-accesorios",
    nombre: "Accesorios de Instalación",
    slug: "accesorios-instalacion",
    parent_id: null,
    imagen_url: "assets/products/dahua-pfm922i-6un-c-gris-caja.png",
    icono: "fa-tools",
    orden: 7,
    activo: true,
    descripcion: "Sierras copa para metal, flejadoras, organizadores de cables, tarugos y herramientas de montaje."
  },
  {
    id: "sub-acc-herramientas",
    nombre: "Herramientas y Montaje",
    slug: "herramientas-montaje",
    parent_id: "cat-accesorios",
    imagen_url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80",
    icono: "fa-tools",
    orden: 1,
    activo: true,
    descripcion: "Sierras copa Makita, flejadoras de acero inox, organizadores de cable, tarugos y perchas."
  }
];

// Helper global para el manejo y consulta de categorías estructuradas
const CategoriesCatalog = {
  STORAGE_KEY: 'wes_categories_structured_catalog_v2',

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
