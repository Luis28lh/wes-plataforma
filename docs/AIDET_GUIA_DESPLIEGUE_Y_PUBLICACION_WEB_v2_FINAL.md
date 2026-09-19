# AIDET — Guía Maestra de Despliegue, Publicación Web e Identidad Digital
## Versión 2.0 FINAL · Taller 2 — El Profesional Potenciado por Tecnología

**Programa:** El Profesional Potenciado por Tecnología  
**Módulo:** Publicación de Productos Digitales, Nombres de Dominio y Arquitecturas Web  
**Marca:** AIDET — Tecnología que potencia talento

---

# 0. PROPÓSITO DEL DOCUMENTO

Este documento complementa el **Prompt Maestro AIDET CORE TALLER 2**.

Define el estándar operativo, metodológico y técnico para:

1. Gestionar correctamente los entornos de desarrollo y producción.
2. Publicar páginas, sitios, aplicaciones web, portales y dashboards.
3. Utilizar Google Apps Script como backend, motor de automatización o capa de integración.
4. Publicar interfaces externas mediante hosting moderno cuando convenga.
5. Mantener identidad digital mediante subdominios, URLs personalizadas o dominios propios.
6. Integrar Google Workspace como infraestructura detrás de la experiencia web.
7. Reducir al mínimo la intervención técnica del participante.
8. Entregar siempre una solución funcional, publicada y accesible mediante una URL real.

---

# 1. PRINCIPIO AIDET DE DESPLIEGUE

**EL PARTICIPANTE DEFINE EL RESULTADO.  
ANTIGRAVITY SELECCIONA LA ARQUITECTURA, CONSTRUYE, PRUEBA, DESPLIEGA Y PUBLICA.**

El participante no debe decidir aspectos técnicos como:

- hosting;
- deployment;
- configuración de DNS;
- estructura frontend/backend;
- CORS;
- APIs;
- OAuth;
- clasp;
- versiones de Apps Script;
- infraestructura.

Antigravity debe elegir automáticamente la estrategia apropiada según:

- objetivo;
- tipo de producto;
- usuarios;
- autenticación;
- privacidad;
- sensibilidad de datos;
- escala;
- identidad de marca;
- necesidad de dominio propio;
- integración con Google Workspace;
- complejidad del frontend;
- costo;
- mantenimiento.

---

# 2. CICLO DE VIDA DEL DESPLIEGUE EN GOOGLE APPS SCRIPT

Cuando una solución utiliza Apps Script Web Apps, debe diferenciar claramente:

**DESARROLLO → PRUEBA → PRODUCCIÓN → ACTUALIZACIÓN**

## 2.1 ENTORNO DE DESARROLLO — URL `/dev`

La URL de prueba generada por Apps Script termina en:

```text
/dev
```

Características:

- ejecuta el código más reciente guardado;
- permite iteración rápida;
- es apropiada para desarrollo y pruebas;
- está disponible únicamente para usuarios con permisos suficientes sobre el proyecto;
- debe utilizarse durante construcción, ajuste y validación.

Flujo típico:

```text
Código local
↓
clasp push
↓
Apps Script
↓
URL /dev
↓
Prueba
↓
Corrección
↓
Nuevo clasp push
```

## 2.2 ENTORNO DE PRODUCCIÓN — URL `/exec`

La URL pública o productiva de una Web App termina en:

```text
/exec
```

Características:

- ejecuta una versión publicada y controlada;
- utiliza un deployment;
- permite separar desarrollo de producción;
- la URL puede mantenerse estable mientras el deployment se actualiza a nuevas versiones.

La aplicación productiva debe ser la utilizada por:

- clientes;
- estudiantes;
- usuarios institucionales;
- colaboradores;
- público general;
- usuarios finales.

## 2.3 ACTUALIZACIÓN CONTINUA SIN ROMPER LA URL

Cuando una aplicación ya está publicada:

1. desarrolla cambios localmente;
2. sincroniza mediante `clasp push`;
3. prueba en `/dev`;
4. valida;
5. crea una nueva versión cuando corresponda;
6. actualiza el deployment existente;
7. conserva la URL `/exec` utilizada por los usuarios.

Principio:

> **La aplicación evoluciona; la URL pública permanece estable siempre que la arquitectura lo permita.**

---

# 3. EJECUCIÓN Y ACCESO EN APPS SCRIPT WEB APPS

Al publicar una Web App, Antigravity debe evaluar dos dimensiones:

## 3.1 ¿QUIÉN EJECUTA LA APLICACIÓN?

### Ejecutar como propietario / usuario que despliega

Útil cuando la solución debe operar con recursos del propietario, por ejemplo:

- guardar información en Sheets;
- generar documentos;
- crear PDFs;
- guardar archivos;
- enviar correos;
- crear eventos;
- gestionar recursos del sistema.

### Ejecutar como usuario que accede

Útil cuando:

- cada usuario debe operar con sus propios permisos;
- la solución es interna;
- existe control de acceso institucional;
- se requiere respetar permisos individuales de Google Workspace.

Antigravity debe seleccionar la modalidad adecuada según seguridad y arquitectura.

## 3.2 ¿QUIÉN PUEDE ACCEDER?

Las opciones dependen de la configuración disponible en el entorno y del tipo de cuenta.

Conceptualmente:

- **Acceso personal:** solo el propietario o usuarios autorizados.
- **Acceso institucional:** usuarios de una organización o dominio.
- **Usuarios autenticados:** usuarios que acceden con cuenta Google cuando la configuración lo exige.
- **Acceso público/anónimo:** usuarios externos sin autenticación cuando la modalidad de despliegue y la cuenta lo permiten.

No asumas que `ANYONE` y acceso anónimo significan lo mismo.

Cuando se gestione mediante manifest o API, diferencia correctamente:

```text
ANYONE
```

de:

```text
ANYONE_ANONYMOUS
```

Antigravity debe validar la configuración real disponible antes de publicar.

---

# 4. ESTRATEGIAS DE IDENTIDAD DE URL

La estrategia de publicación debe elegirse según el resultado esperado.

| Nivel | Estrategia | Ejemplo | Marca | Uso típico |
|---|---|---|---|---|
| 1 | Apps Script Web App | `script.google.com/.../exec` | Básica | Apps internas, prototipos, sistemas Google-first |
| 2 | URL corta / alias | `tinyurl.com/marca` | Media | QR, WhatsApp, materiales impresos |
| 3 | Hosting externo | `marca.vercel.app` / `usuario.github.io` | Alta | Frontend profesional separado |
| 4 | Dominio propio | `www.marca.com` | Máxima | Producto institucional o comercial |

Antigravity debe seleccionar la opción según:

- identidad;
- alcance;
- costo;
- mantenimiento;
- seguridad;
- autenticación;
- arquitectura.

---

# 5. NIVEL 1 — APPS SCRIPT WEB APP NATIVA

Utiliza esta modalidad cuando:

- Google Workspace sea el núcleo;
- Apps Script funcione adecuadamente como backend y frontend;
- se busque simplicidad;
- el producto pueda operar correctamente desde la infraestructura Google;
- una URL técnica sea aceptable.

Puede personalizarse:

- título;
- favicon;
- viewport;
- interfaz;
- diseño;
- marca interna.

Ejemplo:

```javascript
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Nombre del Proyecto')
    .setFaviconUrl('https://URL_DEL_FAVICON')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}
```

---

# 6. NIVEL 2 — URL CORTA O ALIAS

Puede utilizarse cuando se necesite:

- compartir fácilmente;
- generar QR;
- imprimir en materiales;
- enviar por WhatsApp;
- simplificar una URL extensa.

Ejemplo conceptual:

```text
https://tinyurl.com/nombredelproyecto
```

La URL corta redirige al destino real.

Antigravity debe utilizar servicios externos únicamente cuando aporten valor, sean apropiados y no comprometan seguridad.

---

# 7. NIVEL 3 — HOSTING EXTERNO DESACOPLADO

Utiliza hosting externo cuando la experiencia web necesite:

- URL más limpia;
- frontend más flexible;
- identidad visual avanzada;
- SPA;
- mayor independencia de la interfaz;
- integración con backend Google;
- separación frontend/backend.

Arquitectura:

```text
FRONTEND PÚBLICO
↓
HTTPS / API
↓
BACKEND
↓
GOOGLE WORKSPACE
```

---

# 8. VERCEL

Vercel puede utilizarse para desplegar frontend moderno.

Posibilidades:

- HTML/CSS/JS;
- SPA;
- frameworks compatibles;
- frontend conectado con Apps Script;
- frontend conectado con APIs.

Ventajas:

- despliegue rápido;
- SSL automático;
- subdominio;
- CDN;
- integración con dominio propio;
- despliegues desde terminal.

## Uso según tipo de proyecto

### Hobby

Utilizar para:

- aprendizaje;
- prototipos;
- pruebas;
- proyectos personales compatibles con sus términos.

### Pro u opción equivalente

Utilizar cuando el proyecto sea:

- profesional;
- comercial;
- institucional;
- de producción.

No asumas que un plan gratuito es apropiado para cualquier uso.

Antigravity debe comprobar las condiciones vigentes antes de seleccionar el plan.

---

# 9. GITHUB PAGES

GitHub Pages puede utilizarse para sitios estáticos.

Adecuado para:

- HTML;
- CSS;
- JavaScript del lado cliente;
- portafolios;
- páginas informativas;
- frontends estáticos que consumen un backend externo.

GitHub Pages no sustituye un backend.

Si la solución necesita lógica de servidor, escritura en Sheets, generación de documentos, Gmail, Calendar o autenticación de servidor, esa lógica debe residir en Apps Script, otro backend o una API compatible.

Antigravity debe validar también las condiciones actuales de repositorios, visibilidad, planes y dominio propio.

---

# 10. NIVEL 4 — DOMINIO PROPIO

Cuando el participante disponga de un dominio, Antigravity debe:

1. identificar el proveedor de hosting;
2. agregar el dominio al proyecto;
3. obtener los registros DNS actuales recomendados por el proveedor;
4. configurar CNAME, A, ALIAS u otros registros según corresponda;
5. verificar propagación;
6. verificar HTTPS;
7. probar el dominio;
8. redirigir variantes si corresponde.

No utilices valores DNS rígidos como regla permanente.

Obtén los valores vigentes directamente del proveedor en el momento de la configuración.

---

# 11. ARQUITECTURA DESACOPLADA AIDET

Esta arquitectura separa:

**INTERFAZ → LÓGICA → SERVICIOS**

```text
┌────────────────────────────────────────────┐
│ FRONTEND                                   │
│ Vercel / GitHub Pages / Hosting / Dominio │
│ HTML / CSS / JavaScript                    │
└─────────────────────┬──────────────────────┘
                      │ HTTPS
                      ▼
┌────────────────────────────────────────────┐
│ BACKEND                                    │
│ Apps Script Web App / Endpoint HTTP        │
│ doGet(e) / doPost(e)                       │
│ Validaciones / Reglas / Procesamiento      │
└─────────────────────┬──────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────┐
│ GOOGLE WORKSPACE                           │
│ Sheets: almacenamiento estructurado        │
│ Drive: archivos                            │
│ Docs: documentos                           │
│ Gmail: comunicaciones                      │
│ Calendar: citas                            │
│ Slides: presentaciones                     │
└────────────────────────────────────────────┘
```

---

# 12. GOOGLE SHEETS COMO ALMACENAMIENTO OPERATIVO

Google Sheets puede utilizarse como:

- registro estructurado;
- tabla operativa;
- repositorio sencillo;
- almacenamiento para aplicaciones pequeñas o medianas;
- fuente de datos;
- panel administrativo;
- registro de estados.

No debe describirse automáticamente como una base de datos relacional.

Cuando el proyecto requiera mayor concurrencia, escalabilidad, relaciones complejas, alto volumen, consultas avanzadas o transacciones, Antigravity debe evaluar una alternativa de almacenamiento más apropiada.

---

# 13. BACKEND CON APPS SCRIPT WEB APP

Cuando Apps Script actúe como backend HTTP, utiliza:

- `doGet(e)`;
- `doPost(e)`;
- ContentService;
- HtmlService;
- servicios Workspace.

Ejemplo:

```javascript
function doPost(e) {
  try {
    const payload = JSON.parse(
      e && e.postData && e.postData.contents
        ? e.postData.contents
        : '{}'
    );

    let result = {
      success: false,
      message: 'Acción no reconocida'
    };

    switch (payload.action) {
      case 'procesarSolicitud':
        result = procesarSolicitud(payload);
        break;

      case 'consultarFolio':
        result = consultarFolio(payload);
        break;

      default:
        result = {
          success: false,
          message: 'Acción no soportada'
        };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error(error);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error al procesar la solicitud'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

No devuelvas detalles internos de errores sensibles al usuario final.

Registra errores internamente.

---

# 14. COMUNICACIÓN FRONTEND → APPS SCRIPT

Cuando un frontend externo consuma una Apps Script Web App:

- diseña la comunicación cuidadosamente;
- prueba CORS;
- prueba redirects;
- prueba errores;
- prueba JSON;
- prueba autenticación;
- prueba acceso anónimo si corresponde.

Cuando sea adecuado, una solicitud simple puede utilizar:

```javascript
async function llamarBackend(url, action, datos = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({
      action,
      ...datos
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}
```

No conviertas esta técnica en una regla universal.

Antigravity debe probar el comportamiento real del endpoint y seleccionar la estrategia correcta.

---

# 15. SEGURIDAD DEL ENDPOINT

Una URL pública no significa que todas las operaciones deban quedar abiertas.

Protege según corresponda:

- operaciones administrativas;
- consultas privadas;
- cambios de estado;
- información sensible;
- endpoints internos;
- archivos;
- tokens;
- acciones críticas.

Utiliza cuando sea necesario:

- autenticación;
- autorización;
- roles;
- tokens temporales;
- sesiones;
- validación server-side;
- claves almacenadas del lado servidor;
- acceso institucional;
- controles por usuario.

Nunca coloques secretos en JavaScript público.

---

# 16. AUTONOMÍA Y AUTORIZACIÓN MÍNIMA

> **El participante no copia código ni opera terminales. Antigravity construye, configura, despliega, publica y entrega.**

Antigravity debe realizar:

- instalación;
- archivos;
- código;
- push;
- pull;
- deployments;
- hosting;
- configuración;
- APIs;
- URLs;
- pruebas.

Las intervenciones humanas se limitan a acciones obligatorias de seguridad, como:

- inicio de sesión;
- MFA;
- consentimiento OAuth;
- Device Login;
- UAC;
- aprobación de dominio/DNS cuando el proveedor lo exija.

Formato:

```text
ACCIÓN NECESARIA
[Una única instrucción breve]
```

Después continúa automáticamente.

---

# 17. SELECCIÓN AUTOMÁTICA DE ARQUITECTURA

Antigravity debe elegir la arquitectura.

## Caso A — Aplicación interna Google-first

```text
Apps Script Web App + Google Workspace
```

## Caso B — Sitio público o frontend de marca

```text
Hosting externo + backend Apps Script / API
```

## Caso C — Sitio estático

```text
GitHub Pages / hosting estático equivalente
```

## Caso D — Proyecto profesional con dominio propio

```text
Hosting apropiado + dominio propio + backend adecuado
```

## Caso E — Aplicación con mayor complejidad

Evaluar:

- backend dedicado;
- base de datos;
- autenticación;
- servicios externos;
- infraestructura adicional.

No fuerces Apps Script cuando deje de ser la arquitectura adecuada.

---

# 18. MATRIZ DE DECISIÓN

```text
¿QUÉ NECESITA EL PRODUCTO?

├─ Sistema interno conectado con Workspace
│  └─ Apps Script Web App
│
├─ Página pública con identidad de marca
│  └─ Frontend externo + backend según necesidad
│
├─ Sitio estático
│  └─ GitHub Pages / hosting estático
│
├─ Aplicación pública con lógica y Workspace
│  └─ Frontend externo + Apps Script Web App
│
├─ Dominio propio
│  └─ Hosting compatible + DNS del proveedor
│
└─ Mayor escala o complejidad
   └─ Arquitectura web ampliada
```

---

# 19. PRUEBAS ANTES DE PUBLICAR

Antes de producción valida:

## Frontend

- carga;
- navegación;
- formularios;
- responsive;
- errores;
- feedback;
- enlaces;
- accesibilidad básica.

## Backend

- lectura;
- escritura;
- validaciones;
- permisos;
- errores;
- logs;
- seguridad.

## Integración

- frontend → backend;
- backend → Sheets;
- backend → Drive;
- backend → Docs;
- backend → Gmail;
- backend → Calendar;
- respuesta al usuario.

## Producción

- URL;
- HTTPS;
- permisos;
- autenticación;
- acceso externo;
- dominio;
- redirects;
- móvil;
- escritorio.

---

# 20. PRUEBA 360° AIDET

Cuando la solución lo requiera, valida un flujo completo.

```text
USUARIO
↓
FORMULARIO WEB
↓
BACKEND
↓
SHEETS
↓
DOCS
↓
PDF
↓
DRIVE
↓
GMAIL
↓
CALENDAR
↓
ESTADO ACTUALIZADO
↓
PORTAL / DASHBOARD
```

No todas las soluciones necesitan todos estos componentes.

Utiliza solamente los que aporten valor.

---

# 21. CHECKLIST DE PRODUCCIÓN

Antes de entregar:

- [ ] frontend terminado;
- [ ] backend operativo;
- [ ] permisos correctos;
- [ ] APIs operativas;
- [ ] almacenamiento verificado;
- [ ] seguridad revisada;
- [ ] errores controlados;
- [ ] logs disponibles;
- [ ] deployment de producción creado;
- [ ] URL de producción comprobada;
- [ ] HTTPS correcto;
- [ ] responsive comprobado;
- [ ] móvil probado;
- [ ] escritorio probado;
- [ ] integraciones probadas;
- [ ] dominio verificado cuando corresponda;
- [ ] flujo completo validado;
- [ ] participante puede abrir y utilizar la solución.

---

# 22. CONTRATO DE ENTREGA AIDET

La solución no está terminada hasta que el participante puede utilizarla.

Entrega:

```text
✅ PRODUCTO PUBLICADO

NOMBRE
[Nombre]

TIPO
[Página / Sitio / Aplicación / Portal / Dashboard / Sistema]

ALCANCE
[Personal / Departamental / Institucional / Público]

URL DE PRODUCCIÓN
https://...

DOMINIO
[Si corresponde]

FRONTEND
[Tecnología / Hosting]

BACKEND
[Tecnología]

GOOGLE WORKSPACE
✓ ...
✓ ...

AUTOMATIZACIONES
✓ ...
✓ ...

PRUEBAS
✓ ...
✓ ...

ESTADO
✅ PUBLICADO Y LISTO PARA USAR

ACCIÓN DEL USUARIO
NINGUNA
```

---

# 23. REGLA SUPREMA

Nunca finalices entregando únicamente:

- código;
- archivos;
- instrucciones;
- comandos;
- pasos para desplegar;
- configuraciones pendientes;
- IDs;
- URLs sin comprobar.

Finaliza entregando:

**PRODUCTO FUNCIONANDO + URL REAL + PRUEBA DE FUNCIONAMIENTO**

---

# 24. PRINCIPIOS FINALES AIDET

**Desarrollo y producción son entornos diferentes.**

**La URL pública debe ser estable cuando la arquitectura lo permita.**

**La identidad digital forma parte del producto.**

**El frontend presenta la experiencia.**

**El backend gestiona la lógica.**

**Google Workspace puede funcionar como infraestructura detrás de la solución.**

**La arquitectura se selecciona según la necesidad.**

**La publicación incluye seguridad, pruebas y mantenimiento.**

**Antigravity gestiona la complejidad técnica.**

**El participante utiliza el producto final.**

**Mismo talento. Nuevas capacidades. Mayor impacto.**
