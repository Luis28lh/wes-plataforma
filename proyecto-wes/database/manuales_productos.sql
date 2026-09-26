-- ============================================================================
-- PLATAFORMA WARN ELECTRICAL SERVICES, SRL (WES)
-- REGISTRO CENTRALIZADO DE MANUALES TÉCNICOS Y DIAGRAMAS (PDF)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.manuales_productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id VARCHAR(50) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    marca VARCHAR(80) NOT NULL DEFAULT 'CAME',
    nombre_producto VARCHAR(255) NOT NULL,
    titulo_manual VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(100) DEFAULT 'Manual de Instalación y Diagrama Eléctrico',
    idioma VARCHAR(50) DEFAULT 'Español / Multilingüe',
    archivo_url TEXT NOT NULL,
    archivo_nombre VARCHAR(255) NOT NULL,
    tamanio_bytes BIGINT DEFAULT 4861609,
    version_manual VARCHAR(20) DEFAULT '1.0',
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manuales_producto_id ON public.manuales_productos(producto_id);
CREATE INDEX IF NOT EXISTS idx_manuales_sku ON public.manuales_productos(sku);

ALTER TABLE public.manuales_productos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de manuales" ON public.manuales_productos;
CREATE POLICY "Lectura pública de manuales" ON public.manuales_productos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestión administrativa de manuales" ON public.manuales_productos;
CREATE POLICY "Gestión administrativa de manuales" ON public.manuales_productos FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.usuarios u
        WHERE u.id = auth.uid()
        AND u.rol_id IN ('propietario', 'admin', 'editor')
    )
);

-- Registros Oficiales de Manuales CAME
INSERT INTO public.manuales_productos (
    producto_id, sku, marca, nombre_producto, titulo_manual,
    tipo_documento, idioma, archivo_url, archivo_nombre, tamanio_bytes,
    version_manual, descripcion
) VALUES (
    'odoo-21471',
    '604',
    'CAME',
    'MOTOR CAME 800KG',
    'Guía de Instalación y Diagrama Eléctrico Oficial CAME (MOTOR CAME 800KG)',
    'Manual de Instalación y Conexión Eléctrica ZBX',
    'Español / Multilingüe',
    'assets/manuals/manual-came-bx-800kg.pdf',
    'manual-came-bx-800kg.pdf',
    4861609,
    '1.0',
    'Manual técnico oficial del fabricante CAME para motores correderos. Incluye cotas de anclaje, esquema eléctrico, regulación de embrague y programación de mandos.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.manuales_productos (
    producto_id, sku, marca, nombre_producto, titulo_manual,
    tipo_documento, idioma, archivo_url, archivo_nombre, tamanio_bytes,
    version_manual, descripcion
) VALUES (
    'odoo-21470',
    '2009',
    'CAME',
    'MOTOR CAME 600KG USO INTENSIVO',
    'Guía de Instalación y Diagrama Eléctrico Oficial CAME (MOTOR CAME 600KG USO INTENSIVO)',
    'Manual de Instalación y Conexión Eléctrica ZBX',
    'Español / Multilingüe',
    'assets/manuals/manual-came-bx-800kg.pdf',
    'manual-came-bx-800kg.pdf',
    4861609,
    '1.0',
    'Manual técnico oficial del fabricante CAME para motores correderos. Incluye cotas de anclaje, esquema eléctrico, regulación de embrague y programación de mandos.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.manuales_productos (
    producto_id, sku, marca, nombre_producto, titulo_manual,
    tipo_documento, idioma, archivo_url, archivo_nombre, tamanio_bytes,
    version_manual, descripcion
) VALUES (
    'odoo-21469',
    '603',
    'CAME',
    'MOTOR CAME 1800KG USO INDUSTRIAL',
    'Guía de Instalación y Diagrama Eléctrico Oficial CAME (MOTOR CAME 1800KG USO INDUSTRIAL)',
    'Manual de Instalación y Conexión Eléctrica ZBX',
    'Español / Multilingüe',
    'assets/manuals/manual-came-bx-800kg.pdf',
    'manual-came-bx-800kg.pdf',
    4861609,
    '1.0',
    'Manual técnico oficial del fabricante CAME para motores correderos. Incluye cotas de anclaje, esquema eléctrico, regulación de embrague y programación de mandos.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.manuales_productos (
    producto_id, sku, marca, nombre_producto, titulo_manual,
    tipo_documento, idioma, archivo_url, archivo_nombre, tamanio_bytes,
    version_manual, descripcion
) VALUES (
    'odoo-21468',
    '1390',
    'CAME',
    'MOTOR CAME 1000KG USO INTENSIVO',
    'Guía de Instalación y Diagrama Eléctrico Oficial CAME (MOTOR CAME 1000KG USO INTENSIVO)',
    'Manual de Instalación y Conexión Eléctrica ZBX',
    'Español / Multilingüe',
    'assets/manuals/manual-came-bx-800kg.pdf',
    'manual-came-bx-800kg.pdf',
    4861609,
    '1.0',
    'Manual técnico oficial del fabricante CAME para motores correderos. Incluye cotas de anclaje, esquema eléctrico, regulación de embrague y programación de mandos.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.manuales_productos (
    producto_id, sku, marca, nombre_producto, titulo_manual,
    tipo_documento, idioma, archivo_url, archivo_nombre, tamanio_bytes,
    version_manual, descripcion
) VALUES (
    'odoo-21467',
    '3797',
    'CAME',
    'MOTOR 2000KG CAME',
    'Guía de Instalación y Diagrama Eléctrico Oficial CAME (MOTOR 2000KG CAME)',
    'Manual de Instalación y Conexión Eléctrica ZBX',
    'Español / Multilingüe',
    'assets/manuals/manual-came-bx-800kg.pdf',
    'manual-came-bx-800kg.pdf',
    4861609,
    '1.0',
    'Manual técnico oficial del fabricante CAME para motores correderos. Incluye cotas de anclaje, esquema eléctrico, regulación de embrague y programación de mandos.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.manuales_productos (
    producto_id, sku, marca, nombre_producto, titulo_manual,
    tipo_documento, idioma, archivo_url, archivo_nombre, tamanio_bytes,
    version_manual, descripcion
) VALUES (
    'odoo-21472',
    '1765',
    'CAME',
    'MOTOR CAME 800KG REFULL',
    'Guía de Instalación y Diagrama Eléctrico Oficial CAME (MOTOR CAME 800KG REFULL)',
    'Manual de Instalación y Conexión Eléctrica ZBX',
    'Español / Multilingüe',
    'assets/manuals/manual-came-bx-800kg.pdf',
    'manual-came-bx-800kg.pdf',
    4861609,
    '1.0',
    'Manual técnico oficial del fabricante CAME para motores correderos. Incluye cotas de anclaje, esquema eléctrico, regulación de embrague y programación de mandos.'
) ON CONFLICT DO NOTHING;
