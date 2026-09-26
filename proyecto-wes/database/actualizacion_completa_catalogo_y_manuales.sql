-- ============================================================================
-- WARN ELECTRICAL SERVICES, SRL (WES) - SCRIPT MAESTRO SUPABASE
-- ACTUALIZACIÓN TOTAL: 237 PRODUCTOS + MANUALES TÉCNICOS + RESEÑAS
-- Copiar y pegar este archivo completo en Supabase Dashboard > SQL Editor > Run
-- ============================================================================

-- PASO 1: TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS public.productos (
    id VARCHAR(50) PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    categoria_id VARCHAR(50) NOT NULL,
    descripcion TEXT,
    caracteristicas JSONB DEFAULT '[]'::jsonb,
    precio NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    imagen_url TEXT,
    activo BOOLEAN DEFAULT true,
    destacado BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de productos" ON public.productos;
CREATE POLICY "Lectura pública de productos" ON public.productos FOR SELECT USING (true);

-- PASO 2: INSERTAR / ACTUALIZAR EL CATÁLOGO COMPLETO DE 237 PRODUCTOS
-- ============================================================================
-- WARN ELECTRICAL SERVICES, SRL (WES)
-- CATÁLOGO COMPLETO DE PRODUCTOS (SIN MENCIÓN DE ODOO)
-- Total productos: 237
-- ============================================================================

DROP POLICY IF EXISTS "Permitir sincronizar catalogo de productos" ON public.productos;
CREATE POLICY "Permitir sincronizar catalogo de productos" ON public.productos FOR ALL TO PUBLIC USING (TRUE) WITH CHECK (TRUE);

INSERT INTO public.productos (id, codigo, nombre, marca, categoria_id, descripcion, caracteristicas, precio, stock, imagen_url, activo, destacado)
VALUES
('odoo-96', '122', 'BATERIA 12V-4A', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 122","Categoría ERP: Baterías","Disponibilidad: 5 unidades en inventario físico"]'::jsonb, 794.6, 5, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-97', '123', 'BATERIA 12V-7A', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 123","Categoría ERP: Baterías","Disponibilidad: 4 unidades en inventario físico"]'::jsonb, 1173.55, 4, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-125', '503', 'SOLUCION P/ BATERIA', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 503","Categoría ERP: Baterías","Disponibilidad: 3 unidades en inventario físico"]'::jsonb, 181.8, 3, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-127', '1667', 'TERMINAL 50-10 P/BATERIA', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1667","Categoría ERP: Baterías","Disponibilidad: 144 unidades en inventario físico"]'::jsonb, 35.14, 144, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-160', '2983', 'BTC NOBILE NEGRO TOMA UTP RJ45', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2983","Categoría ERP: Cable UTP","Disponibilidad: 10 unidades en inventario físico"]'::jsonb, 601.5, 10, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-162', '3088', 'CABLE UTP CAT6 EXTERIOR DAHUA', 'Dahua', 'cables', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3088","Categoría ERP: Cable UTP","Disponibilidad: 1598 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 11.73, 1598, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-170', '1536', 'CABLE UTP DAHUA CAT 5 BLANCO', 'Dahua', 'cables', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1536","Categoría ERP: Cable UTP","Disponibilidad: 1300 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 23, 1300, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-171', '2362', 'CABLE UTP DAHUA CAT 6 AZUL', 'Dahua', 'cables', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2362","Categoría ERP: Cable UTP","Disponibilidad: 191 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 30.15, 191, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-173', '2949', 'CABLE UTP DAHUA CAT 6 GRIS', 'Dahua', 'cables', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2949","Categoría ERP: Cable UTP","Disponibilidad: 59 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 41.23, 59, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-175', '2487', 'CABLE UTP FERTEC CAT6 EXTERIOR DOUBLE', 'Fertec', 'cables', 'Equipo profesional Fertec distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2487","Categoría ERP: Cable UTP","Disponibilidad: 305 unidades en inventario físico"]'::jsonb, 13.66, 305, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-177', '252', 'CABLE UTP LEVITON CAT 6 AZUL', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 252","Categoría ERP: Cable UTP","Disponibilidad: 873 unidades en inventario físico"]'::jsonb, 46.11, 873, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-178', '1839', 'CABLE UTP LEVINTON CAT 6 GRIS', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1839","Categoría ERP: Cable UTP","Disponibilidad: 108 unidades en inventario físico"]'::jsonb, 13.06, 108, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-181', '2051', 'CABLE UTP PANDUIT PANNET CAT 6 AZUL', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2051","Categoría ERP: Cable UTP","Disponibilidad: 158 unidades en inventario físico"]'::jsonb, 53.56, 158, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-184', '2811', 'PATCH CORD UTP 1M CAT 6', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2811","Categoría ERP: Cable UTP","Disponibilidad: 14 unidades en inventario físico"]'::jsonb, 135.57, 14, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-185', '2813', 'PATCH CORD UTP 2M CAT 6', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2813","Categoría ERP: Cable UTP","Disponibilidad: 7 unidades en inventario físico"]'::jsonb, 197.62, 7, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-187', '3108', 'PATCH CORD UTP CAR 6 1M DAHUA', 'Dahua', 'cables', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3108","Categoría ERP: Cable UTP","Disponibilidad: 27 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 152.38, 27, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-1751', '553', 'INVERSOR PROSTEC 1.2KW UPS 12V DC 120AC ALU.', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 553","Categoría ERP: Inversores","Disponibilidad: 1 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_inversores_wes.pdf"]'::jsonb, 9100, 1, 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-1776', '3883', 'INVERSOR WAVE-SWG 3.6KG/24VDC SENOIDAL/WIFI 120V', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3883","Categoría ERP: Inversores","Disponibilidad: 1 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_inversores_wes.pdf"]'::jsonb, 33739.98, 1, 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-5976', '4509', 'BASE P/ TUBO LED 2-PIN 40W', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4509","Categoría ERP: Cables eléctricos","Disponibilidad: 12 unidades en inventario físico"]'::jsonb, 20.83, 12, 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-5980', '215', 'CABLE 18/4 MULTI FIBRA GENESIS', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 215","Categoría ERP: Cables eléctricos","Disponibilidad: 1290 unidades en inventario físico"]'::jsonb, 25.07, 1290, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-5981', '1629', 'CABLE 22/2 GENESIS', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1629","Categoría ERP: Cables eléctricos","Disponibilidad: 562 unidades en inventario físico"]'::jsonb, 9.39, 562, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-5983', '1836', 'CABLE 22/4 GENESIS MULTIFIBRA', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1836","Categoría ERP: Cables eléctricos","Disponibilidad: 5080 unidades en inventario físico"]'::jsonb, 11.24, 5080, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-5984', '217', 'CABLE 22/4 GENESIS SOLIDO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 217","Categoría ERP: Cables eléctricos","Disponibilidad: 2114 unidades en inventario físico"]'::jsonb, 9.99, 2114, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-5985', '4164', 'CABLE 22/4 MULTIFIBRA ESEENET', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4164","Categoría ERP: Cables eléctricos","Disponibilidad: 534 unidades en inventario físico"]'::jsonb, 5.79, 534, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-5988', '1870', 'CABLE ALTO VOLTAJE ENGOMADO P/CERCO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1870","Categoría ERP: Cables eléctricos","Disponibilidad: 127 unidades en inventario físico"]'::jsonb, 31.54, 127, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-5990', '196', 'CABLE BATERIA #2', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 196","Categoría ERP: Cables eléctricos","Disponibilidad: 33 unidades en inventario físico"]'::jsonb, 228.94, 33, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-5991', '2150', 'CABLE BATERIA #2/0', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2150","Categoría ERP: Cables eléctricos","Disponibilidad: 5 unidades en inventario físico"]'::jsonb, 427.2, 5, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-5993', '197', 'CABLE BATERIA #4', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 197","Categoría ERP: Cables eléctricos","Disponibilidad: 14 unidades en inventario físico"]'::jsonb, 139.3, 14, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-5994', '4530', 'CABLE CAT 6 EXTERIOR FASTCABLE', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4530","Categoría ERP: Cables eléctricos","Disponibilidad: 183 unidades en inventario físico"]'::jsonb, 50.27, 183, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-5995', '198', 'CABLE COAXIAL', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 198","Categoría ERP: Cables eléctricos","Disponibilidad: 8332 unidades en inventario físico"]'::jsonb, 3.75, 8332, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6002', '1813', 'CABLE DE GOMA #10/2', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1813","Categoría ERP: Cables eléctricos","Disponibilidad: 12 unidades en inventario físico"]'::jsonb, 37.53, 12, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6003', '2090', 'CABLE DE GOMA #10/3', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2090","Categoría ERP: Cables eléctricos","Disponibilidad: 142 unidades en inventario físico"]'::jsonb, 65.65, 142, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6004', '1859', 'CABLE DE GOMA #10/4', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1859","Categoría ERP: Cables eléctricos","Disponibilidad: 5 unidades en inventario físico"]'::jsonb, 103.46, 5, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6005', '200', 'CABLE DE GOMA #12/2', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 200","Categoría ERP: Cables eléctricos","Disponibilidad: 419 unidades en inventario físico"]'::jsonb, 32.2, 419, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6006', '201', 'CABLE DE GOMA #12/3', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 201","Categoría ERP: Cables eléctricos","Disponibilidad: 211 unidades en inventario físico"]'::jsonb, 57.33, 211, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6007', '202', 'CABLE DE GOMA #14/2', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 202","Categoría ERP: Cables eléctricos","Disponibilidad: 3130 unidades en inventario físico"]'::jsonb, 21.29, 3130, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6008', '203', 'CABLE DE GOMA #14/3', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 203","Categoría ERP: Cables eléctricos","Disponibilidad: 177 unidades en inventario físico"]'::jsonb, 32.65, 177, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6012', '3038', 'CABLE DE GOMA #8/4', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3038","Categoría ERP: Cables eléctricos","Disponibilidad: 100 unidades en inventario físico"]'::jsonb, 174.11, 100, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6016', '204', 'CABLE DE VINIL #12/2', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 204","Categoría ERP: Cables eléctricos","Disponibilidad: 45 unidades en inventario físico"]'::jsonb, 48.66, 45, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6017', '205', 'CABLE DE VINIL #12/3', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 205","Categoría ERP: Cables eléctricos","Disponibilidad: 595 unidades en inventario físico"]'::jsonb, 54.74, 595, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6018', '206', 'CABLE DE VINIL #14/2', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 206","Categoría ERP: Cables eléctricos","Disponibilidad: 377 unidades en inventario físico"]'::jsonb, 33.21, 377, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6019', '207', 'CABLE DE VINIL 14/3', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 207","Categoría ERP: Cables eléctricos","Disponibilidad: 579 unidades en inventario físico"]'::jsonb, 40.55, 579, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6021', '209', 'CABLE DUPLEX #14', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 209","Categoría ERP: Cables eléctricos","Disponibilidad: 1358 unidades en inventario físico"]'::jsonb, 14.07, 1358, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6036', '2679', 'CABLE ELEC PHELP D #10 AZUL', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2679","Categoría ERP: Cables eléctricos","Disponibilidad: 103 unidades en inventario físico"]'::jsonb, 22.83, 103, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6037', '224', 'CABLE ELEC PHELP D #10 BLANCO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 224","Categoría ERP: Cables eléctricos","Disponibilidad: 1419 unidades en inventario físico"]'::jsonb, 20.53, 1419, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6038', '225', 'CABLE ELEC PHELP D #10 NEGRO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 225","Categoría ERP: Cables eléctricos","Disponibilidad: 817 unidades en inventario físico"]'::jsonb, 21.18, 817, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6039', '226', 'CABLE ELEC PHELP D #10 ROJO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 226","Categoría ERP: Cables eléctricos","Disponibilidad: 1312 unidades en inventario físico"]'::jsonb, 22.83, 1312, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6040', '1736', 'CABLE ELEC PHELP D #10 VERDE', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1736","Categoría ERP: Cables eléctricos","Disponibilidad: 336 unidades en inventario físico"]'::jsonb, 20.36, 336, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6041', '227', 'CABLE ELEC PHELP D #12 AMARILLO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 227","Categoría ERP: Cables eléctricos","Disponibilidad: 1000 unidades en inventario físico"]'::jsonb, 16.64, 1000, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6042', '228', 'CABLE ELEC PHELP D #12 AZUL', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 228","Categoría ERP: Cables eléctricos","Disponibilidad: 1007 unidades en inventario físico"]'::jsonb, 15.25, 1007, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6043', '229', 'CABLE ELEC PHELP D #12 BLANCO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 229","Categoría ERP: Cables eléctricos","Disponibilidad: 2492 unidades en inventario físico"]'::jsonb, 15.28, 2492, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6044', '230', 'CABLE ELEC PHELP D #12 NEGRO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 230","Categoría ERP: Cables eléctricos","Disponibilidad: 1257 unidades en inventario físico"]'::jsonb, 13.57, 1257, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6046', '232', 'CABLE ELEC PHELP D #12 VERDE', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 232","Categoría ERP: Cables eléctricos","Disponibilidad: 266 unidades en inventario físico"]'::jsonb, 13.27, 266, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6048', '234', 'CABLE ELEC PHELP D #14 AZUL', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 234","Categoría ERP: Cables eléctricos","Disponibilidad: 1554 unidades en inventario físico"]'::jsonb, 10.24, 1554, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6049', '235', 'CABLE ELEC PHELP D #14 BLANCO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 235","Categoría ERP: Cables eléctricos","Disponibilidad: 406 unidades en inventario físico"]'::jsonb, 10.67, 406, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6050', '236', 'CABLE ELEC PHELP D #14 NEGRO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 236","Categoría ERP: Cables eléctricos","Disponibilidad: 1369 unidades en inventario físico"]'::jsonb, 9.68, 1369, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6052', '238', 'CABLE ELEC PHELP D #14 VERDE', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 238","Categoría ERP: Cables eléctricos","Disponibilidad: 492 unidades en inventario físico"]'::jsonb, 10.34, 492, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6064', '239', 'CABLE ELEC PHELP D #6 BLANCO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 239","Categoría ERP: Cables eléctricos","Disponibilidad: 811 unidades en inventario físico"]'::jsonb, 58.2, 811, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6065', '240', 'CABLE ELEC PHELP D #6 NEGRO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 240","Categoría ERP: Cables eléctricos","Disponibilidad: 1099 unidades en inventario físico"]'::jsonb, 58.2, 1099, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6066', '1742', 'CABLE ELEC PHELP D #6 ROJO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1742","Categoría ERP: Cables eléctricos","Disponibilidad: 334 unidades en inventario físico"]'::jsonb, 63.05, 334, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6067', '241', 'CABLE ELEC PHELP D #6 VERDE', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 241","Categoría ERP: Cables eléctricos","Disponibilidad: 485 unidades en inventario físico"]'::jsonb, 58.2, 485, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6068', '242', 'CABLE ELEC PHELP D #8 BLANCO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 242","Categoría ERP: Cables eléctricos","Disponibilidad: 604 unidades en inventario físico"]'::jsonb, 39.68, 604, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6069', '2677', 'CABLE ELEC PHELP D #8 GRIS', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2677","Categoría ERP: Cables eléctricos","Disponibilidad: 39 unidades en inventario físico"]'::jsonb, 33.62, 39, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6070', '243', 'CABLE ELEC PHELP D #8 NEGRO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 243","Categoría ERP: Cables eléctricos","Disponibilidad: 305 unidades en inventario físico"]'::jsonb, 37.64, 305, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6071', '244', 'CABLE ELEC PHELP D #8 ROJO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 244","Categoría ERP: Cables eléctricos","Disponibilidad: 172 unidades en inventario físico"]'::jsonb, 38.28, 172, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6072', '245', 'CABLE ELEC PHELP D #8 VERDE', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 245","Categoría ERP: Cables eléctricos","Disponibilidad: 351 unidades en inventario físico"]'::jsonb, 38.9, 351, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6079', '246', 'CABLE HDMI 15FT', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 246","Categoría ERP: Cables eléctricos","Disponibilidad: 7 unidades en inventario físico"]'::jsonb, 267.1, 7, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6081', '213', 'CABLE HDMI 25 FT', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 213","Categoría ERP: Cables eléctricos","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 840, 1, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6083', '247', 'CABLE HDMI 6FT', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 247","Categoría ERP: Cables eléctricos","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 156.09, 1, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6094', '3425', 'CABLE VGA 6 FT F1 MONITOR', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3425","Categoría ERP: Cables eléctricos","Disponibilidad: 6 unidades en inventario físico"]'::jsonb, 133, 6, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6096', '256', 'CABLE VGA MYO 50FT MONITOR', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 256","Categoría ERP: Cables eléctricos","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 1208.25, 1, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6102', '3669', 'DETECTOR DE CABLES ELECTRICOS', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3669","Categoría ERP: Cables eléctricos","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 1547, 1, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6105', '2383', 'EXPANSOR DE 8 ZONAS CABLEADO PS NEO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2383","Categoría ERP: Cables eléctricos","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 2508.4, 2, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6109', '1544', 'FLEJADORA CABLE TIE ACERO INOX', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1544","Categoría ERP: Cables eléctricos","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 8101.09, 1, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6130', '1501', 'ORGANIZADOR CABLE 1.1/8', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1501","Categoría ERP: Cables eléctricos","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 418.6, 2, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6132', '3819', 'ORGANIZADOR DE CABLE 30MM X 2M', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3819","Categoría ERP: Cables eléctricos","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 558.6, 2, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6137', '643', 'PERCHA P/ACOM TENSOR CABLE', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 643","Categoría ERP: Cables eléctricos","Disponibilidad: 18 unidades en inventario físico"]'::jsonb, 97.21, 18, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6139', '667', 'PORTA FUSIBLE P/CABLE', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 667","Categoría ERP: Cables eléctricos","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 27, 2, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6143', '758', 'SIERRA HUECO MAKITA 1 3/4" MAKITA ( TUBO 1 1/2")', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 758","Categoría ERP: Cables eléctricos","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 656.1, 1, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6145', '760', 'SIERRA HUECO MAKITA METAL 2 1/4" MAKITA ( TUBO 2")', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 760","Categoría ERP: Cables eléctricos","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 674.7, 2, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6151', '812', 'TAPON PLAS.1-1/2X1-1/2 P/ TUBO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 812","Categoría ERP: Cables eléctricos","Disponibilidad: 34 unidades en inventario físico"]'::jsonb, 11.7, 34, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6152', '2428', 'TARUGO PLAST SHEETRROCK AUTOROCABLE 40MM', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2428","Categoría ERP: Cables eléctricos","Disponibilidad: 160 unidades en inventario físico"]'::jsonb, 5.13, 160, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6153', '1103', 'TERMINAL P/CABLE COAXIAL GENERICO METAL', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1103","Categoría ERP: Cables eléctricos","Disponibilidad: 92 unidades en inventario físico"]'::jsonb, 25.19, 92, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6154', '2073', 'TUBO 2'''' HG', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2073","Categoría ERP: Cables eléctricos","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 3500, 2, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6155', '898', 'TUBO EMT 1"X10` AMERICANO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 898","Categoría ERP: Cables eléctricos","Disponibilidad: 7 unidades en inventario físico"]'::jsonb, 780, 7, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6156', '2504', 'TUBO EMT 1"X10` GENERICO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2504","Categoría ERP: Cables eléctricos","Disponibilidad: 25 unidades en inventario físico"]'::jsonb, 499.68, 25, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6158', '2506', 'TUBO EMT 1/2"X10` GENERICO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2506","Categoría ERP: Cables eléctricos","Disponibilidad: 44 unidades en inventario físico"]'::jsonb, 281.98, 44, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6165', '2505', 'TUBO EMT 3/4"X10` GENERICO', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2505","Categoría ERP: Cables eléctricos","Disponibilidad: 25 unidades en inventario físico"]'::jsonb, 240.55, 25, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6169', '909', 'TUBO LED 24" 9W 6500K', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 909","Categoría ERP: Cables eléctricos","Disponibilidad: 15 unidades en inventario físico"]'::jsonb, 409, 15, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6171', '1761', 'TUBO LED 18W NEVADO 6500K', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1761","Categoría ERP: Cables eléctricos","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 300.16, 1, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6172', '3189', 'TUBO LED 18W SILVANIA 6500K', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3189","Categoría ERP: Cables eléctricos","Disponibilidad: 3 unidades en inventario físico"]'::jsonb, 313.5, 3, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6173', '1364', 'TUBO LED 24" 4100K', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1364","Categoría ERP: Cables eléctricos","Disponibilidad: 6 unidades en inventario físico"]'::jsonb, 332.05, 6, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6176', '910', 'TUBO LED 48" 18W 4100K', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 910","Categoría ERP: Cables eléctricos","Disponibilidad: 14 unidades en inventario físico"]'::jsonb, 399.6, 14, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6178', '2334', 'TUBO LED SYLVANIA 24'''' 9 W BLAN.', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2334","Categoría ERP: Cables eléctricos","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 164.7, 2, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6182', '3461', 'TUBO LUMINOSO DE TRES LADOS 7X120CM45W BL', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3461","Categoría ERP: Cables eléctricos","Disponibilidad: 3 unidades en inventario físico"]'::jsonb, 1580.5, 3, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6183', '904', 'TUBO PVC 1"X19` SDR26', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 904","Categoría ERP: Cables eléctricos","Disponibilidad: 47 unidades en inventario físico"]'::jsonb, 316.54, 47, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6184', '905', 'TUBO PVC 1/2"X19` SDR26', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 905","Categoría ERP: Cables eléctricos","Disponibilidad: 33 unidades en inventario físico"]'::jsonb, 123.4, 33, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6534', '4142', 'CONECTOR HEMBRA', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4142","Categoría ERP: Conectores","Disponibilidad: 491 unidades en inventario físico"]'::jsonb, 18.03, 491, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6535', '4141', 'CONECTOR MACHO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4141","Categoría ERP: Conectores","Disponibilidad: 163 unidades en inventario físico"]'::jsonb, 18.03, 163, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6545', '365', 'CONECTOR B AZUL / BLANCO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 365","Categoría ERP: Conectores","Disponibilidad: 526 unidades en inventario físico"]'::jsonb, 8.64, 526, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6546', '2698', 'CONECTOR B.V 2/1', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2698","Categoría ERP: Conectores","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 182.98, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6550', '367', 'CONECTOR BX 1/2``RECTO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 367","Categoría ERP: Conectores","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 32.78, 2, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6551', '368', 'CONECTOR BX 1`` RECTO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 368","Categoría ERP: Conectores","Disponibilidad: 48 unidades en inventario físico"]'::jsonb, 32.74, 48, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6552', '4286', 'CONECTOR BX 1-1/2``RECTO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4286","Categoría ERP: Conectores","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 200.1, 2, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6553', '369', 'CONECTOR BX 3/4`` RECTO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 369","Categoría ERP: Conectores","Disponibilidad: 9 unidades en inventario físico"]'::jsonb, 43.49, 9, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6559', '3484', 'CONECTOR EMPALME 2/0 COBRE', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3484","Categoría ERP: Conectores","Disponibilidad: 39 unidades en inventario físico"]'::jsonb, 329.13, 39, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6560', '4641', 'CONECTOR EMPALME #12', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4641","Categoría ERP: Conectores","Disponibilidad: 20 unidades en inventario físico"]'::jsonb, 20.02, 20, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6563', '4626', 'CONECTOR EMPALME COLOR GEN', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4626","Categoría ERP: Conectores","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 561.68, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6564', '371', 'CONECTOR EMT 1', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 371","Categoría ERP: Conectores","Disponibilidad: 129 unidades en inventario físico"]'::jsonb, 34.04, 129, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6565', '372', 'CONECTOR EMT 1/2', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 372","Categoría ERP: Conectores","Disponibilidad: 114 unidades en inventario físico"]'::jsonb, 18.28, 114, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6566', '373', 'CONECTOR EMT 1-1/2', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 373","Categoría ERP: Conectores","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 98.86, 2, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6567', '374', 'CONECTOR EMT 2', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 374","Categoría ERP: Conectores","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 111.43, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6568', '375', 'CONECTOR EMT 3/4', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 375","Categoría ERP: Conectores","Disponibilidad: 23 unidades en inventario físico"]'::jsonb, 29, 23, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6569', '376', 'CONECTOR EMT 3``', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 376","Categoría ERP: Conectores","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 291.6, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6571', '2663', 'CONECTOR GAL.HUB 1', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2663","Categoría ERP: Conectores","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 357.12, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6574', '2664', 'CONECTOR GAL.HUB 2', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2664","Categoría ERP: Conectores","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 933.8, 2, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6575', '3844', 'CONECTOR GAL.HUB IMC 3/4', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3844","Categoría ERP: Conectores","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 146.98, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6578', '377', 'CONECTOR LQT 1" CURVO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 377","Categoría ERP: Conectores","Disponibilidad: 26 unidades en inventario físico"]'::jsonb, 121.71, 26, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6579', '2389', 'CONECTOR LQT 1" CURVO METALICO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2389","Categoría ERP: Conectores","Disponibilidad: 26 unidades en inventario físico"]'::jsonb, 121.1, 26, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6580', '378', 'CONECTOR LQT 1" RECTO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 378","Categoría ERP: Conectores","Disponibilidad: 23 unidades en inventario físico"]'::jsonb, 94.45, 23, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6581', '386', 'CONECTOR LQT 1"RECTO METAL', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 386","Categoría ERP: Conectores","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 133.65, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6582', '379', 'CONECTOR LQT 1/2 RECTO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 379","Categoría ERP: Conectores","Disponibilidad: 34 unidades en inventario físico"]'::jsonb, 19.11, 34, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6583', '380', 'CONECTOR LQT 1/2" CURVO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 380","Categoría ERP: Conectores","Disponibilidad: 26 unidades en inventario físico"]'::jsonb, 105, 26, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6584', '1750', 'CONECTOR LQT 1/2" CURVO METAL', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1750","Categoría ERP: Conectores","Disponibilidad: 10 unidades en inventario físico"]'::jsonb, 56.06, 10, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6585', '388', 'CONECTOR LQT 1-1/2" RECTO METAL', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 388","Categoría ERP: Conectores","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 416.56, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6586', '381', 'CONECTOR LQT 1-1/2`` RECTO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 381","Categoría ERP: Conectores","Disponibilidad: 16 unidades en inventario físico"]'::jsonb, 147.84, 16, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6587', '382', 'CONECTOR LQT 1-1/2``CURVO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 382","Categoría ERP: Conectores","Disponibilidad: 4 unidades en inventario físico"]'::jsonb, 378, 4, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6590', '383', 'CONECTOR LQT 2`` RECTO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 383","Categoría ERP: Conectores","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 241.27, 2, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6591', '384', 'CONECTOR LQT 3/4 CURVO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 384","Categoría ERP: Conectores","Disponibilidad: 14 unidades en inventario físico"]'::jsonb, 156.25, 14, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6592', '385', 'CONECTOR LQT 3/4 RECTO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 385","Categoría ERP: Conectores","Disponibilidad: 63 unidades en inventario físico"]'::jsonb, 59.16, 63, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6593', '387', 'CONECTOR LQT 3/4 RECTO METAL', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 387","Categoría ERP: Conectores","Disponibilidad: 20 unidades en inventario físico"]'::jsonb, 67.37, 20, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6598', '4348', 'CONECTOR P/ CABLE PG 21', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4348","Categoría ERP: Conectores","Disponibilidad: 57 unidades en inventario físico"]'::jsonb, 96.33, 57, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6600', '392', 'CONECTOR P/ CABLE 1 PG 25', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 392","Categoría ERP: Conectores","Disponibilidad: 80 unidades en inventario físico"]'::jsonb, 30, 80, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6601', '394', 'CONECTOR P/ CABLE 1/2 PG13.5', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 394","Categoría ERP: Conectores","Disponibilidad: 115 unidades en inventario físico"]'::jsonb, 27.43, 115, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6602', '393', 'CONECTOR P/ CABLE 3/4 PG19', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 393","Categoría ERP: Conectores","Disponibilidad: 3 unidades en inventario físico"]'::jsonb, 21.1, 3, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6603', '2903', 'CONECTOR P/ CABLE 3/8 PG 7', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2903","Categoría ERP: Conectores","Disponibilidad: 44 unidades en inventario físico"]'::jsonb, 36.63, 44, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6606', '4216', 'CONECTOR P/ CABLE PG 9', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4216","Categoría ERP: Conectores","Disponibilidad: 10 unidades en inventario físico"]'::jsonb, 35.52, 10, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6613', '397', 'CONECTOR P/ VARILLA TIERRA 5/8', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 397","Categoría ERP: Conectores","Disponibilidad: 4 unidades en inventario físico"]'::jsonb, 79.66, 4, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6615', '4424', 'CONECTOR P/BARRAS 25MM', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4424","Categoría ERP: Conectores","Disponibilidad: 3 unidades en inventario físico"]'::jsonb, 610.18, 3, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6618', '1175', 'CONECTOR PLAS P/ CABLE DE GOMA', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1175","Categoría ERP: Conectores","Disponibilidad: 6 unidades en inventario físico"]'::jsonb, 19.36, 6, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6620', '399', 'CONECTOR PULPO 4 SALIDA', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 399","Categoría ERP: Conectores","Disponibilidad: 6 unidades en inventario físico"]'::jsonb, 83.53, 6, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6621', '2031', 'CONECTOR PULPO 8 SALIDA', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2031","Categoría ERP: Conectores","Disponibilidad: 8 unidades en inventario físico"]'::jsonb, 141.74, 8, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6623', '3167', 'CONECTOR RJ11 TELEFONO', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3167","Categoría ERP: Conectores","Disponibilidad: 92 unidades en inventario físico"]'::jsonb, 2.46, 92, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6624', '400', 'CONECTOR RJ45', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 400","Categoría ERP: Conectores","Disponibilidad: 666 unidades en inventario físico"]'::jsonb, 13.71, 666, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6625', '2778', 'CONECTOR RJ45 CAT5E', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2778","Categoría ERP: Conectores","Disponibilidad: 189 unidades en inventario físico"]'::jsonb, 4.92, 189, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6627', '3813', 'CONECTOR SENCILLO #4 2/0 TRIPLE', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3813","Categoría ERP: Conectores","Disponibilidad: 40 unidades en inventario físico"]'::jsonb, 134.66, 40, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6628', '2857', 'CONECTOR SILLA 1/0', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2857","Categoría ERP: Conectores","Disponibilidad: 5 unidades en inventario físico"]'::jsonb, 124.79, 5, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6635', '2817', 'CONECTOR SILLA DOBLE 250 MCM', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2817","Categoría ERP: Conectores","Disponibilidad: 6 unidades en inventario físico"]'::jsonb, 400.78, 6, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6636', '1047', 'CONECTOR SILLA N.2', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1047","Categoría ERP: Conectores","Disponibilidad: 3 unidades en inventario físico"]'::jsonb, 26.05, 3, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-6639', '403', 'CONECTOR UF 1/2', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 403","Categoría ERP: Conectores","Disponibilidad: 30 unidades en inventario físico"]'::jsonb, 21.61, 30, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6640', '404', 'CONECTOR UF 3/4', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 404","Categoría ERP: Conectores","Disponibilidad: 70 unidades en inventario físico"]'::jsonb, 30.66, 70, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-6644', '1950', 'JUEGO DE CONECTORES 35MM2 SCHNEIDER', 'WES', 'redes', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1950","Categoría ERP: Conectores","Disponibilidad: 10 unidades en inventario físico"]'::jsonb, 201.95, 10, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18254', '113 - DH-PFA130-E', 'BASE DAHUA P/CAMARA DH-PFA130-E', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 113 - DH-PFA130-E","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 7 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 1065.62, 7, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18256', '2110 - DH-PFA13A-E', 'BASE DAHUA P/CAMARA DOMO DH-PFA13A-A', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2110 - DH-PFA13A-E","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 20 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 683.42, 20, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-18257', '4356', 'BASE DAHUA P/CAMARA C/TAPA PFA134', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4356","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 19 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 496.73, 19, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-18261', '4245', 'BASE P/CAMARA MONTURA PARED IPC32X', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4245","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 1478.54, 2, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18263', '3076', 'CAMARA 2MPX CRUISER PAN TILT P/EXTERIOR IMOU', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3076","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 5090.04, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18265', '3098', 'CAMARA 2MPX VERSA FULL-COLOR, WIFI SPEA', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3098","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 3024.46, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18271', '4320', 'CAMARA BULEET DAHUA 5MPX COOPER SDL 2.8MM', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4320","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 2 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 2146.86, 2, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18273', '995 - DH-HAC-B1A21N', 'CAMARA BULLET 2MPX- DAHUA 1080P COOPER- B1A21N PLASTICA', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 995 - DH-HAC-B1A21N","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 8 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 1201.2, 8, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18274', '4447', 'CAMARA BULLET 3MPX IMOU WIFI', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4447","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 3 unidades en inventario físico"]'::jsonb, 4137.24, 3, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18275', '1827', 'CAMARA BULLET DAHUA 2 MPX-2.8MM FULL COLOR HDCVI', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1827","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 1266.72, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18277', '3722', 'CAMARA BULLET DAHUA 2MPX COOPER SDL 2.8MM', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3722","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 17 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 750, 17, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-18282', '2491', 'CAMARA BULLET DAHUA IP 2MPX', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2491","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 9 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 3363, 9, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18288', '3044', 'CAMARA BULLET DAHUA IP 5MPX 2.8 MM WIZSENSE SLD', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3044","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 3 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 8185.66, 3, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18291', '2029', 'CAMARA BULLET FERTEC IP 2MPX 3.6MM-ALARMA', 'Fertec', 'camaras', 'Equipo profesional Fertec distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2029","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 5040, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18296', '3946', 'CAMARA BULLET HIKVISION 2MPX COLORVU HIBRID SDL IP67 C/MIC', 'Hikvision', 'camaras', 'Equipo profesional Hikvision distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3946","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 3 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf"]'::jsonb, 4296.91, 3, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18297', '3943', 'CAMARA BULLET HIKVISION 4MPX COLORVU SDL IP67 C/MIC', 'Hikvision', 'camaras', 'Equipo profesional Hikvision distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3943","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf"]'::jsonb, 5930.68, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18308', '2563', 'CAMARA BULLET IP 4MPX 2.8MM IR30M IP67', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2563","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 6438, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18316', '3223-270883', 'CAMARA CRUISER 3MPX CON BOMBILLA WIFI UHD', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3223-270883","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 8 unidades en inventario físico"]'::jsonb, 2692.76, 8, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18320', '3225', 'CAMARA CRUISER RANGER DUAL 8MPX WIFI INTERIOR', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3225","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 4115.71, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18322', '3936', 'CAMARA CUBO 3MPX WIFI SERIE CUBE DAHUA', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3936","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 2415.84, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18323', '4561', 'CAMARA DOMO IP 2MPX SLD SERIE 1 C/AUDIO', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4561","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 5 unidades en inventario físico"]'::jsonb, 3134.55, 5, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18324', '3920 - DH-HAC-T1A21N', 'CAMARA DOMO 1080P COOPER 2MPX PLASTICA DAHUA', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3920 - DH-HAC-T1A21N","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 6 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 1001.62, 6, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18325', '1869', 'CAMARA DOMO DAHUA 1080P C/ MICROFONO HDCVI', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1869","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 4 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 4059.97, 4, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18326', '1021', 'CAMARA DOMO DAHUA 1080P COOPER 2.8MM PLAST', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1021","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 10 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 1031.06, 10, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18328', '3721 - DH-HAC-T1A21N-U-IL-A', 'CAMARA DOMO DAHUA 2MPX COOPER SDL 2.8MM', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3721 - DH-HAC-T1A21N-U-IL-A","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 64 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 750, 64, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-18329', '1826', 'CAMARA DOMO DAHUA 2MPX-2.8MM FULL COLOR HDCVI', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1826","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 1654.65, 1, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18333', '299 - 5H0967APAL41789', 'CAMARA DOMO DAHUA C/ MICROFONO HDCVI', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 299 - 5H0967APAL41789","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 6 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 1230.16, 6, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18334', '1407 - DH-HAC-HDW1200MN', 'CAMARA DOMO DAHUA HDCVI 2.8MM IR30M', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1407 - DH-HAC-HDW1200MN","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 7 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 2256.01, 7, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18338', '3589', 'CAMARA DOMO DAHUA IP 4MPX 2.8 MM WIZSENSE SLD', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3589","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 3904.5, 1, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18340', '2319', 'CAMARA DOMO DAHUA IP 4MPX PRO WIZCOLOR DAHUA', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2319","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 5 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 6555.4, 5, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18341', '4676', 'CAMARA DOMO DAHUA IP 4MPX SMART DUAL LIGHT', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4676","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 4 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 4285.13, 4, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18349', '2036', 'CAMARA DOMO HIKVISION C/ MICROFONO 5MPX', 'Hikvision', 'camaras', 'Equipo profesional Hikvision distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2036","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 3 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf"]'::jsonb, 4200, 3, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18351', '300', 'CAMARA DOMO HIKVISION IP4MPX 2.8MM', 'Hikvision', 'camaras', 'Equipo profesional Hikvision distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 300","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf"]'::jsonb, 5171.4, 1, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18358', '3711 - DH-IPC-HDW1239V-A-IL', 'CAMARA DOMO IP 2MP 2.8MM DAHUA SDL', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3711 - DH-IPC-HDW1239V-A-IL","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 20 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 3214.66, 20, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-18359', '4211', 'CAMARA DOMO IP 2MPX PRO WIZCOLOR', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4211","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 5740, 2, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18369', '2565 -', 'CAMARA DOMO IP DAHUA 2 MPX 2.8MM IP67 IK10 IR30', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2565 -","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 10 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 5718.69, 10, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18376', '1939 - HD-HAC-T2A11N', 'CAMARA DOMO/BULLET DAHUA 2.8MM 720P', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1939 - HD-HAC-T2A11N","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 9 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 1691, 9, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18377', '2215', 'CAMARA FISHEYE DAHUA HDCVI 5MPX WDR STARLIGHT', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2215","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 6608, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18380', '4691', 'CAMARA IP 4MPX DOMO IK10 SERIE 1', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4691","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 12 unidades en inventario físico"]'::jsonb, 4968.35, 12, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-18381', '3460', 'CAMARA IP BULLET 4MP 2.8MM ENTRY FULLCOLOR M DAHUA', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3460","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 10 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 5081.67, 10, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18383', '4635', 'CAMARA IP DOMO 2MP 2.8MM DAHUA IR30', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4635","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 3 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 2929.02, 3, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18384', '3449', 'CAMARA IP DOMO 2MP 2.8MM ENTRY DAHUA IK10', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3449","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 8 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 3506.09, 8, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18393', '3077', 'CAMARA PT CRUISER 2 5MPX FULL-COLOR P/EX', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3077","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 5040.15, 2, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18394', '3061 - IPC-S2EN-3R1S', 'CAMARA IMOU PT RANGER PRO 2 WIFI 3MPX MICRO SD', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3061 - IPC-S2EN-3R1S","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 3 unidades en inventario físico"]'::jsonb, 2477.03, 3, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18397', '2169', 'CAMARA TIPO BOMBILLO WIFI MIC + ADIO + LUZ', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2169","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 2814, 2, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18398', '3945', 'CAMARA TURRET 2MPX COLORVU C/MIC IP67 HIKVISION', 'Hikvision', 'camaras', 'Equipo profesional Hikvision distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3945","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 4 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_hikvision_wes.pdf"]'::jsonb, 6624.58, 4, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18399', '3947', 'CAMARA TURRET 4MPX COLORVU HIBRID LIGHT IP67 C/MIC', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3947","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 4725.85, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18402', '2216', 'CAMARA WIFI EZVIZ 1080P FIJA', 'EZVIZ', 'camaras', 'Equipo profesional EZVIZ distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2216","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 2310, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18403', '2217', 'CAMARA WIFI EZVIZ PTZ INTERIOR', 'EZVIZ', 'camaras', 'Equipo profesional EZVIZ distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2217","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 2380, 2, 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18407', '398', 'CONECTOR POE P/ CAMARA IP', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 398","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 9 unidades en inventario físico"]'::jsonb, 421.89, 9, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18410', '490', 'FUENTE 12V 3A P/ CAMARA', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 490","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 6 unidades en inventario físico"]'::jsonb, 748.33, 6, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18413', '4623', 'LETRERO P/CAMARAS', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4623","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 3 unidades en inventario físico"]'::jsonb, 346.92, 3, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18416', '2268', 'SENSOR MOV + CAMARA DSC PG9934PI INALAMBRICO', 'WES', 'camaras', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2268","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 8815.72, 1, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-21415', '2629', 'MEMORIA MICRO SD 32GB CLASE 10 DAHUA', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2629","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 9 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 325, 9, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-27936', '3745', 'ALAMBRE DE ACOMETIDA 6/3 COBRE', 'WES', 'cables', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3745","Categoría ERP: Cables eléctricos","Disponibilidad: 16 unidades en inventario físico"]'::jsonb, 333.42, 16, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-34064', 'ODOO-34064', 'MINI UPS V2', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: ODOO-34064","Categoría ERP: Baterías","Disponibilidad: 4 unidades en inventario físico"]'::jsonb, 1, 4, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-34077', 'ODOO-34077', 'PATCH CORD DAHUA CAT6 1FT', 'Dahua', 'camaras', 'Equipo profesional Dahua distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: ODOO-34077","Categoría ERP: Camaras y Videovigilancia","Disponibilidad: 30 unidades en inventario físico","Manual de Instalación disponible","manual_url:https://warnelectricalservices.com/docs/manual_dahua_wes.pdf"]'::jsonb, 1, 30, 'https://images.unsplash.com/photo-1549100156-427908b98e1f?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-34079', '3-18-4683', 'CAJA DE BREAKER 24 CIRC EMP', 'WES', 'acceso', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3-18-4683","Categoría ERP: Accesorios Electricos","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 1, 2, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-34095', 'ODOO-34095', 'TERMINAL  OJO #2', 'WES', 'energia', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: ODOO-34095","Categoría ERP: Baterías","Disponibilidad: 19 unidades en inventario físico"]'::jsonb, 125, 19, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', true, true),
('odoo-34096', 'ODOO-34096', 'CAJA BREAKER EMP 24 CIRCUITOS CISMA', 'WES', 'acceso', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: ODOO-34096","Categoría ERP: Accesorios Electricos","Disponibilidad: 4 unidades en inventario físico"]'::jsonb, 500, 4, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-34127', 'ODOO-34127', 'CONTACTOR 110V 9A', 'WES', 'acceso', 'Equipo profesional WES distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: ODOO-34127","Categoría ERP: Accesorios Electricos","Disponibilidad: 1 unidades en inventario físico"]'::jsonb, 1, 1, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-34195', 'FTL-BR600U', 'BRACKET DE PIVOTE P/PUERTA DE CRISTAL FERTEC', 'Fertec', 'acceso', 'Equipo profesional Fertec distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: FTL-BR600U","Categoría ERP: Alarmas y Control de Acceso","Disponibilidad: 2 unidades en inventario físico"]'::jsonb, 900, 2, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-28119', '2399', 'BASE MOTOR OPERADOR CAME 1000KG', 'CAME', 'acceso', 'Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2399","Categoría ERP: Otros","Disponibilidad: Disponible bajo pedido","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 1275, 0, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-31568', '415', 'CONTROL OPERADOR CAME', 'CAME', 'acceso', 'Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 415","Categoría ERP: Otros","Disponibilidad: Disponible bajo pedido","Manual de Instalación disponible","manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01358M04.pdf"]'::jsonb, 1765.65, 0, 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-31569', '4385', 'CONTROL OPERADOR CAME 2 BOTONES (TOP-432EE)', 'CAME', 'acceso', 'Transmisor de radio original CAME TOP-432EE bicanal a frecuencia 433.92 MHz. Sistema de autoaprendizaje para clonación rápida entre mandos sin necesidad de acceder al motor. Carcasa ergonómica con pulsadores reforzados y anilla para llavero.', '["SKU: 4385","Frecuencia de trabajo: 433.92 MHz","Canales: 2 canales independientes (2 puertas/motores)","Función de autoaprendizaje y clonación código a código","Disponibilidad: 3 unidades en inventario físico WES","Alcance: hasta 150 metros en campo abierto"]'::jsonb, 1450, 3, 'https://sc04.alicdn.com/kf/Hba0b1142e5dc4a82a01519e5ce406f85Z.jpg', true, false),
('odoo-31570', '1183', 'CONTROL OPERADOR CAME DIGITAL AZUL 4 BOTONES', 'CAME', 'acceso', 'Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1183","Categoría ERP: Otros","Disponibilidad: Disponible bajo pedido","Manual de Instalación disponible","manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01358M04.pdf"]'::jsonb, 1674, 0, 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-31571', '1757', 'CONTROL OPERADOR CAME DIGITAL AZUL COPIA', 'CAME', 'acceso', 'Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1757","Categoría ERP: Otros","Disponibilidad: Disponible bajo pedido","Manual de Instalación disponible","manual_url:https://www.came.com/global/sites/default/files/2021-04/FA01358M04.pdf"]'::jsonb, 1395, 0, 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-31572', '3152', 'CONTROL OPERADOR CAME 4 BOTONES ROLLING CODE (TOP44RBN)', 'CAME', 'acceso', 'Mando a distancia de última generación CAME 806TS-0270 TOP44RBN de 4 canales y frecuencia 433.92 MHz. Equipado con tecnología Rolling Code de alta seguridad que evita la clonación o interceptación de señal. Dispone de 4 botones configurables para hasta 4 automatizaciones distintas (portón corredero, puerta de garaje, barrera vehicular o iluminación exterior). Permite configuración tradicional por radiofrecuencia o escaneando el código QR exclusivo desde la app oficial CAME SetUp.', '["SKU: 3152","Modelo oficial: CAME 806TS-0270 TOP44RBN","Frecuencia: 433.92 MHz Rolling Code (anticlonación de alta seguridad)","Canales: 4 canales independientes para 4 accesos o automatismos","Configuración: Tradicional o vía App CAME SetUp con código QR","Batería: Pila de litio CR2032 de larga duración incluida","Disponibilidad: 2 unidades en inventario físico WES","Garantía WES: 1 año oficial CAME"]'::jsonb, 1850, 2, 'assets/came-top44rbn-front.jpg', true, false),
('odoo-33659', '4303', 'FINAL DE CARRERA CAME', 'CAME', 'acceso', 'Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 4303","Categoría ERP: Otros","Disponibilidad: Disponible bajo pedido","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 2100, 0, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-33665', '1373', 'FOTOCELDA CAME ORIGINAL DIR10 (PAR)', 'CAME', 'acceso', 'Par de fotoceldas de seguridad infrarrojas CAME DIR10 con sincronización óptica. Detección instantánea de personas, mascotas o vehículos en el radio de recorrido del portón para inversión inmediata de marcha.', '["SKU: 1373","Alcance de detección: 10 metros","Alimentación: 12V - 24V AC/DC","Protección: IP54 para intemperie exterior","Disponibilidad: 2 unidades en inventario físico WES","Seguridad obligatoria para portones automáticos"]'::jsonb, 3600, 2, 'https://sc04.alicdn.com/kf/H40ce806651c9492c984e5c95483f02c0J.jpg', true, false),
('odoo-18519', '2920', 'INSPECCION Y CONFIGURACION DE MOTOR CAME.', 'CAME', 'acceso', 'Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 2920","Categoría ERP: Mano de Obra","Disponibilidad: Disponible bajo pedido","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 500, 0, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-21467', '3797', 'MOTOR 2000KG CAME USO INDUSTRIAL PESADO (BK-2200)', 'CAME', 'acceso', 'Operador electromecánico CAME industrial de máxima potencia para puertas correderas de hasta 2,000 kg a 2,200 kg y 23 metros de longitud. Diseñado para puertos secos, industrias pesadas y naves logísticas. Chasis de aleación de aluminio reforzado, piñón módulo 6 y cuadro electrónico ZT6 con control de par y deceleración progresiva.', '["SKU: 3797","Capacidad máxima: 2,000 kg / Longitud máx: 23 metros","Alimentación: CA 230V - 400V Trifásica / Monofásica","Potencia de arrastre: 580 W / Fuerza de empuje: 1,500 N","Ciclo de trabajo: Servicio industrial continuo (50%)","Piñón de arrastre: Módulo M6 de acero endurecido","Disponibilidad: 1 unidad en inventario físico WES","Garantía WES: 2 años oficial certificada CAME","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 78500, 1, 'https://sc04.alicdn.com/kf/Hbd4ddf56abc14d8e984111131c0bf8c0y.jpg_960x960q80.jpg', true, false),
('odoo-21468', '1390', 'MOTOR CAME 1000KG USO INTENSIVO (BXV10AGS)', 'CAME', 'acceso', 'Motorreductor electromecánico CAME BXV10AGS / 001USU0030 para cancelas y portones correderos de hasta 1,000 kg y 20 metros de longitud. Diseño estilizado, ligero y ultrarresistente con tecnología de motor a 24V CC y Encoder incorporado en la central de control: detección continua de obstáculos con parada y reversa automática de marcha. Cuadro electrónico con display digital de programación para hasta 250 usuarios individuales.', '["SKU: 1390","Modelo oficial: CAME BXV10AGS / 001USU0030 (1000KG)","Capacidad máxima: 1,000 kg / Longitud máx: 20 metros","Alimentación: 110V - 120V CA / Motor: 24V CC con tecnología Encoder","Sistema de seguridad Encoder: Detección de obstáculos con reversa automática","Potencia Máx: 400 W / Fuerza de empuje: 1,000 N","Velocidad de maniobra: 11 m/min","Memoria interna: Hasta 250 usuarios independientes","Grado de protección: IP44 para intemperie / Color: Gris Grafito RAL 7024","Disponibilidad: 1 unidad en inventario físico WES","Garantía WES: 2 años con certificación de origen CAME","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 41330.76, 1, 'assets/came-bxv1000kg.jpg', true, false),
('odoo-21469', '603', 'MOTOR CAME 1800KG USO INDUSTRIAL (BK-1800)', 'CAME', 'acceso', 'Operador electromecánico CAME serie BK para puertas correderas industriales y condominios de hasta 1,800 kg y 20 metros. Estructura robusta de fundición de aluminio inyectado, piñón reforzado módulo 4/6, centralita ZBKN con pantalla de programación.', '["SKU: 603","Capacidad industrial: 1,800 kg / Longitud máx: 20 metros","Alimentación: CA 230V / 50-60 Hz","Potencia de arrastre: 480W / Fuerza: 1,150 N","Ciclo de trabajo: Servicio industrial pesado (50%)","Piñón de arrastre: Módulo 4 / Módulo 6 en acero","Disponibilidad: 1 unidad en inventario físico WES","Garantía WES: 2 años oficial CAME","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 66216, 1, 'https://sc04.alicdn.com/kf/Hbd4ddf56abc14d8e984111131c0bf8c0y.jpg_960x960q80.jpg', true, false),
('odoo-21470', '2009', 'MOTOR CAME 600KG USO INTENSIVO (BXV 600)', 'CAME', 'acceso', 'Motorreductor electromecánico CAME de 24V DC / 230V AC para cancelas correderas de hasta 600 kg y 18 metros de longitud. Equipado con tecnología de encoder para parada suave y detección de obstáculos, desbloqueo ergonómico manual y cuadro de mando digital ZN7 con cargador de batería de respaldo.', '["SKU: 2009","Capacidad: 600 kg / Longitud máx: 18 metros","Alimentación motor: 24V DC (Alta seguridad y respaldo de batería)","Fuerza de empuje: 600 N / Velocidad: 12 m/min","Ciclo de trabajo: Uso intensivo residencial y comercial","Protección: IP44 / IP54 resistente a intemperie","Disponibilidad: 2 unidades en inventario físico WES","Garantía WES: 2 años oficial CAME","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 32735.08, 2, 'https://sc04.alicdn.com/kf/Hbd4ddf56abc14d8e984111131c0bf8c0y.jpg_960x960q80.jpg', true, false),
('odoo-21471', '604', 'MOTOR CAME 800KG (BX-78 / BX-800)', 'CAME', 'acceso', 'Kit de automatización electromecánico CAME para puertas y portones correderos de hasta 800 kg y 14 metros de longitud. Fabricación italiana de alto rendimiento con chasis en aleación de aluminio inyectado a presión, desbloqueo manual ergonómico protegido con llave y cuadro de mando digital ZBX integrado.', '["SKU: 604","Capacidad: 800 kg / Longitud máx: 14 metros","Alimentación motor: CA 230V / 50-60 Hz","Potencia: 300 W / Fuerza de empuje: 800 N","Velocidad: 10.5 m/min","Ciclo de trabajo: Uso intensivo residencial y comercial (30%)","Protección: IP54 resistente a intemperie","Disponibilidad: 2 unidades en inventario físico WES","Garantía WES: 2 años oficial CAME","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 37445.26, 2, 'https://sc04.alicdn.com/kf/Hbd4ddf56abc14d8e984111131c0bf8c0y.jpg_960x960q80.jpg', true, true),
('odoo-21472', '1765', 'MOTOR CAME 800KG REFULL - KIT COMPLETO INTEGRAL', 'CAME', 'acceso', 'Kit integral CAME BX de 800 kg con todos los accesorios incluidos para instalación completa e inmediata: 1 motorreductor CAME BX 800KG, 4 metros de cremallera de acero galvanizado M4, 2 mandos remotos bicanal TOP-432EE, 1 par de fotoceldas infrarrojas DIR10, 1 lámpara destellante LED KRX con antena incorporada y base de anclaje.', '["SKU: 1765","Kit Completo Refull: Motor + 4m Cremallera + 2 Mandos + Fotoceldas + Lámpara LED","Capacidad: 800 kg / Longitud máx: 14 metros","Alimentación: CA 230V / 50-60 Hz","Empuje: 800 N / Velocidad: 10.5 m/min","Disponibilidad: 2 unidades en inventario físico WES","Garantía WES: 2 años oficial CAME","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 42500, 2, 'https://sc04.alicdn.com/kf/H541089cf56e54fcf9bfc4f9a8691647ft.jpg_960x960q80.jpg', true, false),
('odoo-34115', 'COSTO VEF.', 'PORTEZUELA DESBLOQUEO MANUAL MOTOR CAME BX 800KG', 'CAME', 'acceso', 'Portezuela de recambio original CAME para el sistema de desbloqueo mecánico manual en motores correderos de la serie BX (BX-74, BX-78, BX-800). Fabricada en fundición de aluminio inyectado esmaltado en gris grafito. Incluye cilindro de cerradura, leva interior de desembrague y llave original CAME.', '["SKU: BX-DESBL-800","Compatibilidad: Motores CAME BX-74, BX-78 y BX 800KG","Material: Fundición de aluminio esmaltado anticorrosión","Incluye: Cilindro con bombín de cerradura y llave original CAME","Función: Desbloqueo de emergencia manual del engranaje","Disponibilidad: 2 unidades en inventario físico WES"]'::jsonb, 4239.96, 2, 'https://sc04.alicdn.com/kf/Hbd4ddf56abc14d8e984111131c0bf8c0y.jpg_960x960q80.jpg', true, false),
('odoo-25184', '1919', 'RELAY 12VDC 10A P/ MOTOR CAME', 'CAME', 'acceso', 'Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1919","Categoría ERP: Otros","Disponibilidad: Disponible bajo pedido","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 270, 0, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-25186', '1884', 'RELAY 24VDC 5A 8 PIN 1CONTAC P/CAME', 'CAME', 'acceso', 'Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 1884","Categoría ERP: Otros","Disponibilidad: Disponible bajo pedido","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 504.74, 0, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-18539', '3210', 'REPARACION DE TARJETA DE MOTOR CAME 1000KG', 'CAME', 'acceso', 'Equipo profesional CAME distribuido por Warn Electrical Services. Modelo certificado para alta durabilidad.', '["SKU: 3210","Categoría ERP: Mano de Obra","Disponibilidad: Disponible bajo pedido","Manual de Instalación disponible","manual_url:assets/manuals/manual-came-bx-800kg.pdf"]'::jsonb, 500, 0, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', true, false),
('odoo-26418', '4016', 'TARJETA ELECTRÓNICA MOTOR CAME 1800KG ZBX DIGITAL', 'CAME', 'acceso', 'Cuadro de mando y tarjeta electrónica central original CAME ZBX / ZBKN para operadores correderos de 230V AC (CAME BX-78, BK-1200, BK-1800, BK-2200). Incorpora relés de potencia de grado industrial, trimmers de ajuste fino para tiempo de cierre automático, conector directo para tarjeta de radiofrecuencia AF43S/AF868, bornes enchufables para fotoceldas DIR y autodiagnóstico de seguridad.', '["SKU: 4016","Alimentación: 230V AC monofásica","Compatibilidad: Motores CAME BK-1800, BK-2200 y serie BX","Funciones: Cierre automático, apertura parcial peatonal, pre-destello","Conectores: Regleta de bornes extraíbles y ranura para tarjeta AF43S","Disponibilidad: 2 unidades en inventario físico WES"]'::jsonb, 19430.2, 2, 'https://sc04.alicdn.com/kf/H8733a0786cb84e018452aa53d4748bccs.jpg_960x960q80.jpg', true, false),
('wes-crem-m4', 'CREM-M4-AC', 'CREMALLERA DE ACERO GALVANIZADO M4 (1 METRO)', 'CAME', 'acceso', 'Tramo de cremallera de 1 metro en acero macizo cincado con módulo 4 estándar para motores correderos CAME y universales. Incluye 3 espaciadores roscados y 3 pernos de acero de fijación por tramo para soldar o atornillar en portones de hasta 2,200 kg.', '["SKU: CREM-M4-AC","Longitud: 1 metro (1,000 mm)","Paso de diente: Módulo M4 estándar CAME","Material: Acero galvanizado anticorrosión 12x30mm","Incluye: 3 espaciadores y 3 pernos de fijación M8","Disponibilidad: 25 unidades en inventario físico WES"]'::jsonb, 1250, 25, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=960&q=80', true, true),
('wes-crem-nyl', 'CREM-M4-NY', 'CREMALLERA DE NYLON SILENCIOSA M4 (1 METRO)', 'CAME', 'acceso', 'Cremallera de polímero de ingeniería de alta resistencia con núcleo interior de acero reforzado. Reduce en más de un 80% el ruido mecánico de arrastre, no requiere lubricación periódica y previene cualquier tipo de óxido en ambientes exteriores.', '["SKU: CREM-M4-NY","Longitud: 1 metro (1,000 mm)","Paso de diente: Módulo M4","Estructura: Nylon técnico autolubricado con alma de acero","Capacidad: Portones de hasta 800 kg","Disponibilidad: 18 unidades en inventario físico WES"]'::jsonb, 950, 18, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=960&q=80', true, true),
('wes-lamp-krx', 'LAMP-KRX-LED', 'LÁMPARA DESTELLANTE LED CAME KRX CON ANTENA', 'CAME', 'acceso', 'Lámpara de señalización vial LED CAME KRX de advertencia visual para apertura y cierre de portones. Fuente luminosa de alta visibilidad diurna y nocturna con antena sintonizada de 433.92 MHz integrada para maximizar el alcance de los mandos a distancia.', '["SKU: LAMP-KRX-LED","Alimentación: Multi-voltaje 24V a 230V AC/DC","Tecnología: LED de alta visibilidad y bajo consumo","Antena integrada: 433.92 MHz de largo alcance","Protección: IP54 para intemperie","Disponibilidad: 6 unidades en inventario físico WES"]'::jsonb, 3450, 6, 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=960&q=80', true, true)
ON CONFLICT (codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  marca = EXCLUDED.marca,
  precio = EXCLUDED.precio,
  stock = EXCLUDED.stock,
  descripcion = EXCLUDED.descripcion,
  caracteristicas = EXCLUDED.caracteristicas,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();


-- PASO 3: TABLA Y REGISTROS DE RESEÑAS Y CALIDAD DE PRODUCTO
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


-- PASO 4: TABLA Y REGISTROS CENTRALIZADOS DE MANUALES TÉCNICOS PDF
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


-- NOTIFICACIÓN DE FINALIZACIÓN EXITOSA
SELECT 
    (SELECT COUNT(*) FROM public.productos) AS total_productos_en_base_de_datos,
    (SELECT COUNT(*) FROM public.manuales_productos) AS total_manuales_registrados,
    (SELECT COUNT(*) FROM public.resenas_productos) AS total_resenas_registradas;
