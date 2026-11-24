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
| **Última actualización** | 2026-11-24 16:30 (GMT-4) |
| **Repositorio GitHub (privado)** | `https://github.com/Luis28lh/wes-plataforma.git` (remoto `origin`) y `https://github.com/Luis28lh/wes-plataforma-v1.git` (remoto `v1`) |
| **Rama principal / política de cambios** | `main` (despliegue continuo a producción). Commits atómicos con verificación previa obligatoria. |
| **Estado general** | **OPERATIVO EN PRODUCCIÓN** |
| **Entorno actual** | Producción en dominio personalizado CDN + Backend Google Apps Script (Versión #92) |

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
- Picos de latencia de red de Google mitigados con ampliación de timeout a 45s, límite de tokens directos (max 250), cascada optimizada (gemini-2.0-flash, gemini-2.0-flash-lite, gemini-3.5-flash, gemini-3.5-flash-lite) y reintento transparente único en frontend ante timeouts o interrupciones de red.

**Última versión / commit verificado:**  
`f40ef1a` (sincronizado en `origin/main` y `v1/main`).

---

## 4. Arquitectura y tecnología

| Componente | Tecnología / servicio | Función | Estado |
|---|---|---|---|
| **Frontend** | HTML5, Tailwind CSS, JavaScript Vanilla (ES6+), FontAwesome 6, PWA Service Worker | Interfaz pública y paneles | IMPLEMENTADO |
| **Backend API** | Google Apps Script (Web App REST JSON/POST) | Lógica de negocio, correo, base de datos y puente a IA | IMPLEMENTADO (v61) |
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
| **Autenticación** | Acceso sin contraseña con código de 6 dígitos, validez 10 min, un solo uso, RBAC estricto | IMPLEMENTADO | `js/user_auth.js`, `index.html`, `Code.js` (v61) |
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
| **2026-11-24** | Formulario modal integrado WES para registro de usuarios, erradicación de prompts nativos y persistencia en servidor (v92) | El usuario solicitó: 1) Sustituir cuadros nativos (`prompt()`, `alert()`, `confirm()`) por modales integrados con diseño Tailwind WES; 2) Modal responsivo al pulsar "Registrar usuario" con nombre, correo (detección en vivo de duplicados), teléfono, rol (con categoría técnico interno/externo), estado, previsualizador dinámico de permisos RBAC, protección anti-doble envío y conservación de campos ante errores; 3) Persistencia en backend (`Clientes` en Google Sheets), cuentas manuales creadas como `verified: false` hasta completar OTP, y opción de despacho de invitación oficial; 4) Confirmaciones dentro del panel con motivo obligatorio para auditoría. | 1) Creado modal `#admin-create-user-modal` y modal de confirmación `#admin-action-confirm-modal` eliminando 100% de `prompt()`, `alert()` y `confirm()`; 2) Nuevo endpoint `create_user_admin` en Apps Script con validación estricta de autorización, detección de duplicados atómica, inserción en Google Sheets y registro en `Auditoria`; 3) Comprobación en vivo de duplicados en formulario con botón para abrir perfil existente; 4) Modificado `handleVerifyAuthOtp` para marcar `verified: true` al completar el primer acceso OTP; 5) Despliegue de producción Versión #92 (Build 92) y verificación en vivo con pruebas automatizadas exitosas. |
| **2026-11-16** | Gestión avanzada de usuarios, limpieza de ficticios, perfil editable y dashboard de accesos reales (v91) | El usuario solicitó: 1) Retiro y respaldo de usuarios ficticios sin sustitución artificial; 2) Modal de perfil editable con validación estricta y protección del último admin; 3) Acciones segregadas de recuperación de acceso (reenviar instrucciones, revocar códigos, desbloquear intentos, reactivar y cerrar sesiones) con bitácora de auditoría; 4) Dashboard de accesos reales con métricas calculadas en servidor (únicos hoy, semana, mes, fallos, suspendidos) e indicador "En línea" con umbral de 15 min. | 1) Creado respaldo formal en `docs/respaldos/respaldo_usuarios_demostracion.json` y purgada toda auto-semilla en `user_auth.js`; 2) Nuevo endpoint `admin_user_access_action` en Apps Script con acciones auditadas en la hoja `Auditoria`; 3) Endpoint `get_auth_access_dashboard_admin` calculando métricas reales desde `Auth_OTP_Tokens` y `Clientes`; 4) Protección de integridad: el servidor prohíbe degradar o suspender al último administrador activo; 5) Despliegue en Google Apps Script Versión #91 (Build 91) y verificación de endpoints en vivo con respuestas exitosas. |
| **2026-11-05** | Backend central para Gemini en Apps Script | Proteger API key y centralizar auditoría | Tráfico de IA 100% seguro sin exponer tokens |
| **2026-11-08** | Rediseño premium de Sofía y avatar oficial | Sustituir icono de robot por retrato corporativo aprobado | Identidad visual humana y coherente |
| **2026-11-08** | Control estricto de brevedad en servidor | Sofía extendía respuestas y repetía saludos | Respuestas directas de máximo 2 frases y 40 palabras |
| **2026-11-08** | Prohibición estricta de agendamiento automático | Sofía confirmaba citas sin validar calendario humano | Se exige recolección de datos para validación humana previa |
| **2026-11-08** | Módulo "Conocimiento y respuestas de Sofía" | Permitir registrar FAQs y reglas sin editar el prompt maestro | Doble vía de registro con historial y versionado |
| **2026-11-09** | Aumento de timeout a 35s y cascada de modelos | Evitar error "no pudo procesar respuesta" por latencia de red | Estabilidad total en consultas de catálogo y soporte |
| **2026-11-09** | Incorporación formal del Kit de Documentación Maestra | Estandarizar gobernanza, trazabilidad y control de versiones | `AGENTS.md` y `docs/PROYECTO_MAESTRO.md` como fuente de verdad permanente |
| **2026-11-10** | Optimización de latencia en Apps Script (v58) y Timeout a 45s con reintento transparente | Corrección de fallos intermitentes de "no pudo procesar respuesta" en consultas como "hola" y cables | Reducción de latencia a 3-8s, tokens directos acotados (250), modelos ligeros de respaldo y resiliencia ante cortes |
| **2026-11-11** | Autenticación sin contraseña (Magic Code 6 dígitos) y blindaje RBAC de Servicio Técnico | Simplificar acceso unificado de clientes y personal sin contraseñas; proteger tablero técnico | Entrada directa con correo, código de 6 dígitos válido 10 min (un solo uso, máx 5 intentos), botón "Servicio Técnico" oculto a visitantes y clientes, guardia estricta en servidor y frontend |
| **2026-11-13** | Atención inmediata a saludos y optimización de cuota de IA (v63) | Resolver fallo intermitente con "HOLA" y evitar consumo innecesario de tokens en plan Pro | Saludos y agradecimientos respondidos instantáneamente en frontend sin invocar Gemini; retiro garantizado de indicador de escritura; soporte de API key prioritaria en backend |
| **2026-11-14** | Notificación pop-up e instrucción en vivo para Luis Lizardo (v68) | Permitir al propietario instruir a Sofía en tiempo real ante preguntas de clientes no resueltas | Alerta emergente en sesión de `ing.lmlh@gmail.com` para responder preguntas no catalogadas, registro en `Preguntas_Pendientes_Sofia` y autoaprendizaje directo a `Conocimiento_Sofia` |
| **2026-11-15** | Prohibición absoluta de soporte agendado o promesas de citas en Sofía (v88) | El usuario instruyó: "está dando una respuesta a realizar un soporte agendado al cliente que todavía no hemos configurado". Sofía utilizaba expresiones como "para agendar la visita", "te podemos agendar", dando a entender erróneamente que existía una agenda de citas o visitas programadas activa en la plataforma. | 1) Se incorporó en el prompt maestro de backend (`Code.js`), en el contexto temporal y en el frontend (`chat_cliente.js`) la prohibición estricta y explícita de usar las palabras "agendar", "agendado", "soporte agendado" o "visita programada"; 2) Se restringió la función a tomar únicamente el nombre, teléfono e indicación del problema para que un técnico humano atienda al cliente; 3) Se implementó un filtro de desinfección automático tanto en servidor (`Code.js`) como en cliente (`chat_cliente.js`) que reemplaza cualquier residuo de "agendar" por toma de datos; 4) Despliegue de producción Versión #88 (v1.88) y verificación en vivo con casos de prueba de soporte a domicilio y visitas técnicas. |
| **2026-11-15** | Blindaje integral anti-bloqueo de UI y cierre universal de modales/documentos (v87) | El usuario reportó: "está pasando un documento que no deja hacer al cliente vamos a hacer la corrección y poner medidas para que eso no pase". Diagnóstico: En móviles y escritorio, los modales de documentos extensos (Política de Privacidad, Términos, Cotización, Confirmación, etc.) bloqueaban el scroll del body (`overflow-hidden`) y carecían de cierre por toque en el fondo exterior (backdrop click) o por tecla Escape. Si un usuario tocaba involuntariamente el enlace a políticas o abría un modal, la pantalla quedaba bloqueada sin poder cerrarlo salvo tocando un botón diminuto. | 1) Se incorporó un registro centralizado de modales (`modalCloseRegistry`) con listener universal de cierre al hacer tap/clic en cualquier área fuera del contenido (`backdrop dismiss`) y tecla Escape global en toda la plataforma; 2) Se reforzó la restauración forzada de scroll (`overflow-hidden` removido y `document.body.style.overflow = ''`) garantizando que nunca quede la página congelada; 3) Se rediseñó el botón de cierre del modal de políticas (`policy-modal`) haciéndolo prominente, circular y accesible en móviles; 4) Se añadió listener de clic fuera al modal flotante de Sofía Instructor en `user_auth.js`; 5) Automatización y despliegue exitoso de la Versión #87 (Build 87) en Google Apps Script y sincronización en frontend y repositorio. |
| **2026-11-15** | Copia y pega ultra-fácil de código OTP y regla estricta de no generación de tickets en Sofía (v86) | El usuario solicitó: 1) Facilitar al máximo la copia y el pegado del código OTP; 2) Establecer que Sofía NO está capacitada para generar tickets, emitir números ni enviar tickets realizados al cliente, limitando el chat a tomar el nombre, número de teléfono y el problema para que el técnico lo atienda el lunes en horario laboral. | 1) En el correo transaccional se incorporó una caja de código monoespaciada con estilo táctil ampliado, `user-select: all` e instrucciones visuales directas; en el modal web se implementó pegado universal inteligente (evento paste y botón «Pegar código y entrar») que limpia el texto, distribuye los 6 dígitos y auto-ejecuta la verificación inmediatamente sin clics adicionales; 2) En el prompt maestro de Sofía (`Code.js`), en el contexto dinámico y en el flujo del chat cliente (`chat_cliente.js`), se prohibió la invención o generación de tickets autónomos; Sofía toma los datos y responde: "Te voy a tomar el número, tu nombre y la indicación del problema para que el lunes uno de nuestros técnicos te atienda"; 3) Desplegado en producción Versión #86 (v1.86) y verificado con consulta en vivo. |
| **2026-11-15** | Resolución de fallo de entrega OTP y conexión de frontend al backend criptográfico real (v85) | El usuario reportó no recibir el código OTP en `plazamegaton2000@gmail.com` a pesar de que la página mostraba "Enviado". Diagnóstico: 1) `user_auth.js` seguía usando `sendMagicAccessCode` con `nuevoMensaje` y `localStorage` en lugar de invocar `request_auth_otp` del backend; 2) En el backend, `procesarNuevoMensajeContacto` invocaba `MailApp.sendEmail` sin el scope `script.send_mail`, arrojando excepción de permisos que abortaba el despacho al destinatario antes de que saliera, mientras el endpoint retornaba un falso `success: true`. | 1) Se conectó `user_auth.js` (en raíz y en bundle) a `request_auth_otp` y `verify_auth_otp` del backend Apps Script; 2) Se actualizó `appsscript.json` con el scope `https://www.googleapis.com/auth/script.send_mail`; 3) En `Code.js`, `sendTransactionalEmail_` y las notificaciones se configuraron con `GmailApp.sendEmail` como proveedor prioritario validado y `MailApp` como fallback secundario; 4) Despliegue de producción Versión #85 (v1.85); 5) Verificación exitosa de extremo a extremo: solicitud de código a `plazamegaton2000@gmail.com` (`REQ-OTP-B8E1278E`) e `ing.lmlh@gmail.com` (`REQ-OTP-A1B66CBA`), prueba de rechazo con código inválido (`000000`/`123456`) comprobando decremento de intentos (4 intentos restantes), y validación de entrega real sin errores. |
| **2026-11-14** | Blindaje de workflow GitHub Pages para repositorio de respaldo wes-plataforma-v1 | Error "Setup Pages: Get Pages site failed... HttpError: Not Found" al hacer push. Causa: `wes-plataforma-v1` es copia espejo de respaldo y no tiene Pages habilitado en sus ajustes, mientras que `Luis28lh/wes-plataforma` es el repo oficial que compila y sirve `web.warnelectricalservices.com`. | Se añadió guarda condicional `if: github.repository == 'Luis28lh/wes-plataforma'` en `.github/workflows/static.yml`. En `v1` la publicación se omite limpiamente sin fallas; en `origin` publica de forma segura sin exponer backend ni secretos; verificado que la web pública sirve v1.81 y que el flujo OTP (solicitud, envío y validación de intentos) opera con normalidad. |
| **2026-11-14** | Automatización estricta de versión visible en footer y sincronización en despliegues (v81) | El usuario solicitó garantizar que en cada despliegue a producción se coloque abajo la versión correspondiente exacta para identificar de inmediato si un cliente o dispositivo móvil tiene la versión actualizada o una previa. | Se automatizó deploy_apps_script.js para consultar el historial de versiones en Apps Script API antes de empaquetar, calcular la versión correlativa (1.{Build}) e inyectarla tanto en el bundle de producción como en los archivos locales (index.html y proyecto-wes/index.html). El footer muestra de forma inmutable la versión oficial (1.81 (Build 81)) junto al botón interactivo de actualización forzada de caché para clientes. |\n| **2026-11-14** | Garantía de entrega de correos OTP en Gmail con replyTo corporativo y marca anti-hilo (v80) | El usuario reportó no recibir correos con el código de 6 dígitos en su bandeja de entrada (inbox). Causa: cuando origen y destino coinciden (ing.lmlh@gmail.com), Gmail archiva por defecto el auto-envío si se usa GmailApp.sendEmail sin cabeceras eplyTo y con asuntos idénticos que colapsan en conversaciones viejas. | Se configuró MailApp.sendEmail con remitente WES · Seguridad de cuenta, cabecera eplyTo: wes.inform@gmail.com, marca de tiempo exacta [hh:mm:ss a] en el asunto para que Gmail lo catalogue como mensaje nuevo e independiente con entrega prioritaria en bandeja de entrada (Inbox), con fallback dual a GmailApp y registro en hoja segura; desplegado y verificado exitosamente en Versión #80. |\n| **2026-11-14** | Política estricta de citas exclusivamente en horario laboral para Sofía (v79) | Atender instrucción del propietario: si alguien escribe a deshoras o propone una cita fuera del horario laboral, debe citársele estrictamente dentro del horario laboral de servicio, nunca antes ni después | Prompt maestro y contexto temporal dinámico en backend de Google Apps Script configurados con política explícita: recepción solo en horario de servicio (L-V 8:00 a.m. a 6:00 p.m., Sábados 8:00 a.m. a 1:00 p.m., Domingos cerrado). Toda solicitud fuera de horario se reconduce a la próxima apertura laboral a partir de las 8:00 a.m. |
| **2026-11-14** | Autenticación OTP de seis dígitos con backend criptográfico y recuperación de contraseñas (v78) | Proveer registro y acceso unificado sin contraseña mediante OTP de 6 dígitos con controles reales de servidor, HMAC-SHA256, consumo atómico, anti-fuerza bruta y flujo formal de recuperación | Backend Apps Script con endpoints `request_auth_otp`, `verify_auth_otp`, `complete_auth_otp_profile`, `request_password_reset_otp` y `reset_password_with_otp`; tokens protegidos con salt y HMAC en hoja protegida `Auth_OTP_Tokens`; 10 min de validez, máx 5 intentos, rate-limit de 60s por correo/IP; remitente oficial "WES · Seguridad de cuenta"; nuevo paso de recuperación de contraseña con invalidación de sesiones previas; verificación de clientes sin duplicados y preservación de cuentas existentes |
| **2026-11-14** | Blindaje total de visibilidad KDS para empleados y resolución de truncado en Sofía (v74) | Garantizar que el botón y acceso a Servicio Técnico (KDS) esté 100% oculto a clientes y visitantes; eliminar corte abrupto de respuestas de Sofía en consultas de horarios/apertura | Enlaces KDS con `style="display: none !important;"` por defecto en HTML y verificación estricta en app.js (`!isClientRole && isEmployee`); desactivación de summarizer agresivo en backend Apps Script y priorización de modelos Flash Lite sin limitación 429; respuestas de horarios completas y fluidas |
| **2026-11-14** | Acceso a hora real dominicana y evaluación automática de apertura/cierre para Sofía (v73) | Evitar respuesta errónea "no tengo acceso a la hora" y permitir a Sofía responder con la hora exacta y evaluar si WES está abierto | Detección nativa en frontend de zona horaria República Dominicana (GMT-4) y cálculo instantáneo de minutos de apertura/cierre; inyección de contexto temporal dinámico en el backend de Google Apps Script hacia Gemini |
| **2026-11-14** | Despliegue de producción v1.72 con bundle total de scripts y fallback dual de iconos (v72) | Resolver visualización universal de iconos y garantizar la ejecución completa de login con código de 6 dígitos en la nube | Fallback dual CDN (Cloudflare + JSDelivr) para Font Awesome; empaquetado autocontenido de user_auth, chat_cliente y KDS en el deployer de Apps Script; verificación de envío de correos sin requerir API keys adicionales de Gmail |
| **2026-11-14** | Sincronización visual de versión de producción v1.71 en footer y botón de actualización (v71) | Sustituir versión vieja fija (v0.1.100) por versión real en vivo y permitir a clientes y móviles refrescar caché en 1 clic | Footer con badge oficial v1.71 (Build 71) con pulsador de estado y botón interactivo "Actualizar app" que ejecuta limpieza de caché PWA y recarga forzada |
| **2026-11-14** | Bandeja de mensajes directos en header con salto interactivo a Sofía (v70) | Permitir que los clientes reciban mensajes de gerencia y pasen a interactuar con el chat | Botón `#header-user-messages-btn` con badge de no leídos al lado del avatar, bandeja modal y botón "Interactuar en el Chat" para conectar la conversación con Sofía |

---

## 9. Plan y tareas pendientes

| ID | Prioridad | Tarea | Estado | Dependencia / siguiente acción |
|---|---|---|---|---|
| **TSK-01** | Alta | Mantener actualizada la base de conocimientos según nuevas políticas de WES | EN DESARROLLO | A demanda del propietario |
| **TSK-02** | Media | Monitoreo continuo de tiempos de respuesta del endpoint de IA en Apps Script | IMPLEMENTADO | Vigilancia de latencia en horas pico |
| **TSK-03** | Media | Incorporación gradual de nuevos productos al catálogo digital estructurado | PENDIENTE | Nuevos lotes de inventario WES |
| **TSK-04** | Baja | Optimización de imágenes en formato WebP para tiempos de carga ultrarrápidos | PENDIENTE | Mantenimiento periódico de assets |
