const fs = require('fs');
const path = require('path');
const { INITIAL_PRODUCTS } = require('../js/products.js');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return "'[]'::jsonb";
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

function generateSQL() {
  console.log(`Iniciando generación de SQL para ${INITIAL_PRODUCTS.length} productos...`);

  let sql = `-- ============================================================================
-- WARN ELECTRICAL SERVICES, SRL (WES)
-- SCRIPT MAESTRO DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- CATÁLOGO COMPLETO: 237 PRODUCTOS + VARIABLES DE OFERTAS, NOVEDADES Y GALERÍAS
-- Generado automáticamente desde js/products.js
-- ============================================================================
-- INSTRUCCIONES DE APLICACIÓN:
-- 1. Inicie sesión en Supabase Dashboard: https://supabase.com/dashboard/project/tzvuloziazkbcfdwzzff
-- 2. Diríjase a la sección "SQL Editor" en el menú lateral izquierdo.
-- 3. Cree una nueva consulta (+ New query), pegue TODO este contenido y presione "Run" (Ctrl + Enter).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PASO 1: CREAR / ACTUALIZAR TABLA DE PRODUCTOS Y SUS COLUMNAS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.productos (
    id VARCHAR(50) PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    categoria_id VARCHAR(50) NOT NULL,
    descripcion TEXT,
    caracteristicas JSONB DEFAULT '[]'::jsonb,
    precio NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    moneda VARCHAR(10) DEFAULT 'DOP',
    disponibilidad VARCHAR(50) DEFAULT 'Disponible',
    stock INTEGER NOT NULL DEFAULT 0,
    imagen_url TEXT,
    destacado BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    en_oferta BOOLEAN DEFAULT false,
    novedad BOOLEAN DEFAULT false,
    precio_anterior NUMERIC(12,2) DEFAULT NULL,
    tipo_promocion VARCHAR(50) DEFAULT 'normal',
    manual_url TEXT DEFAULT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    key_attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asegurar columnas si la tabla ya existía previamente con menos campos
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS moneda VARCHAR(10) DEFAULT 'DOP';
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS disponibilidad VARCHAR(50) DEFAULT 'Disponible';
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS en_oferta BOOLEAN DEFAULT false;
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS novedad BOOLEAN DEFAULT false;
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS precio_anterior NUMERIC(12,2) DEFAULT NULL;
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS tipo_promocion VARCHAR(50) DEFAULT 'normal';
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS manual_url TEXT DEFAULT NULL;
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS key_attributes JSONB DEFAULT '{}'::jsonb;

-- ----------------------------------------------------------------------------
-- PASO 2: CONFIGURAR POLÍTICAS DE ACCESO (ROW LEVEL SECURITY - RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de productos" ON public.productos;
DROP POLICY IF EXISTS "Permitir lectura de productos" ON public.productos;
DROP POLICY IF EXISTS "Permitir sincronizar catalogo de productos" ON public.productos;
DROP POLICY IF EXISTS "Permitir todo a public" ON public.productos;

-- Permitir lectura y escritura pública para que la web y el panel admin puedan operar
CREATE POLICY "Permitir lectura de productos"
ON public.productos FOR SELECT TO PUBLIC
USING (true);

CREATE POLICY "Permitir sincronizar catalogo de productos"
ON public.productos FOR ALL TO PUBLIC
USING (true)
WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- PASO 3: CREAR TABLAS AUXILIARES (COTIZACIONES, SOPORTE, RESEÑAS, CONTACTO)
-- ----------------------------------------------------------------------------
-- Clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    empresa VARCHAR(255),
    rnc_cedula VARCHAR(50),
    telefono VARCHAR(50),
    email VARCHAR(255),
    ciudad VARCHAR(100) DEFAULT 'Moca',
    direccion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo clientes" ON public.clientes;
CREATE POLICY "Permitir todo clientes" ON public.clientes FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Cotizaciones
CREATE TABLE IF NOT EXISTS public.cotizaciones (
    id VARCHAR(50) PRIMARY KEY,
    codigo_cotizacion VARCHAR(50) UNIQUE NOT NULL,
    cliente_id VARCHAR(50),
    subtotal NUMERIC(12,2) DEFAULT 0,
    itbis NUMERIC(12,2) DEFAULT 0,
    total NUMERIC(12,2) DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'pendiente',
    notas_cliente TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo cotizaciones" ON public.cotizaciones;
CREATE POLICY "Permitir todo cotizaciones" ON public.cotizaciones FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Detalles de Cotizaciones
CREATE TABLE IF NOT EXISTS public.cotizacion_detalles (
    id VARCHAR(50) PRIMARY KEY,
    cotizacion_id VARCHAR(50) NOT NULL,
    producto_id VARCHAR(50),
    nombre_producto VARCHAR(255),
    codigo_producto VARCHAR(50),
    precio_unitario NUMERIC(12,2) DEFAULT 0,
    cantidad INTEGER DEFAULT 1,
    subtotal NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.cotizacion_detalles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo cotizacion_detalles" ON public.cotizacion_detalles;
CREATE POLICY "Permitir todo cotizacion_detalles" ON public.cotizacion_detalles FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Tickets de Soporte
CREATE TABLE IF NOT EXISTS public.tickets_soporte (
    id VARCHAR(50) PRIMARY KEY,
    codigo_ticket VARCHAR(50) UNIQUE NOT NULL,
    cliente_id VARCHAR(50),
    tipo_servicio VARCHAR(100),
    direccion_servicio TEXT,
    descripcion_problema TEXT,
    estado VARCHAR(50) DEFAULT 'abierto',
    prioridad VARCHAR(50) DEFAULT 'media',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.tickets_soporte ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo tickets_soporte" ON public.tickets_soporte;
CREATE POLICY "Permitir todo tickets_soporte" ON public.tickets_soporte FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Evidencias de Soporte
CREATE TABLE IF NOT EXISTS public.ticket_evidencias (
    id VARCHAR(50) PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL,
    archivo_url TEXT NOT NULL,
    nombre_original VARCHAR(255),
    tipo_mime VARCHAR(100),
    tamano_bytes BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.ticket_evidencias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo ticket_evidencias" ON public.ticket_evidencias;
CREATE POLICY "Permitir todo ticket_evidencias" ON public.ticket_evidencias FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Mensajes de Contacto
CREATE TABLE IF NOT EXISTS public.mensajes_contacto (
    id VARCHAR(50) PRIMARY KEY,
    nombre_remitente VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(50),
    asunto VARCHAR(255),
    mensaje TEXT,
    leido BOOLEAN DEFAULT false,
    respondido BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.mensajes_contacto ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo mensajes_contacto" ON public.mensajes_contacto;
CREATE POLICY "Permitir todo mensajes_contacto" ON public.mensajes_contacto FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Reseñas de Productos
CREATE TABLE IF NOT EXISTS public.resenas_productos (
    id VARCHAR(50) PRIMARY KEY,
    producto_id VARCHAR(50) NOT NULL,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_ciudad VARCHAR(255) DEFAULT 'Moca, Rep. Dom.',
    calificacion_general NUMERIC(3,2) DEFAULT 5.0,
    calidad_producto NUMERIC(3,2) DEFAULT 5.0,
    calidad_envio NUMERIC(3,2) DEFAULT 5.0,
    calidad_servicio NUMERIC(3,2) DEFAULT 5.0,
    comentario TEXT,
    verificado BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.resenas_productos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo resenas_productos" ON public.resenas_productos;
CREATE POLICY "Permitir todo resenas_productos" ON public.resenas_productos FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Manuales de Productos
CREATE TABLE IF NOT EXISTS public.manuales_productos (
    id VARCHAR(50) PRIMARY KEY,
    producto_id VARCHAR(50),
    sku VARCHAR(50),
    titulo VARCHAR(255),
    archivo_url TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.manuales_productos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo manuales_productos" ON public.manuales_productos;
CREATE POLICY "Permitir todo manuales_productos" ON public.manuales_productos FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Auditoría
CREATE TABLE IF NOT EXISTS public.auditoria_logs (
    id BIGSERIAL PRIMARY KEY,
    usuario_id VARCHAR(50),
    usuario_email VARCHAR(255),
    accion VARCHAR(100),
    modulo VARCHAR(100),
    detalles JSONB DEFAULT '{}'::jsonb,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.auditoria_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo auditoria_logs" ON public.auditoria_logs;
CREATE POLICY "Permitir todo auditoria_logs" ON public.auditoria_logs FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- PASO 4: LIMPIAR DATOS DE PRUEBA INICIALES (MOCK PROD-001 A PROD-014)
-- ----------------------------------------------------------------------------
DELETE FROM public.productos WHERE id LIKE 'prod-%';

-- ----------------------------------------------------------------------------
-- PASO 5: INSERTAR / ACTUALIZAR EL CATÁLOGO OFICIAL COMPLETO (237 PRODUCTOS)
-- ----------------------------------------------------------------------------
INSERT INTO public.productos (
    id,
    codigo,
    nombre,
    marca,
    categoria_id,
    descripcion,
    caracteristicas,
    precio,
    moneda,
    disponibilidad,
    stock,
    imagen_url,
    destacado,
    activo,
    en_oferta,
    novedad,
    precio_anterior,
    tipo_promocion,
    manual_url,
    gallery_images,
    key_attributes,
    updated_at
)
VALUES
`;

  const rows = INITIAL_PRODUCTS.map(p => {
    const id = p.id || ('odoo-' + (p.codigo || p.code));
    const codigo = p.codigo || p.code || id;
    const nombre = p.nombre || p.name || 'Producto WES';
    const marca = p.marca || p.brand || 'WES';
    const categoria = p.categoria_id || p.category || 'otros';
    const descripcion = p.descripcion || p.description || '';
    const caracteristicas = p.caracteristicas || p.features || [];
    const precio = Number(p.precio || p.price || 0);
    const moneda = p.moneda || p.currency || 'DOP';
    const disponibilidad = p.disponibilidad || p.availability || 'Disponible';
    const stock = Number(p.stock !== undefined ? p.stock : 0);
    const imagenUrl = p.imagen_url || p.image || '';
    const destacado = Boolean(p.destacado || p.featured);
    const activo = p.activo !== false && p.active !== false;
    const enOferta = Boolean(p.en_oferta || p.is_offer);
    const novedad = Boolean(p.novedad || p.is_new);
    const precioAnterior = p.precio_anterior ? Number(p.precio_anterior) : null;
    const tipoPromocion = p.tipo_promocion || (enOferta ? 'oferta' : 'normal');
    const manualUrl = p.manual_url || p.manualUrl || null;
    const galleryImages = Array.isArray(p.gallery_images) ? p.gallery_images : [];
    const keyAttributes = (p.key_attributes && typeof p.key_attributes === 'object') ? p.key_attributes : {};

    const values = [
      escapeSql(id),
      escapeSql(codigo),
      escapeSql(nombre),
      escapeSql(marca),
      escapeSql(categoria),
      escapeSql(descripcion),
      escapeJson(caracteristicas),
      precio,
      escapeSql(moneda),
      escapeSql(disponibilidad),
      stock,
      escapeSql(imagenUrl),
      destacado ? 'true' : 'false',
      activo ? 'true' : 'false',
      enOferta ? 'true' : 'false',
      novedad ? 'true' : 'false',
      precioAnterior !== null ? precioAnterior : 'NULL',
      escapeSql(tipoPromocion),
      escapeSql(manualUrl),
      escapeJson(galleryImages),
      escapeJson(keyAttributes),
      'NOW()'
    ];

    return `(${values.join(', ')})`;
  });

  sql += rows.join(',\n') + '\n';
  sql += `ON CONFLICT (id) DO UPDATE SET
    codigo = EXCLUDED.codigo,
    nombre = EXCLUDED.nombre,
    marca = EXCLUDED.marca,
    categoria_id = EXCLUDED.categoria_id,
    descripcion = EXCLUDED.descripcion,
    caracteristicas = EXCLUDED.caracteristicas,
    precio = EXCLUDED.precio,
    moneda = EXCLUDED.moneda,
    disponibilidad = EXCLUDED.disponibilidad,
    stock = EXCLUDED.stock,
    imagen_url = EXCLUDED.imagen_url,
    destacado = EXCLUDED.destacado,
    activo = EXCLUDED.activo,
    en_oferta = EXCLUDED.en_oferta,
    novedad = EXCLUDED.novedad,
    precio_anterior = EXCLUDED.precio_anterior,
    tipo_promocion = EXCLUDED.tipo_promocion,
    manual_url = EXCLUDED.manual_url,
    gallery_images = EXCLUDED.gallery_images,
    key_attributes = EXCLUDED.key_attributes,
    updated_at = NOW();

-- ----------------------------------------------------------------------------
-- PASO 6: CONSULTA DE VALIDACIÓN
-- ----------------------------------------------------------------------------
SELECT 
    COUNT(*) AS total_productos_en_base_de_datos,
    COUNT(*) FILTER (WHERE en_oferta = true) AS productos_en_oferta,
    COUNT(*) FILTER (WHERE novedad = true) AS productos_novedades,
    COUNT(*) FILTER (WHERE manual_url IS NOT NULL) AS con_manual_tecnico,
    COUNT(*) FILTER (WHERE gallery_images <> '[]'::jsonb) AS con_galeria_fotos
FROM public.productos;
`;

  // Guardar en la raíz y en database/
  const rootDest = path.join(__dirname, '..', '..', 'CARGAR_CATALOGO_237_PRODUCTOS_SUPABASE.sql');
  const dbDest = path.join(__dirname, '..', 'database', 'CARGAR_CATALOGO_237_PRODUCTOS_SUPABASE.sql');

  // Asegurar directorio database
  const dbDir = path.dirname(dbDest);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  fs.writeFileSync(rootDest, sql, 'utf8');
  fs.writeFileSync(dbDest, sql, 'utf8');

  console.log(`✅ Archivo SQL generado exitosamente en:`);
  console.log(`   1. ${rootDest} (${(fs.statSync(rootDest).size / 1024).toFixed(1)} KB)`);
  console.log(`   2. ${dbDest} (${(fs.statSync(dbDest).size / 1024).toFixed(1)} KB)`);
}

generateSQL();
