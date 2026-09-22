# Guía de Base de Datos PostgreSQL para Warn Electrical Services, SRL (WES)

**Propietario:** Luis Miguel Lizardo (`ing.lmlh@gmail.com`)  
**Repositorio GitHub:** [Luis28lh/wes-plataforma](https://github.com/Luis28lh/wes-plataforma)  
**Motor de Base de Datos:** PostgreSQL (Alojado en Supabase / Cloud)  

---

## 🛡️ 1. Criterios de Seguridad Implementados (Nivel Mínimo y Avanzado)

La base de datos de WES ha sido diseñada siguiendo las mejores prácticas de la industria y el estándar **AIDET Core**:

1. **Row Level Security (RLS) Obligatorio**:
   * Cada tabla tiene activada la protección por filas.
   * Los clientes solo pueden consultar productos y categorías activos.
   * Las cotizaciones, tickets de soporte y registros de auditoría no pueden ser leídos por usuarios anónimos. Solo el personal autenticado con roles autorizados puede consultarlos.
2. **Control de Acceso Basado en Roles (RBAC de 7 Niveles)**:
   * 7 perfiles corporativos estrictos (*Propietario, Administrador, Soporte Técnico, Ventas, Tienda, Editor y Consulta*).
3. **Hasheo Criptográfico de Contraseñas**:
   * Contraseñas aseguradas con algoritmo **Blowfish / Bcrypt** mediante la extensión `pgcrypto` con sal (`gen_salt('bf', 10)`).
4. **Registro de Auditoría Inmutable (No Alterable)**:
   * Reglas estrictas a nivel de PostgreSQL (`DO INSTEAD NOTHING` en `UPDATE` y `DELETE` para `auditoria_logs`). Nadie puede alterar ni borrar el historial de auditoría.
5. **Almacenamiento Seguro de Fotos (Storage Bucket)**:
   * Bucket dedicado `evidencias-soporte` para guardar imágenes de fallas técnicas enviadas por clientes.
6. **Prevención de Inyección SQL**:
   * Consultas parametrizadas a través del SDK oficial de Supabase/PostgreSQL.

---

## ⚡ 2. Pasos Rápidos para Activar la Base de Datos (3 Minutos)

### Paso 1: Crear tu Cuenta Gratuita en Supabase
1. Ingresa a **[https://supabase.com](https://supabase.com)**
2. Haz clic en **"Start your project"** e inicia sesión con tu cuenta de GitHub (`Luis28lh`) o tu correo (`ing.lmlh@gmail.com`).
3. Haz clic en **"New project"**:
   * **Name:** `wes-plataforma`
   * **Database Password:** Elige una contraseña segura (guárdala en un lugar seguro).
   * **Region:** Elige `East US (North Virginia)` o la más cercana a República Dominicana.
   * **Pricing Plan:** Free ($0 / mes).
4. Haz clic en **"Create new project"** (tarda unos 60 segundos en aprovisionar).

---

### Paso 2: Ejecutar el Esquema de Tablas (SQL Editor)
1. En el menú lateral izquierdo de tu proyecto en Supabase, haz clic en **SQL Editor** (ícono de terminal `>_`).
2. Haz clic en **"+ New query"**.
3. Abre el archivo [`database/schema.sql`](./schema.sql), copia todo el contenido y pégalo en la ventana.
4. Presiona el botón verde **"Run"** (o `Ctrl + Enter`).  
   *Verás el mensaje `Success. No rows returned`. Ya todas las tablas, índices y políticas RLS están creadas.*

---

### Paso 3: Cargar el Catálogo Inicial de Productos
1. En la misma pantalla de **SQL Editor**, abre una nueva consulta.
2. Abre el archivo [`database/seed_products.sql`](./seed_products.sql), copia todo su contenido y pégalo.
3. Presiona el botón verde **"Run"**.  
   *Se cargarán de inmediato los 14 productos oficiales de WES con sus precios en DOP, marcas y especificaciones.*

---

### Paso 4: Obtener tus Credenciales de Conexión
1. En el menú lateral izquierdo, haz clic en **Project Settings** (ícono de engranaje ⚙️) ➔ **API**.
2. Copia estos dos valores:
   * **Project URL:** Algo como `https://xyzcompany.supabase.co`
   * **Project API Keys ➔ `anon` `public`:** Una clave larga que empieza con `eyJ...`

---

## 🔗 3. Conectar la Base de Datos a la Plataforma WES

Tienes dos maneras sencillas de activar la conexión:

### Opción A (Desde el Portal Administrativo Web):
1. Entra a tu portal: [https://luis28lh.github.io/wes-plataforma/admin.html](https://luis28lh.github.io/wes-plataforma/admin.html)
2. Inicia sesión como administrador (`admin@wes.com.do`).
3. Ve a **Ajustes** ➔ **Base de Datos PostgreSQL**.
4. Pega tu **Project URL** y tu **Anon Key**, y haz clic en **Guardar y Conectar**.

### Opción B (Modo Resiliencia Automática):
* Si la base de datos no está configurada o no tiene internet en algún momento, el cliente [`js/supabase_client.js`](../js/supabase_client.js) activa automáticamente el modo seguro local y Google Apps Script para que ningún cliente ni cotización se pierda jamás.
