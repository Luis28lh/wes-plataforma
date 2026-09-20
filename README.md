# TALLER WEB — Repositorio Maestro de Proyectos
### Programa: El Profesional Potenciado por Tecnología · Estándar AIDET v2.0

Este repositorio de trabajo contiene los proyectos desarrollados de manera modular e independiente, organizados cada uno en su propia carpeta:

---

## 📁 Estructura del Espacio de Trabajo

```
TALLER WEB/
├── proyecto-wes/                           <-- Proyecto 1: Plataforma Web WES
│   ├── index.html                          (Portal público de clientes)
│   ├── admin.html                          (Portal administrativo autónomo)
│   ├── server.js                           (Servidor local - Puerto 3000)
│   ├── assets/                             (Recursos multimedia corporativos)
│   ├── js/                                 (Lógica de catálogo, cotizaciones y soporte)
│   ├── backend/                            (Google Apps Script y despliegue)
│   └── README.md                           (Documentación completa de WES)
│
├── asistente-reuniones/                    <-- Proyecto 2: Asistente Inteligente de Reuniones
│   ├── index.html                          (Portal web del asistente AIR)
│   ├── css/styles.css                      (Estilos en paleta de grises neutros)
│   ├── js/app.js                           (Web Audio API, ingesta IA, minutas, PDF y Chat)
│   ├── server.js                           (Servidor local - Puerto 3001)
│   └── assets/icons/logo-buho.jpg          (Ícono de software del búho centinela)
│
├── docs/                                   <-- Guías y estándares técnicos
│   ├── AIDET_GUIA_DESPLIEGUE_Y_PUBLICACION_WEB_v2_FINAL.md
│   └── ASISTENTE_REUNIONES_README.md
│
└── PROYECTO_SISTEMA_ASISTENTE_REUNIONES.md <-- Especificación maestra del nuevo proyecto
```

---

## 🚀 Proyectos Disponibles

### 1. [Proyecto WES](./proyecto-wes/) — Warn Electrical Services, SRL
Plataforma empresarial de comercio electrónico, catálogo de soluciones eléctricas/seguridad y portal administrativo desacoplado.
* **Carpeta:** `proyecto-wes/`
* **Ejecución local:**
  ```powershell
  cd "proyecto-wes"
  node server.js
  ```
* **Acceso:** `http://localhost:3006/` y `/admin`

---

### 2. [Asistente de Reuniones](./asistente-reuniones/) — AIR (Assistant for Intelligent Records)
Sistema web para grabación ambiental en tiempo real, carga de audios, transcripción y generación automática de minutas, actas formales y matrices de acuerdos con IA (Gemini).
* **Carpeta:** `asistente-reuniones/`
* **Identidad Visual:** Diseño minimalista y ejecutivo con **paleta de grises neutros** (Slate / Zinc) y el **búho centinela como ícono sutil de software**.
* **Ejecución local:**
  ```powershell
  cd "asistente-reuniones"
  node server.js
  ```
* **Acceso:** `http://localhost:3005/`
