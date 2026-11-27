/**
 * WES PLATAFORMA - SERVICIO Y CATÁLOGO DE DOCUMENTOS Y MANUALES TÉCNICOS
 * Módulo para la gestión y consulta estricta de manuales, fichas técnicas, diagramas y guías por producto.
 * Versión: 1.0 - 2026-11-27
 */

(function() {
  'use strict';

  // Catálogo inicial verificado de documentos y manuales oficiales
  const INITIAL_PRODUCT_DOCUMENTS = [
    {
      id: "doc-ruijie-rap2260g-ds",
      product_ids: ["wes-net-ap-wifi6"],
      skus: ["RG-RAP2260G"],
      titulo: "Ficha Técnica Oficial Ruijie Reyee RG-RAP2260(G) Wi-Fi 6 AX1800",
      tipo: "ficha_tecnica",
      url: "https://www.ruijienetworks.com/products/reyee-wireless/reyee-ap/rg-rap2260-g",
      marca: "Ruijie",
      modelo: "RG-RAP2260(G)",
      idioma: "Español / Inglés",
      version: "Oficial 2026",
      verificado: true,
      updated_at: "2026-11-27"
    },
    {
      id: "doc-ruijie-rgeg105g-ds",
      product_ids: ["wes-net-router-gbe"],
      skus: ["RG-EG105G-V2"],
      titulo: "Ficha Técnica Router Gigabit Empresarial Reyee RG-EG105G-V2",
      tipo: "ficha_tecnica",
      url: "https://www.ruijienetworks.com/products/reyee-routers/reyee-enterprise-routers/rg-eg105g-v2",
      marca: "Ruijie",
      modelo: "RG-EG105G-V2",
      idioma: "Español / Inglés",
      version: "Oficial 2026",
      verificado: true,
      updated_at: "2026-11-27"
    },
    {
      id: "doc-came-bx-800",
      product_ids: ["odoo-21471", "odoo-21472"],
      skus: ["604", "1765"],
      titulo: "Manual de Instalación y Diagrama Eléctrico CAME BX (BX-78 / BX-800)",
      tipo: "manual",
      url: "assets/manuals/manual-came-bx-800kg.pdf",
      marca: "CAME",
      modelo: "BX-78 / BX-800",
      idioma: "Español / Multilingüe",
      version: "1.0",
      verificado: true,
      updated_at: "2026-11-27"
    },
    {
      id: "doc-came-bkv-2000",
      product_ids: ["odoo-21467"],
      skus: ["3797"],
      titulo: "Manual de Instalación Motor Corredero Industrial CAME BKV 2000KG",
      tipo: "manual",
      url: "assets/manuals/manual-came-bkv-2000kg.pdf",
      marca: "CAME",
      modelo: "BKV 2000kg (BKV20RGS)",
      idioma: "Español / Multilingüe",
      version: "1.0",
      verificado: true,
      updated_at: "2026-11-27"
    },
    {
      id: "doc-came-zbx-digital",
      product_ids: ["odoo-26418"],
      skus: ["4016"],
      titulo: "Instrucciones de Conexión Cuadro de Mando CAME ZBX",
      tipo: "diagrama",
      url: "https://www.came.com/global/sites/default/files/2021-04/FA00943M04.pdf",
      marca: "CAME",
      modelo: "ZBX Digital",
      idioma: "Español / Multilingüe",
      version: "FA00943M04",
      verificado: true,
      updated_at: "2026-11-27"
    },
    {
      id: "doc-came-radiomandos-top",
      product_ids: ["odoo-31568", "odoo-31569", "odoo-31570", "odoo-31572"],
      skus: ["415", "4385", "1183", "3152"],
      titulo: "Guía de Programación y Duplicación de Radiomandos CAME TOP Series",
      tipo: "guia_instalacion",
      url: "https://www.came.com/global/sites/default/files/2021-04/FA01358M04.pdf",
      marca: "CAME",
      modelo: "TOP-432EE / TOPD4RBS / TOP44RBN",
      idioma: "Español / Multilingüe",
      version: "FA01358M04",
      verificado: true,
      updated_at: "2026-11-27"
    },
    {
      id: "doc-inv-prostec-1500",
      product_ids: ["odoo-1751"],
      skus: ["553"],
      titulo: "Manual de Operación Inversor Wave Platinum PROSTEC 1.5KW / 12VDC",
      tipo: "manual",
      url: "assets/manuals/manual-inversor-wave-platinum-prostec.pdf",
      marca: "PROSTEC",
      modelo: "Wave Platinum 1.5KW",
      idioma: "Español",
      version: "1.0",
      verificado: true,
      updated_at: "2026-11-27"
    },
    {
      id: "doc-sonoff-pow-elite",
      product_ids: ["odoo-1646"],
      skus: ["1646"],
      titulo: "Guía de Instalación y Ficha Técnica Sonoff POW Elite 20A (POWR320D)",
      tipo: "guia_instalacion",
      url: "https://smartxbd.com/product/sonoff-pow-elite-20a-wifi-power-meter-smart-switch-module-powr320d/",
      marca: "Sonoff",
      modelo: "POWR320D",
      idioma: "Español / Inglés",
      version: "1.0",
      verificado: true,
      updated_at: "2026-11-27"
    },
    {
      id: "doc-dahua-pfm922i-cable",
      product_ids: ["odoo-173"],
      skus: ["2949"],
      titulo: "Datasheet Oficial Cable UTP Dahua Cat6 DH-PFM922I-6UN-C",
      tipo: "ficha_tecnica",
      url: "https://material.dahuasecurity.com/uploads/cpq/prm-os-srv-res/smart/formal/Product/HQ/1.0.99.50.10127/Datasheet/PFM922I-6UN-C_datasheet_20220407.pdf",
      marca: "Dahua",
      modelo: "DH-PFM922I-6UN-C",
      idioma: "Inglés",
      version: "2022",
      verificado: true,
      updated_at: "2026-11-27"
    }
  ];

  const STORAGE_KEY = 'wes_product_documents_v1';

  const ProductDocumentsService = {
    getAllDocuments: function() {
      try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('[ProductDocumentsService] Error al leer documentos locales:', e);
      }
      return INITIAL_PRODUCT_DOCUMENTS.slice();
    },

    saveAllDocuments: function(docs) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
        }
        return true;
      } catch (e) {
        console.error('[ProductDocumentsService] Error al guardar documentos:', e);
        return false;
      }
    },

    getDocumentsForProduct: function(productId, sku) {
      if (!productId && !sku) return [];
      const allDocs = this.getAllDocuments();
      const pIdStr = productId ? String(productId).trim().toLowerCase() : null;
      const skuStr = sku ? String(sku).trim().toLowerCase() : null;

      return allDocs.filter(doc => {
        if (!doc || doc.verificado === false) return false;

        const hasProductMatch = pIdStr && Array.isArray(doc.product_ids) &&
          doc.product_ids.some(id => String(id).trim().toLowerCase() === pIdStr);

        const hasSkuMatch = skuStr && Array.isArray(doc.skus) &&
          doc.skus.some(s => String(s).trim().toLowerCase() === skuStr);

        return hasProductMatch || hasSkuMatch;
      });
    },

    saveDocument: function(docData) {
      if (!docData) return { success: false, message: 'Datos inválidos' };
      const docs = this.getAllDocuments();
      const id = docData.id || ('doc-' + Date.now());

      const newDoc = {
        id: id,
        product_ids: Array.isArray(docData.product_ids) ? docData.product_ids : (docData.producto_id ? [docData.producto_id] : []),
        skus: Array.isArray(docData.skus) ? docData.skus : (docData.sku ? [docData.sku] : []),
        titulo: docData.titulo || docData.title || 'Documento Técnico',
        tipo: docData.tipo || docData.type || 'manual',
        url: docData.url || docData.archivo_url || '#',
        marca: docData.marca || docData.brand || '',
        modelo: docData.modelo || docData.model || '',
        idioma: docData.idioma || 'Español',
        version: docData.version || '1.0',
        verificado: docData.verificado !== false,
        updated_at: new Date().toISOString().split('T')[0]
      };

      const existingIndex = docs.findIndex(d => d.id === id);
      if (existingIndex >= 0) {
        docs[existingIndex] = newDoc;
      } else {
        docs.push(newDoc);
      }

      this.saveAllDocuments(docs);
      return { success: true, document: newDoc };
    },

    deleteDocument: function(docId) {
      if (!docId) return { success: false };
      let docs = this.getAllDocuments();
      docs = docs.filter(d => d.id !== docId);
      this.saveAllDocuments(docs);
      return { success: true };
    },

    linkProductToDocument: function(docId, productId, sku) {
      const docs = this.getAllDocuments();
      const doc = docs.find(d => d.id === docId);
      if (!doc) return { success: false, message: 'Documento no encontrado' };

      if (!Array.isArray(doc.product_ids)) doc.product_ids = [];
      if (!Array.isArray(doc.skus)) doc.skus = [];

      if (productId && !doc.product_ids.includes(productId)) {
        doc.product_ids.push(productId);
      }
      if (sku && !doc.skus.includes(sku)) {
        doc.skus.push(sku);
      }
      doc.updated_at = new Date().toISOString().split('T')[0];

      this.saveAllDocuments(docs);
      return { success: true, document: doc };
    },

    unlinkProductFromDocument: function(docId, productId, sku) {
      const docs = this.getAllDocuments();
      const doc = docs.find(d => d.id === docId);
      if (!doc) return { success: false, message: 'Documento no encontrado' };

      if (Array.isArray(doc.product_ids) && productId) {
        doc.product_ids = doc.product_ids.filter(id => id !== productId);
      }
      if (Array.isArray(doc.skus) && sku) {
        doc.skus = doc.skus.filter(s => s !== sku);
      }
      doc.updated_at = new Date().toISOString().split('T')[0];

      this.saveAllDocuments(docs);
      return { success: true, document: doc };
    },

    getMetaForType: function(tipo) {
      switch (tipo) {
        case 'ficha_tecnica':
          return {
            label: 'Ficha Técnica',
            badgeBg: 'bg-blue-50',
            badgeText: 'text-blue-700',
            badgeBorder: 'border-blue-200',
            iconClass: 'fas fa-file-invoice text-blue-600',
            btnClass: 'bg-blue-600 hover:bg-blue-700 text-white'
          };
        case 'diagrama':
          return {
            label: 'Diagrama Eléctrico',
            badgeBg: 'bg-amber-50',
            badgeText: 'text-amber-800',
            badgeBorder: 'border-amber-200',
            iconClass: 'fas fa-project-diagram text-amber-600',
            btnClass: 'bg-amber-600 hover:bg-amber-700 text-white'
          };
        case 'guia_instalacion':
          return {
            label: 'Guía Rápida de Instalación',
            badgeBg: 'bg-emerald-50',
            badgeText: 'text-emerald-800',
            badgeBorder: 'border-emerald-200',
            iconClass: 'fas fa-wrench text-emerald-600',
            btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white'
          };
        case 'manual':
        default:
          return {
            label: 'Manual de Usuario',
            badgeBg: 'bg-rose-50',
            badgeText: 'text-rose-700',
            badgeBorder: 'border-rose-200',
            iconClass: 'fas fa-file-pdf text-rose-600',
            btnClass: 'bg-rose-600 hover:bg-rose-700 text-white'
          };
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.INITIAL_PRODUCT_DOCUMENTS = INITIAL_PRODUCT_DOCUMENTS;
    window.ProductDocumentsService = ProductDocumentsService;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INITIAL_PRODUCT_DOCUMENTS, ProductDocumentsService };
  }

})();
