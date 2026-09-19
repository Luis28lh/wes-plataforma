// Base de datos inicial de productos de Warn Electrical Services, SRL (WES)
const INITIAL_PRODUCTS = [
  {
    id: "prod-001",
    name: "Cámara IP Domo 4 MP Ultra HD",
    code: "CAM-IP-4MP-001",
    brand: "Hikvision",
    category: "Cámaras de seguridad",
    description: "Cámara de videovigilancia domo con resolución 4 MP, visión nocturna EXIR inteligente de hasta 30m y protección IP67 para exterior/interior.",
    features: [
      "Resolución 4 Megapíxeles (2560 × 1440)",
      "Visión nocturna infrarroja EXIR 30 metros",
      "Compresión eficiente H.265+ para ahorro de almacenamiento",
      "Protección contra agua y polvo IP67",
      "Alimentación PoE (802.3af) o 12V DC",
      "Acceso remoto en tiempo real vía smartphone"
    ],
    price: 4850,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-002",
    name: "Cámara IP Bala Exterior 4 MP con Audio",
    code: "CAM-BALA-4MP-002",
    brand: "Dahua",
    category: "Cámaras de seguridad",
    description: "Cámara tipo bala para intemperie con lente fijo de 2.8mm, micrófono incorporado de alta sensibilidad y tecnología Smart IR.",
    features: [
      "Resolución 4 MP a 30 fps",
      "Micrófono integrado para audio ambiental",
      "Alcance nocturno hasta 30m",
      "Carcasa metálica antivandálica con norma IP67",
      "Detección inteligente de movimiento con filtrado humano"
    ],
    price: 5200,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-003",
    name: "Cámara PTZ WiFi 360° Exterior con Seguimiento",
    code: "CAM-PTZ-WIFI-003",
    brand: "EZVIZ / WES",
    category: "Cámaras de seguridad",
    description: "Cámara motorizada con giro horizontal de 352° y vertical de 95°, seguimiento automático de objetivos y foco luminoso de disuasión.",
    features: [
      "Visión panorámica 360° motorizada",
      "Resolución 2K (3 Megapíxeles)",
      "Visión nocturna a todo color mediante reflectores LED",
      "Audio bidireccional (altavoz y micrófono)",
      "Sirena y luz estroboscópica disuasoria integrada",
      "Conexión WiFi de doble antena de largo alcance"
    ],
    price: 6900,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-004",
    name: "Grabador de Video NVR 8 Canales 4K PoE",
    code: "NVR-4K-08P-001",
    brand: "Hikvision",
    category: "Grabadores DVR y NVR",
    description: "Grabador de red para 8 cámaras IP con puertos PoE independientes Plug & Play, soporte para discos de hasta 10TB y salida HDMI 4K.",
    features: [
      "8 puertos PoE integrados para conexión directa de cámaras",
      "Soporte de cámaras de hasta 8 MP (4K)",
      "Decodificación y compresión H.265+",
      "Salidas simultáneas HDMI 4K y VGA",
      "Configuración rápida P2P para visualización en celular",
      "Alertas push instantáneas de eventos"
    ],
    price: 13500,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-005",
    name: "Grabador DVR 16 Canales Pentahíbrido",
    code: "DVR-16CH-HD-002",
    brand: "Dahua",
    category: "Grabadores DVR y NVR",
    description: "Grabador digital pentahíbrido compatible con tecnologías HDCVI, AHD, TVI, CVBS e IP, ideal para modernización de sistemas existentes.",
    features: [
      "16 canales analógicos HD + canales IP adicionales",
      "Transmisión a larga distancia por cable coaxial o UTP",
      "Búsqueda inteligente por área de detección",
      "Ventilador de bajo ruido y diseño térmico optimizado"
    ],
    price: 11200,
    availability: "Bajo pedido",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-006",
    name: "Terminal Biométrico de Acceso Facial y Huella",
    code: "BIO-FACIAL-F100",
    brand: "ZKTeco",
    category: "Controles de acceso",
    description: "Control de acceso y asistencia con reconocimiento facial Visible Light anti-suplantación, lector de huellas digitales SilkID y tarjetas RFID.",
    features: [
      "Capacidad para 3,000 rostros y 3,000 huellas",
      "Reconocimiento ultrarrápido en menos de 0.3 segundos",
      "Pantalla táctil IPS de 5 pulgadas",
      "Conectividad TCP/IP, WiFi y USB",
      "Relé para control de cerradura electromagnética o pestillo"
    ],
    price: 18900,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-007",
    name: "Teclado Autónomo RFID Metálico Exterior",
    code: "ACC-KEY-RFID-007",
    brand: "WES Pro",
    category: "Controles de acceso",
    description: "Control de acceso para puerta individual con teclado retroiluminado antivandálico y lector de llaveros/tarjetas de proximidad 125 kHz.",
    features: [
      "Estructura metálica de alta resistencia con norma IP68",
      "Apertura por PIN numérico, tarjeta RFID o PIN + Tarjeta",
      "Capacidad para hasta 2,000 usuarios",
      "Salida de relé temporizada programable"
    ],
    price: 3600,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-008",
    name: "Cerradura Inteligente WiFi con Huella y Teclado",
    code: "LOCK-SMART-WF-008",
    brand: "Tuya / Smart WES",
    category: "Cerraduras inteligentes",
    description: "Cerradura digital de sobreponer o embutir con 5 métodos de apertura: huella biométrica, código digital, tarjeta IC, llave mecánica y app móvil.",
    features: [
      "Apertura remota desde smartphone en cualquier lugar",
      "Generación de contraseñas temporales para visitas o personal",
      "Registro de accesos en tiempo real con fecha y hora",
      "Alarma de intento de intrusión y batería baja",
      "Alimentación con baterías AA de hasta 12 meses de duración"
    ],
    price: 9800,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-009",
    name: "Cerradura Electromagnética de 600 Lbs con Soporte ZL",
    code: "MAG-LOCK-600-ZL",
    brand: "Securitron / WES",
    category: "Cerraduras eléctricas",
    description: "Electroimán para puertas de madera, metal o vidrio con fuerza de retención de 600 libras (280 kg), sensor de estado LED y soporte multiposición.",
    features: [
      "Fuerza de retención magnética de 280 kg / 600 lbs",
      "Voltaje dual 12V / 24V DC con bajo consumo",
      "Diseño anti-magnetismo residual",
      "Incluye soporte tipo ZL para montaje flexible",
      "Indicador visual de estado de bloqueo (LED verde/rojo)"
    ],
    price: 4950,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-010",
    name: "Videoportero IP WiFi con Pantalla Táctil 7\"",
    code: "INTER-IP-7IN-010",
    brand: "Hikvision",
    category: "Videoporteros e intercomunicadores",
    description: "Sistema completo de intercomunicación con placa exterior de cámara Full HD gran angular y monitor táctil de interior con recepción en el celular.",
    features: [
      "Placa de calle con cámara 1080p y visión nocturna",
      "Monitor de 7 pulgadas táctil a color para pared",
      "Atención y apertura de puerta remota desde el celular",
      "Grabación de mensajes y captura de fotos de visitantes",
      "Alimentación estándar PoE"
    ],
    price: 16500,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-011",
    name: "Panel de Alarma Inalámbrico WiFi/GSM Kit Completo",
    code: "ALM-KIT-WF-011",
    brand: "Tuya Smart / WES",
    category: "Alarmas y sensores",
    description: "Kit de seguridad inteligente que incluye central inalámbrica, sensor de movimiento PIR, contacto magnético para puerta/ventana y 2 controles remotos.",
    features: [
      "Doble vía de comunicación: WiFi residencial e inserción de SIM GSM",
      "Sirena interna integrada de 90 dB + soporte para sirena exterior",
      "Notificaciones instantáneas vía App y llamada telefónica o SMS",
      "Batería recargable de respaldo ante cortes eléctricos de hasta 8 horas",
      "Compatible con asistentes Google Home y Alexa"
    ],
    price: 7400,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-012",
    name: "Switch PoE Gigabit 8 Puertos + 2 Uplink",
    code: "NET-SW-8P-GB",
    brand: "Ubiquiti / TP-Link",
    category: "Redes y conectividad",
    description: "Switch administrado de 8 puertos PoE+ 10/100/1000 Mbps con potencia total de 120W y 2 puertos Gigabit adicionales para enlace con router.",
    features: [
      "8 puertos compatibles con estándares IEEE 802.3af/at",
      "Potencia total de suministro PoE hasta 120W",
      "Función Extend de hasta 250 metros para cámaras lejanas",
      "Prioridad de puertos QoS y aislamiento VLAN automático",
      "Chasis metálico resistente con montaje en rack o pared"
    ],
    price: 6800,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-013",
    name: "Fuente de Poder Centralizada 12V 10A (9 Salidas)",
    code: "PWR-BOX-12V10A-9",
    brand: "WES Power",
    category: "Fuentes de alimentación",
    description: "Caja de distribución de energía regulada con 9 salidas protegidas por fusibles PTC auto-recuperables e indicador LED individual.",
    features: [
      "Entrada 110V/220V AC conmutada",
      "Salida estabilizada 12V DC total 10 Amperios",
      "9 terminales de salida con fusibles térmicos PTC independientes",
      "Gabinete metálico con cerradura de seguridad con llave",
      "Espacio para batería de respaldo opcional"
    ],
    price: 2950,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "prod-014",
    name: "Bobina Cable UTP Cat6 100% Cobre Exterior 305m",
    code: "CAB-CAT6-EXT-305",
    brand: "Panduit / Furukawa",
    category: "Cables",
    description: "Cable de red estructurado categoría 6 certificado para exteriores con doble chaqueta UV e hilo de desgarre para instalaciones de CCTV y redes.",
    features: [
      "Conductores 100% cobre sólido 23 AWG",
      "Doble recubrimiento PE resistente a rayos ultravioleta y humedad",
      "Ancho de banda testeado de hasta 250 MHz",
      "Longitud en caja dispensadora de 305 metros (1,000 pies)",
      "Ideal para tendidos a la intemperie y ducterías"
    ],
    price: 8900,
    availability: "Disponible",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    active: true
  }
];

// Almacenamiento local para permitir gestión dinámica desde el panel admin
const StorageService = {
  getProducts: function() {
    const saved = localStorage.getItem("wes_products");
    if (!saved) {
      localStorage.setItem("wes_products", JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts: function(products) {
    localStorage.setItem("wes_products", JSON.stringify(products));
  },

  getQuotes: function() {
    const saved = localStorage.getItem("wes_quotes");
    if (!saved) {
      const sampleQuotes = [
        {
          id: "COT-2026-0001",
          date: "2026-09-18 14:32",
          clientName: "Ing. Carlos Mendoza",
          company: "Coopcibao Moca",
          taxId: "1-01-23456-7",
          phone: "809-578-2200",
          whatsapp: "809-578-2200",
          email: "cmendoza@coopcibao.com.do",
          city: "Moca, Espaillat",
          clientType: "Empresarial",
          contactMethod: "WhatsApp",
          items: [
            { name: "Cámara IP Domo 4 MP Ultra HD", code: "CAM-IP-4MP-001", quantity: 4, price: 4850 },
            { name: "Grabador de Video NVR 8 Canales 4K PoE", code: "NVR-4K-08P-001", quantity: 1, price: 13500 },
            { name: "Bobina Cable UTP Cat6 100% Cobre Exterior 305m", code: "CAB-CAT6-EXT-305", quantity: 1, price: 8900 }
          ],
          totalEstimated: 41800,
          comments: "Requerimos cotización formal para el área de bóveda y recepción.",
          status: "En revisión",
          internalNotes: "Contactado por WhatsApp. Preparando propuesta formal con instalación."
        }
      ];
      localStorage.setItem("wes_quotes", JSON.stringify(sampleQuotes));
      return sampleQuotes;
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  },

  saveQuotes: function(quotes) {
    localStorage.setItem("wes_quotes", JSON.stringify(quotes));
  },

  getSupportTickets: function() {
    const saved = localStorage.getItem("wes_support_tickets");
    if (!saved) {
      const sampleTickets = [
        {
          id: "SOP-2026-0001",
          date: "2026-09-19 08:45",
          clientName: "Dra. Carmen Santos",
          company: "Farmacia Naraly",
          phone: "809-578-9844",
          whatsapp: "809-578-9844",
          email: "csantos@farmacianaraly.com",
          address: "Calle Independencia esq. Rosario, Moca",
          orderNumber: "FAC-8921",
          productSystem: "Sistema de 8 Cámaras CCTV",
          category: "Cámara sin imagen",
          priority: "Media",
          description: "La cámara que enfoca la caja registradora número 2 muestra pantalla negra desde ayer en la tarde. Los conectores parecen firmes.",
          preferredTime: "Mañana (8:00 AM - 12:00 PM)",
          contactMethod: "Llamada telefónica",
          images: [
            "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80"
          ],
          status: "Visita programada",
          internalNotes: "Técnico Juan Rodríguez asignado para inspección hoy a las 11:30 AM."
        }
      ];
      localStorage.setItem("wes_support_tickets", JSON.stringify(sampleTickets));
      return sampleTickets;
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  },

  saveSupportTickets: function(tickets) {
    localStorage.setItem("wes_support_tickets", JSON.stringify(tickets));
  },

  getCompanySettings: function() {
    const saved = localStorage.getItem("wes_company_settings");
    if (!saved) {
      const defaultSettings = {
        name: "Warn Electrical Services, SRL (WES)",
        slogan: "Tecnología, seguridad y soporte a tu alcance",
        rnc: "1-31-89326-4",
        address: "Autopista Ramón Cáceres, Plaza Megatone, Moca, Provincia Espaillat, República Dominicana",
        phone: "(809) 578-4320",
        whatsapp: "18095784320",
        whatsappDisplay: "(809) 578-4320",
        emailGeneral: "info@wes.com.do",
        emailSupport: "soporte@wes.com.do",
        scheduleWeek: "Lunes a Viernes: 7:30 AM – 6:00 PM (Almuerzo 12:00 PM – 2:00 PM)",
        scheduleSat: "Sábados: 8:00 AM – 1:00 PM",
        instagram: "@wessrl",
        facebook: "Warn Electrical Services SRL",
        googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.4284792376994!2d-70.5283995!3d19.4005876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1cf6027a42b1f%3A0x1d61994a4c6a28bf!2sAutopista%20Ram%C3%B3n%20C%C3%A1ceres%2C%20Moca!5e0!3m2!1ses!2sdo!4v1700000000000!5m2!1ses!2sdo"
      };
      localStorage.setItem("wes_company_settings", JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return {};
    }
  },

  saveCompanySettings: function(settings) {
    localStorage.setItem("wes_company_settings", JSON.stringify(settings));
  }
};
