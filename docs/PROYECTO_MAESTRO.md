# PROYECTO MAESTRO - PLATAFORMA OFICIAL WARN ELECTRICAL SERVICES (WES)

> Documento vivo de fuente de verdad. Leer antes de cada tarea y actualizar al terminar cada cambio.  
> Estados permitidos: IMPLEMENTADO | EN DESARROLLO | PENDIENTE | BLOQUEADO | POR CONFIRMAR.

---

## 1. Ficha general

| Campo | Información |
|---|---|
| **Nombre del proyecto** | Plataforma Integral Warn Electrical Services, SRL (WES) |
| **Descripción y propósito** | Plataforma web comercial, catálogo digital, sistema de cotizaciones, gestión de soporte técnico (KDS) y asistente virtual de IA (Sofía) con backend en Google Apps Script y hoja de cálculo segura. |
| **Propietario / organización** | Ing. Luis Miguel Lizardo / Warn Electrical Services, SRL (WES) |
| **Sede física** | Autopista Ramón Cáceres, Moca, Provincia Espaillat, República Dominicana |
| **Fecha de inicio** | 2017 (operaciones WES) / Septiembre 2026 (fase plataforma digital) |
| **Última actualización** | 2026-11-09 19:25 (GMT-4) |
| **Repositorio GitHub (privado)** | `https://github.com/Luis28lh/wes-plataforma.git` (remoto `origin`) y `https://github.com/Luis28lh/wes-plataforma-v1.git` (remoto `v1`) |
| **Rama principal / política de cambios** | `main` (despliegue continuo a producción). Commits atómicos con verificación previa obligatoria. |
| **Estado general** | **OPERATIVO EN PRODUCCIÓN** |
| **Entorno actual** | Producción en dominio personalizado CDN + Backend Google Apps Script (Versión #56) |

---

## 2. Objetivo y alcance

**Problema que resuelve:**  
Digitalizar integralmente los canales de atención comercial y técnica de WES en República Dominicana: catálogo estructurado de productos (seguridad electrónica, portones, inversores, cables, control de acceso), generación de solicitudes de cotización formales, seguimiento de tickets de reparación técnica en taller y atención interactiva 24/7 mediante el asistente virtual Sofía.

**Usuarios y roles:**
- **Público / Clientes:** Navegación por catálogo, carrito de cotizaciones, consulta de tickets y chat con Sofía.
- **Clientes Registrados (`cliente`):** Inicio de sesión con OTP, historial de pedidos y solicitudes.
- **Técnicos / Operaciones (`tecnico`):** Gestión de tickets, reparaciones, diagnóstico y entrega en el tablero de servicio técnico.
- **Administrador / Propietario (`admin` / `propietario`):** Control total: inventario, precios, configuración de IA, prompts, reglas de Sofía, base de conocimientos y auditoría.

**Incluido en el alcance:**
- Tienda web PWA responsiva optimizada para móvil y escritorio.
- Asistente Sofía con conexión segura a modelos Google Gemini (backend Apps Script).
- Base de datos relacional/tabular en Google Sheets (`Cotizaciones`, `Soporte_Tecnico`, `Clientes`, `Config_IA`, `Conocimiento_Sofia`, `Auditoria`).
- Tablero KDS para recepción y gestión de equipos en taller.
- Panel administrativo con control de reglas y catálogo.

**Fuera del alcance actual:**
- Pasarela de cobro directo con tarjeta de crédito en línea (las cotizaciones se gestionan vía transferencia, efectivo o crédito comercial con el equipo humano).

**Criterios de éxito:**
- Disponibilidad 99.9%, tiempos de respuesta ágiles, sin inventar precios o existencias, cumplimiento estricto del protocolo de privacidad y seguridad sin exponer secretos en el frontend.

---

## 3. Estado operativo actual

### Lo que SÍ funciona y se ha verificado:
- **Catálogo de Productos y Carrito:** Más de 100 productos clasificados en categorías (cámaras, cables, motores, inversores, control de acceso).
- **Asistente Virtual Sofía (Gemini AI):**
  - Backend seguro en Google Apps Script (`action: 'query_gemini_chat'`), versión #56.
  - Conmutación automática de modelos (`gemini-2.0-flash` como primario, cascada a `gemini-3.5-flash` y `gemini-3.5-flash-lite`).
  - Timeout en frontend ampliado a 35 segundos para evitar cortes por latencia en horas pico.
  - Reglas estrictas de brevedad (máximo 2 frases y 40 palabras en consultas regulares).
  - Regla estricta de agendamiento humano: Sofía nunca confirma citas ni visitas técnicas de forma autónoma.
  - Interfaz gráfica moderna con la foto aprobada de Sofía, indicador animado de escritura sin icono de robot y eliminación del rótulo repetitivo "IA".
- **Sección de Conocimiento y Respuestas de Sofía:**
  - Registro de doble vía: configurable desde el panel de administración (`admin.html`) y registrable mediante acciones autorizadas desde el entorno de desarrollo.
  - 8 entradas activas en servidor central:
    1. Garantía oficial de motores CAME (2 años).
    2. Venta de cables de red Leviton (consulta previa de categoría Cat5e/Cat6 y catálogo).
    3. Proyectos estructurados de cámaras IP (referencia US$250-US$320 por cámara para mínimo 5 unidades).
    4. Servicio técnico rápido o de emergencia (RD$1,500 - RD$2,000 según avería).
    5. Cerradura magnética completa para una puerta (aprox. RD$18,000 instalada).
    6. Motor CAME 800 para portón residencial (aprox. US$850 según características del portón).
    7. Política de moneda y tasa comercial de referencia (RD$61 x US$1).
    8. Reglas de contención comercial: cuando falte información confirmada de producto o precio, pedir cantidad o presupuesto y derivar a ventas.
- **Autenticación y Seguridad (RBAC):** Login con correo/contraseña, verificación por código OTP de 6 dígitos enviado por Gmail corporativo, aislamiento estricto de roles.
- **Servicio Técnico KDS:** Registro de órdenes, generación de código `SRV-YYYY-XXXX`, estados de reparación y consulta pública mediante código o teléfono.

### Limitaciones o errores conocidos:
- El modelo de IA puede experimentar picos de latencia en la red de Google; mitigado con timeout de 35s y cascada multi-modelo.

**Última versión / commit verificado:**  
`f40ef1a` (sincronizado en `origin/main` y `v1/main`).

---

## 4. Arquitectura y tecnología

| Componente | Tecnología / servicio | Función | Estado |
|---|---|---|---|
| **Frontend** | HTML5, Tailwind CSS, JavaScript Vanilla (ES6+), FontAwesome 6, PWA Service Worker | Interfaz pública y paneles | IMPLEMENTADO |
| **Backend API** | Google Apps Script (Web App REST JSON/POST) | Lógica de negocio, correo, base de datos y puente a IA | IMPLEMENTADO (v56) |
| **Persistencia** | Google Sheets (`Base_Datos_WES_Oficial`) | Base de datos relacional y hojas operativas | IMPLEMENTADO |
| **Inteligencia Artificial** | Google Gemini API (`gemini-2.0-flash` / `gemini-3.5-flash`) | Motor conversacional de Sofía | IMPLEMENTADO |
| **Hosting y CDN** | GitHub Pages Privado + Custom Domain Cloudflare/DNS | Entrega rápida con SSL | IMPLEMENTADO |
| **Mailing** | Google Cloud OAuth + `GmailApp` | Envío de OTP y notificaciones | IMPLEMENTADO |

---

## 5. Funciones por módulo

| Módulo | Función | Estado | Evidencia / ruta / notas |
|---|---|---|---|
| **Catálogo** | Visualización, búsqueda, filtrado y ficha técnica de productos | IMPLEMENTADO | `js/products.js`, `index.html` |
| **Cotizador** | Carrito flotante, cálculo de totales y despacho a backend | IMPLEMENTADO | `js/app.js`, hoja `Cotizaciones` |
| **Autenticación** | Login, registro OTP, recuperación de contraseña y perfiles | IMPLEMENTADO | `js/admin_auth.js`, `js/user_auth.js` |
| **Chat Sofía** | Asistente IA, consulta de tickets, asesoría técnica y cotizaciones | IMPLEMENTADO | `js/chat_cliente.js`, `proyecto-wes/Code.js` |
| **Gestión IA** | Panel de control de prompts, modelos, API key y base de conocimientos | IMPLEMENTADO | `js/admin_app.js`, hoja `Config_IA` y `Conocimiento_Sofia` |
| **Soporte KDS** | Recepción de equipos, diagnóstico, cotización de reparación y entrega | IMPLEMENTADO | `servicio-tecnico.html`, `js/servicio_tecnico.js` |

---

## 6. Datos e integraciones

**Hojas de cálculo en el backend:**
- `Cotizaciones`: Registro de solicitudes entrantes de clientes.
- `Soporte_Tecnico`: Tickets de servicio, diagnósticos y costos.
- `Clientes`: Base de usuarios con roles y fecha de verificación.
- `Config_IA`: Clave API, modelo activo, prompt maestro y temperatura.
- `Conocimiento_Sofia`: Entradas de preguntas frecuentes, referencias comerciales, condiciones y estado (activo/inactivo).
- `Auditoria`: Trazabilidad de accesos y modificaciones administrativas.

**Reglas de negocio relevantes:**
- Precios de proyectos expresados originalmente en dólares (US$). Tasa de referencia interna: RD$61 x US$1 sujeta a validación.
- Consultas regulares de Sofía: máximo 2 frases y 40 palabras.
- Si falta información técnica o precio: nunca inventar; solicitar cantidad o presupuesto del cliente.

---

## 7. Configuración y despliegue

**URLs no sensibles:**
- Web Pública: `https://web.warnelectricalservices.com/`
- Panel Administrador: `https://web.warnelectricalservices.com/admin.html`
- Tablero Técnico: `https://web.warnelectricalservices.com/servicio-tecnico.html`
- Web App Apps Script: `https://script.google.com/macros/s/AKfycbyoN8TnzeN9Cg2X44YEt6KeQULahvG0DrEXP5m4HyLvJFs475maMjVrwjW8t-IRVIQ_OQ/exec`

**Variables y secretos protegidos:**
- `WES_GEMINI_API_KEY`: Almacenada en `ScriptProperties` de Google Apps Script. Nunca expuesta en el cliente.
- `WES_ADMIN_SECRET_TOKEN`: Token de autenticación de llamadas administrativas hacia Apps Script.

**Procedimiento de despliegue:**
1. Cambios en frontend: Commit y push a `main` en `origin` y `v1`.
2. Actualización de control de caché en `index.html` (`?v=YYYYMMDDHHmm`).
3. Cambios en backend: Despliegue con nueva versión mediante `deploy_apps_script.js`.

---

## 8. Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto |
|---|---|---|---|
| **2026-11-05** | Backend central para Gemini en Apps Script | Proteger API key y centralizar auditoría | Tráfico de IA 100% seguro sin exponer tokens |
| **2026-11-08** | Rediseño premium de Sofía y avatar oficial | Sustituir icono de robot por retrato corporativo aprobado | Identidad visual humana y coherente |
| **2026-11-08** | Control estricto de brevedad en servidor | Sofía extendía respuestas y repetía saludos | Respuestas directas de máximo 2 frases y 40 palabras |
| **2026-11-08** | Prohibición estricta de agendamiento automático | Sofía confirmaba citas sin validar calendario humano | Se exige recolección de datos para validación humana previa |
| **2026-11-08** | Módulo "Conocimiento y respuestas de Sofía" | Permitir registrar FAQs y reglas sin editar el prompt maestro | Doble vía de registro con historial y versionado |
| **2026-11-09** | Aumento de timeout a 35s y cascada de modelos | Evitar error "no pudo procesar respuesta" por latencia de red | Estabilidad total en consultas de catálogo y soporte |
| **2026-11-09** | Incorporación formal del Kit de Documentación Maestra | Estandarizar gobernanza, trazabilidad y control de versiones | `AGENTS.md` y `docs/PROYECTO_MAESTRO.md` como fuente de verdad permanente |

---

## 9. Plan y tareas pendientes

| ID | Prioridad | Tarea | Estado | Dependencia / siguiente acción |
|---|---|---|---|---|
| **TSK-01** | Alta | Mantener actualizada la base de conocimientos según nuevas políticas de WES | EN DESARROLLO | A demanda del propietario |
| **TSK-02** | Media | Monitoreo continuo de tiempos de respuesta del endpoint de IA en Apps Script | IMPLEMENTADO | Vigilancia de latencia en horas pico |
| **TSK-03** | Media | Incorporación gradual de nuevos productos al catálogo digital estructurado | PENDIENTE | Nuevos lotes de inventario WES |
| **TSK-04** | Baja | Optimización de imágenes en formato WebP para tiempos de carga ultrarrápidos | PENDIENTE | Mantenimiento periódico de assets |
