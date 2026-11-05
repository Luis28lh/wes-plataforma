# Estado del Proyecto - Plataforma Oficial Warn Electrical Services (WES)

**Fecha de última actualización:** 2026-11-04 21:50 (GMT-4)  
**Versión de despliegue:** `20261104_1245`  
**Dominio de producción:** [https://web.warnelectricalservices.com/](https://web.warnelectricalservices.com/)  

---

## 1. Módulo de Autenticación, Registro y Recuperación de Contraseña

### Estado: ✅ Completado y Verificado E2E

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
- [x] **Integración de Envío de Correos:**
  - Validaciones estrictas: si el servicio de correo falla o responde con error HTTP, la interfaz **no** engaña al usuario mostrando "Correo enviado".
  - Identificación formal como **Tienda WES - Warn Electrical Services, SRL**.
  - Nota de infraestructura: el envío de salida requiere credencial directa de Google (Contraseña de Aplicación de 16 caracteres o Client ID/Secret OAuth de Google Cloud Console).

---

## 2. Hallazgos y Defectos Pendientes Registrados para Siguiente Etapa

### Módulo: Asistente Virtual / Chat Web WES
- **Fallo identificado:** Durante las pruebas recientes, el chat web ofreció respuestas comerciales idénticas ante tres preguntas distintas con pérdida de continuidad y contexto.
- **Acción:** Queda registrado en este documento sin modificar todavía, a la espera de ser atendido en la siguiente fase una vez cerrada la etapa de autenticación.

---

## 3. URLs Oficiales de la Plataforma

- **Portal Público y Tienda WES:** [https://web.warnelectricalservices.com/](https://web.warnelectricalservices.com/)
- **Portal Administrativo y Gestión:** [https://web.warnelectricalservices.com/admin.html](https://web.warnelectricalservices.com/admin.html)
- **Tablero KDS / Soporte Técnico:** [https://web.warnelectricalservices.com/servicio-tecnico.html](https://web.warnelectricalservices.com/servicio-tecnico.html)
