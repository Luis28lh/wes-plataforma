# WARN ELECTRICAL SERVICES, SRL (WES)
## Plataforma Web Empresarial, Catálogo Digital y Centro de Soporte
### Taller 2: Publicación de Productos Digitales — Estándar AIDET v2.0

---

## 1. Resumen Ejecutivo de la Solución

Esta solución implementa la plataforma web empresarial para **Warn Electrical Services, SRL (WES)**, diseñada y construida según las especificaciones técnicas, corporativas y operativas de la **Guía Maestra de Despliegue y Publicación Web AIDET v2.0**.

### Datos Corporativos Incorporados del Manual Oficial:
* **Razón Social:** Warn Electrical Services, SRL (WES)
* **Incorporación:** Fundada el 9 de julio de 2017 · Incorporada por Decreto No. 326-06 del 11 de diciembre de 2017
* **Capital y Socios:** Iniciada con 3 Socios y RD$100,000.00
* **Sede:** Autopista Ramón Cáceres, Plaza Megatone, Moca, Provincia Espaillat, República Dominicana
* **Horarios Oficiales:**
  * Lunes a Viernes: 7:30 AM – 6:00 PM (Receso almuerzo 12:00 PM – 2:00 PM)
  * Sábados: 8:00 AM – 1:00 PM
* **Estructura Interna:** Administración; Ventas; Instalación, Soporte y Seguimiento
* **Misión, Visión y Valores:** Integrados íntegramente del manual corporativo (Servicios, Puntualidad, Ética, Emprendedores, Responsabilidad)
* **Colores Institucionales:** Azul Corporativo (`#0D2A5C`), Amarillo Relámpago (`#F5B300`) y Blanco

---

## 2. Módulos y Capacidades Implementadas

1. **Portada & Hero:**
   * Propuesta de valor de alto impacto y métricas de confianza (+8 años, 15 especialistas).
   * 4 botones de acción rápida (*Ver productos*, *Solicitar cotización*, *Solicitar soporte*, *WhatsApp*).
   * 3 beneficios estratégicos: *Asesoría Personalizada*, *Instalación Profesional*, *Soporte Técnico Continuo*.
   * Cuadrícula interactiva de categorías destacadas con llamado a la acción comercial.

2. **Sección Institucional y Fundadores:**
   * Historia real y valores de la empresa.
   * 3 tarjetas para los fundadores con designaciones ejecutivas y marco de reserva *"Fotografía próximamente"* sin rostros falsos generados por IA.

3. **Tienda y Catálogo Comercial:**
   * Catálogo interactivo de equipos (CCTV, cámaras IP, biométricos, cerraduras inteligentes, switches PoE, cableado Cat6, fuentes reguladas).
   * Buscador en tiempo real por texto, código y características.
   * Filtros dinámicos por Categoría, Marca y Disponibilidad.
   * Botón directo *"Agregar a cotización"* y *"Consultar por WhatsApp"*.

4. **Sistema de Cotización (Cotizador Inteligente):**
   * Carrito flotante con contador en tiempo real.
   * Formulario completo con validación y selección de tipo de cliente.
   * Generación automática de código correlativo único: `COT-2026-XXXX`.
   * Almacenamiento local persistente + despacho opcional al backend de Google Apps Script.

5. **Centro de Servicios Técnicos:**
   * 6 servicios especializados con llamada a evaluación técnica.

6. **Módulo de Soporte Técnico con Evidencia Fotográfica:**
   * Formulario técnico con clasificación de fallas y selector de prioridad (*Baja*, *Media*, *Alta*).
   * Módulo Drag & Drop para subir hasta 5 fotografías con previsualización en miniatura y eliminación selectiva antes de enviar.
   * Generación automática de número de ticket único: `SOP-2026-XXXX`.

7. **Contacto y Geolocalización:**
   * Datos reales de la sede en Plaza Megatone, Moca.
   * Mapa de Google Maps integrado.
   * Botón flotante accesible de WhatsApp.

8. **Panel Administrativo Privado (`admin` / `wes2026`):**
   * Acceso protegido con contraseña.
   * Gestión integral de cotizaciones con cambio de estado y notas internas.
   * Gestión de tickets de soporte con visualizador de fotografías ampliadas.
   * Administrador de productos (crear, editar, activar/desactivar).
   * Configuración de textos y enlace al Web App de Google Apps Script.
   * Exportación instantánea a CSV.

9. **Backend en Google Apps Script (`backend/Code.gs`):**
   * Integración con Google Sheets para registro en tiempo real.
   * Despacho automático de correos con formato corporativo HTML para la empresa y para el cliente.
   * Almacenamiento seguro de fotos en Google Drive.

---

## 3. Instrucciones para la Versión de Prueba Local

Para visualizar y probar la plataforma en este equipo:
1. Abre tu navegador web en: **`http://localhost:3000`**
2. Para acceder al panel administrativo, haz clic en **"Portal Administrador"** en la barra superior o en el pie de página.
   * **Usuario:** `admin`
   * **Contraseña:** `wes2026`
