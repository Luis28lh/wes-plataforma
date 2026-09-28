# 🏬 Directorio Oficial de Tiendas y Proveedores de Referencia WES

Este documento establece el directorio permanente de tiendas, distribuidores mayoristas y fabricantes oficiales para consultar especificaciones técnicas, galerías de fotos en alta definición, manuales y modelos de referencia cada vez que se agregue o enriquezca un producto en la plataforma **Warn Electrical Services (WES)**.

---

## 📌 Protocolo Obligatorio de Enriquecimiento (Estándar Alibaba)

Cada vez que se procese un producto en el catálogo WES:
1. **Búsqueda Cruzada:** Consultar las tiendas de este directorio según la categoría del producto.
2. **Extracción Técnica:** Obtener código de parte del fabricante (OEM / SKU), dimensiones exactas (mm), peso neto, voltajes, amperajes y certificaciones.
3. **Descarga de Fotografías:** Descargar imágenes reales de alta resolución y guardarlas localmente en `assets/products/` para garantizar que la plataforma nunca dependa de enlaces externos propensos a expirar.
4. **Estructuración Alibaba:**
   - **Key Attributes:** Cuadrícula de 6 a 10 atributos esenciales.
   - **Galería Multi-ángulo:** Fotos frontal, posterior, ángulos de terminales y accesorios.
   - **Reseñas Locales Verificadas:** Opiniones técnicas de clientes en República Dominicana.
5. **Sincronización:** Actualizar `js/products.js`, base de datos Supabase (SQL) y desplegar en producción.

---

## 🏢 Directorio de Empresas y Fuentes de Consulta

### 1. 🔵 Omega Tech (República Dominicana)
* **Portal Oficial:** [https://tienda.omega.com.do](https://tienda.omega.com.do)
* **Plantilla de Búsqueda:** `https://tienda.omega.com.do/es/search/buscar?busqueda={query}`
* **Plantilla de Producto Web:** `https://tienda.omega.com.do/es/product/consul/{id}`
* **API REST Directa de Consulta:**
  * **Detalle de Producto:** `https://sis.omega.com.do/rest/productos/get/producto/{id}`
  * **Categorías:** `https://sis.omega.com.do/rest/clasificacion/get/categoria/{id}`
  * **Servidor CDN de Imágenes:** `https://sis.omega.com.do/upload/{nombre_foto}`
* **Categorías Clave Conocidas:**
  * **Categoría 180:** Baterías AGM / VRLA (Forza FUB-1245, FUB-1270, FUB-1290, CSB)
  * **Categoría 179:** UPS y Sistemas de Respaldo
  * **Categoría 181:** Reguladores de Voltaje
  * **Categoría 182:** Cableado de Red y UTP
* **Especialidad:** Respaldo de energía, marcas Forza, Dahua, CSB, UPS, cableado estructurado.

---

### 2. 🟢 Winterbournea (Seguridad Electrónica y Automatización CAME)
* **Portal Oficial:** [https://store.winterbournea.com](https://store.winterbournea.com)
* **Plantilla de Búsqueda:** `https://store.winterbournea.com/buscar?controller=search&s={query}`
* **Plantilla de Producto Web:** `https://store.winterbournea.com/producto-p-{id}.htm`
* **Especialidad:**
  * Motores para portón corredizo y batiente CAME (BX-74, BX-78, BK-1200, BK-1800, Krono, Ferni).
  * Tarjetas electrónicas de mando (ZBX74-78, ZLJ24, ZL180).
  * Mandos y controles remotos CAME (TOP44RBN, TOP432EE, ATOMO).
  * Fotoceldas de seguridad DIR10, DIR20, Delta.
  * Cremalleras de acero galvanizado y nylon para portones.
  * Cerraduras electromagnéticas y repuestos mecánicos originales.

---

### 3. 🔴 CAME Group / CAME Americas (Fabricante Oficial)
* **Portal España / Internacional:** [https://www.came.com/es/](https://www.came.com/es/)
* **Portal Américas:** [https://www.cameamericas.com](https://www.cameamericas.com)
* **Plantilla de Búsqueda:** `https://www.came.com/es/buscar?q={query}`
* **Especialidad:**
  * Manuales oficiales de usuario e instalación en formato PDF.
  * Diagramas de conexionado eléctrico oficial (borneras 24V, 110V, 230V).
  * Cotas milimétricas para obras civiles de anclaje de motores.
  * Guías de programación de finales de carrera y switches DIP.

---

### 4. 🟣 Cecomsa (República Dominicana)
* **Portal Oficial:** [https://cecomsa.com](https://cecomsa.com)
* **Plantilla de Búsqueda:** `https://cecomsa.com/catalogsearch/result/?q={query}`
* **Especialidad:**
  * Protección eléctrica y UPS corporativas (APC, Tripp-Lite, Forza).
  * Bobinas de cable UTP Furukawa, Panduit, CommScope (Cat 5e, Cat 6, Exterior).
  * Gabinetes de pared y racks para telecomunicaciones y CCTV.

---

### 5. 🟡 Steren República Dominicana
* **Portal Oficial:** [https://www.steren.com.do](https://www.steren.com.do)
* **Plantilla de Búsqueda:** `https://www.steren.com.do/catalogsearch/result/?q={query}`
* **Especialidad:**
  * Conectores de video BNC, conectores de energía DC macho/hembra.
  * Baluns de video para cámaras HD-CVI / TVI / AHD.
  * Fuentes conmutadas de pared 12V 1A, 2A, 5A.
  * Herramientas de instalación (ponchadoras RJ45, desaisladores, testers de cable).

---

### 6. 🌐 Plataforma Alibaba B2B (Referencia Estilística y Arquitectura)
* **Portal Oficial:** [https://www.alibaba.com](https://www.alibaba.com)
* **Plantilla de Búsqueda:** `https://www.alibaba.com/trade/search?SearchText={query}`
* **Especialidad:**
  * Modelo visual y diseño de fichas de alta conversión.
  * Cuadrículas comparativas 'Key Attributes'.
  * Galerías multi-ángulo en pestañas interactivas.
  * Verificación visual de calidad y confianza técnica.

---

## 🛠️ Herramienta Automatizada de Consulta

El proyecto incluye el script `scripts/consultar_tiendas_referencia.js` para automatizar consultas directas por consola:

```bash
# Consultar un término o producto
node scripts/consultar_tiendas_referencia.js "bateria 12v"
node scripts/consultar_tiendas_referencia.js "came bx"
```
