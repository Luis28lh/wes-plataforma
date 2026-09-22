-- ============================================================================
-- PLATAFORMA EMPRESARIAL WARN ELECTRICAL SERVICES, SRL (WES)
-- ESQUEMA MAESTRO DE BASE DE DATOS POSTGRESQL (v2.0)
-- Propietario: Luis Miguel Lizardo (ing.lmlh@gmail.com)
-- Criterios de Seguridad: RLS (Row Level Security), RBAC 7 Roles, Encriptación y Auditoría Inmutable
-- ============================================================================

-- Habilitar extensión para UUIDs criptográficos y pgcrypto
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABLA DE ROLES DEL SISTEMA (RBAC 7 ROLES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.roles (
    id VARCHAR(30) PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE,
    descripcion TEXT,
    nivel_prioridad INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar los 7 roles corporativos de WES
INSERT INTO public.roles (id, nombre, descripcion, nivel_prioridad) VALUES
('propietario', 'Propietario / Superadmin', 'Acceso irrestricto y superadministración total de la plataforma', 7),
('admin', 'Administrador General', 'Gestión operativa, asignaciones y aprobaciones globales', 6),
('soporte', 'Gestor de Soporte Técnico', 'Atención, diagnóstico y resolución de tickets con fotos de evidencia', 5),
('ventas', 'Gestor de Cotizaciones / Ventas', 'Seguimiento de cotizaciones, precios y contacto directo con clientes', 4),
('tienda', 'Gestor de Tienda / Inventario', 'Control de stock, marcas, productos y especificaciones técnicas', 3),
('editor', 'Editor de Contenido', 'Gestión de textos informativos, fundadores y casos de éxito', 2),
('consulta', 'Usuario de Consulta / Auditor', 'Acceso de solo lectura para auditorías y revisión de métricas', 1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. TABLA DE USUARIOS Y CONTROL DE ACCESO
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(150) NOT NULL UNIQUE,
    nombre_completo VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id VARCHAR(30) NOT NULL REFERENCES public.roles(id) ON UPDATE CASCADE,
    dos_pasos_activo BOOLEAN DEFAULT TRUE,
    codigo_2fa_secreto VARCHAR(10) DEFAULT '202601',
    intentos_fallidos INT DEFAULT 0,
    bloqueado_hasta TIMESTAMPTZ,
    ultimo_acceso TIMESTAMPTZ,
    ultimo_ip VARCHAR(45),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usuario Propietario Inicial (Luis Miguel Lizardo)
INSERT INTO public.usuarios (email, nombre_completo, password_hash, rol_id, dos_pasos_activo, activo)
VALUES (
    'wes.inform@gmail.com',
    'Luis Miguel Lizardo',
    crypt('Wes2026!', gen_salt('bf', 10)),
    'propietario',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Usuario Administrador Adicional
INSERT INTO public.usuarios (email, nombre_completo, password_hash, rol_id, dos_pasos_activo, activo)
VALUES (
    'admin@wes.com.do',
    'Administrador WES',
    crypt('Wes2026!', gen_salt('bf', 10)),
    'admin',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 3. TABLA DE CATEGORÍAS Y PRODUCTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categorias (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'fa-box',
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.categorias (id, nombre, descripcion, icono, orden) VALUES
('camaras', 'Cámaras de seguridad', 'Sistemas de CCTV, IP, domo, bala y visión nocturna', 'fa-video', 1),
('grabadores', 'Grabadores DVR y NVR', 'Grabadores digitales y de red con puertos PoE y almacenamiento masivo', 'fa-hdd', 2),
('acceso', 'Controles de acceso', 'Terminales biométricos faciales, de huella digital y tarjetas RFID', 'fa-id-card', 3),
('cerraduras', 'Cerraduras inteligentes y eléctricas', 'Cerraduras digitales biométricas, electroimanes y pestillos', 'fa-lock', 4),
('intercom', 'Videoporteros e intercomunicadores', 'Pantallas táctiles y frentes de calle IP con atención remota', 'fa-door-open', 5),
('alarmas', 'Alarmas y sensores', 'Kits inalámbricos WiFi/GSM, sensores de movimiento y sirenas', 'fa-bell', 6),
('redes', 'Redes y conectividad', 'Switches PoE Gigabit, routers y gabinetes de comunicación', 'fa-network-wired', 7),
('energia', 'Fuentes y respaldo eléctrico', 'Inversores senoidales, baterías de ciclo profundo y cajas de poder', 'fa-bolt', 8),
('cables', 'Cables y accesorios', 'Bobinas de cable UTP Cat6 100% cobre exterior e interior', 'fa-ethernet', 9)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.productos (
    id VARCHAR(50) PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    marca VARCHAR(60) NOT NULL,
    categoria_id VARCHAR(50) NOT NULL REFERENCES public.categorias(id) ON UPDATE CASCADE,
    descripcion TEXT NOT NULL,
    caracteristicas JSONB DEFAULT '[]'::jsonb,
    precio NUMERIC(12, 2) NOT NULL CHECK (precio >= 0),
    moneda VARCHAR(5) DEFAULT 'DOP',
    disponibilidad VARCHAR(30) DEFAULT 'Disponible',
    stock INT DEFAULT 10 CHECK (stock >= 0),
    imagen_url TEXT NOT NULL,
    destacado BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. TABLA DE CLIENTES Y COTIZACIONES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(120) NOT NULL,
    empresa VARCHAR(120),
    rnc_cedula VARCHAR(30),
    telefono VARCHAR(30) NOT NULL,
    email VARCHAR(120) NOT NULL,
    ciudad VARCHAR(60) DEFAULT 'Moca',
    direccion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cotizaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_cotizacion VARCHAR(30) NOT NULL UNIQUE,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    itbis NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    estado VARCHAR(30) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'aprobada', 'rechazada', 'facturada')),
    notas_cliente TEXT,
    notas_internas TEXT,
    pdf_generado_url TEXT,
    atendido_por UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cotizacion_detalles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cotizacion_id UUID NOT NULL REFERENCES public.cotizaciones(id) ON DELETE CASCADE,
    producto_id VARCHAR(50) REFERENCES public.productos(id) ON DELETE SET NULL,
    nombre_producto VARCHAR(150) NOT NULL,
    codigo_producto VARCHAR(50),
    precio_unitario NUMERIC(12, 2) NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    subtotal NUMERIC(12, 2) NOT NULL
);

-- ============================================================================
-- 5. TABLA DE TICKETS DE SOPORTE Y FOTOS DE EVIDENCIA
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tickets_soporte (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_ticket VARCHAR(30) NOT NULL UNIQUE,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    tipo_servicio VARCHAR(80) NOT NULL,
    direccion_servicio TEXT NOT NULL,
    descripcion_problema TEXT NOT NULL,
    estado VARCHAR(30) DEFAULT 'abierto' CHECK (estado IN ('abierto', 'en_diagnostico', 'repuesto_pendiente', 'resuelto', 'cancelado')),
    prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
    tecnico_asignado UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    diagnostico_tecnico TEXT,
    resolucion TEXT,
    costo_reparacion NUMERIC(12, 2) DEFAULT 0,
    fecha_resolucion TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ticket_evidencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES public.tickets_soporte(id) ON DELETE CASCADE,
    archivo_url TEXT NOT NULL,
    nombre_original VARCHAR(255),
    tipo_mime VARCHAR(80),
    tamano_bytes INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. MENSAJES DE CONTACTO Y ASESORÍA
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mensajes_contacto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_remitente VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    telefono VARCHAR(30),
    asunto VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    respondido BOOLEAN DEFAULT FALSE,
    atendido_por UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. AUDITORÍA INMUTABLE (LOGS DE SEGURIDAD)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.auditoria_logs (
    id BIGSERIAL PRIMARY KEY,
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    usuario_email VARCHAR(150),
    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(60) NOT NULL,
    detalles JSONB DEFAULT '{}'::jsonb,
    ip_origen VARCHAR(45),
    user_agent TEXT,
    fecha_hora TIMESTAMPTZ DEFAULT NOW()
);

-- Impedir modificación o borrado de registros de auditoría (Seguridad estricta)
CREATE OR REPLACE RULE no_update_auditoria AS ON UPDATE TO public.auditoria_logs DO INSTEAD NOTHING;
CREATE OR REPLACE RULE no_delete_auditoria AS ON DELETE TO public.auditoria_logs DO INSTEAD NOTHING;

-- ============================================================================
-- 8. FEATURE FLAGS (INTERRUPTORES PÚBLICOS EN TIEMPO REAL)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.feature_flags (
    clave VARCHAR(60) PRIMARY KEY,
    descripcion TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    categoria VARCHAR(40) DEFAULT 'general',
    updated_by UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.feature_flags (clave, descripcion, activo, categoria) VALUES
('showPrices', 'Muestra u oculta los precios de los productos en el catálogo público', TRUE, 'tienda'),
('enableQuotes', 'Habilita o pausa temporalmente el generador de cotizaciones', TRUE, 'cotizaciones'),
('enableSupportTickets', 'Habilita o pausa la recepción de nuevos tickets de soporte técnico', TRUE, 'soporte'),
('hideOutOfStock', 'Oculta automáticamente productos que no tengan disponibilidad inmediata', FALSE, 'tienda'),
('showCategories', 'Muestra el selector visual de categorías destacadas', TRUE, 'inicio'),
('showFounders', 'Muestra la sección del equipo directivo y fundadores de WES', TRUE, 'inicio'),
('showMap', 'Muestra el mapa interactivo Leaflet de ubicación en Moca', TRUE, 'contacto'),
('enableWhatsAppFloat', 'Muestra el botón flotante directo a WhatsApp (+1 849 207-5474)', TRUE, 'contacto')
ON CONFLICT (clave) DO NOTHING;

-- ============================================================================
-- 9. ÍNDICES DE ALTO RENDIMIENTO
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON public.productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_destacado ON public.productos(destacado) WHERE activo = TRUE;
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente ON public.cotizaciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON public.cotizaciones(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_cliente ON public.tickets_soporte(cliente_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON public.tickets_soporte(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_prioridad ON public.tickets_soporte(prioridad);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON public.auditoria_logs(fecha_hora DESC);

-- ============================================================================
-- 10. POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY)
-- ============================================================================
-- Habilitar RLS en todas las tablas
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizacion_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets_soporte ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_evidencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes_contacto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- A) Acceso Público de Lectura (Catálogo y Opciones de Web)
CREATE POLICY "Publico puede ver categorias activas" ON public.categorias
    FOR SELECT USING (activo = TRUE);

CREATE POLICY "Publico puede ver productos activos" ON public.productos
    FOR SELECT USING (activo = TRUE);

CREATE POLICY "Publico puede consultar feature flags" ON public.feature_flags
    FOR SELECT USING (TRUE);

-- B) Acceso Público de Creación (Clientes creando cotizaciones, tickets y mensajes)
CREATE POLICY "Publico puede registrar sus datos de cliente" ON public.clientes
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Publico puede crear cotizaciones" ON public.cotizaciones
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Publico puede insertar items en cotizaciones" ON public.cotizacion_detalles
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Publico puede crear tickets de soporte" ON public.tickets_soporte
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Publico puede subir evidencias de tickets" ON public.ticket_evidencias
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Publico puede enviar mensajes de contacto" ON public.mensajes_contacto
    FOR INSERT WITH CHECK (TRUE);

-- C) Acceso Administrativo (Usuarios Autenticados tienen gestión completa)
CREATE POLICY "Personal autorizado gestiona todo" ON public.usuarios
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Personal autorizado gestiona productos" ON public.productos
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Personal autorizado gestiona cotizaciones" ON public.cotizaciones
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Personal autorizado gestiona tickets" ON public.tickets_soporte
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Personal autorizado gestiona contactos" ON public.mensajes_contacto
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Personal autorizado consulta auditoria" ON public.auditoria_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Personal autorizado actualiza feature flags" ON public.feature_flags
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- 11. BUCKET DE ALMACENAMIENTO DE FOTOS (SUPABASE STORAGE)
-- ============================================================================
-- Crea el bucket para fotos de tickets si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidencias-soporte', 'evidencias-soporte', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Política de subida de fotos por clientes
CREATE POLICY "Permitir subida de fotos de soporte" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'evidencias-soporte');

-- Política de lectura pública de fotos de tickets
CREATE POLICY "Permitir ver fotos de soporte" ON storage.objects
    FOR SELECT USING (bucket_id = 'evidencias-soporte');

-- ============================================================================
-- FIN DEL ESQUEMA MAESTRO
-- ============================================================================
