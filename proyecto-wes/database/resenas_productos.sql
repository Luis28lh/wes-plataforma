-- ============================================================================
-- PLATAFORMA WARN ELECTRICAL SERVICES, SRL (WES)
-- TABLA DE RESEÑAS, VALORACIONES Y MÉTRICAS DE CALIDAD POR PRODUCTO
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.resenas_productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_resenas_producto_id ON public.resenas_productos(producto_id);
CREATE INDEX IF NOT EXISTS idx_resenas_created_at ON public.resenas_productos(created_at DESC);

ALTER TABLE public.resenas_productos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de reseñas" ON public.resenas_productos;
CREATE POLICY "Lectura pública de reseñas" ON public.resenas_productos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserción pública de reseñas" ON public.resenas_productos;
CREATE POLICY "Inserción pública de reseñas" ON public.resenas_productos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Gestión administrativa de reseñas" ON public.resenas_productos;
CREATE POLICY "Gestión administrativa de reseñas" ON public.resenas_productos FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.usuarios u
        WHERE u.id = auth.uid()
        AND u.rol_id IN ('propietario', 'admin', 'editor')
    )
);

-- Registros de testimonios verificados
INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-21471',
    'Ing. Carlos Mendoza',
    'Moca, Espaillat',
    5.0,
    5.0,
    5.0,
    5.0,
    'Excelente motor CAME 800KG. Instalado en portón residencial de 6 metros. Movimiento suave y silencioso.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-21471',
    'Lic. Ramona Peña',
    'Santiago de los Caballeros',
    5.0,
    5.0,
    4.8,
    5.0,
    'Calidad italiana insuperable. El personal de WES me asesoró con la placa ZBX y la entrega fue el mismo día.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-21471',
    'Manuel de Jesús Tavares',
    'La Vega',
    4.8,
    5.0,
    5.0,
    4.8,
    'Robusto y potente. Chasis de aluminio inyectado de primera y los controles CAME tienen un alcance genial.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-21470',
    'Ing. Rafael Almonte',
    'Moca, Espaillat',
    5.0,
    5.0,
    5.0,
    5.0,
    'Instalé este motor CAME 600kg en una residencia. Al ser de 24V con batería nunca se queda sin funcionar cuando se va la luz. Excelente compra en WES.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-21470',
    'Lic. Andrés Salcedo',
    'Santiago, Rep. Dom.',
    4.9,
    5.0,
    4.8,
    5.0,
    'Silencioso y arranca con rampa suave. La parada suave protege el portón y la cremallera de golpes.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-21469',
    'Arq. Domingo Guzmán',
    'Zona Franca Santiago',
    5.0,
    5.0,
    5.0,
    5.0,
    'Motor formidable para entrada de camiones pesados. Pesa bastante el portón y lo mueve con total soltura. Chasis macizo.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-21469',
    'Ing. Luis Fernando Collado',
    'Moca Industrial',
    5.0,
    5.0,
    4.9,
    5.0,
    'La centralita ZBKN con pantalla facilita la calibración de tiempos. Calidad CAME 100% recomendada.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-21468',
    'Lic. Roberto Paulino',
    'Santo Domingo Este',
    5.0,
    5.0,
    5.0,
    5.0,
    'Excelente relación costo/potencia. En nuestro residencial de 14 casas funciona todo el día sin calentarse.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-21467',
    'Ing. Fausto Bretón',
    'Parque Logístico Haina',
    5.0,
    5.0,
    5.0,
    5.0,
    'Para portones pesados de acero macizo no hay otro mejor. Tracción extrema y piñón módulo 6 indestructible.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-21472',
    'Ing. Marcos Estrella',
    'La Vega',
    5.0,
    5.0,
    5.0,
    5.0,
    'El kit Refull lo trae todo: motor, cremalleras, fotoceldas, baliza y mandos. Llegar y montar sin faltar nada.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-31569',
    'Pedro José Ramos',
    'Moca, Espaillat',
    5.0,
    5.0,
    5.0,
    5.0,
    'Mando original. Lo programé en 10 segundos clonándolo directamente del otro control sin tener que abrir el motor.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-31569',
    'Lic. Karina Valdez',
    'Santiago, Rep. Dom.',
    4.9,
    5.0,
    4.8,
    5.0,
    'Muy buen alcance, abre desde media cuadra antes de llegar a la marquesina.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-31572',
    'Arq. Gilberto Méndez',
    'Santiago de los Caballeros',
    5.0,
    5.0,
    5.0,
    5.0,
    'Excelente tener 4 botones en un solo control. Manejo el portón vehicular, la puerta peatonal y el garage.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-33665',
    'Ing. Leonardo Peña',
    'Moca, Rep. Dom.',
    5.0,
    5.0,
    5.0,
    5.0,
    'Seguridad imprescindible. Con niños y vehículos en la casa es obligatorio. Reacciona al instante deteniendo el portón.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'wes-crem-m4',
    'Metalúrgica del Cibao',
    'Moca, Espaillat',
    5.0,
    5.0,
    5.0,
    5.0,
    'Acero macizo galvanizado de verdad. Los 3 separadores roscados por tramo facilitan la nivelación perfecta.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'wes-crem-nyl',
    'Dr. Juan Carlos Belliard',
    'Santiago, Rep. Dom.',
    5.0,
    5.0,
    5.0,
    5.0,
    'Increíble cómo elimina el ruido de arrastre del portón. Ahora ni se escucha cuando entra o sale un vehículo.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'wes-lamp-krx',
    'Ing. César Minaya',
    'La Vega, Rep. Dom.',
    5.0,
    5.0,
    5.0,
    5.0,
    'Luz LED muy brillante y visible de día. La antena incorporada duplicó el alcance de todos los controles de la casa.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-34115',
    'Técnico Ramón Tejada',
    'Moca, Rep. Dom.',
    5.0,
    5.0,
    5.0,
    5.0,
    'Repuesto original para CAME BX. La llave calza suave y el aluminio tiene el mismo acabado de fábrica.',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.resenas_productos (
    producto_id, cliente_nombre, cliente_ciudad,
    calificacion_general, calidad_producto, calidad_envio, calidad_servicio,
    comentario, verificado
) VALUES (
    'odoo-26418',
    'Ing. Electrónico Samuel Rosario',
    'Santiago, Rep. Dom.',
    5.0,
    5.0,
    5.0,
    5.0,
    'Tarjeta original con todos sus relés y protección de fusibles. Sustituyó la dañada por tormenta y el motor quedó perfecto.',
    true
) ON CONFLICT DO NOTHING;
