# Estado del Proyecto - Plataforma Oficial Warn Electrical Services (WES)

**Fecha de última actualización:** 2026-11-05 07:27 (GMT-4)  
**Versión de despliegue:** `20261105_0725` (Versión 39 Apps Script / PWA v20261104_1245)  
**Dominio de producción:** [https://web.warnelectricalservices.com/](https://web.warnelectricalservices.com/)  

---

## 1. Módulo de Autenticación, Registro y Recuperación de Contraseña

### Estado: ✅ Completado y Verificado E2E con Credenciales Google OAuth / Gmail

- [x] **Inicio de Sesión:**
  - Soporte de acceso con correo electrónico y contraseña tanto para clientes como para empleados y propietario.
  - Validación directa e inmediata de credenciales maestras (`ing.lmlh@gmail.com` / `255133`).
  - Opciones visibles y funcionales para “Crear cuenta” y “Olvidé mi contraseña”.
- [x] **Creación de Cuenta con Código OTP:**
  - Registro con nombre, correo y contraseña.
  - Generación de código de verificación de 6 dígitos con validez temporal de 10 minutos.
  - Validación del código e inserción automática en la base de clientes activados (`wes_registered_clients`).
- [x] **Restablecimiento de Contraseña:**
  - Solicitud de recuperación mediante correo registrado.
  - Generación de código de seguridad de 6 dígitos.
  - Validación del código en la aplicación, creación y confirmación de nueva contraseña.
  - Quema inmediata del código tras su uso (garantía de un solo uso).
  - Límite de 5 intentos y 60 segundos entre reenvíos.
- [x] **Aislamiento de Perfiles (RBAC):**
  - Los clientes registrados con rol `cliente` acceden exclusivamente al portal público/tienda y tienen bloqueado de raíz el acceso al portal administrativo (`/admin.html`).
- [x] **Integración de Envío de Correos (Google Cloud OAuth / GmailApp):**
  - Conexión configurada con el proyecto OAuth de Google Cloud (`265854802758-ormnnuectp6pafv3vmga1a2evb6k9c6r.apps.googleusercontent.com`).
  - Despliegue de Apps Script actualizado a la versión 39 utilizando `GmailApp.sendEmail` con remitente corporativo: `Tienda WES - Warn Electrical Services`.
  - Formato HTML corporativo con logotipo WES, colores oficiales y código de 6 dígitos legible.
  - Si el servicio de correo falla o responde con error HTTP, la interfaz **no** engaña al usuario mostrando "Correo enviado".

---

## 2. Hallazgos y Defectos Pendientes Registrados para Siguiente Etapa

### Módulo: Asistente Virtual / Chat Web WES (Sofía)
- **Estado:** ✅ Corregido y Desplegado en Producción (Apps Script v45 & GitHub Pages v20261105_2030).
- **Mejoras Implementadas:**
  - **Conexión a Backend Seguro:** Las consultas públicas a Gemini ahora se realizan a través de Google Apps Script (`action: 'query_gemini_chat'`), protegiendo la API Key sin exponerla a visitantes.
  - **Identidad de Sofía:** Encabezado actualizado a 'Sofía - Asistente WES' y saludo inicial personalizado.
  - **Memoria Multiturno:** Implementación de historial conversacional en memoria (`chatSession.chatHistory`) respetando el orden y alternancia de roles (`user` y `model`) para conservar el contexto.
  - **Eliminación de Respuestas Simuladas:** Erradicadas las plantillas comerciales idénticas basadas en palabras clave. En caso de indisponibilidad del modelo, se muestra un aviso veraz con botón de reintento y enlace directo a WhatsApp.
  - **Unificación de Horarios:** Horario oficial de sábados consolidado de 8:00 a. m. a 1:00 p. m. en todo el sistema (`products.js`, catálogo, footer y chat).
  - **Seguridad y Control Administrativo:** Edición del prompt de Sofía y clave de Gemini restringida a administradores mediante `save_ai_config_admin` con sincronización en tiempo real al servidor. Límites de mensajes a 1,000 caracteres.

---

## 3. URLs Oficiales de la Plataforma

- **Portal Público y Tienda WES:** [https://web.warnelectricalservices.com/](https://web.warnelectricalservices.com/)
- **Portal Administrativo y Gestión:** [https://web.warnelectricalservices.com/admin.html](https://web.warnelectricalservices.com/admin.html)
- **Tablero KDS / Soporte Técnico:** [https://web.warnelectricalservices.com/servicio-tecnico.html](https://web.warnelectricalservices.com/servicio-tecnico.html)
