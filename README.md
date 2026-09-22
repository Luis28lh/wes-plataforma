# TALLER WEB — Repositorio Maestro de Proyectos
### Programa: El Profesional Potenciado por Tecnología · Estándar AIDET v2.0

Este repositorio de trabajo contiene los proyectos desarrollados de manera modular e independiente, organizados cada uno en su propia carpeta:

---

## 🌐 Estándar Mandatorio: Publicación Remota y Versionado Continuo (Política Mobile-First)
> **Principio de Disponibilidad Remota:** Dado que la supervisión, administración y pruebas operativas se realizan frecuentemente de forma remota o desde dispositivos móviles (fuera de la red local):
> 1. **Versionado Inmediato a GitHub:** Todo desarrollo, módulo funcional o cambio realizado debe consolidarse de inmediato en Git y enviarse (`git push`) al repositorio remoto en GitHub (`Luis28lh`).
> 2. **Publicación y Acceso desde Fuera:** Cada proyecto debe desplegarse y mantenerse accesible mediante una URL pública oficial (GitHub Pages / Google Apps Script Web App / Cloud Hosting), permitiendo al usuario abrirlo, probarlo e interactuar desde su teléfono celular o computadora desde cualquier lugar del mundo sin depender de `localhost`.

---

## 📁 Estructura del Espacio de Trabajo

```
TALLER WEB/
├── plaza-megaton/                          <-- Proyecto 3: Sistema de Gestión – Plaza Megatón
│   ├── server.js                           (Servidor local - Puerto 3007)
│   ├── public/                             (Portal público, registro QR y admin)
│   ├── database/                           (Catálogo maestro y persistencia)
│   ├── services/                           (Patrón repositorio, Google Drive/Sheets y correo)
│   ├── google-apps-script/                 (Script desplegable para Google Sheets)
│   └── README.md                           (Documentación completa de Plaza Megatón)
│
├── proyecto-wes/                           <-- Proyecto 1: Plataforma Web WES
│   ├── index.html                          (Portal público de clientes)
│   ├── admin.html                          (Portal administrativo autónomo)
│   ├── server.js                           (Servidor local - Puerto 3006)
│   ├── assets/                             (Recursos multimedia corporativos)
│   ├── js/                                 (Lógica de catálogo, cotizaciones y soporte)
│   ├── backend/                            (Google Apps Script y despliegue)
│   └── README.md                           (Documentación completa de WES)
│
├── asistente-reuniones/                    <-- Proyecto 2: Asistente Inteligente de Reuniones
│   ├── index.html                          (Portal web del asistente AIR)
│   ├── css/styles.css                      (Estilos en paleta de grises neutros)
│   ├── js/app.js                           (Web Audio API, ingesta IA, minutas, PDF y Chat)
│   ├── server.js                           (Servidor local - Puerto 3005)
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

### 1. [Plaza Megatón](./plaza-megaton/) — Sistema de Gestión Inmobiliaria
Plataforma móvil-first para gestión de cubículos, registro QR, solicitudes/reclamaciones (CL-xxx), pagos (PG-xxx), notificaciones automáticas por correo y panel administrativo (/admin).
* **Carpeta:** `plaza-megaton/`
* **Ejecución local:**
  ```powershell
  cd "plaza-megaton"
  npm install
  node server.js
  ```
* **Acceso Local:** `http://localhost:3007/` y `/admin.html` (PIN: `megaton2026`)
* **🌐 Acceso Público en Vivo (GitHub Pages):**
  - **Portal General:** [https://luis28lh.github.io/wes-plataforma/plaza-megaton/index.html](https://luis28lh.github.io/wes-plataforma/plaza-megaton/index.html)
  - **Formulario QR Directo:** [https://luis28lh.github.io/wes-plataforma/plaza-megaton/registro.html](https://luis28lh.github.io/wes-plataforma/plaza-megaton/registro.html)
  - **Panel Administrativo:** [https://luis28lh.github.io/wes-plataforma/plaza-megaton/admin.html](https://luis28lh.github.io/wes-plataforma/plaza-megaton/admin.html) *(PIN: `megaton2026`)*

---

### 2. [Proyecto WES](./proyecto-wes/) — Warn Electrical Services, SRL
Plataforma empresarial de comercio electrónico, catálogo de soluciones eléctricas/seguridad y portal administrativo desacoplado.
* **Carpeta:** `proyecto-wes/`
* **Ejecución local:**
  ```powershell
  cd "proyecto-wes"
  node server.js
  ```
* **Acceso:** `http://localhost:3006/` y `/admin`

---

### 3. [Asistente de Reuniones](./asistente-reuniones/) — AIR (Assistant for Intelligent Records)
Sistema web para grabación ambiental en tiempo real, carga de audios, transcripción y generación automática de minutas, actas formales y matrices de acuerdos con IA (Gemini).
* **Carpeta:** `asistente-reuniones/`
* **Identidad Visual:** Diseño minimalista y ejecutivo con **paleta de grises neutros** (Slate / Zinc) y el **búho centinela como ícono sutil de software**.
* **Ejecución local:**
  ```powershell
  cd "asistente-reuniones"
  node server.js
  ```
* **Acceso:** `http://localhost:3005/`
