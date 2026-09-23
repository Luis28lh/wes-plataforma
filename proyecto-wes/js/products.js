// Base de datos inicial de productos de Warn Electrical Services, SRL (WES)
// Sincronizado desde Odoo ERP en modo Solo Lectura
const INITIAL_PRODUCTS = [
  {
    "id": "odoo-96",
    "codigo": "122",
    "nombre": "BATERIA 12V-4A",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 122",
      "Categoría ERP: Baterías",
      "Disponibilidad: 6 unidades en inventario físico"
    ],
    "precio": 794.6,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 6,
    "imagen_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-97",
    "codigo": "123",
    "nombre": "BATERIA 12V-7A",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 123",
      "Categoría ERP: Baterías",
      "Disponibilidad: 4 unidades en inventario físico"
    ],
    "precio": 1173.55,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 4,
    "imagen_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-125",
    "codigo": "503",
    "nombre": "SOLUCION P/ BATERIA",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 503",
      "Categoría ERP: Baterías",
      "Disponibilidad: 3 unidades en inventario físico"
    ],
    "precio": 181.8,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-127",
    "codigo": "1667",
    "nombre": "TERMINAL 50-10 P/BATERIA",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1667",
      "Categoría ERP: Baterías",
      "Disponibilidad: 144 unidades en inventario físico"
    ],
    "precio": 35.14,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 144,
    "imagen_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-160",
    "codigo": "2983",
    "nombre": "BTC NOBILE NEGRO TOMA UTP RJ45",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2983",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 10 unidades en inventario físico"
    ],
    "precio": 601.5,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 10,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-162",
    "codigo": "3088",
    "nombre": "CABLE UTP CAT6 EXTERIOR DAHUA",
    "marca": "Dahua",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3088",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 1598 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 11.73,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1598,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-170",
    "codigo": "1536",
    "nombre": "CABLE UTP DAHUA CAT 5 BLANCO",
    "marca": "Dahua",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1536",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 1300 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 23,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1300,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-171",
    "codigo": "2362",
    "nombre": "CABLE UTP DAHUA CAT 6 AZUL",
    "marca": "Dahua",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2362",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 191 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 30.15,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 191,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-173",
    "codigo": "2949",
    "nombre": "CABLE UTP DAHUA CAT 6 GRIS",
    "marca": "Dahua",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2949",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 59 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 41.23,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 59,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-175",
    "codigo": "2487",
    "nombre": "CABLE UTP FERTEC CAT6 EXTERIOR DOUBLE",
    "marca": "Fertec",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional Fertec distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2487",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 305 unidades en inventario físico"
    ],
    "precio": 13.66,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 305,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-177",
    "codigo": "252",
    "nombre": "CABLE UTP LEVITON CAT 6 AZUL",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 252",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 873 unidades en inventario físico"
    ],
    "precio": 46.11,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 873,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-178",
    "codigo": "1839",
    "nombre": "CABLE UTP LEVINTON CAT 6 GRIS",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1839",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 108 unidades en inventario físico"
    ],
    "precio": 13.06,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 108,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-181",
    "codigo": "2051",
    "nombre": "CABLE UTP PANDUIT PANNET CAT 6 AZUL",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2051",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 158 unidades en inventario físico"
    ],
    "precio": 53.56,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 158,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-184",
    "codigo": "2811",
    "nombre": "PATCH CORD UTP 1M CAT 6",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2811",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 14 unidades en inventario físico"
    ],
    "precio": 135.57,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 14,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-185",
    "codigo": "2813",
    "nombre": "PATCH CORD UTP 2M CAT 6",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2813",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 7 unidades en inventario físico"
    ],
    "precio": 197.62,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 7,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-187",
    "codigo": "3108",
    "nombre": "PATCH CORD UTP CAR 6 1M DAHUA",
    "marca": "Dahua",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3108",
      "Categoría ERP: Cable UTP",
      "Disponibilidad: 27 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 152.38,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 27,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-1751",
    "codigo": "553",
    "nombre": "INVERSOR PROSTEC 1.2KW UPS 12V DC 120AC ALU.",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 553",
      "Categoría ERP: Inversores",
      "Disponibilidad: 1 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_inversores_wes.pdf"
    ],
    "precio": 9100,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-1776",
    "codigo": "3883",
    "nombre": "INVERSOR WAVE-SWG 3.6KG/24VDC SENOIDAL/WIFI 120V",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3883",
      "Categoría ERP: Inversores",
      "Disponibilidad: 1 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_inversores_wes.pdf"
    ],
    "precio": 33739.98,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-5976",
    "codigo": "4509",
    "nombre": "BASE P/ TUBO LED 2-PIN 40W",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4509",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 12 unidades en inventario físico"
    ],
    "precio": 20.83,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 12,
    "imagen_url": "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-5980",
    "codigo": "215",
    "nombre": "CABLE 18/4 MULTI FIBRA GENESIS",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 215",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1340 unidades en inventario físico"
    ],
    "precio": 25.07,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1340,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-5981",
    "codigo": "1629",
    "nombre": "CABLE 22/2 GENESIS",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1629",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1062 unidades en inventario físico"
    ],
    "precio": 9.39,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1062,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-5983",
    "codigo": "1836",
    "nombre": "CABLE 22/4 GENESIS MULTIFIBRA",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1836",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 5080 unidades en inventario físico"
    ],
    "precio": 11.24,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 5080,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-5984",
    "codigo": "217",
    "nombre": "CABLE 22/4 GENESIS SOLIDO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 217",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 2114 unidades en inventario físico"
    ],
    "precio": 9.99,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2114,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-5985",
    "codigo": "4164",
    "nombre": "CABLE 22/4 MULTIFIBRA ESEENET",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4164",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 534 unidades en inventario físico"
    ],
    "precio": 5.79,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 534,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-5988",
    "codigo": "1870",
    "nombre": "CABLE ALTO VOLTAJE ENGOMADO P/CERCO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1870",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 127 unidades en inventario físico"
    ],
    "precio": 31.54,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 127,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-5990",
    "codigo": "196",
    "nombre": "CABLE BATERIA #2",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 196",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 33 unidades en inventario físico"
    ],
    "precio": 228.94,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 33,
    "imagen_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-5991",
    "codigo": "2150",
    "nombre": "CABLE BATERIA #2/0",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2150",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 5 unidades en inventario físico"
    ],
    "precio": 427.2,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 5,
    "imagen_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-5993",
    "codigo": "197",
    "nombre": "CABLE BATERIA #4",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 197",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 14 unidades en inventario físico"
    ],
    "precio": 139.3,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 14,
    "imagen_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-5994",
    "codigo": "4530",
    "nombre": "CABLE CAT 6 EXTERIOR FASTCABLE",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4530",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 183 unidades en inventario físico"
    ],
    "precio": 50.27,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 183,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-5995",
    "codigo": "198",
    "nombre": "CABLE COAXIAL",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 198",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 8332 unidades en inventario físico"
    ],
    "precio": 3.75,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 8332,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6002",
    "codigo": "1813",
    "nombre": "CABLE DE GOMA #10/2",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1813",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 12 unidades en inventario físico"
    ],
    "precio": 37.53,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 12,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6003",
    "codigo": "2090",
    "nombre": "CABLE DE GOMA #10/3",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2090",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 142 unidades en inventario físico"
    ],
    "precio": 65.65,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 142,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6004",
    "codigo": "1859",
    "nombre": "CABLE DE GOMA #10/4",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1859",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 5 unidades en inventario físico"
    ],
    "precio": 103.46,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 5,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6005",
    "codigo": "200",
    "nombre": "CABLE DE GOMA #12/2",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 200",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 419 unidades en inventario físico"
    ],
    "precio": 32.2,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 419,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6006",
    "codigo": "201",
    "nombre": "CABLE DE GOMA #12/3",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 201",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 211 unidades en inventario físico"
    ],
    "precio": 57.33,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 211,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6007",
    "codigo": "202",
    "nombre": "CABLE DE GOMA #14/2",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 202",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 3130 unidades en inventario físico"
    ],
    "precio": 21.29,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3130,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6008",
    "codigo": "203",
    "nombre": "CABLE DE GOMA #14/3",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 203",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 177 unidades en inventario físico"
    ],
    "precio": 32.65,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 177,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6012",
    "codigo": "3038",
    "nombre": "CABLE DE GOMA #8/4",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3038",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 100 unidades en inventario físico"
    ],
    "precio": 174.11,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 100,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6016",
    "codigo": "204",
    "nombre": "CABLE DE VINIL #12/2",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 204",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 45 unidades en inventario físico"
    ],
    "precio": 48.66,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 45,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6017",
    "codigo": "205",
    "nombre": "CABLE DE VINIL #12/3",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 205",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 595 unidades en inventario físico"
    ],
    "precio": 54.74,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 595,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6018",
    "codigo": "206",
    "nombre": "CABLE DE VINIL #14/2",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 206",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 377 unidades en inventario físico"
    ],
    "precio": 33.21,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 377,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6019",
    "codigo": "207",
    "nombre": "CABLE DE VINIL 14/3",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 207",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 579 unidades en inventario físico"
    ],
    "precio": 40.55,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 579,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6021",
    "codigo": "209",
    "nombre": "CABLE DUPLEX #14",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 209",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1358 unidades en inventario físico"
    ],
    "precio": 14.07,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1358,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6036",
    "codigo": "2679",
    "nombre": "CABLE ELEC PHELP D #10 AZUL",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2679",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 103 unidades en inventario físico"
    ],
    "precio": 22.83,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 103,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6037",
    "codigo": "224",
    "nombre": "CABLE ELEC PHELP D #10 BLANCO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 224",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1419 unidades en inventario físico"
    ],
    "precio": 20.53,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1419,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6038",
    "codigo": "225",
    "nombre": "CABLE ELEC PHELP D #10 NEGRO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 225",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 817 unidades en inventario físico"
    ],
    "precio": 21.18,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 817,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6039",
    "codigo": "226",
    "nombre": "CABLE ELEC PHELP D #10 ROJO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 226",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1312 unidades en inventario físico"
    ],
    "precio": 22.83,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1312,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6040",
    "codigo": "1736",
    "nombre": "CABLE ELEC PHELP D #10 VERDE",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1736",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 336 unidades en inventario físico"
    ],
    "precio": 20.36,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 336,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6041",
    "codigo": "227",
    "nombre": "CABLE ELEC PHELP D #12 AMARILLO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 227",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1000 unidades en inventario físico"
    ],
    "precio": 16.64,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1000,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6042",
    "codigo": "228",
    "nombre": "CABLE ELEC PHELP D #12 AZUL",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 228",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1007 unidades en inventario físico"
    ],
    "precio": 15.25,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1007,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6043",
    "codigo": "229",
    "nombre": "CABLE ELEC PHELP D #12 BLANCO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 229",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 2492 unidades en inventario físico"
    ],
    "precio": 15.28,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2492,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6044",
    "codigo": "230",
    "nombre": "CABLE ELEC PHELP D #12 NEGRO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 230",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1257 unidades en inventario físico"
    ],
    "precio": 13.57,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1257,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6046",
    "codigo": "232",
    "nombre": "CABLE ELEC PHELP D #12 VERDE",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 232",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 266 unidades en inventario físico"
    ],
    "precio": 13.27,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 266,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6048",
    "codigo": "234",
    "nombre": "CABLE ELEC PHELP D #14 AZUL",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 234",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1554 unidades en inventario físico"
    ],
    "precio": 10.24,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1554,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6049",
    "codigo": "235",
    "nombre": "CABLE ELEC PHELP D #14 BLANCO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 235",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 406 unidades en inventario físico"
    ],
    "precio": 10.67,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 406,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6050",
    "codigo": "236",
    "nombre": "CABLE ELEC PHELP D #14 NEGRO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 236",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1369 unidades en inventario físico"
    ],
    "precio": 9.68,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1369,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6052",
    "codigo": "238",
    "nombre": "CABLE ELEC PHELP D #14 VERDE",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 238",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 492 unidades en inventario físico"
    ],
    "precio": 10.34,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 492,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6064",
    "codigo": "239",
    "nombre": "CABLE ELEC PHELP D #6 BLANCO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 239",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 811 unidades en inventario físico"
    ],
    "precio": 58.2,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 811,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6065",
    "codigo": "240",
    "nombre": "CABLE ELEC PHELP D #6 NEGRO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 240",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1099 unidades en inventario físico"
    ],
    "precio": 58.2,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1099,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6066",
    "codigo": "1742",
    "nombre": "CABLE ELEC PHELP D #6 ROJO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1742",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 334 unidades en inventario físico"
    ],
    "precio": 63.05,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 334,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6067",
    "codigo": "241",
    "nombre": "CABLE ELEC PHELP D #6 VERDE",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 241",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 485 unidades en inventario físico"
    ],
    "precio": 58.2,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 485,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6068",
    "codigo": "242",
    "nombre": "CABLE ELEC PHELP D #8 BLANCO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 242",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 604 unidades en inventario físico"
    ],
    "precio": 39.68,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 604,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6069",
    "codigo": "2677",
    "nombre": "CABLE ELEC PHELP D #8 GRIS",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2677",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 39 unidades en inventario físico"
    ],
    "precio": 33.62,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 39,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6070",
    "codigo": "243",
    "nombre": "CABLE ELEC PHELP D #8 NEGRO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 243",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 305 unidades en inventario físico"
    ],
    "precio": 37.64,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 305,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6071",
    "codigo": "244",
    "nombre": "CABLE ELEC PHELP D #8 ROJO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 244",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 172 unidades en inventario físico"
    ],
    "precio": 38.28,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 172,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6072",
    "codigo": "245",
    "nombre": "CABLE ELEC PHELP D #8 VERDE",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 245",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 351 unidades en inventario físico"
    ],
    "precio": 38.9,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 351,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6079",
    "codigo": "246",
    "nombre": "CABLE HDMI 15FT",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 246",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 7 unidades en inventario físico"
    ],
    "precio": 267.1,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 7,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6081",
    "codigo": "213",
    "nombre": "CABLE HDMI 25 FT",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 213",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 840,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6083",
    "codigo": "247",
    "nombre": "CABLE HDMI 6FT",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 247",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 156.09,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6094",
    "codigo": "3425",
    "nombre": "CABLE VGA 6 FT F1 MONITOR",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3425",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 6 unidades en inventario físico"
    ],
    "precio": 133,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 6,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6096",
    "codigo": "256",
    "nombre": "CABLE VGA MYO 50FT MONITOR",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 256",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 1208.25,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6102",
    "codigo": "3669",
    "nombre": "DETECTOR DE CABLES ELECTRICOS",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3669",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 1547,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6105",
    "codigo": "2383",
    "nombre": "EXPANSOR DE 8 ZONAS CABLEADO PS NEO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2383",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 2508.4,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6109",
    "codigo": "1544",
    "nombre": "FLEJADORA CABLE TIE ACERO INOX",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1544",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 8101.09,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6130",
    "codigo": "1501",
    "nombre": "ORGANIZADOR CABLE 1.1/8",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1501",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 418.6,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6132",
    "codigo": "3819",
    "nombre": "ORGANIZADOR DE CABLE 30MM X 2M",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3819",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 558.6,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6137",
    "codigo": "643",
    "nombre": "PERCHA P/ACOM TENSOR CABLE",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 643",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 18 unidades en inventario físico"
    ],
    "precio": 97.21,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 18,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6139",
    "codigo": "667",
    "nombre": "PORTA FUSIBLE P/CABLE",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 667",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 27,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6143",
    "codigo": "758",
    "nombre": "SIERRA HUECO MAKITA 1 3/4\" MAKITA ( TUBO 1 1/2\")",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 758",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 656.1,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6145",
    "codigo": "760",
    "nombre": "SIERRA HUECO MAKITA METAL 2 1/4\" MAKITA ( TUBO 2\")",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 760",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 674.7,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6151",
    "codigo": "812",
    "nombre": "TAPON PLAS.1-1/2X1-1/2 P/ TUBO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 812",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 34 unidades en inventario físico"
    ],
    "precio": 11.7,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 34,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6152",
    "codigo": "2428",
    "nombre": "TARUGO PLAST SHEETRROCK AUTOROCABLE 40MM",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2428",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 160 unidades en inventario físico"
    ],
    "precio": 5.13,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 160,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6153",
    "codigo": "1103",
    "nombre": "TERMINAL P/CABLE COAXIAL GENERICO METAL",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1103",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 92 unidades en inventario físico"
    ],
    "precio": 25.19,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 92,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6154",
    "codigo": "2073",
    "nombre": "TUBO 2'' HG",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2073",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 3500,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6155",
    "codigo": "898",
    "nombre": "TUBO EMT 1\"X10` AMERICANO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 898",
      "Categoría ERP: Cables el��ctricos",
      "Disponibilidad: 7 unidades en inventario físico"
    ],
    "precio": 780,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 7,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6156",
    "codigo": "2504",
    "nombre": "TUBO EMT 1\"X10` GENERICO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2504",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 25 unidades en inventario físico"
    ],
    "precio": 499.68,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 25,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6158",
    "codigo": "2506",
    "nombre": "TUBO EMT 1/2\"X10` GENERICO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2506",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 44 unidades en inventario físico"
    ],
    "precio": 281.98,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 44,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6165",
    "codigo": "2505",
    "nombre": "TUBO EMT 3/4\"X10` GENERICO",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2505",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 25 unidades en inventario físico"
    ],
    "precio": 240.55,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 25,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6169",
    "codigo": "909",
    "nombre": "TUBO LED 24\" 9W 6500K",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 909",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 15 unidades en inventario físico"
    ],
    "precio": 409,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 15,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6171",
    "codigo": "1761",
    "nombre": "TUBO LED 18W NEVADO 6500K",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1761",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 300.16,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6172",
    "codigo": "3189",
    "nombre": "TUBO LED 18W SILVANIA 6500K",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3189",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 3 unidades en inventario físico"
    ],
    "precio": 313.5,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6173",
    "codigo": "1364",
    "nombre": "TUBO LED 24\" 4100K",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1364",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 6 unidades en inventario físico"
    ],
    "precio": 332.05,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 6,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6176",
    "codigo": "910",
    "nombre": "TUBO LED 48\" 18W 4100K",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 910",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 14 unidades en inventario físico"
    ],
    "precio": 399.6,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 14,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6178",
    "codigo": "2334",
    "nombre": "TUBO LED SYLVANIA 24'' 9 W BLAN.",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2334",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 164.7,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6182",
    "codigo": "3461",
    "nombre": "TUBO LUMINOSO DE TRES LADOS 7X120CM45W BL",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3461",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 3 unidades en inventario físico"
    ],
    "precio": 1580.5,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6183",
    "codigo": "904",
    "nombre": "TUBO PVC 1\"X19` SDR26",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 904",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 47 unidades en inventario físico"
    ],
    "precio": 316.54,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 47,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6184",
    "codigo": "905",
    "nombre": "TUBO PVC 1/2\"X19` SDR26",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 905",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 33 unidades en inventario físico"
    ],
    "precio": 123.4,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 33,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6534",
    "codigo": "4142",
    "nombre": "CONECTOR HEMBRA",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4142",
      "Categoría ERP: Conectores",
      "Disponibilidad: 491 unidades en inventario físico"
    ],
    "precio": 18.03,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 491,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6535",
    "codigo": "4141",
    "nombre": "CONECTOR MACHO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4141",
      "Categoría ERP: Conectores",
      "Disponibilidad: 163 unidades en inventario físico"
    ],
    "precio": 18.03,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 163,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6545",
    "codigo": "365",
    "nombre": "CONECTOR B AZUL / BLANCO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 365",
      "Categoría ERP: Conectores",
      "Disponibilidad: 626 unidades en inventario físico"
    ],
    "precio": 8.64,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 626,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6546",
    "codigo": "2698",
    "nombre": "CONECTOR B.V 2/1",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2698",
      "Categoría ERP: Conectores",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 182.98,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6550",
    "codigo": "367",
    "nombre": "CONECTOR BX 1/2``RECTO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 367",
      "Categoría ERP: Conectores",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 32.78,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6551",
    "codigo": "368",
    "nombre": "CONECTOR BX 1`` RECTO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 368",
      "Categoría ERP: Conectores",
      "Disponibilidad: 48 unidades en inventario físico"
    ],
    "precio": 32.74,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 48,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6552",
    "codigo": "4286",
    "nombre": "CONECTOR BX 1-1/2``RECTO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4286",
      "Categoría ERP: Conectores",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 200.1,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6553",
    "codigo": "369",
    "nombre": "CONECTOR BX 3/4`` RECTO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 369",
      "Categoría ERP: Conectores",
      "Disponibilidad: 9 unidades en inventario físico"
    ],
    "precio": 43.49,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 9,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6559",
    "codigo": "3484",
    "nombre": "CONECTOR EMPALME 2/0 COBRE",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3484",
      "Categoría ERP: Conectores",
      "Disponibilidad: 39 unidades en inventario físico"
    ],
    "precio": 329.13,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 39,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6560",
    "codigo": "4641",
    "nombre": "CONECTOR EMPALME #12",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4641",
      "Categoría ERP: Conectores",
      "Disponibilidad: 20 unidades en inventario físico"
    ],
    "precio": 20.02,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 20,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6563",
    "codigo": "4626",
    "nombre": "CONECTOR EMPALME COLOR GEN",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4626",
      "Categoría ERP: Conectores",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 561.68,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6564",
    "codigo": "371",
    "nombre": "CONECTOR EMT 1",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 371",
      "Categoría ERP: Conectores",
      "Disponibilidad: 129 unidades en inventario físico"
    ],
    "precio": 34.04,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 129,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6565",
    "codigo": "372",
    "nombre": "CONECTOR EMT 1/2",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 372",
      "Categoría ERP: Conectores",
      "Disponibilidad: 114 unidades en inventario físico"
    ],
    "precio": 18.28,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 114,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6566",
    "codigo": "373",
    "nombre": "CONECTOR EMT 1-1/2",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 373",
      "Categoría ERP: Conectores",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 98.86,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6567",
    "codigo": "374",
    "nombre": "CONECTOR EMT 2",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 374",
      "Categoría ERP: Conectores",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 111.43,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6568",
    "codigo": "375",
    "nombre": "CONECTOR EMT 3/4",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 375",
      "Categoría ERP: Conectores",
      "Disponibilidad: 23 unidades en inventario físico"
    ],
    "precio": 29,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 23,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6569",
    "codigo": "376",
    "nombre": "CONECTOR EMT 3``",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 376",
      "Categoría ERP: Conectores",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 291.6,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6571",
    "codigo": "2663",
    "nombre": "CONECTOR GAL.HUB 1",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2663",
      "Categoría ERP: Conectores",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 357.12,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6574",
    "codigo": "2664",
    "nombre": "CONECTOR GAL.HUB 2",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2664",
      "Categoría ERP: Conectores",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 933.8,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6575",
    "codigo": "3844",
    "nombre": "CONECTOR GAL.HUB IMC 3/4",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3844",
      "Categoría ERP: Conectores",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 146.98,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6578",
    "codigo": "377",
    "nombre": "CONECTOR LQT 1\" CURVO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 377",
      "Categoría ERP: Conectores",
      "Disponibilidad: 26 unidades en inventario físico"
    ],
    "precio": 121.71,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 26,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6579",
    "codigo": "2389",
    "nombre": "CONECTOR LQT 1\" CURVO METALICO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2389",
      "Categoría ERP: Conectores",
      "Disponibilidad: 26 unidades en inventario físico"
    ],
    "precio": 121.1,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 26,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6580",
    "codigo": "378",
    "nombre": "CONECTOR LQT 1\" RECTO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 378",
      "Categoría ERP: Conectores",
      "Disponibilidad: 23 unidades en inventario físico"
    ],
    "precio": 94.45,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 23,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6581",
    "codigo": "386",
    "nombre": "CONECTOR LQT 1\"RECTO METAL",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 386",
      "Categoría ERP: Conectores",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 133.65,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6582",
    "codigo": "379",
    "nombre": "CONECTOR LQT 1/2 RECTO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 379",
      "Categoría ERP: Conectores",
      "Disponibilidad: 34 unidades en inventario físico"
    ],
    "precio": 19.11,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 34,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6583",
    "codigo": "380",
    "nombre": "CONECTOR LQT 1/2\" CURVO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 380",
      "Categoría ERP: Conectores",
      "Disponibilidad: 26 unidades en inventario físico"
    ],
    "precio": 105,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 26,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6584",
    "codigo": "1750",
    "nombre": "CONECTOR LQT 1/2\" CURVO METAL",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1750",
      "Categoría ERP: Conectores",
      "Disponibilidad: 10 unidades en inventario físico"
    ],
    "precio": 56.06,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 10,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6585",
    "codigo": "388",
    "nombre": "CONECTOR LQT 1-1/2\" RECTO METAL",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 388",
      "Categoría ERP: Conectores",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 416.56,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6586",
    "codigo": "381",
    "nombre": "CONECTOR LQT 1-1/2`` RECTO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 381",
      "Categoría ERP: Conectores",
      "Disponibilidad: 16 unidades en inventario físico"
    ],
    "precio": 147.84,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 16,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6587",
    "codigo": "382",
    "nombre": "CONECTOR LQT 1-1/2``CURVO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 382",
      "Categoría ERP: Conectores",
      "Disponibilidad: 4 unidades en inventario físico"
    ],
    "precio": 378,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 4,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6590",
    "codigo": "383",
    "nombre": "CONECTOR LQT 2`` RECTO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 383",
      "Categoría ERP: Conectores",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 241.27,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6591",
    "codigo": "384",
    "nombre": "CONECTOR LQT 3/4 CURVO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 384",
      "Categoría ERP: Conectores",
      "Disponibilidad: 14 unidades en inventario físico"
    ],
    "precio": 156.25,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 14,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6592",
    "codigo": "385",
    "nombre": "CONECTOR LQT 3/4 RECTO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 385",
      "Categoría ERP: Conectores",
      "Disponibilidad: 63 unidades en inventario físico"
    ],
    "precio": 59.16,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 63,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6593",
    "codigo": "387",
    "nombre": "CONECTOR LQT 3/4 RECTO METAL",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 387",
      "Categoría ERP: Conectores",
      "Disponibilidad: 20 unidades en inventario físico"
    ],
    "precio": 67.37,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 20,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6598",
    "codigo": "4348",
    "nombre": "CONECTOR P/ CABLE PG 21",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4348",
      "Categoría ERP: Conectores",
      "Disponibilidad: 57 unidades en inventario físico"
    ],
    "precio": 96.33,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 57,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6600",
    "codigo": "392",
    "nombre": "CONECTOR P/ CABLE 1 PG 25",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 392",
      "Categoría ERP: Conectores",
      "Disponibilidad: 80 unidades en inventario físico"
    ],
    "precio": 30,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 80,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6601",
    "codigo": "394",
    "nombre": "CONECTOR P/ CABLE 1/2 PG13.5",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 394",
      "Categoría ERP: Conectores",
      "Disponibilidad: 115 unidades en inventario físico"
    ],
    "precio": 27.43,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 115,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6602",
    "codigo": "393",
    "nombre": "CONECTOR P/ CABLE 3/4 PG19",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 393",
      "Categoría ERP: Conectores",
      "Disponibilidad: 3 unidades en inventario físico"
    ],
    "precio": 21.1,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6603",
    "codigo": "2903",
    "nombre": "CONECTOR P/ CABLE 3/8 PG 7",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2903",
      "Categoría ERP: Conectores",
      "Disponibilidad: 44 unidades en inventario físico"
    ],
    "precio": 36.63,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 44,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6606",
    "codigo": "4216",
    "nombre": "CONECTOR P/ CABLE PG 9",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4216",
      "Categoría ERP: Conectores",
      "Disponibilidad: 10 unidades en inventario físico"
    ],
    "precio": 35.52,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 10,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6613",
    "codigo": "397",
    "nombre": "CONECTOR P/ VARILLA TIERRA 5/8",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 397",
      "Categoría ERP: Conectores",
      "Disponibilidad: 4 unidades en inventario físico"
    ],
    "precio": 79.66,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 4,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6615",
    "codigo": "4424",
    "nombre": "CONECTOR P/BARRAS 25MM",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4424",
      "Categoría ERP: Conectores",
      "Disponibilidad: 3 unidades en inventario físico"
    ],
    "precio": 610.18,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6618",
    "codigo": "1175",
    "nombre": "CONECTOR PLAS P/ CABLE DE GOMA",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1175",
      "Categoría ERP: Conectores",
      "Disponibilidad: 6 unidades en inventario físico"
    ],
    "precio": 19.36,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 6,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6620",
    "codigo": "399",
    "nombre": "CONECTOR PULPO 4 SALIDA",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 399",
      "Categoría ERP: Conectores",
      "Disponibilidad: 6 unidades en inventario físico"
    ],
    "precio": 83.53,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 6,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6621",
    "codigo": "2031",
    "nombre": "CONECTOR PULPO 8 SALIDA",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2031",
      "Categoría ERP: Conectores",
      "Disponibilidad: 8 unidades en inventario físico"
    ],
    "precio": 141.74,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 8,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6623",
    "codigo": "3167",
    "nombre": "CONECTOR RJ11 TELEFONO",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3167",
      "Categoría ERP: Conectores",
      "Disponibilidad: 92 unidades en inventario físico"
    ],
    "precio": 2.46,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 92,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6624",
    "codigo": "400",
    "nombre": "CONECTOR RJ45",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 400",
      "Categoría ERP: Conectores",
      "Disponibilidad: 666 unidades en inventario físico"
    ],
    "precio": 13.71,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 666,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6625",
    "codigo": "2778",
    "nombre": "CONECTOR RJ45 CAT5E",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2778",
      "Categoría ERP: Conectores",
      "Disponibilidad: 189 unidades en inventario físico"
    ],
    "precio": 4.92,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 189,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6627",
    "codigo": "3813",
    "nombre": "CONECTOR SENCILLO #4 2/0 TRIPLE",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3813",
      "Categoría ERP: Conectores",
      "Disponibilidad: 40 unidades en inventario físico"
    ],
    "precio": 134.66,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 40,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6628",
    "codigo": "2857",
    "nombre": "CONECTOR SILLA 1/0",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2857",
      "Categoría ERP: Conectores",
      "Disponibilidad: 5 unidades en inventario físico"
    ],
    "precio": 124.79,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 5,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6635",
    "codigo": "2817",
    "nombre": "CONECTOR SILLA DOBLE 250 MCM",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2817",
      "Categoría ERP: Conectores",
      "Disponibilidad: 6 unidades en inventario físico"
    ],
    "precio": 400.78,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 6,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6636",
    "codigo": "1047",
    "nombre": "CONECTOR SILLA N.2",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1047",
      "Categoría ERP: Conectores",
      "Disponibilidad: 3 unidades en inventario físico"
    ],
    "precio": 26.05,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-6639",
    "codigo": "403",
    "nombre": "CONECTOR UF 1/2",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 403",
      "Categoría ERP: Conectores",
      "Disponibilidad: 30 unidades en inventario físico"
    ],
    "precio": 21.61,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 30,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6640",
    "codigo": "404",
    "nombre": "CONECTOR UF 3/4",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 404",
      "Categoría ERP: Conectores",
      "Disponibilidad: 70 unidades en inventario físico"
    ],
    "precio": 30.66,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 70,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-6644",
    "codigo": "1950",
    "nombre": "JUEGO DE CONECTORES 35MM2 SCHNEIDER",
    "marca": "WES",
    "categoria_id": "redes",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1950",
      "Categoría ERP: Conectores",
      "Disponibilidad: 10 unidades en inventario físico"
    ],
    "precio": 201.95,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 10,
    "imagen_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18254",
    "codigo": "113 - DH-PFA130-E",
    "nombre": "BASE DAHUA P/CAMARA DH-PFA130-E",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 113 - DH-PFA130-E",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 7 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 1065.62,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 7,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18256",
    "codigo": "2110 - DH-PFA13A-E",
    "nombre": "BASE DAHUA P/CAMARA DOMO DH-PFA13A-A",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2110 - DH-PFA13A-E",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 20 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 683.42,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 20,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-18257",
    "codigo": "4356",
    "nombre": "BASE DAHUA P/CAMARA C/TAPA PFA134",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4356",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 19 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 496.73,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 19,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-18261",
    "codigo": "4245",
    "nombre": "BASE P/CAMARA MONTURA PARED IPC32X",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4245",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 1478.54,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18263",
    "codigo": "3076",
    "nombre": "CAMARA 2MPX CRUISER PAN TILT P/EXTERIOR IMOU",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3076",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 5090.04,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18265",
    "codigo": "3098",
    "nombre": "CAMARA 2MPX VERSA FULL-COLOR, WIFI SPEA",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3098",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 3024.46,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18271",
    "codigo": "4320",
    "nombre": "CAMARA BULEET DAHUA 5MPX COOPER SDL 2.8MM",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4320",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 2 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 2146.86,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18273",
    "codigo": "995 - DH-HAC-B1A21N",
    "nombre": "CAMARA BULLET 2MPX- DAHUA 1080P COOPER- B1A21N PLASTICA",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 995 - DH-HAC-B1A21N",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 8 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 1201.2,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 8,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18274",
    "codigo": "4447",
    "nombre": "CAMARA BULLET 3MPX IMOU WIFI",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4447",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 3 unidades en inventario físico"
    ],
    "precio": 4137.24,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18275",
    "codigo": "1827",
    "nombre": "CAMARA BULLET DAHUA 2 MPX-2.8MM FULL COLOR HDCVI",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1827",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 1266.72,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18277",
    "codigo": "3722",
    "nombre": "CAMARA BULLET DAHUA 2MPX COOPER SDL 2.8MM",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3722",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 17 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 750,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 17,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-18282",
    "codigo": "2491",
    "nombre": "CAMARA BULLET DAHUA IP 2MPX",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2491",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 9 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 3363,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 9,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18288",
    "codigo": "3044",
    "nombre": "CAMARA BULLET DAHUA IP 5MPX 2.8 MM WIZSENSE SLD",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3044",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 3 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 8185.66,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18291",
    "codigo": "2029",
    "nombre": "CAMARA BULLET FERTEC IP 2MPX 3.6MM-ALARMA",
    "marca": "Fertec",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Fertec distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2029",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 5040,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18296",
    "codigo": "3946",
    "nombre": "CAMARA BULLET HIKVISION 2MPX COLORVU HIBRID SDL IP67 C/MIC",
    "marca": "Hikvision",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Hikvision distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3946",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 3 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf"
    ],
    "precio": 4296.91,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18297",
    "codigo": "3943",
    "nombre": "CAMARA BULLET HIKVISION 4MPX COLORVU SDL IP67 C/MIC",
    "marca": "Hikvision",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Hikvision distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3943",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf"
    ],
    "precio": 5930.68,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18308",
    "codigo": "2563",
    "nombre": "CAMARA BULLET IP 4MPX 2.8MM IR30M IP67",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2563",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 6438,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18316",
    "codigo": "3223-270883",
    "nombre": "CAMARA CRUISER 3MPX CON BOMBILLA WIFI UHD",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3223-270883",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 8 unidades en inventario físico"
    ],
    "precio": 2692.76,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 8,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18320",
    "codigo": "3225",
    "nombre": "CAMARA CRUISER RANGER DUAL 8MPX WIFI INTERIOR",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3225",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 4115.71,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18322",
    "codigo": "3936",
    "nombre": "CAMARA CUBO 3MPX WIFI SERIE CUBE DAHUA",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3936",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 2415.84,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18323",
    "codigo": "4561",
    "nombre": "CAMARA DOMO IP 2MPX SLD SERIE 1 C/AUDIO",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4561",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 5 unidades en inventario físico"
    ],
    "precio": 3134.55,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 5,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18324",
    "codigo": "3920 - DH-HAC-T1A21N",
    "nombre": "CAMARA DOMO 1080P COOPER 2MPX PLASTICA DAHUA",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3920 - DH-HAC-T1A21N",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 6 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 1001.62,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 6,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18325",
    "codigo": "1869",
    "nombre": "CAMARA DOMO DAHUA 1080P C/ MICROFONO HDCVI",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1869",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 4 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 4059.97,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 4,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18326",
    "codigo": "1021",
    "nombre": "CAMARA DOMO DAHUA 1080P COOPER 2.8MM PLAST",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1021",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 10 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 1031.06,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 10,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18328",
    "codigo": "3721 - DH-HAC-T1A21N-U-IL-A",
    "nombre": "CAMARA DOMO DAHUA 2MPX COOPER SDL 2.8MM",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3721 - DH-HAC-T1A21N-U-IL-A",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 64 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 750,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 64,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-18329",
    "codigo": "1826",
    "nombre": "CAMARA DOMO DAHUA 2MPX-2.8MM FULL COLOR HDCVI",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1826",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 1654.65,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18333",
    "codigo": "299 - 5H0967APAL41789",
    "nombre": "CAMARA DOMO DAHUA C/ MICROFONO HDCVI",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 299 - 5H0967APAL41789",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 6 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 1230.16,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 6,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18334",
    "codigo": "1407 - DH-HAC-HDW1200MN",
    "nombre": "CAMARA DOMO DAHUA HDCVI 2.8MM IR30M",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1407 - DH-HAC-HDW1200MN",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 7 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 2256.01,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 7,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18338",
    "codigo": "3589",
    "nombre": "CAMARA DOMO DAHUA IP 4MPX 2.8 MM WIZSENSE SLD",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3589",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 3904.5,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18340",
    "codigo": "2319",
    "nombre": "CAMARA DOMO DAHUA IP 4MPX PRO WIZCOLOR DAHUA",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2319",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 5 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 6555.4,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 5,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18341",
    "codigo": "4676",
    "nombre": "CAMARA DOMO DAHUA IP 4MPX SMART DUAL LIGHT",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4676",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 4 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 4285.13,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 4,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18349",
    "codigo": "2036",
    "nombre": "CAMARA DOMO HIKVISION C/ MICROFONO 5MPX",
    "marca": "Hikvision",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Hikvision distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2036",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 3 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf"
    ],
    "precio": 4200,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18351",
    "codigo": "300",
    "nombre": "CAMARA DOMO HIKVISION IP4MPX 2.8MM",
    "marca": "Hikvision",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Hikvision distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 300",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf"
    ],
    "precio": 5171.4,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18358",
    "codigo": "3711 - DH-IPC-HDW1239V-A-IL",
    "nombre": "CAMARA DOMO IP 2MP 2.8MM DAHUA SDL",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3711 - DH-IPC-HDW1239V-A-IL",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 20 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 3214.66,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 20,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-18359",
    "codigo": "4211",
    "nombre": "CAMARA DOMO IP 2MPX PRO WIZCOLOR",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4211",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 5740,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18369",
    "codigo": "2565 -",
    "nombre": "CAMARA DOMO IP DAHUA 2 MPX 2.8MM IP67 IK10 IR30",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2565 -",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 10 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 5718.69,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 10,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18376",
    "codigo": "1939 - HD-HAC-T2A11N",
    "nombre": "CAMARA DOMO/BULLET DAHUA 2.8MM 720P",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1939 - HD-HAC-T2A11N",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 9 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 1691,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 9,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18377",
    "codigo": "2215",
    "nombre": "CAMARA FISHEYE DAHUA HDCVI 5MPX WDR STARLIGHT",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2215",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 6608,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18380",
    "codigo": "4691",
    "nombre": "CAMARA IP 4MPX DOMO IK10 SERIE 1",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4691",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 12 unidades en inventario físico"
    ],
    "precio": 4968.35,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 12,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-18381",
    "codigo": "3460",
    "nombre": "CAMARA IP BULLET 4MP 2.8MM ENTRY FULLCOLOR M DAHUA",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3460",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 10 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 5081.67,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 10,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18383",
    "codigo": "4635",
    "nombre": "CAMARA IP DOMO 2MP 2.8MM DAHUA IR30",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4635",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 3 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 2929.02,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18384",
    "codigo": "3449",
    "nombre": "CAMARA IP DOMO 2MP 2.8MM ENTRY DAHUA IK10",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3449",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 8 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 3506.09,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 8,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18393",
    "codigo": "3077",
    "nombre": "CAMARA PT CRUISER 2 5MPX FULL-COLOR P/EX",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3077",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 5040.15,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18394",
    "codigo": "3061 - IPC-S2EN-3R1S",
    "nombre": "CAMARA IMOU PT RANGER PRO 2 WIFI 3MPX MICRO SD",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3061 - IPC-S2EN-3R1S",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 3 unidades en inventario físico"
    ],
    "precio": 2477.03,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18397",
    "codigo": "2169",
    "nombre": "CAMARA TIPO BOMBILLO WIFI MIC + ADIO + LUZ",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2169",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 2814,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18398",
    "codigo": "3945",
    "nombre": "CAMARA TURRET 2MPX COLORVU C/MIC IP67 HIKVISION",
    "marca": "Hikvision",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Hikvision distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3945",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 4 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf"
    ],
    "precio": 6624.58,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 4,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18399",
    "codigo": "3947",
    "nombre": "CAMARA TURRET 4MPX COLORVU HIBRID LIGHT IP67 C/MIC",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3947",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 4725.85,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18402",
    "codigo": "2216",
    "nombre": "CAMARA WIFI EZVIZ 1080P FIJA",
    "marca": "EZVIZ",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional EZVIZ distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2216",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 2310,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18403",
    "codigo": "2217",
    "nombre": "CAMARA WIFI EZVIZ PTZ INTERIOR",
    "marca": "EZVIZ",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional EZVIZ distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2217",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 2380,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18407",
    "codigo": "398",
    "nombre": "CONECTOR POE P/ CAMARA IP",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 398",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 9 unidades en inventario físico"
    ],
    "precio": 421.89,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 9,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18410",
    "codigo": "490",
    "nombre": "FUENTE 12V 3A P/ CAMARA",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 490",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 6 unidades en inventario físico"
    ],
    "precio": 748.33,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 6,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18413",
    "codigo": "4623",
    "nombre": "LETRERO P/CAMARAS",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4623",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 3 unidades en inventario físico"
    ],
    "precio": 346.92,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18416",
    "codigo": "2268",
    "nombre": "SENSOR MOV + CAMARA DSC PG9934PI INALAMBRICO",
    "marca": "WES",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2268",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 8815.72,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-21415",
    "codigo": "2629",
    "nombre": "MEMORIA MICRO SD 32GB CLASE 10 DAHUA",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2629",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 9 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 325,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 9,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-27936",
    "codigo": "3745",
    "nombre": "ALAMBRE DE ACOMETIDA 6/3 COBRE",
    "marca": "WES",
    "categoria_id": "cables",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3745",
      "Categoría ERP: Cables eléctricos",
      "Disponibilidad: 16 unidades en inventario físico"
    ],
    "precio": 333.42,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 16,
    "imagen_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-34064",
    "codigo": "ODOO-34064",
    "nombre": "MINI UPS V2",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: ODOO-34064",
      "Categoría ERP: Baterías",
      "Disponibilidad: 4 unidades en inventario físico"
    ],
    "precio": 1,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 4,
    "imagen_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-34077",
    "codigo": "ODOO-34077",
    "nombre": "PATCH CORD DAHUA CAT6 1FT",
    "marca": "Dahua",
    "categoria_id": "camaras",
    "descripcion": "Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: ODOO-34077",
      "Categoría ERP: Camaras y Videovigilancia",
      "Disponibilidad: 30 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"
    ],
    "precio": 1,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 30,
    "imagen_url": "https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-34079",
    "codigo": "3-18-4683",
    "nombre": "CAJA DE BREAKER 24 CIRC EMP",
    "marca": "WES",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3-18-4683",
      "Categoría ERP: Accesorios Electricos",
      "Disponibilidad: 2 unidades en inventario físico"
    ],
    "precio": 1,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-34095",
    "codigo": "ODOO-34095",
    "nombre": "TERMINAL  OJO #2",
    "marca": "WES",
    "categoria_id": "energia",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: ODOO-34095",
      "Categoría ERP: Baterías",
      "Disponibilidad: 19 unidades en inventario físico"
    ],
    "precio": 125,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 19,
    "imagen_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
    "destacado": true,
    "activo": true
  },
  {
    "id": "odoo-34096",
    "codigo": "ODOO-34096",
    "nombre": "CAJA BREAKER EMP 24 CIRCUITOS CISMA",
    "marca": "WES",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: ODOO-34096",
      "Categoría ERP: Accesorios Electricos",
      "Disponibilidad: 4 unidades en inventario físico"
    ],
    "precio": 500,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 4,
    "imagen_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-34127",
    "codigo": "ODOO-34127",
    "nombre": "CONTACTOR 110V 9A",
    "marca": "WES",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: ODOO-34127",
      "Categoría ERP: Accesorios Electricos",
      "Disponibilidad: 1 unidades en inventario físico"
    ],
    "precio": 1,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 1,
    "imagen_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-34195",
    "codigo": "FTL-BR600U",
    "nombre": "BRACKET DE PIVOTE P/PUERTA DE CRISTAL FERTEC",
    "marca": "Fertec",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional Fertec distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: FTL-BR600U",
      "Categoría ERP: Alarmas y Control de Acceso",
      "Disponibilidad: 4 unidades en inventario físico"
    ],
    "precio": 900,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 4,
    "imagen_url": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-28119",
    "codigo": "2399",
    "nombre": "BASE MOTOR OPERADOR CAME 1000KG",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2399",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 1275,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-31568",
    "codigo": "415",
    "nombre": "CONTROL OPERADOR CAME",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 415",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01358M04.pdf"
    ],
    "precio": 1765.65,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-31569",
    "codigo": "4385",
    "nombre": "CONTROL OPERADOR CAME 2 BOTONES CAME",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4385",
      "Categoría ERP: Otros",
      "Disponibilidad: 3 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01358M04.pdf"
    ],
    "precio": 1807.5,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 3,
    "imagen_url": "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-31570",
    "codigo": "1183",
    "nombre": "CONTROL OPERADOR CAME DIGITAL AZUL 4 BOTONES",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1183",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01358M04.pdf"
    ],
    "precio": 1674,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-31571",
    "codigo": "1757",
    "nombre": "CONTROL OPERADOR CAME DIGITAL AZUL COPIA",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1757",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01358M04.pdf"
    ],
    "precio": 1395,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-31572",
    "codigo": "3152",
    "nombre": "CONTROL OPERADOR CAME DIGITAL NEGRO 4 BOTONES",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3152",
      "Categoría ERP: Otros",
      "Disponibilidad: 2 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01358M04.pdf"
    ],
    "precio": 1827,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-33659",
    "codigo": "4303",
    "nombre": "FINAL DE CARRERA CAME",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4303",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 2100,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-33665",
    "codigo": "1373",
    "nombre": "FOTOCELDA CAME ORIGINAL",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1373",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 6608,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18519",
    "codigo": "2920",
    "nombre": "INSPECCION Y CONFIGURACION DE MOTOR CAME.",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2920",
      "Categoría ERP: Mano de Obra",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 500,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-21467",
    "codigo": "3797",
    "nombre": "MOTOR 2000KG CAME",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3797",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 500,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-21468",
    "codigo": "1390",
    "nombre": "MOTOR CAME 1000KG USO INTENSIVO",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1390",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 41330.76,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-21469",
    "codigo": "603",
    "nombre": "MOTOR CAME 1800KG",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 603",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA00943M04.pdf"
    ],
    "precio": 66216,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-21470",
    "codigo": "2009",
    "nombre": "MOTOR CAME 600KG USO INTENSIVO",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 2009",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 32735.08,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-21471",
    "codigo": "604",
    "nombre": "MOTOR CAME 800KG",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 604",
      "Categoría ERP: Otros",
      "Disponibilidad: 2 unidades en inventario físico",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 37445.26,
    "moneda": "DOP",
    "disponibilidad": "Disponible",
    "stock": 2,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-21472",
    "codigo": "1765",
    "nombre": "MOTOR CAME 800KG REFULL",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1765",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 15000,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-34115",
    "codigo": "COSTO VEF.",
    "nombre": "PORTEZUELA DESBLOQUEO MOTOR CAME BX 800KG",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: COSTO VEF.",
      "Categoría ERP: Automatización y Domotica",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 4239.96,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-25184",
    "codigo": "1919",
    "nombre": "RELAY 12VDC 10A P/ MOTOR CAME",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1919",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 270,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-25186",
    "codigo": "1884",
    "nombre": "RELAY 24VDC 5A 8 PIN 1CONTAC P/CAME",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 1884",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 504.74,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-18539",
    "codigo": "3210",
    "nombre": "REPARACION DE TARJETA DE MOTOR CAME 1000KG",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 3210",
      "Categoría ERP: Mano de Obra",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01128M04.pdf"
    ],
    "precio": 500,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  },
  {
    "id": "odoo-26418",
    "codigo": "4016",
    "nombre": "TARJETA MOTOR CAME 1800KG ZBX CAME DIGITAL",
    "marca": "CAME",
    "categoria_id": "acceso",
    "descripcion": "Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.",
    "caracteristicas": [
      "Código SKU / Odoo: 4016",
      "Categoría ERP: Otros",
      "Disponibilidad: Disponible bajo pedido",
      "Manual de Instalación disponible",
      "manual_url:https://www.came.com/global/sites/default/files/2021-04/FA00943M04.pdf"
    ],
    "precio": 19430.2,
    "moneda": "DOP",
    "disponibilidad": "Agotado",
    "stock": 0,
    "imagen_url": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "destacado": false,
    "activo": true
  }
];

// Almacenamiento local para permitir gestión dinámica desde el panel admin
const StorageService = {
  getProducts: function() {
    const versionKey = "wes_products_v3";
    const saved = localStorage.getItem(versionKey);
    if (!saved) {
      localStorage.setItem(versionKey, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts: function(products) {
    localStorage.setItem("wes_products_v3", JSON.stringify(products));
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
    const defaultSettings = {
      name: "Warn Electrical Services, SRL (WES)",
      slogan: "Tecnología, seguridad y soporte a tu alcance",
      rnc: "1-31-89326-4",
      address: "Autopista Ramón Cáceres, Plaza Megatone, Moca, Provincia Espaillat, República Dominicana",
      phone: "(849) 207-5474",
      whatsapp: "18492075474",
      whatsappDisplay: "(849) 207-5474",
      emailGeneral: "wes.inform@gmail.com",
      emailSupport: "wes.inform@gmail.com",
      scheduleWeek: "Lunes a Viernes: 7:30 AM – 6:00 PM (Almuerzo 12:00 PM – 2:00 PM)",
      scheduleSat: "Sábados: 8:00 AM – 1:00 PM",
      instagram: "@wes.inform",
      facebook: "Warn Electrical Services SRL",
      mapsUrl: "https://maps.app.goo.gl/KMosxdkCGwXxqFjC9",
      googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.644026857189!2d-70.53322972412808!3d19.387725481881775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1d15627d6e5d1%3A0x6786e017c4c3a285!2sWES!5e0!3m2!1ses!2sdo!4v1710000000000!5m2!1ses!2sdo"
    };
    const saved = localStorage.getItem("wes_company_settings");
    if (!saved) {
      localStorage.setItem("wes_company_settings", JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    try {
      const parsed = JSON.parse(saved);
      // Forzar actualización si tenía el número anterior
      if (!parsed.phone || parsed.phone.includes("578-4320")) {
        localStorage.setItem("wes_company_settings", JSON.stringify(defaultSettings));
        return defaultSettings;
      }
      return parsed;
    } catch (e) {
      return defaultSettings;
    }
  },

  saveCompanySettings: function(settings) {
    localStorage.setItem("wes_company_settings", JSON.stringify(settings));
  }
};
