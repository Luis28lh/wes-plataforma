-- ============================================================================
-- PLATAFORMA WARN ELECTRICAL SERVICES, SRL (WES)
-- TABLA DE RESEÑAS, VALORACIONES Y MÉTRICAS DE CALIDAD POR PRODUCTO
-- Diseñada para compatibilidad con Supabase PostgreSQL, RLS y auditoría
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.resenas_productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id VARCHAR(50) NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
    cliente_nombre VARCHAR(120) NOT NULL,
    cliente_ciudad VARCHAR(80) DEFAULT 'Moca, Rep. Dom.',
    calificacion_general NUMERIC(2,1) NOT NULL CHECK (calificacion_general >= 1 AND calificacion_general <= 5),
    calidad_producto NUMERIC(2,1) DEFAULT 5.0 CHECK (calidad_producto >= 1 AND calidad_producto <= 5),
    calidad_envio NUMERIC(2,1) DEFAULT 5.0 CHECK (calidad_envio >= 1 AND calidad_envio <= 5),
    calidad_servicio NUMERIC(2,1) DEFAULT 5.0 CHECK (calidad_servicio >= 1 AND calidad_servicio <= 5),
    comentario TEXT NOT NULL,
    verificado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas ultra rápidas por producto y fecha
CREATE INDEX IF NOT EXISTS idx_resenas_producto_id ON public.resenas_productos(producto_id);
CREATE INDEX IF NOT EXISTS idx_resenas_created_at ON public.resenas_productos(created_at DESC);

-- ============================================================================
-- POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY)
-- ============================================================================
ALTER TABLE public.resenas_productos ENABLE ROW LEVEL SECURITY;

-- 1. Política de Lectura Pública: Cualquier visitante puede ver las reseñas
DROP POLICY IF EXISTS "Lectura pública de reseñas" ON public.resenas_productos;
CREATE POLICY "Lectura pública de reseñas"
ON public.resenas_productos FOR SELECT
USING (true);

-- 2. Política de Inserción: Los clientes pueden registrar su testimonio
DROP POLICY IF EXISTS "Inserción pública de reseñas" ON public.resenas_productos;
CREATE POLICY "Inserción pública de reseñas"
ON public.resenas_productos FOR INSERT
WITH CHECK (true);

-- 3. Política de Gestión Admin: Solo usuarios con rol autorizado pueden moderar o borrar
DROP POLICY IF EXISTS "Gestión administrativa de reseñas" ON public.resenas_productos;
CREATE POLICY "Gestión administrativa de reseñas"
ON public.resenas_productos FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios u
        WHERE u.id = auth.uid()
        AND u.rol_id IN ('propietario', 'admin', 'editor')
    )
);

-- ============================================================================
-- REGISTROS PILOTO INICIALES PARA EL MOTOR CAME 800KG (CÓDIGO 604 - odoo-21471)
-- ============================================================================
INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado, created_at
) VALUES
(
    'odoo-21471',
    'Ing. Carlos Mendoza',
    'Moca, Provincia Espaillat',
    5.0, 5.0, 5.0, 5.0,
    'Instalamos este motor CAME de 800 kg en un portón de acceso a una nave comercial en la Autopista Ramón Cáceres. La fuerza de arrastre es excepcional y la llave de desbloqueo manual es muy suave y segura. Excelente atención de Warn Electrical Services.',
    true,
    NOW() - INTERVAL '12 days'
),
(
    'odoo-21471',
    'Lic. Roberto Almanzar',
    'Santiago de los Caballeros',
    4.9, 5.0, 4.8, 5.0,
    'Compré el kit completo con fotoceldas y cremalleras. El envío llegó el mismo día por transporte privado en perfectas condiciones y bien embalado. Los técnicos de WES nos orientaron por WhatsApp con la programación del control.',
    true,
    NOW() - INTERVAL '5 days'
),
(
    'odoo-21471',
    'Residencial Las Colinas',
    'San Víctor, Moca',
    5.0, 5.0, 5.0, 5.0,
    'Motor robusto de calidad italiana comprobada. Funciona de manera continua para las más de 30 familias del residencial sin recalentarse. Los 2 años de garantía que otorga WES dan total tranquilidad.',
    true,
    NOW() - INTERVAL '2 days'
)
ON CONFLICT DO NOTHING;
