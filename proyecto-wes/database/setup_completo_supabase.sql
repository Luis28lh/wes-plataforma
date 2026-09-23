-- ============================================================================
-- PLATAFORMA EMPRESARIAL WARN ELECTRICAL SERVICES, SRL (WES)
-- ESQUEMA MAESTRO DE BASE DE DATOS POSTGRESQL (v2.0)
-- Propietario: Luis Miguel Lizardo (ing.lmlh@gmail.com)
-- Criterios de Seguridad: RLS (Row Level Security), RBAC 7 Roles, EncriptaciÃ³n y AuditorÃ­a Inmutable
-- ============================================================================

-- Habilitar extensiÃ³n para UUIDs criptogrÃ¡ficos y pgcrypto
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
('propietario', 'Propietario / Superadmin', 'Acceso irrestricto y superadministraciÃ³n total de la plataforma', 7),
('admin', 'Administrador General', 'GestiÃ³n operativa, asignaciones y aprobaciones globales', 6),
('soporte', 'Gestor de Soporte TÃ©cnico', 'AtenciÃ³n, diagnÃ³stico y resoluciÃ³n de tickets con fotos de evidencia', 5),
('ventas', 'Gestor de Cotizaciones / Ventas', 'Seguimiento de cotizaciones, precios y contacto directo con clientes', 4),
('tienda', 'Gestor de Tienda / Inventario', 'Control de stock, marcas, productos y especificaciones tÃ©cnicas', 3),
('editor', 'Editor de Contenido', 'GestiÃ³n de textos informativos, fundadores y casos de Ã©xito', 2),
('consulta', 'Usuario de Consulta / Auditor', 'Acceso de solo lectura para auditorÃ­as y revisiÃ³n de mÃ©tricas', 1)
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
-- 3. TABLA DE CATEGORÃAS Y PRODUCTOS
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
('camaras', 'CÃ¡maras de seguridad', 'Sistemas de CCTV, IP, domo, bala y visiÃ³n nocturna', 'fa-video', 1),
('grabadores', 'Grabadores DVR y NVR', 'Grabadores digitales y de red con puertos PoE y almacenamiento masivo', 'fa-hdd', 2),
('acceso', 'Controles de acceso', 'Terminales biomÃ©tricos faciales, de huella digital y tarjetas RFID', 'fa-id-card', 3),
('cerraduras', 'Cerraduras inteligentes y elÃ©ctricas', 'Cerraduras digitales biomÃ©tricas, electroimanes y pestillos', 'fa-lock', 4),
('intercom', 'Videoporteros e intercomunicadores', 'Pantallas tÃ¡ctiles y frentes de calle IP con atenciÃ³n remota', 'fa-door-open', 5),
('alarmas', 'Alarmas y sensores', 'Kits inalÃ¡mbricos WiFi/GSM, sensores de movimiento y sirenas', 'fa-bell', 6),
('redes', 'Redes y conectividad', 'Switches PoE Gigabit, routers y gabinetes de comunicaciÃ³n', 'fa-network-wired', 7),
('energia', 'Fuentes y respaldo elÃ©ctrico', 'Inversores senoidales, baterÃ­as de ciclo profundo y cajas de poder', 'fa-bolt', 8),
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
-- 6. MENSAJES DE CONTACTO Y ASESORÃA
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
-- 7. AUDITORÃA INMUTABLE (LOGS DE SEGURIDAD)
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

-- Impedir modificaciÃ³n o borrado de registros de auditorÃ­a (Seguridad estricta)
CREATE OR REPLACE RULE no_update_auditoria AS ON UPDATE TO public.auditoria_logs DO INSTEAD NOTHING;
CREATE OR REPLACE RULE no_delete_auditoria AS ON DELETE TO public.auditoria_logs DO INSTEAD NOTHING;

-- ============================================================================
-- 8. FEATURE FLAGS (INTERRUPTORES PÃšBLICOS EN TIEMPO REAL)
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
('showPrices', 'Muestra u oculta los precios de los productos en el catÃ¡logo pÃºblico', TRUE, 'tienda'),
('enableQuotes', 'Habilita o pausa temporalmente el generador de cotizaciones', TRUE, 'cotizaciones'),
('enableSupportTickets', 'Habilita o pausa la recepciÃ³n de nuevos tickets de soporte tÃ©cnico', TRUE, 'soporte'),
('hideOutOfStock', 'Oculta automÃ¡ticamente productos que no tengan disponibilidad inmediata', FALSE, 'tienda'),
('showCategories', 'Muestra el selector visual de categorÃ­as destacadas', TRUE, 'inicio'),
('showFounders', 'Muestra la secciÃ³n del equipo directivo y fundadores de WES', TRUE, 'inicio'),
('showMap', 'Muestra el mapa interactivo Leaflet de ubicaciÃ³n en Moca', TRUE, 'contacto'),
('enableWhatsAppFloat', 'Muestra el botÃ³n flotante directo a WhatsApp (+1 849 207-5474)', TRUE, 'contacto')
ON CONFLICT (clave) DO NOTHING;

-- ============================================================================
-- 9. ÃNDICES DE ALTO RENDIMIENTO
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
-- 10. POLÃTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY)
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

-- A) Acceso PÃºblico de Lectura (CatÃ¡logo y Opciones de Web)
CREATE POLICY "Publico puede ver categorias activas" ON public.categorias
    FOR SELECT USING (activo = TRUE);

CREATE POLICY "Publico puede ver productos activos" ON public.productos
    FOR SELECT USING (activo = TRUE);

CREATE POLICY "Publico puede consultar feature flags" ON public.feature_flags
    FOR SELECT USING (TRUE);

-- B) Acceso PÃºblico de CreaciÃ³n (Clientes creando cotizaciones, tickets y mensajes)
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

-- C) Acceso Administrativo (Usuarios Autenticados tienen gestiÃ³n completa)
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

-- PolÃ­tica de subida de fotos por clientes
CREATE POLICY "Permitir subida de fotos de soporte" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'evidencias-soporte');

-- PolÃ­tica de lectura pÃºblica de fotos de tickets
CREATE POLICY "Permitir ver fotos de soporte" ON storage.objects
    FOR SELECT USING (bucket_id = 'evidencias-soporte');

-- ============================================================================
-- FIN DEL ESQUEMA MAESTRO
-- ============================================================================
-- ============================================================================
-- WARN ELECTRICAL SERVICES, SRL (WES)
-- CARGA INICIAL DE PRODUCTOS EN POSTGRESQL (SEED DATA)
-- ============================================================================

INSERT INTO public.productos (id, codigo, nombre, marca, categoria_id, descripcion, caracteristicas, precio, stock, imagen_url, activo, destacado) VALUES
(
    'prod-001',
    'CAM-IP-4MP-001',
    'CÃ¡mara IP Domo 4 MP Ultra HD',
    'Hikvision',
    'camaras',
    'CÃ¡mara de videovigilancia domo con resoluciÃ³n 4 MP, visiÃ³n nocturna EXIR inteligente de hasta 30m y protecciÃ³n IP67 para exterior/interior.',
    '["ResoluciÃ³n 4 MegapÃ­xeles (2560 Ã— 1440)", "VisiÃ³n nocturna infrarroja EXIR 30 metros", "CompresiÃ³n eficiente H.265+ para ahorro de almacenamiento", "ProtecciÃ³n contra agua y polvo IP67", "AlimentaciÃ³n PoE (802.3af) o 12V DC", "Acceso remoto en tiempo real vÃ­a smartphone"]'::jsonb,
    4850.00,
    15,
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    TRUE,
    TRUE
),
(
    'prod-002',
    'CAM-BALA-4MP-002',
    'CÃ¡mara IP Bala Exterior 4 MP con Audio',
    'Dahua',
    'camaras',
    'CÃ¡mara tipo bala para intemperie con lente fijo de 2.8mm, micrÃ³fono incorporado de alta sensibilidad y tecnologÃ­a Smart IR.',
    '["ResoluciÃ³n 4 MP a 30 fps", "MicrÃ³fono integrado para audio ambiental", "Alcance nocturno hasta 30m", "Carcasa metÃ¡lica antivandÃ¡lica con norma IP67", "DetecciÃ³n inteligente de movimiento con filtrado humano"]'::jsonb,
    5200.00,
    20,
    'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80',
    TRUE,
    TRUE
),
(
    'prod-003',
    'CAM-PTZ-WIFI-003',
    'CÃ¡mara PTZ WiFi 360Â° Exterior con Seguimiento',
    'EZVIZ / WES',
    'camaras',
    'CÃ¡mara motorizada con giro horizontal de 352Â° y vertical de 95Â°, seguimiento automÃ¡tico de objetivos y foco luminoso de disuasiÃ³n.',
    '["VisiÃ³n panorÃ¡mica 360Â° motorizada", "ResoluciÃ³n 2K (3 MegapÃ­xeles)", "VisiÃ³n nocturna a todo color mediante reflectores LED", "Audio bidireccional (altavoz y micrÃ³fono)", "Sirena y luz estroboscÃ³pica disuasoria integrada", "ConexiÃ³n WiFi de doble antena de largo alcance"]'::jsonb,
    6900.00,
    8,
    'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    TRUE,
    TRUE
),
(
    'prod-004',
    'NVR-4K-08P-001',
    'Grabador de Video NVR 8 Canales 4K PoE',
    'Hikvision',
    'grabadores',
    'Grabador de red para 8 cÃ¡maras IP con puertos PoE independientes Plug & Play, soporte para discos de hasta 10TB y salida HDMI 4K.',
    '["8 puertos PoE integrados para conexiÃ³n directa de cÃ¡maras", "Soporte de cÃ¡maras de hasta 8 MP (4K)", "DecodificaciÃ³n y compresiÃ³n H.265+", "Salidas simultÃ¡neas HDMI 4K y VGA", "ConfiguraciÃ³n rÃ¡pida P2P para visualizaciÃ³n en celular", "Alertas push instantÃ¡neas de eventos"]'::jsonb,
    13500.00,
    5,
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    TRUE,
    TRUE
),
(
    'prod-005',
    'DVR-16CH-HD-002',
    'Grabador DVR 16 Canales PentahÃ­brido',
    'Dahua',
    'grabadores',
    'Grabador digital pentahÃ­brido compatible con tecnologÃ­as HDCVI, AHD, TVI, CVBS e IP, ideal para modernizaciÃ³n de sistemas existentes.',
    '["16 canales analÃ³gicos HD + canales IP adicionales", "TransmisiÃ³n a larga distancia por cable coaxial o UTP", "BÃºsqueda inteligente por Ã¡rea de detecciÃ³n", "Ventilador de bajo ruido y diseÃ±o tÃ©rmico optimizado"]'::jsonb,
    11200.00,
    4,
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    TRUE,
    FALSE
),
(
    'prod-006',
    'BIO-FACIAL-F100',
    'Terminal BiomÃ©trico de Acceso Facial y Huella',
    'ZKTeco',
    'acceso',
    'Control de acceso y asistencia con reconocimiento facial Visible Light anti-suplantaciÃ³n, lector de huellas digitales SilkID y tarjetas RFID.',
    '["Capacidad para 3,000 rostros y 3,000 huellas", "Reconocimiento ultrarrÃ¡pido en menos de 0.3 segundos", "Pantalla tÃ¡ctil IPS de 5 pulgadas", "Conectividad TCP/IP, WiFi y USB", "RelÃ© para control de cerradura electromagnÃ©tica o pestillo"]'::jsonb,
    18900.00,
    6,
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80',
    TRUE,
    TRUE
),
(
    'prod-007',
    'ACC-KEY-RFID-007',
    'Teclado AutÃ³nomo RFID MetÃ¡lico Exterior',
    'WES Pro',
    'acceso',
    'Control de acceso para puerta individual con teclado retroiluminado antivandÃ¡lico y lector de llaveros/tarjetas de proximidad 125 kHz.',
    '["Estructura metÃ¡lica de alta resistencia con norma IP68", "Apertura por PIN numÃ©rico, tarjeta RFID o PIN + Tarjeta", "Capacidad para hasta 2,000 usuarios", "Salida de relÃ© temporizada programable"]'::jsonb,
    3600.00,
    25,
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    TRUE,
    FALSE
),
(
    'prod-008',
    'LOCK-SMART-WF-008',
    'Cerradura Inteligente WiFi con Huella y Teclado',
    'Tuya / Smart WES',
    'cerraduras',
    'Cerradura digital de sobreponer o embutir con 5 mÃ©todos de apertura: huella biomÃ©trica, cÃ³digo digital, tarjeta IC, llave mecÃ¡nica y app mÃ³vil.',
    '["Apertura remota desde smartphone en cualquier lugar", "GeneraciÃ³n de contraseÃ±as temporales para visitas o personal", "Registro de accesos en tiempo real con fecha y hora", "Alarma de intento de intrusiÃ³n y baterÃ­a baja", "AlimentaciÃ³n con baterÃ­as AA de hasta 12 meses de duraciÃ³n"]'::jsonb,
    9800.00,
    10,
    'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=600&q=80',
    TRUE,
    TRUE
),
(
    'prod-009',
    'MAG-LOCK-600-ZL',
    'Cerradura ElectromagnÃ©tica de 600 Lbs con Soporte ZL',
    'Securitron / WES',
    'cerraduras',
    'ElectroimÃ¡n para puertas de madera, metal o vidrio con fuerza de retenciÃ³n de 600 libras (280 kg), sensor de estado LED y soporte multiposiciÃ³n.',
    '["Fuerza de retenciÃ³n magnÃ©tica de 280 kg / 600 lbs", "Voltaje dual 12V / 24V DC con bajo consumo", "DiseÃ±o anti-magnetismo residual", "Incluye soporte tipo ZL para montaje flexible", "Indicador visual de estado de bloqueo (LED verde/rojo)"]'::jsonb,
    4950.00,
    18,
    'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
    TRUE,
    FALSE
),
(
    'prod-010',
    'INTER-IP-7IN-010',
    'Videoportero IP WiFi con Pantalla TÃ¡ctil 7"',
    'Hikvision',
    'intercom',
    'Sistema completo de intercomunicaciÃ³n con placa exterior de cÃ¡mara Full HD gran angular y monitor tÃ¡ctil de interior con recepciÃ³n en el celular.',
    '["Placa de calle con cÃ¡mara 1080p y visiÃ³n nocturna", "Monitor de 7 pulgadas tÃ¡ctil a color para pared", "AtenciÃ³n y apertura de puerta remota desde el celular", "GrabaciÃ³n de mensajes y captura de fotos de visitantes", "AlimentaciÃ³n estÃ¡ndar PoE"]'::jsonb,
    16500.00,
    7,
    'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=600&q=80',
    TRUE,
    TRUE
),
(
    'prod-011',
    'ALM-KIT-WF-011',
    'Panel de Alarma InalÃ¡mbrico WiFi/GSM Kit Completo',
    'Tuya Smart / WES',
    'alarmas',
    'Kit de seguridad inteligente que incluye central inalÃ¡mbrica, sensor de movimiento PIR, contacto magnÃ©tico para puerta/ventana y 2 controles remotos.',
    '["Doble vÃ­a de comunicaciÃ³n: WiFi residencial e inserciÃ³n de SIM GSM", "Sirena interna integrada de 90 dB + soporte para sirena exterior", "Notificaciones instantÃ¡neas vÃ­a App y llamada telefÃ³nica o SMS", "BaterÃ­a recargable de respaldo ante cortes elÃ©ctricos de hasta 8 horas", "Compatible con asistentes Google Home y Alexa"]'::jsonb,
    7400.00,
    12,
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    TRUE,
    TRUE
),
(
    'prod-012',
    'NET-SW-8P-GB',
    'Switch PoE Gigabit 8 Puertos + 2 Uplink',
    'Ubiquiti / TP-Link',
    'redes',
    'Switch administrado de 8 puertos PoE+ 10/100/1000 Mbps con potencia total de 120W y 2 puertos Gigabit adicionales para enlace con router.',
    '["8 puertos compatibles con estÃ¡ndares IEEE 802.3af/at", "Potencia total de suministro PoE hasta 120W", "FunciÃ³n Extend de hasta 250 metros para cÃ¡maras lejanas", "Prioridad de puertos QoS y aislamiento VLAN automÃ¡tico", "Chasis metÃ¡lico resistente con montaje en rack o pared"]'::jsonb,
    6800.00,
    9,
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    TRUE,
    FALSE
),
(
    'prod-013',
    'PWR-BOX-12V10A-9',
    'Fuente de Poder Centralizada 12V 10A (9 Salidas)',
    'WES Power',
    'energia',
    'Caja de distribuciÃ³n de energÃ­a regulada con 9 salidas protegidas por fusibles PTC auto-recuperables e indicador LED individual.',
    '["Entrada 110V/220V AC conmutada", "Salida estabilizada 12V DC total 10 Amperios", "9 terminales de salida con fusibles tÃ©rmicos PTC independientes", "Gabinete metÃ¡lico con cerradura de seguridad con llave", "Espacio para baterÃ­a de respaldo opcional"]'::jsonb,
    2950.00,
    30,
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    TRUE,
    FALSE
),
(
    'prod-014',
    'CAB-CAT6-EXT-305',
    'Bobina Cable UTP Cat6 100% Cobre Exterior 305m',
    'Panduit / Furukawa',
    'cables',
    'Cable de red estructurado categorÃ­a 6 certificado para exteriores con doble chaqueta UV e hilo de desgarre para instalaciones de CCTV y redes.',
    '["Conductores 100% cobre sÃ³lido 23 AWG", "Doble recubrimiento PE resistente a rayos ultravioleta y humedad", "Ancho de banda testeado de hasta 250 MHz", "Longitud en caja dispensadora de 305 metros (1,000 pies)", "Ideal para tendidos a la intemperie y ducterÃ­as"]'::jsonb,
    8900.00,
    14,
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    TRUE,
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen_url = EXCLUDED.imagen_url,
    descripcion = EXCLUDED.descripcion;
