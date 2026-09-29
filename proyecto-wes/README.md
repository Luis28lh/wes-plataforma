# WARN ELECTRICAL SERVICES, SRL (WES)
## Plataforma Web Empresarial, Catálogo Digital, Centro de Soporte y Portal Administrativo Autónomo
### Estándar AIDET v2.0 — El Profesional Potenciado por Tecnología

---

## 1. Resumen Ejecutivo de la Solución

Esta solución implementa la plataforma web empresarial para **Warn Electrical Services, SRL (WES)**, diseñada y construida con una división arquitectónica estricta entre dos espacios desacoplados:
1. **Portal Público para Clientes y Visitantes (`index.html`)**: accesible en `http://localhost:3000/`.
2. **Portal Administrativo Autónomo y Privado (`admin.html`)**: accesible exclusivamente en `http://localhost:3000/admin`.

### Datos Corporativos Oficiales:
* **Razón Social:** Warn Electrical Services, SRL (WES)
* **RNC:** 1-31-89326-4
* **Sede:** Autopista Ramón Cáceres, Moca, Provincia Espaillat, República Dominicana
* **Teléfono Principal y WhatsApp:** **`(849) 207-5474`** (`https://wa.me/18492075474`)
* **Ubicación Google Maps:** [https://maps.app.goo.gl/KMosxdkCGwXxqFjC9](https://maps.app.goo.gl/KMosxdkCGwXxqFjC9) (`19.3877255, -70.531041`)
* **Correos Electrónicos:** **`wes.inform@gmail.com`**
* **Redes Sociales:** Instagram **`@wes.inform`** ([instagram.com/wes.inform](https://www.instagram.com/wes.inform/)) | Facebook **`Warn.Electrical.Services`** ([facebook.com/Warn.Electrical.Services](https://www.facebook.com/Warn.Electrical.Services))
* **Horarios:** Lun - Vie: 7:30 AM – 6:00 PM | Sáb: 8:00 AM – 1:00 PM

---

## 2. Arquitectura de Dos Espacios Desacoplados

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ESPACIO PÚBLICO (index.html -> http://localhost:3000/)   │
│ - Catálogo digital, cotizaciones en línea y soporte         │
│ - Mapa interactivo Leaflet con marcador WES y cómo llegar   │
│ - Feature Flags: precios, cotizaciones, soporte, WhatsApp   │
│ - Sin enlaces visibles hacia el panel de administración     │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │ Sincronización en tiempo real
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. ESPACIO ADMINISTRATIVO PRIVADO (/admin -> admin.html)    │
│ - Ruta protegida independiente con <meta noindex, nofollow> │
│ - Bloqueo temporal de 15 min tras 5 intentos fallidos       │
│ - Verificación en dos pasos (2FA) y Watchdog de inactividad │
│ - 7 Roles y Matriz de Permisos (Ver/Crear/Editar/Eliminar)  │
│ - Cotizaciones, Soporte, Contactos, Catálogo y Auditoría    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Módulos y Capacidades del Sistema

### A. Portal Público (`index.html`)
* **Catálogo Comercial Interactivo:** Soluciones de videovigilancia, controles de acceso, cerraduras inteligentes, switches PoE, redes y automatización.
* **Cotizador Inteligente:** Carrito dinámico, validación de datos del solicitante y generación automática de identificador correlativo `COT-2026-XXXX`.
* **Módulo de Soporte Técnico Especializado:**
  * Disparadores directos de cámara móvil (`capture="environment"`), selector de galería y zona Drag & Drop.
  * Compresión inteligente en el navegador (Canvas HTML5) para optimizar fotos a ~200 KB sin perder nitidez.
  * Generación de ticket correlativo `SOP-2026-XXXX`.
* **Mapa Interactivo Leaflet:** Centrado en las coordenadas oficiales (`19.3877255, -70.531041`), con marcador corporativo en forma de rayo amarillo y tarjeta popup con enlace directo "Cómo llegar".
* **Conexión a Feature Flags:** Se adapta en tiempo real a las configuraciones establecidas desde el panel administrativo.

### B. Portal Administrativo Autónomo (`/admin`)
* **Privacidad y Seguridad:**
  * Protegido contra indexación de buscadores con `<meta name="robots" content="noindex, nofollow">`.
  * Bloqueo temporal por 15 minutos tras 5 intentos fallidos consecutivos con temporizador visible.
  * Verificación en dos pasos (2FA) opcional con código de 6 dígitos.
  * Monitor de inactividad de 15 minutos con aviso previo a los 14 minutos (60 segundos para renovar sesión).
* **7 Roles Corporativos y Matriz Interactiva de Permisos (RBAC):**
  1. *Propietario:* Control total e irrestricto de la plataforma.
  2. *Administrador:* Gestión integral de módulos operativos.
  3. *Gestor de Tienda:* Catálogo de productos, categorías, inventario y precios.
  4. *Gestor de Cotizaciones:* Atención comercial, cambio de estados y notas privadas.
  5. *Gestor de Soporte:* Tickets de servicio, inspección de fotos de averías y asignación técnica.
  6. *Editor de Contenido:* Mantenimiento de textos institucionales, servicios y fundadores.
  7. *Usuario de Consulta:* Acceso en modo de solo lectura.
  * *Validación centralizada:* Oculta módulos no autorizados y emite la notificación: *"No tienes autorización para realizar esta acción"*.
* **Feature Toggles (Conmutadores Públicos):**
  * Mostrar u ocultar precios en catálogo.
  * Pausar cotizaciones (con mensaje de cortesía configurable).
  * Pausar soporte técnico (con mensaje de calibración).
  * Ocultar productos sin disponibilidad inmediata.
  * Activar o desactivar categorías enteras.
  * Conmutar visibilidad de fundadores, mapa interactivo y botón de WhatsApp.
* **Gestión de Solicitudes y Bitácora Confidencial:**
  * Asignación de colaboradores responsables.
  * Registro de notas internas privadas (ocultas para el cliente).
  * Visor modal de fotos de evidencias en alta resolución.
  * Cola de reintento de correos (*"Solicitud registrada, correo pendiente de envío"* y botón *"Reenviar correo"*).
  * Exportación de solicitudes a archivos CSV.
* **Historial de Auditoría (Audit Log):**
  * Registro inmutable de operaciones (fecha/hora, usuario, rol, módulo, acción, valores anteriores/nuevos).
  * Buscador en vivo y exportación a CSV.

---

## 4. Credenciales de Demostración del Portal Administrativo

Dirección de acceso: **`http://localhost:3000/admin`**

| Rol Corporativo | Correo / Usuario | Contraseña |
| :--- | :--- | :--- |
| **Propietario** | `wes.inform@gmail.com` | `Wes2026!` |
| **Administrador** | `admin@wes.com.do` | `Wes2026!` |
| **Gestor de Tienda** | `tienda@wes.com.do` | `Wes2026!` |
| **Gestor de Cotizaciones** | `cotizaciones@wes.com.do` | `Wes2026!` |
| **Gestor de Soporte** | `soporte@wes.com.do` | `Wes2026!` |
| **Editor de Contenido** | `editor@wes.com.do` | `Wes2026!` |
| **Usuario de Consulta** | `consulta@wes.com.do` | `Wes2026!` |

---

## 5. Control de Versiones Git

```text
494750d feat(admin): implement standalone admin portal, 7-role RBAC matrix, feature flags, audit log, and interactive Leaflet map
252cb40 fix(contact-support): update phone to (849) 207-5474, email to wes.inform@gmail.com, Google Maps coordinates, and enhance photo upload
77f2fd1 feat(wes): initial enterprise web platform release
```
