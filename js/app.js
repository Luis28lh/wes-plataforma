

// ==========================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// Lógica Principal de la Aplicación Web (app.js)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Estado global de la aplicación
var AppState = {
  cart: [],
  selectedCategory: 'all',
  selectedSubcategory: null,
  selectedCategoryParent: null,
  selectedBrand: 'all',
  selectedAvailability: 'all',
  searchQuery: '',
  sortBy: 'featured',
  offerSubFilter: 'all',
  catalogPageSize: 24,
  catalogVisibleCount: 24,
  supportImages: [],
  settings: StorageService.getCompanySettings(),
  backendUrl: localStorage.getItem('wes_backend_url') || 'https://script.google.com/macros/s/AKfycbyoN8TnzeN9Cg2X44YEt6KeQULahvG0DrEXP5m4HyLvJFs475maMjVrwjW8t-IRVIQ_OQ/exec'
};
window.AppState = AppState;

let wesMapInstance = null;

function initApp() {
  renderCompanyInfo();
  initInteractiveMap();
  applyFeatureFlags();
  renderProducts();
  setupEventListeners();
  updateCartBadge();
  setupSupportImageUploader();
  setupPhoneInputsMask();
  checkCookieConsent();
  initEnergyProjectScenarios();
  updateAuthHeaderUI();

  // Revisar si la URL contiene un enlace directo a un producto (?p=SKU o ?sku=SKU)
  checkUrlForProduct();

  // Revisar si la URL contiene filtro de categoría o subcategoría (?cat=... &sub=...)
  checkUrlForCategory();

  // Revisar si se solicitó abrir proyectos en instalación (desde tablero técnico)
  if (window.location.hash === '#proyectos-instalacion' || localStorage.getItem('wes_open_odoo_projects_on_load') === 'true') {
    localStorage.removeItem('wes_open_odoo_projects_on_load');
    setTimeout(() => {
      if (typeof openInstallationProjectsModal === 'function') openInstallationProjectsModal();
    }, 400);
  }

  // Reaccionar a cambios de Feature Flags emitidos desde el portal administrativo
  window.addEventListener('wes_flags_changed', () => {
    applyFeatureFlags();
    renderProducts();
  });

  // Sincronización en segundo plano con Supabase si está disponible
  if (window.WesDB && window.WesDB.isConfigured()) {
    window.WesDB.getProducts().then(remoteProducts => {
      if (Array.isArray(remoteProducts) && remoteProducts.length >= 200) {
        // Preservar productos locales y personalizados (p. ej. altas desde Solicitudes de Sofía)
        let mergedProducts = [...remoteProducts];
        try {
          const currentLocal = JSON.parse(localStorage.getItem('wes_custom_products') || '[]');
          if (Array.isArray(currentLocal) && currentLocal.length) {
            currentLocal.forEach(localItem => {
              const localSku = String(localItem.code || localItem.codigo || '');
              const remoteIdx = mergedProducts.findIndex(r => String(r.code || r.codigo || '') === localSku);
              if (remoteIdx === -1 && localSku) {
                mergedProducts.unshift(localItem);
              } else if (remoteIdx !== -1 && localItem._customConfirmed) {
                mergedProducts[remoteIdx] = Object.assign({}, mergedProducts[remoteIdx], localItem);
              }
            });
          }
        } catch(e) {}
        StorageService.saveProducts(mergedProducts);
        renderProducts();
        if (typeof populateFilterOptions === 'function') {
          populateFilterOptions(mergedProducts);
        }
        // Si había una petición de enlace directo pendiente mientras cargaba la base de datos
        if (window.pendingDeepLinkQuery) {
          checkUrlForProduct();
          delete window.pendingDeepLinkQuery;
        }
      }
    }).catch(err => {
      console.warn('[WesApp] Fallback a catálogo local activo:', err);
    });
  }
}

// 1. Renderizar datos de contacto y textos de la empresa
function renderCompanyInfo() {
  const s = AppState.settings;
  
  // Teléfonos y WhatsApp
  document.querySelectorAll('.company-phone').forEach(el => el.textContent = s.phone);
  document.querySelectorAll('.company-whatsapp').forEach(el => {
    el.textContent = s.whatsappDisplay;
    el.setAttribute('href', `https://wa.me/${s.whatsapp}?text=${encodeURIComponent('Hola Warn Electrical Services (WES), deseo información sobre sus servicios.')}`);
  });
  
  // Botón flotante de WhatsApp
  const floatingWa = document.getElementById('floating-whatsapp');
  if (floatingWa) {
    floatingWa.setAttribute('href', `https://wa.me/${s.whatsapp}?text=${encodeURIComponent('Hola Warn Electrical Services (WES), me gustaría hacer una consulta.')}`);
  }

  // Correos
  document.querySelectorAll('.company-email-general').forEach(el => {
    el.textContent = s.emailGeneral;
    el.setAttribute('href', `mailto:${s.emailGeneral}`);
  });
  document.querySelectorAll('.company-email-support').forEach(el => {
    el.textContent = s.emailSupport;
    el.setAttribute('href', `mailto:${s.emailSupport}`);
  });

  // Dirección y Horarios
  document.querySelectorAll('.company-address').forEach(el => el.textContent = s.address);
  document.querySelectorAll('.company-schedule-week').forEach(el => el.textContent = s.scheduleWeek);
  document.querySelectorAll('.company-schedule-sat').forEach(el => el.textContent = s.scheduleSat);
}

// 1.1 Inicializar Mapa Interactivo con Marcador Personalizado WES
function initInteractiveMap() {
  const mapContainer = document.getElementById('wes-interactive-map');
  if (!mapContainer || !window.L) return;

  if (wesMapInstance) {
    wesMapInstance.remove();
  }

  const wesCoords = [19.3877255, -70.531041]; // Autopista Ramón Cáceres, Moca

  wesMapInstance = L.map('wes-interactive-map', {
    center: wesCoords,
    zoom: 16,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | Warn Electrical Services',
    maxZoom: 19
  }).addTo(wesMapInstance);

  // Marcador Corporativo WES con Isotipo de Rayo
  const wesCustomIcon = L.divIcon({
    className: 'wes-marker-icon',
    html: `
      <div style="position: relative; width: 44px; height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: #071836; border: 2.5px solid #F5B300; display: flex; align-items: center; justify-content: center; color: #F5B300; font-size: 18px; box-shadow: 0 4px 12px rgba(13,42,92,0.5);">
          <i class="fas fa-bolt"></i>
        </div>
        <div style="width: 12px; height: 12px; background: #F5B300; transform: rotate(45deg); margin-top: -6px; border-radius: 2px;"></div>
      </div>
    `,
    iconSize: [44, 50],
    iconAnchor: [22, 48],
    popupAnchor: [0, -46]
  });

  const popupHtml = `
    <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #1e293b; padding: 4px; min-width: 220px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0;">
        <img src="assets/logo-wes.png" style="height: 28px; width: auto;" alt="WES">
        <div>
          <strong style="display: block; font-size: 11px; color: #071836; font-family: 'Montserrat', sans-serif; text-transform: uppercase;">Warn Electrical Services</strong>
          <span style="font-size: 9px; color: #d97706; font-weight: bold;">SRL • RNC: 1-31-89326-4</span>
        </div>
      </div>
      <p style="margin: 0 0 6px 0; color: #475569; font-size: 11px; line-height: 1.4;">
        <i class="fas fa-map-marker-alt" style="color: #0D2A5C; margin-right: 4px;"></i>
        Autopista Ramón Cáceres, Moca, Rep. Dominicana.
      </p>
      <p style="margin: 0 0 8px 0; color: #475569; font-size: 11px;">
        <i class="fas fa-phone-alt" style="color: #059669; margin-right: 4px;"></i>
        (849) 207-5474
      </p>
      <a href="https://maps.app.goo.gl/KMosxdkCGwXxqFjC9" target="_blank" style="display: block; width: 100%; padding: 6px 0; background: #0D2A5C; color: #ffffff; text-align: center; font-weight: bold; border-radius: 8px; text-decoration: none; font-size: 11px;">
        <i class="fas fa-directions" style="margin-right: 4px;"></i> Cómo llegar
      </a>
    </div>
  `;

  const marker = L.marker(wesCoords, { icon: wesCustomIcon }).addTo(wesMapInstance);
  marker.bindPopup(popupHtml).openPopup();
}

// 1.2 Aplicar Estados de Feature Flags a la Interfaz Pública
function applyFeatureFlags() {
  if (!window.FeatureFlags) return;
  const flags = FeatureFlags.getFlags();

  // Control de sección fundadores
  const foundersSec = document.getElementById('fundadores');
  if (foundersSec) {
    foundersSec.style.display = flags.showFounders ? '' : 'none';
  }

  // Control de mapa interactivo
  const mapSec = document.getElementById('wes-map-section-container');
  if (mapSec) {
    mapSec.style.display = flags.showMap ? '' : 'none';
  }

  // Control de botón flotante WhatsApp
  const waBtn = document.getElementById('floating-whatsapp');
  if (waBtn) {
    waBtn.style.display = flags.showWhatsAppButton ? '' : 'none';
  }

  // Aviso de pausa para cotizaciones
  const quoteNoticeBox = document.getElementById('quote-pause-banner');
  if (quoteNoticeBox) {
    if (!flags.enableQuotes) {
      quoteNoticeBox.classList.remove('hidden');
      quoteNoticeBox.innerHTML = `
        <div class="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-center space-x-3 mb-6 shadow-sm">
          <i class="fas fa-exclamation-circle text-amber-600 text-lg shrink-0"></i>
          <div>
            <strong class="block font-bold text-sm mb-0.5">Solicitudes de Cotización Pausadas</strong>
            <span>${flags.quotesNotice}</span>
          </div>
        </div>
      `;
    } else {
      quoteNoticeBox.classList.add('hidden');
    }
  }

  // Aviso de pausa para soporte
  const supportForm = document.getElementById('support-form');
  const supportNoticeBox = document.getElementById('support-pause-banner');
  if (supportForm && supportNoticeBox) {
    if (!flags.enableSupport) {
      supportForm.classList.add('hidden');
      supportNoticeBox.classList.remove('hidden');
      supportNoticeBox.innerHTML = `
        <div class="p-6 bg-amber-50 border border-amber-300 rounded-3xl text-amber-900 text-xs flex items-start space-x-3 shadow-sm">
          <i class="fas fa-tools text-amber-600 text-xl shrink-0 mt-0.5"></i>
          <div>
            <strong class="block font-bold text-sm mb-1">Módulo de Soporte en Calibración</strong>
            <p class="leading-relaxed">${flags.supportNotice}</p>
          </div>
        </div>
      `;
    } else {
      supportForm.classList.remove('hidden');
      supportNoticeBox.classList.add('hidden');
    }
  }
}

// Función utilitaria precisa para emparejar categorías y subcategorías reales
function matchesCategoryFilter(product, selectedCat, selectedSubcat = null) {
  if (!selectedCat || selectedCat === 'all') return true;

  const selCat = String(selectedCat).toLowerCase().trim();
  const selSub = selectedSubcat ? String(selectedSubcat).toLowerCase().trim() : null;

  // 1. Si hay subcategoría activa, debe coincidir estrictamente
  if (selSub && selSub !== 'all') {
    if (Array.isArray(product.category_ids)) {
      const hasSubId = product.category_ids.some(cid => {
        const idLower = String(cid).toLowerCase().trim();
        return idLower === selSub;
      });
      if (hasSubId) return true;
    }
    if (product.subcategoria_id && String(product.subcategoria_id).toLowerCase().trim() === selSub) {
      return true;
    }
    // Cotejar con CategoriesCatalog por slug
    if (typeof CategoriesCatalog !== 'undefined') {
      const subObj = CategoriesCatalog.getBySlug(selSub) || CategoriesCatalog.getById(selSub);
      if (subObj) {
        if (Array.isArray(product.category_ids) && product.category_ids.includes(subObj.id)) return true;
        if (product.subcategoria_id === subObj.id) return true;
      }
    }
    return false;
  }

  // 2. Si es categoría principal (o slug de categoría)
  if (Array.isArray(product.category_ids)) {
    // Si coincide con el ID directo (ej: 'cat-redes')
    if (product.category_ids.some(cid => String(cid).toLowerCase() === selCat)) {
      return true;
    }
  }

  // Comprobar con CategoriesCatalog
  if (typeof CategoriesCatalog !== 'undefined') {
    const catObj = CategoriesCatalog.getBySlug(selCat) || CategoriesCatalog.getById(selCat);
    if (catObj) {
      if (Array.isArray(product.category_ids) && product.category_ids.includes(catObj.id)) {
        return true;
      }
      if (product.category && product.category.toLowerCase().trim() === catObj.nombre.toLowerCase().trim()) {
        return true;
      }
    }
  }

  // Comprobación por nombre exacto o categoria_id
  const prodCatName = String(product.category || '').toLowerCase().trim();
  const prodCatId = String(product.categoria_id || '').toLowerCase().trim();

  if (prodCatName === selCat || prodCatId === selCat) return true;

  // Redes y Conectividad
  if (selCat.includes('redes') || selCat === 'cat-redes' || selCat === 'redes-conectividad') {
    return prodCatName === 'redes y conectividad' || prodCatId === 'redes' || (Array.isArray(product.category_ids) && product.category_ids.includes('cat-redes'));
  }

  // Cámaras de Seguridad
  if (selCat.includes('camara') || selCat === 'cat-camaras' || selCat === 'camaras-seguridad') {
    return prodCatName === 'cámaras de seguridad' || prodCatName === 'camaras de seguridad' || prodCatId === 'camaras' || (Array.isArray(product.category_ids) && product.category_ids.includes('cat-camaras'));
  }

  // Controles de Acceso
  if ((selCat.includes('acceso') && !selCat.includes('accesorio')) || selCat === 'cat-acceso' || selCat === 'controles-acceso') {
    return prodCatName === 'controles de acceso' || prodCatId === 'acceso' || (Array.isArray(product.category_ids) && product.category_ids.includes('cat-acceso'));
  }

  // Energía y Respaldo
  if (selCat.includes('energia') || selCat.includes('respaldo') || selCat === 'cat-energia' || selCat === 'energia-respaldo') {
    return prodCatName === 'energía y respaldo' || prodCatName === 'energia y respaldo' || prodCatId === 'energia' || (Array.isArray(product.category_ids) && product.category_ids.includes('cat-energia'));
  }

  // Material Eléctrico
  if (selCat.includes('electrico') || selCat.includes('eléctrico') || selCat === 'cat-electrico' || selCat === 'material-electrico') {
    return prodCatName === 'material eléctrico' || prodCatName === 'material electrico' || prodCatId === 'electrico' || (Array.isArray(product.category_ids) && product.category_ids.includes('cat-electrico'));
  }

  // Iluminación
  if (selCat.includes('ilumina') || selCat === 'cat-iluminacion' || selCat === 'iluminacion') {
    return prodCatName === 'iluminación' || prodCatName === 'iluminacion' || prodCatId === 'iluminacion' || (Array.isArray(product.category_ids) && product.category_ids.includes('cat-iluminacion'));
  }

  // Accesorios de Instalación
  if (selCat.includes('accesorio') || selCat === 'cat-accesorios' || selCat === 'accesorios-instalacion') {
    return prodCatName === 'accesorios de instalación' || prodCatName === 'accesorios de instalacion' || prodCatId === 'accesorios' || prodCatId === 'cables' || (Array.isArray(product.category_ids) && product.category_ids.includes('cat-accesorios'));
  }

  return false;
}

// 2. Renderizar catálogo de productos
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const flags = window.FeatureFlags ? window.FeatureFlags.getFlags() : {
    showPrices: true,
    enableQuotes: true,
    hideOutOfStock: false
  };

  let allProducts = StorageService.getProducts().filter(p => p.active !== false && p.activo !== false);
  if (!allProducts || allProducts.length === 0) {
    allProducts = (typeof INITIAL_PRODUCTS !== 'undefined' ? INITIAL_PRODUCTS : []);
  }

  // Filtrar si la categoría está activa en Feature Flags
  if (window.FeatureFlags) {
    allProducts = allProducts.filter(p => FeatureFlags.isCategoryActive(p.category) || FeatureFlags.isCategoryActive(p.categoria_id));
  }

  // Filtrar productos sin stock inmediato si está encendido el toggle
  if (flags.hideOutOfStock) {
    allProducts = allProducts.filter(p => p.availability === 'Disponible' || p.disponibilidad === 'Disponible');
  }
  
  // Extraer categorías y marcas únicas para poblar los filtros dinámicamente
  populateFilterOptions(allProducts);

  // Detectar si la categoría seleccionada es Ofertas & Promociones
  const isOfferCategory = (
    AppState.selectedCategory === 'ofertas' ||
    AppState.selectedCategory.toLowerCase() === 'ofertas' ||
    AppState.selectedCategory.toLowerCase().includes('oferta')
  );

  // Sincronizar encabezados y breadcrumbs dinámicos
  const breadcrumbEl = document.getElementById('store-breadcrumb');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  const storeBadge = document.getElementById('store-badge');
  const storeTitle = document.getElementById('store-title');
  const storeDesc = document.getElementById('store-desc');
  const offerTabs = document.getElementById('offer-sub-tabs');

  if (isOfferCategory) {
    if (breadcrumbEl) breadcrumbEl.classList.remove('hidden');
    if (breadcrumbCurrent) {
      if (AppState.offerSubFilter === 'novedades') {
        breadcrumbCurrent.textContent = 'Novedades y Nuevos Lanzamientos';
      } else if (AppState.offerSubFilter === 'ofertas') {
        breadcrumbCurrent.textContent = 'Ofertas con Descuento';
      } else {
        breadcrumbCurrent.textContent = 'Ofertas y promociones';
      }
    }
    if (offerTabs) offerTabs.classList.remove('hidden');
    if (storeBadge) storeBadge.textContent = '🔥 Oportunidades & Temporada';
    if (storeTitle) storeTitle.textContent = 'Ofertas y Promociones WES';
    if (storeDesc) storeDesc.textContent = 'Aprovecha precios especiales en equipos de seguridad y novedades tecnológicas con garantía oficial.';
  } else {
    if (breadcrumbEl) breadcrumbEl.classList.add('hidden');
    if (offerTabs) offerTabs.classList.add('hidden');
    if (storeBadge) storeBadge.textContent = 'Catálogo Comercial';
    if (storeTitle) storeTitle.textContent = 'Tienda de Equipos y Accesorios';
    if (storeDesc) storeDesc.textContent = 'Selecciona los productos y agrégalos a tu lista para solicitar una cotización formal.';
  }

  // Filtrado
  let filtered = allProducts.filter(product => {
    let matchCat = false;
    if (AppState.selectedCategory === 'all') {
      matchCat = true;
    } else if (isOfferCategory) {
      const isOffer = !!(product.en_oferta || product.is_offer || product.tipo_promocion === 'oferta');
      const isNew = !!(product.novedad || product.is_new || product.tipo_promocion === 'novedad');
      if (AppState.offerSubFilter === 'ofertas') {
        matchCat = isOffer;
      } else if (AppState.offerSubFilter === 'novedades') {
        matchCat = isNew;
      } else {
        matchCat = isOffer || isNew;
      }
    } else {
      matchCat = matchesCategoryFilter(product, AppState.selectedCategory, AppState.selectedSubcategory);
    }

    const matchBrand = AppState.selectedBrand === 'all' || product.brand === AppState.selectedBrand;
    const matchAvail = AppState.selectedAvailability === 'all' || product.availability === AppState.selectedAvailability;
    const query = String(AppState.searchQuery || '').toLowerCase();
    const prodName = String(product.name || product.nombre || '').toLowerCase();
    const prodCode = String(product.code || product.codigo || '').toLowerCase();
    const prodBrand = String(product.brand || product.marca || '').toLowerCase();
    const prodDesc = String(product.description || product.descripcion || '').toLowerCase();
    const matchSearch = !query || 
      prodName.includes(query) ||
      prodCode.includes(query) ||
      prodBrand.includes(query) ||
      prodDesc.includes(query);
    return matchCat && matchBrand && matchAvail && matchSearch;
  });

  // Sincronizar Banner de Categoría / Subcategoría Activa
  const activeCatBanner = document.getElementById('active-category-banner');
  const activeCatTitle = document.getElementById('active-category-title');
  const activeCatParent = document.getElementById('active-category-parent');
  const activeCatBreadcrumbs = document.getElementById('active-category-breadcrumbs');
  const activeCatCount = document.getElementById('active-category-count');

  if (activeCatBanner) {
    const isFilteredByCategory = (AppState.selectedCategory && AppState.selectedCategory !== 'all');
    if (isFilteredByCategory) {
      activeCatBanner.classList.remove('hidden');

      // Buscar nombres en CategoriesCatalog si está disponible
      let displayTitle = AppState.selectedCategory;
      let displayParent = 'Categoría';

      if (typeof CategoriesCatalog !== 'undefined') {
        if (AppState.selectedSubcategory) {
          const subObj = CategoriesCatalog.getById(AppState.selectedSubcategory) || CategoriesCatalog.getBySlug(AppState.selectedSubcategory);
          const parentObj = CategoriesCatalog.getById(AppState.selectedCategory) || CategoriesCatalog.getBySlug(AppState.selectedCategory);
          displayTitle = subObj ? subObj.nombre : AppState.selectedSubcategory;
          displayParent = parentObj ? parentObj.nombre : (subObj && subObj.parent_id ? (CategoriesCatalog.getById(subObj.parent_id) || {}).nombre : 'Categoría');
        } else {
          const catObj = CategoriesCatalog.getById(AppState.selectedCategory) || CategoriesCatalog.getBySlug(AppState.selectedCategory);
          displayTitle = catObj ? catObj.nombre : AppState.selectedCategory;
          displayParent = 'Catálogo General';
        }
      }

      if (activeCatTitle) activeCatTitle.textContent = displayTitle;
      if (activeCatParent) activeCatParent.textContent = displayParent;
      if (activeCatCount) activeCatCount.textContent = `${filtered.length} producto${filtered.length === 1 ? '' : 's'}`;
    } else {
      activeCatBanner.classList.add('hidden');
    }
  }

  // Ordenamiento
  if (AppState.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (AppState.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (AppState.sortBy === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Actualizar contador
  const countEl = document.getElementById('products-count');
  if (countEl) {
    countEl.textContent = `${filtered.length} producto${filtered.length === 1 ? '' : 's'} disponible${filtered.length === 1 ? '' : 's'}`;
  }

  const paginationContainer = document.getElementById('catalog-pagination-container');

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
          <i class="fas fa-search text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-700">No se encontraron productos</h3>
        <p class="text-slate-500 mt-2 max-w-md mx-auto">Intenta modificando los filtros de búsqueda o categoría seleccionada.</p>
        <button onclick="resetProductFilters()" class="mt-4 px-4 py-2 bg-wes-blue text-white text-sm rounded-lg hover:bg-opacity-90 transition font-medium">
          Restablecer filtros
        </button>
      </div>
    `;
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  // Control de paginación progresiva
  if (!AppState.catalogVisibleCount) {
    AppState.catalogVisibleCount = AppState.catalogPageSize || 24;
  }

  const total = filtered.length;
  const currentVisible = Math.min(AppState.catalogVisibleCount, total);
  const remaining = total - currentVisible;
  const visibleProducts = filtered.slice(0, currentVisible);

  container.innerHTML = visibleProducts.map(product => {
    const isAvail = product.availability === 'Disponible';
    const availClass = isAvail ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800';
    const waUrl = `https://wa.me/${AppState.settings.whatsapp}?text=${encodeURIComponent(`Hola WES, deseo consultar disponibilidad y precio sobre: ${product.name} (Código: ${product.code})`)}`;

    const isProductOffer = !!(product.en_oferta || product.is_offer);
    const isProductNew = !!(product.novedad || product.is_new);
    const hasDiscount = isProductOffer && product.precio_anterior && product.precio_anterior > (product.price || 0);
    const discountPct = hasDiscount ? Math.round((1 - (product.price / product.precio_anterior)) * 100) : null;

    let promoBadgeHtml = '';
    if (isProductOffer && discountPct) {
      promoBadgeHtml = `
        <span class="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 text-[9px] sm:text-[11px] font-black px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-rose-600 text-white shadow-xs flex items-center space-x-0.5 sm:space-x-1 animate-pulse z-10">
          <i class="fas fa-fire-alt text-amber-300 text-[9px] sm:text-xs"></i>
          <span>-${discountPct}%</span>
        </span>
      `;
    } else if (isProductOffer) {
      promoBadgeHtml = `
        <span class="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 text-[9px] sm:text-[11px] font-black px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-rose-600 text-white shadow-xs flex items-center space-x-0.5 sm:space-x-1 z-10">
          <i class="fas fa-fire-alt text-amber-300 text-[9px] sm:text-xs"></i>
          <span>OFERTA</span>
        </span>
      `;
    } else if (isProductNew) {
      promoBadgeHtml = `
        <span class="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 text-[9px] sm:text-[11px] font-black px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-amber-500 text-white shadow-xs flex items-center space-x-0.5 sm:space-x-1 z-10">
          <i class="fas fa-star text-white text-[9px] sm:text-xs"></i>
          <span>NOVEDAD</span>
        </span>
      `;
    } else {
      promoBadgeHtml = `
        <span class="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 text-[9px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${availClass} backdrop-blur-sm shadow-2xs">
          ${product.availability}
        </span>
      `;
    }

    let priceHtml = '';
    if (flags.showPrices) {
      if (hasDiscount) {
        priceHtml = `
          <div class="flex flex-col">
            <span class="text-[9px] sm:text-xs line-through text-slate-400 font-bold leading-none sm:leading-tight">RD$ ${Number(product.precio_anterior).toLocaleString()}</span>
            <span class="text-xs sm:text-lg font-black text-rose-600 font-brand leading-tight">RD$ ${(product.price || 0).toLocaleString()}</span>
          </div>
        `;
      } else {
        priceHtml = `
          <span class="text-xs sm:text-lg font-bold text-wes-blue font-brand leading-tight block truncate">
            RD$ ${(product.price || 0).toLocaleString()}
          </span>
        `;
      }
    } else {
      priceHtml = `<span class="text-[10px] sm:text-xs text-slate-500 font-bold italic leading-tight">Consultar</span>`;
    }

    const quoteBtnHtml = flags.enableQuotes
      ? `
        <button onclick="addToQuote('${product.id}', event)" title="Agregar a cotización" class="w-7 h-7 sm:w-auto sm:px-3.5 sm:h-10 rounded-lg sm:rounded-xl bg-wes-blue text-white hover:bg-wes-dark flex items-center justify-center sm:space-x-1.5 text-xs font-semibold transition shadow-2xs sm:shadow-md hover:shadow-wes-blue/20 shrink-0">
          <i class="fas fa-cart-plus text-xs sm:text-sm"></i>
          <span class="hidden sm:inline">Cotizar</span>
        </button>
      `
      : `
        <a href="${waUrl}" target="_blank" onclick="event.stopPropagation()" title="Consultar por WhatsApp" class="w-7 h-7 sm:w-auto sm:px-3.5 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center sm:space-x-1 text-xs font-semibold transition shrink-0">
          <i class="fab fa-whatsapp text-xs sm:hidden"></i>
          <span class="hidden sm:inline">Consultar</span>
        </a>
      `;

    return `
      <div onclick="openProductDetailModal('${product.id}')" class="product-card bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer hover:border-wes-blue/50">
        <div class="relative h-28 xs:h-32 sm:h-36 md:h-40 lg:h-44 bg-white flex items-center justify-center p-2 sm:p-2.5 border-b border-slate-100 overflow-hidden">
          <img src="${product.image}" alt="${product.name}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500" loading="lazy">
          ${promoBadgeHtml}
          <span class="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 bg-slate-900/80 text-white rounded sm:rounded-md shadow-2xs">
            ${product.brand}
          </span>
        </div>
        
        <div class="p-2 sm:p-3 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 sm:text-slate-500 mb-0.5 tracking-wide truncate">
              SKU: ${product.code || product.codigo || ''}
            </div>
            <h3 class="font-bold text-slate-900 text-xs sm:text-[13px] leading-tight sm:leading-snug line-clamp-2 group-hover:text-wes-blue transition min-h-[28px] sm:min-h-[34px]">
              ${product.name}
            </h3>
          </div>

          <div class="mt-2 sm:mt-auto pt-2 sm:pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1" onclick="event.stopPropagation()">
            <div class="min-w-0 flex-1">
              <span class="text-[8px] sm:text-[10px] text-slate-400 block font-medium uppercase tracking-wider leading-none mb-0.5">Precio Ref:</span>
              ${priceHtml}
            </div>
            
            <div class="flex items-center space-x-1 shrink-0">
              <button type="button" onclick="shareProductWhatsAppBySku('${product.code || product.codigo}', event)" title="Compartir este producto con un cliente por WhatsApp" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition shadow-2xs">
                <i class="fab fa-whatsapp text-xs sm:text-sm"></i>
              </button>
              <button type="button" onclick="copyProductLinkBySku('${product.code || product.codigo}', event)" title="Copiar enlace directo para cliente" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-100 text-slate-700 hover:bg-wes-blue hover:text-white items-center justify-center transition shadow-2xs hidden xs:flex">
                <i class="fas fa-link text-[10px] sm:text-xs"></i>
              </button>
              ${quoteBtnHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Renderizar la barra de carga progresiva
  if (paginationContainer) {
    if (remaining > 0) {
      const nextBatch = Math.min(AppState.catalogPageSize, remaining);
      const progressPct = Math.round((currentVisible / total) * 100);
      paginationContainer.innerHTML = `
        <div class="max-w-2xl mx-auto bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 sm:p-6 text-center shadow-xs">
          <div class="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
            <span>Mostrando <strong class="text-wes-blue text-sm">${currentVisible}</strong> de <strong class="text-slate-800">${total}</strong> productos</span>
            <span class="text-slate-400 font-medium">Quedan ${remaining} equipos</span>
          </div>

          <!-- Barra de progreso visual -->
          <div class="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden mb-4 shadow-inner">
            <div class="bg-gradient-to-r from-wes-blue via-blue-600 to-wes-gold h-full rounded-full transition-all duration-300" style="width: ${progressPct}%"></div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <button type="button" onclick="loadMoreProducts()" class="px-5 py-2.5 sm:py-3 rounded-xl bg-wes-blue text-white hover:bg-wes-dark shadow-md hover:shadow-lg transition font-bold text-xs sm:text-sm flex items-center space-x-2 group">
              <i class="fas fa-chevron-circle-down text-wes-gold group-hover:translate-y-0.5 transition-transform text-sm"></i>
              <span>Mostrar más productos (+${nextBatch})</span>
            </button>

            <button type="button" onclick="loadAllProducts()" class="px-3.5 py-2.5 sm:py-3 rounded-xl bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 transition font-semibold text-xs flex items-center space-x-1.5 shadow-2xs">
              <i class="fas fa-layer-group text-slate-400"></i>
              <span>Ver todos (${total})</span>
            </button>

            <a href="#proyectos" class="px-4 py-2.5 sm:py-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition font-bold text-xs flex items-center space-x-1.5 shadow-2xs">
              <span>⚡ Saltar a Proyectos & Servicios</span>
              <i class="fas fa-arrow-down text-amber-600"></i>
            </a>
          </div>
        </div>
      `;
    } else {
      paginationContainer.innerHTML = `
        <div class="max-w-xl mx-auto py-4 text-center">
          <div class="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 mb-3">
            <i class="fas fa-check-circle text-emerald-500"></i>
            <span>Has visualizado todos los ${total} productos</span>
          </div>
          <div>
            <a href="#proyectos" class="inline-flex items-center space-x-1.5 text-xs font-bold text-wes-blue hover:text-wes-gold transition">
              <span>Continuar a Proyectos y Casos de Éxito</span>
              <i class="fas fa-arrow-down"></i>
            </a>
          </div>
        </div>
      `;
    }
  }
}

function loadMoreProducts() {
  AppState.catalogVisibleCount = (AppState.catalogVisibleCount || AppState.catalogPageSize || 24) + (AppState.catalogPageSize || 24);
  renderProducts();
}
window.loadMoreProducts = loadMoreProducts;

function loadAllProducts() {
  AppState.catalogVisibleCount = 99999;
  renderProducts();
}
window.loadAllProducts = loadAllProducts;

function populateFilterOptions(products) {
  const catSelect = document.getElementById('category-filter');
  const brandSelect = document.getElementById('brand-filter');

  if (catSelect && catSelect.children.length <= 1) {
    // Agregar opción destacada de Ofertas y Promociones
    const offerOpt = document.createElement('option');
    offerOpt.value = 'ofertas';
    offerOpt.textContent = '🔥 Ofertas y Promociones';
    catSelect.appendChild(offerOpt);

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    categories.forEach(cat => {
      if (cat.toLowerCase().includes('oferta')) return;
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      catSelect.appendChild(opt);
    });
  }

  if (brandSelect && brandSelect.children.length <= 1) {
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    brands.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      brandSelect.appendChild(opt);
    });
  }
}

function syncCategoryPillsUI(categoryName) {
  document.querySelectorAll('.cat-pill').forEach(pill => {
    const cat = pill.getAttribute('data-cat');
    if (cat === categoryName) {
      if (categoryName === 'ofertas') {
        pill.className = 'cat-pill px-3.5 py-2 rounded-xl bg-rose-600 text-white shadow-md shrink-0 flex items-center space-x-1.5 transition font-bold';
      } else {
        pill.className = 'cat-pill px-3.5 py-2 rounded-xl bg-wes-blue text-white shadow-md shrink-0 transition font-bold';
      }
    } else {
      pill.className = 'cat-pill px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 transition flex items-center space-x-1.5 font-bold';
    }
  });
}

function filterByCategory(categoryName, subcategoryOrSlug = null, skipScroll = false) {
  AppState.selectedCategory = categoryName || 'all';
  AppState.selectedSubcategory = subcategoryOrSlug || null;
  AppState.catalogVisibleCount = AppState.catalogPageSize || 24;

  const catSelect = document.getElementById('category-filter');
  if (catSelect) {
    const hasOption = Array.from(catSelect.options).some(o => o.value.toLowerCase() === String(categoryName).toLowerCase());
    if (hasOption) {
      catSelect.value = categoryName;
    } else {
      catSelect.value = (categoryName === 'ofertas') ? 'ofertas' : 'all';
    }
  }

  // Actualizar URL con deep-linking sin recargar
  try {
    const url = new URL(window.location.href);
    if (AppState.selectedCategory && AppState.selectedCategory !== 'all') {
      let slug = AppState.selectedCategory;
      if (typeof CategoriesCatalog !== 'undefined') {
        const obj = CategoriesCatalog.getById(AppState.selectedCategory) || CategoriesCatalog.getBySlug(AppState.selectedCategory);
        if (obj && obj.slug) slug = obj.slug;
      }
      url.searchParams.set('cat', slug);
    } else {
      url.searchParams.delete('cat');
    }

    if (AppState.selectedSubcategory) {
      let subSlug = AppState.selectedSubcategory;
      if (typeof CategoriesCatalog !== 'undefined') {
        const subObj = CategoriesCatalog.getById(AppState.selectedSubcategory) || CategoriesCatalog.getBySlug(AppState.selectedSubcategory);
        if (subObj && subObj.slug) subSlug = subObj.slug;
      }
      url.searchParams.set('sub', subSlug);
    } else {
      url.searchParams.delete('sub');
    }
    window.history.replaceState({}, '', url.toString());
  } catch(e) {}

  syncCategoryPillsUI(categoryName);
  renderProducts();

  if (!skipScroll) {
    const storeSection = document.getElementById('tienda');
    if (storeSection) {
      storeSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
window.filterByCategory = filterByCategory;

function filterBySubcategory(subcategoryIdOrSlug) {
  if (typeof CategoriesCatalog !== 'undefined') {
    const subObj = CategoriesCatalog.getBySlug(subcategoryIdOrSlug) || CategoriesCatalog.getById(subcategoryIdOrSlug);
    if (subObj && subObj.parent_id) {
      const parentObj = CategoriesCatalog.getById(subObj.parent_id);
      filterByCategory(parentObj ? parentObj.id : subObj.parent_id, subObj.id);
      return;
    }
  }
  filterByCategory(AppState.selectedCategory || 'all', subcategoryIdOrSlug);
}
window.filterBySubcategory = filterBySubcategory;

function clearCategoryFilter() {
  AppState.selectedCategory = 'all';
  AppState.selectedSubcategory = null;
  AppState.selectedCategoryParent = null;
  AppState.catalogVisibleCount = AppState.catalogPageSize || 24;

  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('cat');
    url.searchParams.delete('sub');
    window.history.replaceState({}, '', url.toString());
  } catch(e) {}

  const catSelect = document.getElementById('category-filter');
  if (catSelect) catSelect.value = 'all';

  syncCategoryPillsUI('all');
  renderProducts();
}
window.clearCategoryFilter = clearCategoryFilter;

function setOfferSubFilter(subFilter) {
  AppState.offerSubFilter = subFilter;
  AppState.catalogVisibleCount = AppState.catalogPageSize || 24;
  
  document.querySelectorAll('.offer-sub-btn').forEach(btn => {
    btn.className = 'offer-sub-btn px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-slate-700 hover:bg-rose-600 hover:text-white transition';
  });
  const activeBtn = document.getElementById(`offer-tab-${subFilter}`);
  if (activeBtn) {
    activeBtn.className = 'offer-sub-btn px-3 py-1.5 rounded-xl bg-rose-600 text-white shadow-sm transition';
  }

  renderProducts();
}
window.setOfferSubFilter = setOfferSubFilter;

function resetProductFilters() {
  AppState.selectedCategory = 'all';
  AppState.selectedBrand = 'all';
  AppState.selectedAvailability = 'all';
  AppState.searchQuery = '';
  AppState.sortBy = 'featured';
  AppState.offerSubFilter = 'all';
  AppState.catalogVisibleCount = AppState.catalogPageSize || 24;

  const catSelect = document.getElementById('category-filter');
  const brandSelect = document.getElementById('brand-filter');
  const availSelect = document.getElementById('availability-filter');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-filter');

  if (catSelect) catSelect.value = 'all';
  if (brandSelect) brandSelect.value = 'all';
  if (availSelect) availSelect.value = 'all';
  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'featured';

  syncCategoryPillsUI('all');
  renderProducts();
}

// Filtrar catálogo por marca desde los accesos del pie de página
function filterByBrand(brandName) {
  const brandSelect = document.getElementById('brand-filter');
  const searchInput = document.getElementById('search-input');
  const storeSection = document.getElementById('tienda');

  if (brandSelect) {
    const hasOption = Array.from(brandSelect.options).some(
      o => o.value.toLowerCase() === brandName.toLowerCase()
    );
    if (hasOption) {
      AppState.selectedBrand = brandName;
      brandSelect.value = brandName;
      AppState.searchQuery = '';
      if (searchInput) searchInput.value = '';
    } else {
      AppState.selectedBrand = 'all';
      brandSelect.value = 'all';
      AppState.searchQuery = brandName;
      if (searchInput) searchInput.value = brandName;
    }
    AppState.catalogVisibleCount = AppState.catalogPageSize || 24;
    renderProducts();
  }

  if (storeSection) {
    storeSection.scrollIntoView({ behavior: 'smooth' });
  }
}
window.filterByBrand = filterByBrand;

// 3. Sistema de Carrito / Lista de Cotización
function addToQuote(productId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const products = StorageService.getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = AppState.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      code: product.code,
      brand: product.brand,
      price: product.price || 0,
      image: product.image,
      quantity: 1
    });
  }

  updateCartBadge();
  showToast(`"${product.name}" agregado a tu cotización`, 'success');
}

function updateCartBadge() {
  const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = totalItems;
    if (totalItems > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
}

function openQuoteModal() {
  const modal = document.getElementById('quote-modal');
  if (!modal) return;

  renderQuoteCartItems();
  setupPhoneInputsMask();

  // Si el cliente o empleado tiene sesión activa, pre-llenar sus datos automáticamente
  if (typeof UserAuth !== 'undefined' && UserAuth.isAuthenticated()) {
    const user = UserAuth.getCurrentUser();
    const form = document.getElementById('quote-form');
    if (form && user) {
      if (form.name && !form.name.value) form.name.value = user.name || '';
      if (form.email && !form.email.value) form.email.value = user.email || '';
      if (form.phone && !form.phone.value && user.phone) {
        form.phone.value = user.phone;
        formatPhoneInputValue(form.phone);
      }
    }
  }

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeQuoteModal() {
  const modal = document.getElementById('quote-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

function renderQuoteCartItems() {
  const listContainer = document.getElementById('quote-items-list');
  const totalContainer = document.getElementById('quote-total-amount');
  if (!listContainer) return;

  if (AppState.cart.length === 0) {
    listContainer.innerHTML = `
      <div class="py-12 text-center text-slate-400">
        <i class="fas fa-shopping-basket text-4xl mb-3 text-slate-300"></i>
        <p class="font-medium text-slate-600">No has agregado ningún producto todavía.</p>
        <p class="text-xs text-slate-400 mt-1">Explora nuestro catálogo en la sección Tienda y selecciona los equipos que necesitas.</p>
        <button type="button" onclick="closeQuoteModal(); scrollToSection('tienda')" class="mt-4 px-4 py-2 bg-wes-blue text-white rounded-lg text-xs font-semibold hover:bg-opacity-90">
          Explorar Tienda
        </button>
      </div>
    `;
    if (totalContainer) totalContainer.textContent = 'RD$ 0.00';
    return;
  }

  let total = 0;
  listContainer.innerHTML = AppState.cart.map(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    return `
      <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg border border-slate-200">
        <div class="flex-1 min-w-0">
          <div class="text-[11px] font-mono font-semibold text-slate-500">${item.code}</div>
          <h4 class="text-xs font-bold text-slate-800 truncate">${item.name}</h4>
          <div class="text-xs text-wes-blue font-semibold mt-0.5">RD$ ${(item.price).toLocaleString()} c/u</div>
        </div>
        <div class="flex items-center space-x-2">
          <div class="flex items-center border border-slate-200 bg-white rounded-lg overflow-hidden">
            <button type="button" onclick="changeCartQty('${item.id}', -1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold">-</button>
            <span class="w-7 text-center text-xs font-bold text-slate-800">${item.quantity}</span>
            <button type="button" onclick="changeCartQty('${item.id}', 1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold">+</button>
          </div>
          <button type="button" onclick="removeFromCart('${item.id}')" class="w-7 h-7 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Eliminar">
            <i class="fas fa-trash-alt text-xs"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (totalContainer) {
    totalContainer.textContent = `RD$ ${total.toLocaleString()}`;
  }
}

function changeCartQty(id, delta) {
  const item = AppState.cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    AppState.cart = AppState.cart.filter(i => i.id !== id);
  }
  updateCartBadge();
  renderQuoteCartItems();
}

function removeFromCart(id) {
  AppState.cart = AppState.cart.filter(i => i.id !== id);
  updateCartBadge();
  renderQuoteCartItems();
}

// 4. Envío del Formulario de Cotización
async function handleQuoteSubmit(e) {
  e.preventDefault();

  if (window.FeatureFlags && !FeatureFlags.isFeatureActive('enableQuotes')) {
    const flags = FeatureFlags.getFlags();
    showToast(flags.quotesNotice || 'Las cotizaciones están temporalmente en pausa.', 'warning');
    return;
  }

  if (AppState.cart.length === 0) {
    showToast('Debes agregar al menos un producto a la lista de cotización.', 'warning');
    return;
  }

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  // Validar formato de teléfono a 10 dígitos (ej. 809-000-0000)
  const phoneDigits = form.phone ? form.phone.value.replace(/\D/g, '') : '';
  if (phoneDigits.length !== 10) {
    showToast('El teléfono directo debe tener 10 dígitos (ej. 809-000-0000).', 'warning');
    if (form.phone) form.phone.focus();
    return;
  }
  const waDigits = form.whatsapp ? form.whatsapp.value.replace(/\D/g, '') : '';
  if (waDigits && waDigits.length !== 10) {
    showToast('El número de WhatsApp debe tener 10 dígitos (ej. 809-000-0000).', 'warning');
    if (form.whatsapp) form.whatsapp.focus();
    return;
  }

  // Recolectar datos
  const quotes = StorageService.getQuotes();
  const nextNum = quotes.length + 1;
  const quoteId = `COT-2026-${String(nextNum).padStart(4, '0')}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const totalEst = AppState.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  const quoteData = {
    id: quoteId,
    date: now,
    client: {
      name: form.clientName.value.trim(),
      company: form.company.value.trim() || 'N/A',
      taxId: form.taxId.value.trim() || 'N/A',
      phone: form.phone.value.trim(),
      whatsapp: form.whatsapp.value.trim() || form.phone.value.trim(),
      email: form.email.value.trim(),
      city: form.city.value.trim(),
      clientType: form.clientType.value,
      contactMethod: form.contactMethod.value
    },
    clientName: form.clientName.value.trim(),
    items: [...AppState.cart],
    total: totalEst,
    totalEstimated: totalEst,
    comments: form.comments.value.trim(),
    status: 'Pendiente',
    assignedTo: '',
    emailStatus: 'sent',
    internalNotes: []
  };

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Procesando cotización...';

    // 1. Guardar en almacenamiento local para que el panel administrativo lo vea de inmediato
    quotes.unshift(quoteData);
    StorageService.saveQuotes(quotes);

    // 1b. Si Supabase PostgreSQL está activo, sincronizar en base de datos en la nube
    if (window.WesDB && WesDB.isConfigured()) {
      try {
        await WesDB.createQuote({
          id: quoteId,
          clientName: quoteData.client.name,
          company: quoteData.client.company,
          taxId: quoteData.client.taxId,
          phone: quoteData.client.phone,
          email: quoteData.client.email,
          city: quoteData.client.city,
          address: '',
          subtotal: totalEst / 1.18,
          tax: totalEst - (totalEst / 1.18),
          total: totalEst,
          items: quoteData.items,
          notes: quoteData.comments
        });
      } catch (pgErr) {
        console.warn('Error sincronizando cotización con PostgreSQL:', pgErr);
      }
    }

    // 2. Si hay backend de Apps Script configurado, enviar vía POST
    if (AppState.backendUrl) {
      try {
        await fetch(AppState.backendUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'nuevaCotizacion',
            data: quoteData
          })
        });
      } catch (beErr) {
        console.warn('Backend Apps Script no alcanzado (modo local activo):', beErr);
      }
    }

    // 3. Limpiar carrito y cerrar modal
    AppState.cart = [];
    updateCartBadge();
    form.reset();
    closeQuoteModal();

    // 4. Mostrar pantalla de confirmación con el número único
    showConfirmationModal({
      title: '¡Solicitud recibida!',
      code: quoteId,
      message: `Hemos registrado tu cotización con el número <strong>${quoteId}</strong>. Nuestro equipo técnico revisará los productos solicitados y se pondrá en contacto contigo a la brevedad.`,
      type: 'quote',
      data: quoteData
    });

  } catch (error) {
    console.error(error);
    showToast('Ocurrió un error al enviar la solicitud. Intenta nuevamente.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// ==========================================
// Máscara y Validación de Teléfono (10 dígitos Dominicano: XXX-XXX-XXXX)
// ==========================================
function formatPhoneNumber(val) {
  if (!val) return '';
  let digits = String(val).replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.substring(1);
  }
  digits = digits.substring(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function attachPhoneMask(input) {
  if (!input || input._phoneMaskAttached) return;
  input._phoneMaskAttached = true;
  input.maxLength = 12;
  input.inputMode = 'numeric';
  input.autocomplete = 'tel';

  if (input.value) {
    input.value = formatPhoneNumber(input.value);
  }

  // Interceptar borrado sobre el guión para evitar bloqueo del cursor
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
      const selStart = input.selectionStart;
      const selEnd = input.selectionEnd;
      if (selStart === selEnd && selStart > 0 && input.value[selStart - 1] === '-') {
        e.preventDefault();
        const val = input.value;
        const before = val.slice(0, selStart - 2);
        const after = val.slice(selStart);
        input.value = before + after;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else if (e.key === 'Delete') {
      const selStart = input.selectionStart;
      const selEnd = input.selectionEnd;
      if (selStart === selEnd && selStart < input.value.length && input.value[selStart] === '-') {
        e.preventDefault();
        const val = input.value;
        const before = val.slice(0, selStart);
        const after = val.slice(selStart + 2);
        input.value = before + after;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });

  input.addEventListener('input', () => {
    const raw = input.value;
    const cursorPos = input.selectionStart || 0;
    const digitsBefore = raw.slice(0, cursorPos).replace(/\D/g, '').length;
    const formatted = formatPhoneNumber(raw);
    input.value = formatted;

    // Calcular posición óptima del cursor basada en dígitos tipeados
    let newPos = 0;
    let counted = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (formatted[i] !== '-') {
        counted++;
      }
      if (counted === digitsBefore) {
        newPos = i + 1;
        break;
      }
    }
    if (newPos < formatted.length && formatted[newPos] === '-') {
      newPos++;
    }
    input.setSelectionRange(newPos, newPos);
  });

  input.addEventListener('blur', () => {
    if (input.value) {
      input.value = formatPhoneNumber(input.value);
    }
  });
}

function setupPhoneInputsMask() {
  const selectors = [
    'input.phone-mask-input',
    '#support-form input[name="phone"]',
    '#support-form input[name="whatsapp"]',
    '#contact-form input[name="phone"]',
    '#quote-form input[name="phone"]',
    '#quote-form input[name="whatsapp"]'
  ];
  const inputs = document.querySelectorAll(selectors.join(', '));
  inputs.forEach(input => attachPhoneMask(input));
}

// 5. Carga de Fotografías y Gestión de Soporte
function setupSupportImageUploader() {
  const dropZone = document.getElementById('support-dropzone');
  const fileInput = document.getElementById('support-file-input');
  const cameraInput = document.getElementById('support-camera-input');
  const btnCamera = document.getElementById('btn-trigger-camera');
  const btnGallery = document.getElementById('btn-trigger-gallery');

  if (btnCamera && cameraInput) {
    btnCamera.addEventListener('click', () => cameraInput.click());
    cameraInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        processSelectedFiles(e.target.files);
        cameraInput.value = ''; // Reset para permitir tomar otra foto
      }
    });
  }

  if (btnGallery && fileInput) {
    btnGallery.addEventListener('click', () => fileInput.click());
  }

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-wes-blue', 'bg-blue-50/70');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-wes-blue', 'bg-blue-50/70');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-wes-blue', 'bg-blue-50/70');
      if (e.dataTransfer.files) {
        processSelectedFiles(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        processSelectedFiles(e.target.files);
        fileInput.value = ''; // Reset
      }
    });
  }
}

function processSelectedFiles(files) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  Array.from(files).forEach(file => {
    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      showToast(`El formato de "${file.name}" no está permitido. Solo se aceptan imágenes (JPG, PNG, WEBP).`, 'warning');
      return;
    }

    if (AppState.supportImages.length >= 5) {
      showToast('Límite alcanzado: máximo 5 fotografías por solicitud de soporte.', 'warning');
      return;
    }

    // Compresión y optimización cliente para garantizar carga rápida
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1400;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        const approxKb = Math.round((optimizedBase64.length * 0.75) / 1024);

        AppState.supportImages.push({
          name: file.name || `Foto_${AppState.supportImages.length + 1}.jpg`,
          size: approxKb + ' KB',
          base64: optimizedBase64
        });

        renderSupportImagePreviews();
        showToast(`Fotografía agregada (${approxKb} KB)`, 'success');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderSupportImagePreviews() {
  const container = document.getElementById('support-images-preview');
  const counter = document.getElementById('support-photo-counter');

  if (counter) {
    counter.textContent = `${AppState.supportImages.length} de 5 fotos`;
    if (AppState.supportImages.length > 0) {
      counter.classList.add('bg-blue-100', 'text-wes-blue');
      counter.classList.remove('bg-slate-100', 'text-slate-700');
    } else {
      counter.classList.remove('bg-blue-100', 'text-wes-blue');
      counter.classList.add('bg-slate-100', 'text-slate-700');
    }
  }

  if (!container) return;

  if (AppState.supportImages.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = AppState.supportImages.map((img, idx) => `
    <div class="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm flex flex-col">
      <div class="h-24 w-full overflow-hidden bg-slate-900 flex items-center justify-center">
        <img src="${img.base64}" alt="${img.name}" class="w-full h-full object-cover">
      </div>
      <div class="p-1.5 bg-white border-t border-slate-100 flex items-center justify-between text-[10px]">
        <span class="text-slate-600 font-medium truncate flex-1 pr-1">${img.size}</span>
        <button type="button" onclick="removeSupportImage(${idx})" class="text-rose-600 hover:text-rose-800 font-bold px-1 py-0.5 hover:bg-rose-50 rounded transition" title="Eliminar foto">
          <i class="fas fa-trash-alt"></i> Quitar
        </button>
      </div>
    </div>
  `).join('');
}

function removeSupportImage(index) {
  AppState.supportImages.splice(index, 1);
  renderSupportImagePreviews();
  showToast('Fotografía retirada.', 'info');
}

// 6. Envío del Formulario de Soporte Técnico
async function handleSupportSubmit(e) {
  e.preventDefault();

  if (window.FeatureFlags && !FeatureFlags.isFeatureActive('enableSupport')) {
    const flags = FeatureFlags.getFlags();
    showToast(flags.supportNotice || 'El módulo de soporte está temporalmente en calibración.', 'warning');
    return;
  }

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  // Validar formato de teléfono a 10 dígitos (ej. 809-000-0000)
  const phoneDigits = form.phone ? form.phone.value.replace(/\D/g, '') : '';
  if (phoneDigits.length !== 10) {
    showToast('El teléfono de contacto debe tener 10 dígitos (ej. 809-000-0000).', 'warning');
    if (form.phone) form.phone.focus();
    return;
  }
  const waDigits = form.whatsapp ? form.whatsapp.value.replace(/\D/g, '') : '';
  if (waDigits && waDigits.length !== 10) {
    showToast('El número de WhatsApp debe tener 10 dígitos (ej. 809-000-0000).', 'warning');
    if (form.whatsapp) form.whatsapp.focus();
    return;
  }

  const tickets = StorageService.getSupportTickets();
  const nextNum = tickets.length + 1;
  const caseId = `SOP-2026-${String(nextNum).padStart(4, '0')}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const isoNow = new Date().toISOString();
  const ticketData = {
    id: caseId,
    date: now,
    createdAt: isoNow,
    clientName: form.clientName.value.trim(),
    company: form.company.value.trim() || 'N/A',
    phone: form.phone.value.trim(),
    whatsapp: form.whatsapp.value.trim() || form.phone.value.trim(),
    email: form.email.value.trim(),
    address: form.address.value.trim(),
    orderNumber: form.orderNumber.value.trim() || 'N/A',
    productSystem: form.productSystem.value.trim() || 'Reportado',
    category: form.category.value,
    problemType: form.category.value,
    priority: form.priority.value,
    urgency: form.priority.value,
    description: form.description.value.trim(),
    preferredTime: form.preferredTime.value,
    contactMethod: form.contactMethod.value,
    photos: AppState.supportImages.map(img => img.base64),
    images: AppState.supportImages.map(img => img.base64),
    status: 'Nuevo',
    assignedTech: '',
    emailStatus: 'sent',
    internalNotes: []
  };

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Registrando ticket de soporte...';

    // 1. Guardar localmente
    tickets.unshift(ticketData);
    StorageService.saveSupportTickets(tickets);
    window.dispatchEvent(new CustomEvent('wes_kds_updated', { detail: tickets }));
    if (typeof updateNavOngoingBadge === 'function') updateNavOngoingBadge();

    // 1b. Si Supabase PostgreSQL está activo, registrar ticket y fotos en la nube
    if (window.WesDB && WesDB.isConfigured()) {
      try {
        await WesDB.createSupportTicket({
          ticketCode: caseId,
          name: ticketData.clientName,
          phone: ticketData.phone,
          email: ticketData.email,
          serviceType: ticketData.productSystem,
          location: ticketData.address,
          description: ticketData.description
        });
      } catch (pgErr) {
        console.warn('Error sincronizando ticket con PostgreSQL:', pgErr);
      }
    }

    // 2. Enviar a backend de Apps Script si está conectado
    if (AppState.backendUrl) {
      try {
        await fetch(AppState.backendUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'nuevoSoporte',
            data: ticketData
          })
        });
      } catch (beErr) {
        console.warn('Backend Apps Script no alcanzado (modo local activo):', beErr);
      }
    }

    // 3. Reset form
    form.reset();
    AppState.supportImages = [];
    renderSupportImagePreviews();

    // 4. Mostrar confirmación
    showConfirmationModal({
      title: '¡Solicitud de Soporte Recibida!',
      code: caseId,
      message: `
        <div class="space-y-2">
          <p>Tu número de soporte asignado es <strong class="text-wes-blue text-sm">${caseId}</strong>.</p>
          <p>Hemos enviado un correo formal de confirmación a <strong class="text-slate-800">${ticketData.email}</strong> con el resumen completo de lo que solicitaste.</p>
          <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-[11px] font-medium flex items-start space-x-2 mt-2">
            <span class="text-base leading-none">⏱️</span>
            <span><strong>Compromiso WES en 1h:</strong> Tu solicitud ha sido tomada con todos los detalles reportados. Un especialista técnico evaluará tu caso y serás contactado dentro de la <strong>próxima 1 hora</strong> a través de tu método preferido (${ticketData.contactMethod}).</span>
          </div>
        </div>
      `,
      type: 'support',
      data: ticketData
    });

  } catch (error) {
    console.error(error);
    showToast('Ocurrió un error al enviar el ticket. Intenta nuevamente.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// 7. Formulario de Contacto General (Gestión por Correo con Generación de Ticket Formal)
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Enviar mensaje';

  const name = form.name.value.trim();
  const phone = form.phone ? form.phone.value.trim() : '';
  const email = form.email ? form.email.value.trim() : '';
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  // Validar formato de teléfono a 10 dígitos si fue ingresado (opcional en contacto)
  if (phone) {
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      showToast('El número de teléfono debe tener 10 dígitos (ej. 809-000-0000).', 'warning');
      if (form.phone) form.phone.focus();
      return;
    }
  }

  // Generar número de Ticket formal consecutivo
  const contacts = JSON.parse(localStorage.getItem('wes_contact_messages') || '[]');
  const nextNum = contacts.length + 1;
  const ticketId = `TKT-2026-${String(nextNum).padStart(4, '0')}`;
  const now = new Date().toISOString();

  const ticketData = {
    id: ticketId,
    ticketId: ticketId,
    date: now,
    name,
    phone,
    email,
    subject,
    message,
    status: 'Nuevo'
  };

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generando ticket y enviando correo...';
    }

    // 1. Guardar en buzón interno para el portal administrativo
    contacts.unshift(ticketData);
    localStorage.setItem('wes_contact_messages', JSON.stringify(contacts));

    // 1b. Si Supabase PostgreSQL está activo, registrar en la base de datos
    if (window.WesDB && WesDB.isConfigured()) {
      try {
        if (typeof WesDB.createContactMessage === 'function') {
          await WesDB.createContactMessage({
            name,
            email,
            phone,
            subject: `[${ticketId}] ${subject}`,
            message
          });
        }
      } catch (pgErr) {
        console.warn('Error sincronizando mensaje con PostgreSQL:', pgErr);
      }
    }

    // 2. Despachar correo automático vía Google Apps Script Backend (Cliente y WES)
    if (AppState.backendUrl) {
      try {
        await fetch(AppState.backendUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'nuevoMensaje',
            data: {
              ticketId,
              name,
              phone,
              email,
              subject,
              message
            }
          })
        });
      } catch (beErr) {
        console.warn('Backend Apps Script no alcanzado (modo local/resiliente):', beErr);
      }
    }

    // 3. Limpiar formulario
    form.reset();

    // 4. Mostrar confirmación en pantalla con el número de Ticket (Gestión 100% por Correo, sin WhatsApp)
    showConfirmationModal({
      title: '¡Solicitud Recibida y Ticket Generado!',
      code: ticketId,
      message: `Tu solicitud ha sido registrada bajo el ticket oficial <strong>${ticketId}</strong>.<br><br>📧 <strong>Confirmación por Correo Electrónico:</strong><br>Hemos enviado los detalles completos y la confirmación a tu correo <strong>${email}</strong>.<br><br>Nuestro equipo de atención al cliente revisará tu solicitud y te responderá por esa misma vía de correo a la mayor brevedad posible.`,
      type: 'contact',
      data: ticketData
    });

    showToast(`¡Ticket ${ticketId} generado! Se envió la confirmación a tu correo.`, 'success');

  } catch (err) {
    console.error('Error al procesar solicitud de contacto:', err);
    showToast('Ocurrió un error al procesar el mensaje. Intenta nuevamente.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }
}

// 8. Modales de Confirmación y Políticas
function showConfirmationModal({ title, code, message, type, data }) {
  const modal = document.getElementById('confirmation-modal');
  if (!modal) return;

  document.getElementById('conf-title').textContent = title;
  
  const codeEl = document.getElementById('conf-code');
  if (codeEl) {
    codeEl.textContent = code;
    if (type === 'support') {
      codeEl.className = 'text-2xl sm:text-3xl font-mono font-black text-wes-blue tracking-widest mt-1 bg-wes-blue/5 py-1.5 px-3 rounded-xl border border-wes-blue/20 inline-block shadow-inner';
    } else {
      codeEl.className = 'text-2xl font-mono font-extrabold text-wes-blue tracking-wider mt-1';
    }
  }

  const labelEl = document.getElementById('conf-code-label');
  if (labelEl) {
    if (type === 'support') {
      labelEl.textContent = '🎫 Número de Soporte Técnico Oficial';
      labelEl.className = 'text-[11px] uppercase tracking-wider text-amber-600 font-extrabold mb-1 block';
    } else if (type === 'contact') {
      labelEl.textContent = '✉️ Número de Ticket de Consulta Web';
      labelEl.className = 'text-[11px] uppercase tracking-wider text-sky-600 font-bold mb-1 block';
    } else {
      labelEl.textContent = 'Número de Registro Oficial';
      labelEl.className = 'text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1 block';
    }
  }

  document.getElementById('conf-message').innerHTML = message;

  // Botón para WhatsApp con la referencia (se oculta en contacto porque se gestiona por correo)
  const waBtn = document.getElementById('conf-wa-btn');
  if (waBtn) {
    if (type === 'contact' || type === 'login' || !data) {
      waBtn.classList.add('hidden');
    } else {
      waBtn.classList.remove('hidden');
      const clientName = (data && data.clientName) ? data.clientName : '';
      const priority = (data && data.priority) ? data.priority : 'Normal';
      const text = type === 'quote' 
        ? `Hola WES, acabo de enviar la solicitud de cotización ${code}. Mi nombre es ${clientName}.`
        : `Hola WES, acabo de generar el caso de soporte ${code} con prioridad ${priority}. Mi nombre es ${clientName}.`;
      waBtn.href = `https://wa.me/${AppState.settings.whatsapp}?text=${encodeURIComponent(text)}`;
    }
  }

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.classList.add('overflow-hidden');
}

function closeConfirmationModal() {
  const modal = document.getElementById('confirmation-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.classList.remove('overflow-hidden');
  }
}

function openPolicyModal(type) {
  const modal = document.getElementById('policy-modal');
  const titleEl = document.getElementById('policy-title');
  const contentEl = document.getElementById('policy-content');
  if (!modal) return;

  if (type === 'privacy') {
    titleEl.textContent = 'Política de Privacidad y Protección de Datos';
    contentEl.innerHTML = `
      <p>En <strong>Warn Electrical Services, SRL (WES)</strong> nos comprometemos a garantizar la confidencialidad, integridad y seguridad de la información personal de nuestros clientes, proveedores y colaboradores.</p>
      <h4 class="font-bold text-slate-800 mt-4 mb-2">1. Uso de la Información</h4>
      <p>Los datos solicitados a través de nuestros formularios de cotización, soporte técnico y contacto se utilizarán exclusivamente para:</p>
      <ul class="list-disc pl-5 space-y-1 my-2">
        <li>Elaborar y remitir propuestas comerciales y cotizaciones personalizadas.</li>
        <li>Coordinar visitas de diagnóstico, soporte técnico e instalaciones en sitio.</li>
        <li>Evaluar las evidencias fotográficas de fallas en sistemas de seguridad y electricidad.</li>
        <li>Establecer comunicación directa vía telefónica, correo electrónico o WhatsApp.</li>
      </ul>
      <h4 class="font-bold text-slate-800 mt-4 mb-2">2. Protección de Archivos y Fotografías</h4>
      <p>Las fotografías cargadas en el módulo de soporte técnico son procesadas en entornos controlados y no son públicas ni compartidas con terceros ajenos al servicio.</p>
      <h4 class="font-bold text-slate-800 mt-4 mb-2">3. Derechos del Titular</h4>
      <p>Usted puede solicitar la rectificación, actualización o eliminación de sus datos en cualquier momento escribiendo a <a href="mailto:${AppState.settings.emailGeneral}" class="text-wes-blue underline">${AppState.settings.emailGeneral}</a>.</p>
    `;
  } else {
    titleEl.textContent = 'Términos y Condiciones del Servicio';
    contentEl.innerHTML = `
      <p>Bienvenido al portal web de <strong>Warn Electrical Services, SRL (WES)</strong>. El uso de esta plataforma implica la aceptación de los siguientes términos:</p>
      <h4 class="font-bold text-slate-800 mt-4 mb-2">1. Solicitudes de Cotización</h4>
      <p>El envío de una solicitud de cotización mediante el portal web <strong>no constituye un contrato vinculante de venta ni asegura reserva de inventario</strong>. Las cotizaciones formales serán emitidas por nuestro departamento de ventas tras validar especificaciones técnicas y disponibilidad.</p>
      <h4 class="font-bold text-slate-800 mt-4 mb-2">2. Servicios y Diagnósticos Técnicos</h4>
      <p>El registro de un ticket de soporte técnico confirma la recepción de la incidencia. La viabilidad de garantías, visitas en terreno y presupuestos de reparación están sujetos a la inspección física de los equipos por parte de nuestros técnicos certificados.</p>
      <h4 class="font-bold text-slate-800 mt-4 mb-2">3. Propiedad Intelectual</h4>
      <p>Los logotipos, marcas comerciales y contenidos presentes en este sitio web son propiedad de WES o de sus respectivos fabricantes (Hikvision, Dahua, ZKTeco, etc.).</p>
    `;
  }

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closePolicyModal() {
  const modal = document.getElementById('policy-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
  document.body.classList.remove('overflow-hidden');
  document.body.style.overflow = '';
}

function checkCookieConsent() {
  const consent = localStorage.getItem('wes_cookies_accepted');
  const banner = document.getElementById('cookie-banner');
  if (banner && !consent) {
    banner.classList.remove('hidden');
  }
}

function acceptCookies() {
  localStorage.setItem('wes_cookies_accepted', 'true');
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.add('hidden');
}

// 9. Funciones Utilitarias y Event Listeners
function setupEventListeners() {
  // Búsqueda y filtros del catálogo
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      AppState.catalogVisibleCount = AppState.catalogPageSize || 24;
      renderProducts();
    });
  }

  const catSelect = document.getElementById('category-filter');
  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      AppState.selectedCategory = e.target.value;
      AppState.catalogVisibleCount = AppState.catalogPageSize || 24;
      syncCategoryPillsUI(e.target.value);
      renderProducts();
    });
  }

  const brandSelect = document.getElementById('brand-filter');
  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      AppState.selectedBrand = e.target.value;
      AppState.catalogVisibleCount = AppState.catalogPageSize || 24;
      renderProducts();
    });
  }

  const availSelect = document.getElementById('availability-filter');
  if (availSelect) {
    availSelect.addEventListener('change', (e) => {
      AppState.selectedAvailability = e.target.value;
      AppState.catalogVisibleCount = AppState.catalogPageSize || 24;
      renderProducts();
    });
  }

  const sortSelect = document.getElementById('sort-filter');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      AppState.catalogVisibleCount = AppState.catalogPageSize || 24;
      renderProducts();
    });
  }

  // Menú móvil
  window.openMobileMenu = function() {
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    if (mobileMenuDrawer) {
      mobileMenuDrawer.classList.remove('translate-x-full');
      document.body.classList.add('overflow-hidden');
    }
  };

  window.closeMobileMenu = function() {
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    if (mobileMenuDrawer) {
      mobileMenuDrawer.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');
    }
  };

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', window.openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', window.closeMobileMenu);
  }

  // Cerrar menú móvil al hacer clic en un enlace
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', window.closeMobileMenu);
  });

  // Formularios
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) quoteForm.addEventListener('submit', handleQuoteSubmit);

  const supportForm = document.getElementById('support-form');
  if (supportForm) supportForm.addEventListener('submit', handleSupportSubmit);

  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);

  // Autenticación universal y Perfil WES
  const authPersonBtn = document.getElementById('auth-person-btn');
  if (authPersonBtn) {
    authPersonBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleUserPersonClick();
    });
  }

  const mobileLoginBtn = document.getElementById('mobile-login-btn');
  if (mobileLoginBtn) {
    mobileLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal('login');
      if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
    });
  }

  // Cierre automático por clic en backdrop (fondo oscuro) y tecla Escape para TODOS los modales
  const modalCloseRegistry = [
    { id: 'policy-modal', closeFn: () => typeof closePolicyModal === 'function' && closePolicyModal() },
    { id: 'quote-modal', closeFn: () => typeof closeQuoteModal === 'function' && closeQuoteModal() },
    { id: 'confirmation-modal', closeFn: () => typeof closeConfirmationModal === 'function' && closeConfirmationModal() },
    { id: 'product-detail-modal', closeFn: () => typeof closeProductDetailModal === 'function' && closeProductDetailModal() },
    { id: 'project-photo-modal', closeFn: () => typeof closeProjectImageModal === 'function' && closeProjectImageModal() },
    { id: 'pwa-ios-modal', closeFn: () => typeof closePwaIosModal === 'function' && closePwaIosModal() },
    { id: 'pwa-guide-modal', closeFn: () => typeof closePwaGuideModal === 'function' && closePwaGuideModal() },
    { id: 'user-profile-modal', closeFn: () => typeof closeUserProfileModal === 'function' && closeUserProfileModal() },
    { id: 'client-services-modal', closeFn: () => typeof closeClientServicesModal === 'function' && closeClientServicesModal() },
    { id: 'client-quotes-modal', closeFn: () => typeof closeClientQuotesModal === 'function' && closeClientQuotesModal() },
    { id: 'client-support-history-modal', closeFn: () => typeof closeClientSupportModal === 'function' && closeClientSupportModal() },
    { id: 'user-messages-modal', closeFn: () => typeof closeUserMessagesModal === 'function' && closeUserMessagesModal() },
    { id: 'ongoing-support-modal', closeFn: () => typeof closeOngoingSupportModal === 'function' && closeOngoingSupportModal() },
    { id: 'auth-modal', closeFn: () => typeof closeAuthModal === 'function' && closeAuthModal() },
    { id: 'modal-tecnico-externo', closeFn: () => typeof closeTecnicoExternoPortal === 'function' && closeTecnicoExternoPortal() },
    { id: 'modal-proyectos-instalacion', closeFn: () => typeof closeInstallationProjectsModal === 'function' && closeInstallationProjectsModal() }
  ];

  modalCloseRegistry.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          item.closeFn();
          document.body.classList.remove('overflow-hidden');
          document.body.style.overflow = '';
        }
      });
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalCloseRegistry.forEach(item => item.closeFn());
      if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
      document.body.classList.remove('overflow-hidden');
      document.body.style.overflow = '';
    }
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600' :
                  type === 'warning' ? 'bg-amber-600' :
                  type === 'error' ? 'bg-rose-600' : 'bg-wes-blue';

  const iconClass = type === 'success' ? 'fa-check-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' :
                    type === 'error' ? 'fa-times-circle' : 'fa-info-circle';

  toast.className = `${bgClass} text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-3 text-sm transform transition duration-300 translate-y-2 opacity-0`;
  toast.innerHTML = `
    <i class="fas ${iconClass} text-base"></i>
    <span class="flex-1 font-medium">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================================================
// SISTEMA DE DETALLE DE PRODUCTO ESTILO ALIBABA (MULTI-ÁNGULO, ATRIBUTOS Y RESEÑAS)
// ============================================================================

window.currentDetailProductId = null;

/**
 * Abre el modal interactivo de detalle de producto estilo Alibaba.
 * Carga galería multi-ángulo, atributos clave tabulados y sistema de opiniones.
 * @param {string} productId - Identificador del producto (ej. 'odoo-21471')
 */
function openProductDetailModal(productId) {
  const products = StorageService.getProducts();
  const product = products.find(p => p.id === productId || p.code === productId || p.codigo === productId);
  if (!product) {
    showToast('Producto no encontrado.', 'warning');
    return;
  }

  window.currentDetailProductId = product.id;

  // 1. Textos y badges básicos
  const brandBadge = document.getElementById('detail-brand-badge');
  if (brandBadge) brandBadge.textContent = product.brand || 'WES';

  const skuBadge = document.getElementById('detail-sku-badge');
  if (skuBadge) skuBadge.textContent = `SKU: ${product.code || product.codigo || ''}`;

  const catBadge = document.getElementById('detail-category-badge');
  if (catBadge) catBadge.textContent = product.category || 'Seguridad Electrónica';

  const titleEl = document.getElementById('detail-product-title');
  if (titleEl) titleEl.textContent = product.name || product.nombre;

  // Promociones y Precios
  const priceEl = document.getElementById('detail-product-price');
  const oldPriceEl = document.getElementById('detail-product-old-price');
  const promoContainer = document.getElementById('detail-promo-container');
  const promoBadge = document.getElementById('detail-promo-badge');
  const promoText = document.getElementById('detail-promo-text');
  const promoSavings = document.getElementById('detail-promo-savings');

  const isOffer = !!(product.en_oferta || product.is_offer);
  const isNovelty = !!(product.novedad || product.is_new);
  const currentPrice = product.price || product.precio || 0;
  const oldPrice = product.precio_anterior || null;
  const hasDiscount = isOffer && oldPrice && oldPrice > currentPrice;

  if (priceEl) {
    priceEl.textContent = `RD$ ${currentPrice.toLocaleString()}`;
  }

  if (promoContainer) {
    if (hasDiscount) {
      const discountPct = Math.round((1 - (currentPrice / oldPrice)) * 100);
      const savingsVal = (oldPrice - currentPrice).toFixed(2);
      promoContainer.classList.remove('hidden');
      promoContainer.classList.add('flex');
      if (promoBadge) {
        promoBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm flex items-center space-x-1 animate-pulse';
      }
      if (promoText) promoText.textContent = `🔥 OFERTA ESPECIAL (-${discountPct}%)`;
      if (promoSavings) {
        promoSavings.textContent = `Ahorras: RD$ ${Number(savingsVal).toLocaleString()}`;
        promoSavings.classList.remove('hidden');
      }
      if (oldPriceEl) {
        oldPriceEl.textContent = `RD$ ${Number(oldPrice).toLocaleString()}`;
        oldPriceEl.classList.remove('hidden');
      }
    } else if (isOffer) {
      promoContainer.classList.remove('hidden');
      promoContainer.classList.add('flex');
      if (promoBadge) {
        promoBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm flex items-center space-x-1';
      }
      if (promoText) promoText.textContent = '🔥 OFERTA DE TEMPORADA';
      if (promoSavings) promoSavings.classList.add('hidden');
      if (oldPriceEl) oldPriceEl.classList.add('hidden');
    } else if (isNovelty) {
      promoContainer.classList.remove('hidden');
      promoContainer.classList.add('flex');
      if (promoBadge) {
        promoBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white shadow-sm flex items-center space-x-1';
      }
      if (promoText) promoText.textContent = '⭐ NOVEDAD 2026';
      if (promoSavings) promoSavings.classList.add('hidden');
      if (oldPriceEl) oldPriceEl.classList.add('hidden');
    } else {
      promoContainer.classList.add('hidden');
      promoContainer.classList.remove('flex');
      if (oldPriceEl) oldPriceEl.classList.add('hidden');
      if (promoSavings) promoSavings.classList.add('hidden');
    }
  }

  const stockBadge = document.getElementById('detail-stock-badge');
  if (stockBadge) {
    const stockQty = product.stock || 2;
    stockBadge.innerHTML = `<i class="fas fa-check-circle mr-1"></i>En Inventario Físico (${stockQty} uds)`;
  }

  const descEl = document.getElementById('detail-product-description');
  if (descEl) descEl.textContent = product.description || product.descripcion || '';

  // WhatsApp botón
  const waBtn = document.getElementById('detail-wa-btn');
  if (waBtn) {
    const waPhone = AppState.settings?.whatsapp || '18492075474';
    const waText = encodeURIComponent(`Hola WES, deseo consultar disponibilidad y asesoría sobre: ${product.name} (Código: ${product.code})`);
    waBtn.href = `https://wa.me/${waPhone}?text=${waText}`;
  }

  // 2. Galería de Fotos Multi-Ángulo (Estilo Alibaba)
  // Protección activa para SKU 3797 y productos enriquecidos: nunca usar enlaces obsoletos
  let effectiveGallery = product.gallery_images;
  if (typeof INITIAL_PRODUCTS !== 'undefined' && Array.isArray(INITIAL_PRODUCTS)) {
    const initMatch = INITIAL_PRODUCTS.find(i => String(i.codigo || i.code) === String(product.codigo || product.code));
    if (initMatch && Array.isArray(initMatch.gallery_images) && initMatch.gallery_images.length > 0) {
      if (!effectiveGallery || effectiveGallery.length === 0 || effectiveGallery.some(g => (g.url || '').includes('alicdn') || (g.url || '').includes('unsplash'))) {
        effectiveGallery = initMatch.gallery_images;
      }
    }
  }

  const defaultGallery = [
    {
      url: product.image || product.imagen_url,
      title: 'Vista Frontal y Desbloqueo',
      badge: 'Principal',
      caption: 'Motor CAME de tracción extrema'
    }
  ];
  const gallery = (effectiveGallery && effectiveGallery.length > 0) ? effectiveGallery : defaultGallery;

  const mainImage = document.getElementById('detail-main-image');
  const imageBadge = document.getElementById('detail-image-badge');
  if (mainImage && gallery[0]) {
    mainImage.src = gallery[0].url;
    mainImage.alt = gallery[0].title;
    if (imageBadge) imageBadge.textContent = gallery[0].badge || gallery[0].title;
  }

  const thumbsContainer = document.getElementById('detail-thumbnails-container');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = gallery.map((item, idx) => `
      <button type="button" onclick="selectDetailGalleryImage('${item.url}', '${item.badge || item.title}', this)"
        class="gallery-thumb-btn relative rounded-xl border-2 ${idx === 0 ? 'border-wes-blue ring-2 ring-wes-blue/20' : 'border-slate-200 hover:border-wes-blue'} p-1.5 bg-white transition duration-200 text-left overflow-hidden group">
        <div class="h-16 w-full flex items-center justify-center overflow-hidden rounded-lg bg-slate-50">
          <img src="${item.url}" alt="${item.title}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition">
        </div>
        <div class="text-[9px] font-bold text-slate-700 truncate mt-1 text-center">${item.badge || `Foto ${idx + 1}`}</div>
      </button>
    `).join('');
  }

  // 3. Características Principales (Key Attributes estilo Alibaba)
  const keyAttrsGrid = document.getElementById('detail-key-attributes-grid');
  if (keyAttrsGrid) {
    const baseAttrs = product.key_attributes || {
      "Código / SKU": product.code || product.codigo || 'N/A',
      "Marca": product.brand || product.marca || 'WES Certificado',
      "Categoría ERP": product.category || product.categoria_id || 'Equipos y Repuestos',
      "Disponibilidad": (product.stock !== undefined && product.stock > 0) ? `${product.stock} unidades en inventario físico` : 'Disponible bajo pedido',
      "Condición": "100% Nuevo Original",
      "Garantía WES": "Garantía oficial Warn Electrical Services",
      "Soporte Técnico": "Asistencia técnica directa WES",
      "Entrega": "Despacho a todo el país (Rep. Dominicana)"
    };

    const attrs = { ...baseAttrs };
    if (Array.isArray(product.features)) {
      product.features.forEach(f => {
        if (typeof f === 'string' && !f.startsWith('manual_url:')) {
          const cleanF = f.replace(/Código SKU \/ Odoo:/gi, 'SKU:').replace(/\/ Odoo/gi, '');
          if (cleanF.includes(':')) {
            const parts = cleanF.split(':');
            const k = parts[0].trim();
            const v = parts.slice(1).join(':').trim();
            if (k && v && !attrs[k]) {
              attrs[k] = v;
            }
          }
        }
      });
    }

    keyAttrsGrid.innerHTML = Object.entries(attrs).map(([key, value]) => `
      <div class="p-3 bg-white border border-slate-200/80 rounded-xl">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${key}</div>
        <div class="text-xs font-bold text-slate-800 mt-0.5">${value}</div>
      </div>
    `).join('');
  }

  // 4. Documentos y Manuales Técnicos (Relación Estricta por Producto)
  // Prevención de race condition al alternar productos rápidamente
  window.productModalLoadCounter = (window.productModalLoadCounter || 0) + 1;
  const currentModalLoadId = window.productModalLoadCounter;

  const docsListEl = document.getElementById('detail-documents-list');
  const noDocsEl = document.getElementById('detail-no-documents-msg');
  const docsBadge = document.getElementById('tab-docs-badge');

  // Limpieza inmediata del contenedor para evitar persistencia de datos previos
  if (docsListEl) {
    docsListEl.innerHTML = `
      <div class="py-6 flex items-center justify-center space-x-2 text-slate-400 text-xs">
        <i class="fas fa-spinner fa-spin text-wes-blue"></i>
        <span>Consultando documentación técnica verificada...</span>
      </div>
    `;
  }
  if (noDocsEl) noDocsEl.classList.add('hidden');
  if (docsBadge) docsBadge.textContent = '...';

  // Consulta asíncrona y sincronizada de documentos
  renderProductTechnicalDocuments(product, currentModalLoadId);

  // 5. Cargar Reseñas y Métricas de Calidad
  switchDetailTab('specs');
  loadAndRenderProductReviews(product.id);

  // Mostrar modal y actualizar URL sin recargar
  const modal = document.getElementById('product-detail-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    try {
      const sku = product.code || product.codigo || product.id;
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('p', sku);
      window.history.replaceState({ modalOpen: true, productId: product.id, sku: sku }, '', currentUrl.toString());
      document.title = `${product.name || product.nombre} | Warn Electrical Services`;
    } catch (e) {
      console.warn('Error actualizando URL de producto:', e);
    }
  }
}

/**
 * Cierra el modal de detalle de producto y restaura la URL.
 */
function closeProductDetailModal() {
  const modal = document.getElementById('product-detail-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');

    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('p');
      currentUrl.searchParams.delete('sku');
      currentUrl.searchParams.delete('producto');
      currentUrl.searchParams.delete('prod');
      currentUrl.searchParams.delete('id');
      const cleanSearch = currentUrl.searchParams.toString();
      const cleanPath = currentUrl.pathname + (cleanSearch ? '?' + cleanSearch : '');
      window.history.replaceState({}, '', cleanPath);
      document.title = 'Warn Electrical Services (WES) | Seguridad Electrónica y Automatización';
    } catch (e) {
      console.warn('Error restaurando URL limpia:', e);
    }
  }
}

/**
 * Cambia la imagen principal de la galería al hacer clic en una miniatura.
 */
function selectDetailGalleryImage(url, badgeText, btnEl) {
  const mainImage = document.getElementById('detail-main-image');
  const badgeEl = document.getElementById('detail-image-badge');
  if (mainImage) mainImage.src = url;
  if (badgeEl) badgeEl.textContent = badgeText;

  document.querySelectorAll('.gallery-thumb-btn').forEach(btn => {
    btn.classList.remove('border-wes-blue', 'ring-2', 'ring-wes-blue/20');
    btn.classList.add('border-slate-200');
  });

  if (btnEl) {
    btnEl.classList.remove('border-slate-200');
    btnEl.classList.add('border-wes-blue', 'ring-2', 'ring-wes-blue/20');
  }
}

/**
 * Alterna entre pestañas en el modal de detalle ('specs', 'manual', 'reviews').
 */
function switchDetailTab(tab) {
  const tabs = ['specs', 'manual', 'reviews'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const content = document.getElementById(`tab-content-${t}`);
    if (btn && content) {
      if (t === tab) {
        btn.className = 'px-4 py-2 font-bold text-xs rounded-xl transition bg-wes-blue text-white shadow-sm flex items-center space-x-1.5';
        content.classList.remove('hidden');
      } else {
        btn.className = 'px-4 py-2 font-bold text-xs rounded-xl transition text-slate-600 hover:bg-slate-100 flex items-center space-x-1.5';
        content.classList.add('hidden');
      }
    }
  });
}

/**
 * Consulta y renderiza la documentación técnica oficial vinculada exclusivamente al producto actual.
 * Aplica protección contra race condition con currentModalLoadId.
 */
async function renderProductTechnicalDocuments(product, loadId) {
  const docsListEl = document.getElementById('detail-documents-list');
  const noDocsEl = document.getElementById('detail-no-documents-msg');
  const docsBadge = document.getElementById('tab-docs-badge');

  let docs = [];

  // 1. Consulta inmediata en servicio local / datos verificados
  if (window.ProductDocumentsService && typeof window.ProductDocumentsService.getDocumentsForProduct === 'function') {
    docs = window.ProductDocumentsService.getDocumentsForProduct(product.id, product.code || product.codigo);
  }

  // Función interna para pintar documentos en la interfaz
  const paintDocs = (items) => {
    if (window.productModalLoadCounter !== loadId) return;

    if (docsBadge) docsBadge.textContent = items.length;
    if (!docsListEl || !noDocsEl) return;

    if (items.length === 0) {
      docsListEl.innerHTML = '';
      noDocsEl.classList.remove('hidden');
      return;
    }

    noDocsEl.classList.add('hidden');
    docsListEl.innerHTML = items.map(doc => {
      const meta = (window.ProductDocumentsService && typeof window.ProductDocumentsService.getMetaForType === 'function')
        ? window.ProductDocumentsService.getMetaForType(doc.tipo)
        : {
            label: 'Documento Técnico',
            badgeBg: 'bg-slate-100',
            badgeText: 'text-slate-700',
            badgeBorder: 'border-slate-200',
            iconClass: 'fas fa-file-alt text-slate-600',
            btnClass: 'bg-wes-blue hover:bg-wes-dark text-white'
          };

      const isExternal = doc.url.startsWith('http://') || doc.url.startsWith('https://');
      const actionLabel = doc.url.toLowerCase().endsWith('.pdf') ? 'Descargar PDF' : (isExternal ? 'Abrir Documento Web' : 'Ver Documento');
      const brandModel = [doc.marca, doc.modelo].filter(Boolean).join(' • ');

      return `
        <div class="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-wes-blue/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-start space-x-3.5">
            <div class="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shrink-0 mt-0.5">
              <i class="${meta.iconClass}"></i>
            </div>
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-md border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}">
                  ${meta.label}
                </span>
                ${brandModel ? `<span class="text-[11px] font-semibold text-slate-500">${brandModel}</span>` : ''}
                ${doc.idioma ? `<span class="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded"><i class="fas fa-globe mr-1 text-[9px]"></i>${doc.idioma}</span>` : ''}
                ${doc.version ? `<span class="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">v${doc.version}</span>` : ''}
              </div>
              <h4 class="font-bold text-sm text-slate-900 leading-snug">${doc.titulo}</h4>
              <div class="flex items-center space-x-2 text-[11px] text-emerald-600 font-semibold">
                <i class="fas fa-check-circle text-xs"></i>
                <span>Verificado por soporte técnico WES</span>
              </div>
            </div>
          </div>

          <div class="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
            <a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-4 py-2.5 ${meta.btnClass} rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-xs">
              <i class="fas fa-external-link-alt text-xs"></i>
              <span>${actionLabel}</span>
            </a>
          </div>
        </div>
      `;
    }).join('');
  };

  // Renderizado instantáneo de documentos verificados disponibles localmente
  paintDocs(docs);

  // 2. Consulta asíncrona complementaria en PostgreSQL (si está conectado)
  if (window.WesDB && typeof window.WesDB.getManual === 'function') {
    window.WesDB.getManual(product.id, product.code || product.codigo).then(dbManual => {
      if (window.productModalLoadCounter !== loadId) return;
      if (dbManual && dbManual.archivo_url) {
        const exists = docs.some(d => d.url === dbManual.archivo_url);
        if (!exists) {
          docs.push({
            id: dbManual.id || 'pg-doc-' + Date.now(),
            product_ids: [product.id],
            skus: [product.code || product.codigo],
            titulo: dbManual.titulo || 'Manual Técnico Oficial',
            tipo: dbManual.tipo || 'manual',
            url: dbManual.archivo_url,
            marca: dbManual.marca || product.brand || product.marca || '',
            modelo: dbManual.modelo || product.code || product.codigo || '',
            idioma: dbManual.idioma || 'Español',
            version: dbManual.version || 'Oficial',
            verificado: true
          });
          paintDocs(docs);
        }
      }
    }).catch(e => {
      console.warn('[renderProductTechnicalDocuments] Error en consulta complementaria:', e);
    });
  }
}

/**
 * Atajo para contactar a soporte técnico desde la ficha del producto cuando no hay documentación.
 */
function contactTechSupportForProduct() {
  const currentModal = document.getElementById('product-detail-modal');
  const title = document.getElementById('detail-title') ? document.getElementById('detail-title').textContent : 'Producto WES';
  const sku = document.getElementById('detail-sku-badge') ? document.getElementById('detail-sku-badge').textContent : '';

  const waMsg = encodeURIComponent(`Hola WES, requiero asistencia técnica / manual para el producto: ${title} (${sku})`);
  window.open(`https://wa.me/18095781234?text=${waMsg}`, '_blank');
}

/**
 * Carga y renderiza las reseñas y métricas de calidad (3 pilares: producto, envío, servicio).
 */
async function loadAndRenderProductReviews(productId) {
  let reviews = [];
  try {
    if (window.WesDB && typeof window.WesDB.getReviews === 'function') {
      reviews = await window.WesDB.getReviews(productId);
    } else {
      reviews = StorageService.getProductReviews(productId);
    }
  } catch (err) {
    reviews = StorageService.getProductReviews(productId);
  }

  // Actualizar badges de conteo
  const countEls = [document.getElementById('detail-reviews-count'), document.getElementById('tab-reviews-badge')];
  countEls.forEach(el => { if (el) el.textContent = reviews.length; });

  if (reviews.length === 0) {
    const listEl = document.getElementById('detail-reviews-list');
    if (listEl) {
      listEl.innerHTML = `
        <div class="text-center py-6 bg-slate-50 rounded-xl text-slate-400 text-xs">
          Aún no hay reseñas registradas para este producto. ¡Sé el primero en valorar!
        </div>
      `;
    }
    return;
  }

  // Calcular promedios
  let sumProd = 0, sumShip = 0, sumServ = 0, sumGlobal = 0;
  reviews.forEach(r => {
    sumProd += (r.productQuality || 5.0);
    sumShip += (r.shippingQuality || 5.0);
    sumServ += (r.serviceQuality || 5.0);
    sumGlobal += (r.rating || 5.0);
  });

  const avgProd = (sumProd / reviews.length).toFixed(1);
  const avgShip = (sumShip / reviews.length).toFixed(1);
  const avgServ = (sumServ / reviews.length).toFixed(1);
  const avgGlobal = (sumGlobal / reviews.length).toFixed(1);

  const globalEl = document.getElementById('metric-global-score');
  if (globalEl) globalEl.textContent = avgGlobal;

  const prodEl = document.getElementById('metric-product-score');
  if (prodEl) prodEl.textContent = `${avgProd} / 5.0`;

  const shipEl = document.getElementById('metric-shipping-score');
  if (shipEl) shipEl.textContent = `${avgShip} / 5.0`;

  const servEl = document.getElementById('metric-service-score');
  if (servEl) servEl.textContent = `${avgServ} / 5.0`;

  const ratingText = document.getElementById('detail-rating-text');
  if (ratingText) ratingText.textContent = `${avgGlobal} / 5.0`;

  // Renderizar tarjetas de reseñas
  const listEl = document.getElementById('detail-reviews-list');
  if (listEl) {
    listEl.innerHTML = reviews.map(r => `
      <div class="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-full bg-wes-blue text-white font-bold text-xs flex items-center justify-center">
              ${(r.author || 'C').charAt(0).toUpperCase()}
            </div>
            <div>
              <div class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span>${r.author}</span>
                ${r.verified ? '<span class="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-700 font-bold rounded-full">Compra verificada</span>' : ''}
              </div>
              <div class="text-[10px] text-slate-400">${r.location || 'Moca, Rep. Dom.'} • ${r.date || 'Reciente'}</div>
            </div>
          </div>
          <div class="flex text-amber-400 text-xs">
            ${Array.from({ length: Math.round(r.rating || 5) }).map(() => '<i class="fas fa-star"></i>').join('')}
          </div>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed italic">"${r.comment}"</p>
        <div class="flex flex-wrap gap-2 pt-1 border-t border-slate-200/50 text-[10px] text-slate-500">
          <span>Calidad: <strong>${r.productQuality || 5.0}★</strong></span>
          <span>•</span>
          <span>Envío: <strong>${r.shippingQuality || 5.0}★</strong></span>
          <span>•</span>
          <span>Servicio WES: <strong>${r.serviceQuality || 5.0}★</strong></span>
        </div>
      </div>
    `).join('');
  }
}

/**
 * Procesa el envío de una nueva reseña de cliente desde el formulario modal.
 */
async function handleReviewSubmit(e) {
  e.preventDefault();
  if (!window.currentDetailProductId) return;

  const author = document.getElementById('review-author')?.value.trim();
  const location = document.getElementById('review-location')?.value.trim() || 'Moca, Rep. Dom.';
  const productQuality = parseFloat(document.getElementById('review-product-quality')?.value || '5');
  const shippingQuality = parseFloat(document.getElementById('review-shipping-quality')?.value || '5');
  const serviceQuality = parseFloat(document.getElementById('review-service-quality')?.value || '5');
  const comment = document.getElementById('review-comment')?.value.trim();

  if (!author || !comment) {
    showToast('Por favor completa tu nombre y comentario.', 'warning');
    return;
  }

  const overallRating = parseFloat(((productQuality + shippingQuality + serviceQuality) / 3).toFixed(1));

  const reviewPayload = {
    productId: window.currentDetailProductId,
    author: author,
    location: location,
    rating: overallRating,
    productQuality: productQuality,
    shippingQuality: shippingQuality,
    serviceQuality: serviceQuality,
    comment: comment,
    verified: true
  };

  try {
    if (window.WesDB && typeof window.WesDB.createReview === 'function') {
      await window.WesDB.createReview(reviewPayload);
    } else {
      StorageService.saveProductReview(Object.assign({ id: 'loc-' + Date.now(), date: 'Hoy' }, reviewPayload));
    }

    showToast('¡Gracias! Tu reseña ha sido publicada con éxito.', 'success');
    document.getElementById('product-review-form')?.reset();
    await loadAndRenderProductReviews(window.currentDetailProductId);
  } catch (err) {
    console.error('Error al guardar reseña:', err);
    showToast('No se pudo guardar la reseña. Intenta de nuevo.', 'error');
  }
}

/**
 * Agrega el producto actual en vista de detalle a la lista de cotización.
 */
function addCurrentDetailToQuote() {
  if (window.currentDetailProductId) {
    addToQuote(window.currentDetailProductId);
    showToast('Producto añadido a la cotización.', 'success');
  }
}

// ============================================================================
// SISTEMA DE ESCENARIOS INTERACTIVOS Y COTIZACIÓN DE PROYECTOS WES
// ============================================================================

/**
 * Catálogo de escenarios reales para el Proyecto 5 (Sistemas de Respaldo Energético)
 */
const PROJECT_ENERGY_SCENARIOS = [
  {
    id: 'inversor-3600w-8bat',
    tabLabel: '3.6 kW (8 Bat.)',
    categoryBadge: 'Energía & Respaldo Crítico',
    statusBadge: 'Obra Real WES',
    statusIcon: 'fas fa-camera',
    location: 'Espaillat / Cibao, Rep. Dominicana',
    image: 'assets/projects/sistema-respaldo-inversor-interstate-3600w.jpg',
    imageAlt: 'Instalación de Sistema de Respaldo Energético Crítico: Inversor Wave 3.6 kW y 8 Baterías Interstate',
    title: 'Instalación de Sistema de Respaldo Energético Crítico: Inversor Onda Senoidal Pura 3.6 kW y Banco de 8 Baterías Interstate',
    description: 'Diseño, reacondicionamiento e instalación de infraestructura eléctrica de respaldo ininterrumpido (UPS/Inversor), orientada a proteger y mantener en operación continua los activos más sensibles del cliente: el sistema de facturación, la plataforma de videovigilancia y los sistemas de bombeo de agua.',
    specs: [
      {
        icon: 'fas fa-bolt',
        title: 'Inversor / Cargador:',
        desc: 'Inversor Inteligente Onda Senoidal Pura (Wave 3.6 kW) de alto rendimiento.'
      },
      {
        icon: 'fas fa-car-battery',
        title: 'Banco de Baterías:',
        desc: '8 baterías de ciclo profundo marca Interstate Batteries en base metálica reforzada.'
      },
      {
        icon: 'fas fa-shield-alt',
        title: 'Protecciones y Control:',
        desc: 'Centro de carga / caja de breakers dedicada y panel de transferencia para protección contra sobrecargas y cortocircuitos.'
      },
      {
        icon: 'fas fa-server',
        title: 'Cargas Críticas Respaldadas:',
        desc: 'Servidores y facturación (cero reinicios ni pérdidas), circuito cerrado (CCTV) y sistemas de bombeo de agua.'
      }
    ],
    quoteButtonText: 'Cotizar Sistema 3.6 kW (8 Baterías)',
    quoteItem: {
      id: 'odoo-1776',
      sku: '3883',
      name: 'Sistema de Respaldo Crítico 3.6 kW (Inversor Wave Senoidal + Banco 8 Baterías Interstate)',
      price: 33739.98,
      brand: 'WES / WAVE',
      image: 'assets/projects/sistema-respaldo-inversor-interstate-3600w.jpg'
    }
  },
  {
    id: 'inversor-1500w-2bat',
    tabLabel: '1.5 kW (2 Bat.)',
    categoryBadge: 'Respaldo Residencial Esencial',
    statusBadge: 'Obra en Instalación WES',
    statusIcon: 'fas fa-tools',
    location: 'Moca / Cibao, Rep. Dominicana',
    image: 'assets/projects/sistema-respaldo-inversor-1500w-2bat.jpg',
    imageAlt: 'Instalación de Sistema de Respaldo Residencial: Inversor PROSTEC 1.5 kW Aluminio y Banco de 2 Baterías',
    title: 'Instalación de Sistema de Respaldo Residencial: Inversor PROSTEC 1.5 kW (Aluminio) y Banco de 2 Baterías',
    description: 'Instalación residencial y comercial ligera diseñada para garantizar autonomía continua ante apagones en cargas esenciales del hogar: refrigerador/nevera, iluminación LED, conexión de internet (módem/router), ventilación y equipos de trabajo.',
    specs: [
      {
        icon: 'fas fa-bolt',
        title: 'Inversor / Cargador:',
        desc: 'Inversor PROSTEC Smart Power System 1.5 kW / 1.2 kW con chasis 100% de aluminio, display digital LED y selector GEL (SKU 553).'
      },
      {
        icon: 'fas fa-car-battery',
        title: 'Banco de Baterías:',
        desc: 'Banco de 2 baterías de ciclo profundo de 12VDC en gabinete de seguridad con cables de alta sección.'
      },
      {
        icon: 'fas fa-shield-alt',
        title: 'Protecciones Avanzadas:',
        desc: 'Supresor de picos, corte por alto/bajo voltaje y conmutación automática tipo UPS ultra rápida (10-15 ms).'
      },
      {
        icon: 'fas fa-home',
        title: 'Cargas Esenciales Respaldadas:',
        desc: 'Refrigerador/nevera, router de internet, computadoras, iluminación completa de la vivienda y abanicos.'
      }
    ],
    quoteButtonText: 'Cotizar Sistema 1.5 kW (2 Baterías)',
    quoteItem: {
      id: 'odoo-1751',
      sku: '553',
      name: 'INVERSOR PROSTEC 1.5KW / 1.2KW UPS 12V DC 120AC (CHASIS ALUMINIO) + 2 Baterías',
      price: 9100,
      brand: 'PROSTEC',
      image: 'assets/projects/sistema-respaldo-inversor-1500w-2bat.jpg'
    }
  }
];

let currentEnergyScenarioIndex = 0;
let modalCurrentScenarioIndex = 0;

/**
 * Inicializa el componente de proyectos interactivos de energía.
 */
function initEnergyProjectScenarios() {
  const customImg = localStorage.getItem('wes_custom_scenario_2_img');
  if (customImg && PROJECT_ENERGY_SCENARIOS[1]) {
    PROJECT_ENERGY_SCENARIOS[1].image = customImg;
  }
  switchEnergyProjectScenario(0);
}

/**
 * Cambia el escenario activo en la tarjeta del Proyecto 5.
 */
function switchEnergyProjectScenario(index) {
  if (index < 0 || index >= PROJECT_ENERGY_SCENARIOS.length) return;
  currentEnergyScenarioIndex = index;
  const scenario = PROJECT_ENERGY_SCENARIOS[index];

  // Actualizar botones de pestaña
  for (let i = 0; i < PROJECT_ENERGY_SCENARIOS.length; i++) {
    const btn = document.getElementById(`energy-tab-btn-${i}`);
    if (btn) {
      if (i === index) {
        btn.className = 'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 flex items-center space-x-1.5 bg-wes-gold text-wes-dark shadow-sm';
      } else {
        btn.className = 'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 flex items-center space-x-1.5 bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80';
      }
    }
  }

  // Actualizar imagen y detalles de tarjeta
  const cardImg = document.getElementById('energy-project-card-img');
  const catBadge = document.getElementById('energy-project-category-badge');
  const statusIcon = document.getElementById('energy-project-status-icon');
  const statusText = document.getElementById('energy-project-status-text');
  const locationEl = document.getElementById('energy-project-location');
  const titleEl = document.getElementById('energy-project-title');
  const descEl = document.getElementById('energy-project-desc');
  const specsContainer = document.getElementById('energy-project-specs-container');
  const quoteBtnText = document.getElementById('energy-project-quote-btn-text');

  if (cardImg) {
    cardImg.src = scenario.image;
    cardImg.alt = scenario.imageAlt;
  }
  if (catBadge) catBadge.textContent = scenario.categoryBadge;
  if (statusIcon) statusIcon.className = `${scenario.statusIcon} text-[10px]`;
  if (statusText) statusText.textContent = scenario.statusBadge;
  if (locationEl) locationEl.innerHTML = `<i class="fas fa-map-marker-alt text-wes-gold mr-1"></i> ${scenario.location}`;
  if (titleEl) titleEl.textContent = scenario.title;
  if (descEl) descEl.textContent = scenario.description;
  if (quoteBtnText) quoteBtnText.textContent = scenario.quoteButtonText;

  if (specsContainer && scenario.specs) {
    specsContainer.innerHTML = scenario.specs.map(spec => `
      <div class="flex items-start space-x-2">
        <i class="${spec.icon} text-wes-gold text-[11px] mt-0.5 shrink-0"></i>
        <span><strong class="text-white">${spec.title}</strong> ${spec.desc}</span>
      </div>
    `).join('');
  }
}

/**
 * Permite cambiar de escenario desde las flechas de la tarjeta
 */
function changeEnergyProjectScenarioCard(delta) {
  let nextIndex = (currentEnergyScenarioIndex + delta + PROJECT_ENERGY_SCENARIOS.length) % PROJECT_ENERGY_SCENARIOS.length;
  switchEnergyProjectScenario(nextIndex);
}

/**
 * Abre el visor modal para el escenario actualmente activo en la tarjeta.
 */
function openCurrentEnergyProjectModal() {
  openProjectImageModal(null, null, null, currentEnergyScenarioIndex);
}

/**
 * Agrega el escenario de respaldo seleccionado a la cotización y abre el formulario.
 */
function quoteEnergyProjectScenario(index) {
  const scenario = PROJECT_ENERGY_SCENARIOS[index] || PROJECT_ENERGY_SCENARIOS[0];
  const itemData = scenario.quoteItem;

  const existing = AppState.cart.find(i => i.id === itemData.id || (i.code && i.code === itemData.sku));
  if (existing) {
    existing.quantity += 1;
  } else {
    AppState.cart.push({
      id: itemData.id,
      name: itemData.name,
      code: itemData.sku,
      brand: itemData.brand,
      price: itemData.price || 0,
      image: scenario.image,
      quantity: 1
    });
  }

  updateCartBadge();
  if (typeof showToast === 'function') {
    showToast(`"${scenario.quoteItem.name}" añadido a tu cotización`, 'success');
  }
  openQuoteModal();
}

/**
 * Abre el visor modal de fotografías de proyectos reales WES.
 * Soporta navegación interactiva si se especifica scenarioIndex.
 */
function openProjectImageModal(imgSrc, title, desc, scenarioIndex) {
  const modal = document.getElementById('project-photo-modal');
  const imgEl = document.getElementById('project-modal-img');
  const titleEl = document.getElementById('project-modal-title');
  const descEl = document.getElementById('project-modal-desc');
  const thumbsBar = document.getElementById('project-modal-thumbnails-bar');
  const specsBox = document.getElementById('project-modal-specs-box');
  const counterPill = document.getElementById('modal-photo-counter');
  const prevBtn = document.getElementById('modal-nav-prev');
  const nextBtn = document.getElementById('modal-nav-next');
  if (!modal) return;

  if (typeof scenarioIndex === 'number' && PROJECT_ENERGY_SCENARIOS[scenarioIndex]) {
    modalCurrentScenarioIndex = scenarioIndex;
    if (thumbsBar) thumbsBar.classList.remove('hidden');
    if (specsBox) specsBox.classList.remove('hidden');
    if (counterPill) counterPill.classList.remove('hidden');
    if (prevBtn) prevBtn.classList.remove('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
    updateModalScenarioView();
  } else {
    modalCurrentScenarioIndex = -1;
    if (thumbsBar) thumbsBar.classList.add('hidden');
    if (specsBox) specsBox.classList.add('hidden');
    if (counterPill) counterPill.classList.add('hidden');
    if (prevBtn) prevBtn.classList.add('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');
    if (imgEl) imgEl.src = imgSrc || '';
    if (titleEl) titleEl.textContent = title || '';
    if (descEl) descEl.textContent = desc || '';
    const quoteBtnText = document.getElementById('project-modal-quote-btn-text');
    if (quoteBtnText) quoteBtnText.textContent = 'Cotizar Esta Solución';
  }

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

/**
 * Actualiza la información visual mostrada dentro del modal de fotografía.
 */
function updateModalScenarioView() {
  const scenario = PROJECT_ENERGY_SCENARIOS[modalCurrentScenarioIndex];
  if (!scenario) return;

  const imgEl = document.getElementById('project-modal-img');
  const titleEl = document.getElementById('project-modal-title');
  const descEl = document.getElementById('project-modal-desc');
  const quoteBtnText = document.getElementById('project-modal-quote-btn-text');
  const headerTag = document.getElementById('project-modal-header-tag');
  const counterText = document.getElementById('modal-photo-counter-text');
  const statusPill = document.getElementById('modal-scenario-status-pill');
  const modalSpecsContainer = document.getElementById('project-modal-specs-container');

  if (imgEl) {
    imgEl.src = scenario.image;
    imgEl.alt = scenario.imageAlt;
  }
  if (titleEl) titleEl.textContent = scenario.title;
  if (descEl) descEl.textContent = scenario.description;
  if (quoteBtnText) quoteBtnText.textContent = `Cotizar ${scenario.tabLabel}`;
  if (headerTag) headerTag.textContent = `${scenario.statusBadge} — Warn Electrical Services`;
  if (counterText) counterText.textContent = `Foto ${modalCurrentScenarioIndex + 1} de 2: ${scenario.tabLabel}`;
  if (statusPill) statusPill.textContent = scenario.statusBadge;

  // Actualizar datos técnicos de la instalación dentro del modal
  if (modalSpecsContainer && scenario.specs) {
    modalSpecsContainer.innerHTML = scenario.specs.map(spec => `
      <div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60 flex items-start space-x-2.5">
        <div class="w-7 h-7 rounded-lg bg-wes-gold/15 text-wes-gold flex items-center justify-center shrink-0 mt-0.5">
          <i class="${spec.icon} text-xs"></i>
        </div>
        <div class="text-[11px] leading-relaxed">
          <div class="text-white font-bold mb-0.5">${spec.title}</div>
          <div class="text-slate-300">${spec.desc}</div>
        </div>
      </div>
    `).join('');
  }

  // Actualizar miniaturas activas
  for (let i = 0; i < PROJECT_ENERGY_SCENARIOS.length; i++) {
    const thumb = document.getElementById(`modal-thumb-${i}`);
    if (thumb) {
      if (i === modalCurrentScenarioIndex) {
        thumb.className = 'flex-1 max-w-[240px] p-1.5 rounded-xl border-2 transition-all flex items-center space-x-2 bg-slate-800 border-wes-gold ring-2 ring-wes-gold/30 shadow-md text-left opacity-100';
      } else {
        thumb.className = 'flex-1 max-w-[240px] p-1.5 rounded-xl border-2 transition-all flex items-center space-x-2 bg-slate-800 border-slate-700 opacity-60 hover:opacity-100 shadow-md text-left';
      }
    }
  }
}

/**
 * Selecciona directamente un escenario dentro del modal.
 */
function setModalProjectScenario(index) {
  if (index >= 0 && index < PROJECT_ENERGY_SCENARIOS.length) {
    modalCurrentScenarioIndex = index;
    updateModalScenarioView();
    switchEnergyProjectScenario(index);
  }
}

/**
 * Alterna entre escenarios hacia adelante o atrás dentro del modal.
 */
function changeModalProjectScenario(delta) {
  if (modalCurrentScenarioIndex < 0) return;
  let nextIndex = (modalCurrentScenarioIndex + delta + PROJECT_ENERGY_SCENARIOS.length) % PROJECT_ENERGY_SCENARIOS.length;
  setModalProjectScenario(nextIndex);
}

/**
 * Ejecuta la cotización de la solución actualmente visualizada en el modal.
 */
function quoteActiveProjectScenario() {
  closeProjectImageModal();
  if (modalCurrentScenarioIndex >= 0) {
    quoteEnergyProjectScenario(modalCurrentScenarioIndex);
  } else {
    openQuoteModal();
  }
}

/**
 * Cierra el visor modal de fotografías de proyectos.
 */
function closeProjectImageModal() {
  const modal = document.getElementById('project-photo-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// Navegación con teclado dentro del modal
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('project-photo-modal');
  if (modal && !modal.classList.contains('hidden')) {
    if (e.key === 'ArrowLeft') {
      changeModalProjectScenario(-1);
    } else if (e.key === 'ArrowRight') {
      changeModalProjectScenario(1);
    } else if (e.key === 'Escape') {
      closeProjectImageModal();
    }
  }
});

// Exponer funciones globales al objeto window para navegación en HTML
window.PROJECT_ENERGY_SCENARIOS = PROJECT_ENERGY_SCENARIOS;
window.initEnergyProjectScenarios = initEnergyProjectScenarios;
window.switchEnergyProjectScenario = switchEnergyProjectScenario;
window.changeEnergyProjectScenarioCard = changeEnergyProjectScenarioCard;
window.openCurrentEnergyProjectModal = openCurrentEnergyProjectModal;
window.quoteEnergyProjectScenario = quoteEnergyProjectScenario;
window.openProjectImageModal = openProjectImageModal;
window.setModalProjectScenario = setModalProjectScenario;
window.changeModalProjectScenario = changeModalProjectScenario;
window.quoteActiveProjectScenario = quoteActiveProjectScenario;
window.closeProjectImageModal = closeProjectImageModal;

// ============================================================================
// SISTEMA DE ENLACES DIRECTOS Y COMPARTIR PRODUCTOS CON CLIENTES (DEEP-LINKING)
// ============================================================================

/**
 * Genera la URL pública directa para un producto específico.
 * @param {Object|string} productOrSku - Producto o código SKU
 * @returns {string} URL directa (ej: https://web.warnelectricalservices.com/?p=2949)
 */
function getProductDirectUrl(productOrSku) {
  let sku = '';
  if (typeof productOrSku === 'string') {
    sku = productOrSku;
  } else if (productOrSku && typeof productOrSku === 'object') {
    sku = productOrSku.code || productOrSku.codigo || productOrSku.id;
  }
  const cleanSku = String(sku || '').trim();
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?p=${encodeURIComponent(cleanSku)}`;
}

/**
 * Copia el enlace directo del producto que está abierto actualmente en el modal.
 */
function copyCurrentProductLink() {
  if (!window.currentDetailProductId) return;
  const products = StorageService.getProducts();
  const product = products.find(p => p.id === window.currentDetailProductId || p.code === window.currentDetailProductId || p.codigo === window.currentDetailProductId);
  if (!product) return;

  const directUrl = getProductDirectUrl(product);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(directUrl).then(() => {
      onLinkCopiedSuccess(directUrl);
    }).catch(() => {
      fallbackCopyText(directUrl);
    });
  } else {
    fallbackCopyText(directUrl);
  }
}

/**
 * Abre WhatsApp con mensaje pre-redactado para enviar el producto actual al cliente.
 */
function shareCurrentProductClientWhatsApp() {
  if (!window.currentDetailProductId) return;
  const products = StorageService.getProducts();
  const product = products.find(p => p.id === window.currentDetailProductId || p.code === window.currentDetailProductId || p.codigo === window.currentDetailProductId);
  if (!product) return;

  const directUrl = getProductDirectUrl(product);
  const sku = product.code || product.codigo || '';
  const price = (product.price || product.precio || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 });
  const brand = product.brand || product.marca || 'WES';

  const message = `¡Hola! Te comparto este producto de *Warn Electrical Services (WES)*:\n\n` +
    `📦 *${product.name || product.nombre}*\n` +
    (sku ? `🔢 Código / SKU: ${sku}\n` : '') +
    (brand ? `🏷️ Marca: ${brand}\n` : '') +
    `💰 Precio: RD$ ${price}\n\n` +
    `👉 Puedes ver las fotos multi-ángulo, ficha técnica y cotizar directamente aquí:\n${directUrl}`;

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}

/**
 * Copia el enlace directo de un producto desde la tarjeta del catálogo.
 */
function copyProductLinkBySku(sku, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const products = StorageService.getProducts();
  const product = products.find(p => p.id === sku || p.code === sku || p.codigo === sku);
  const directUrl = getProductDirectUrl(product || sku);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(directUrl).then(() => {
      showToast(`¡Enlace directo copiado para cliente (SKU: ${sku})!`, 'success');
    }).catch(() => {
      fallbackCopyText(directUrl);
    });
  } else {
    fallbackCopyText(directUrl);
  }
}

/**
 * Comparte un producto por WhatsApp desde la tarjeta del catálogo.
 */
function shareProductWhatsAppBySku(sku, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const products = StorageService.getProducts();
  const product = products.find(p => p.id === sku || p.code === sku || p.codigo === sku);
  if (!product) return;

  const directUrl = getProductDirectUrl(product);
  const price = (product.price || product.precio || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 });

  const message = `¡Hola! Te comparto este producto de *Warn Electrical Services (WES)*:\n\n` +
    `📦 *${product.name || product.nombre}*\n` +
    `🔢 Código / SKU: ${product.code || product.codigo}\n` +
    `💰 Precio: RD$ ${price}\n\n` +
    `👉 Puedes ver las fotos y detalles técnicos directamente aquí:\n${directUrl}`;

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}

/**
 * Notificación visual y cambio transitorio del botón al copiar enlace.
 */
function onLinkCopiedSuccess(url) {
  showToast('¡Enlace directo copiado al portapapeles! Puedes enviárselo a tu cliente.', 'success');
  const badge = document.getElementById('detail-share-copied-badge');
  if (badge) {
    badge.classList.remove('hidden');
    setTimeout(() => badge.classList.add('hidden'), 3500);
  }
  const textEl = document.getElementById('detail-copy-link-text');
  if (textEl) {
    const orig = textEl.textContent;
    textEl.textContent = '¡Enlace Copiado!';
    setTimeout(() => { textEl.textContent = orig; }, 2500);
  }
}

/**
 * Fallback de copia para navegadores sin API clipboard moderna.
 */
function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    onLinkCopiedSuccess(text);
  } catch (e) {
    prompt('Copia este enlace directo para tu cliente:', text);
  }
  document.body.removeChild(ta);
}

/**
 * Analiza la URL del navegador al cargar para abrir automáticamente el producto solicitado.
 * Admite parámetros: ?p=SKU, ?sku=SKU, ?producto=SKU, ?id=ID o hash #p=SKU.
 */
function checkUrlForProduct() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    let targetQuery = urlParams.get('p') || urlParams.get('sku') || urlParams.get('producto') || urlParams.get('prod') || urlParams.get('id');

    if (!targetQuery && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('p=') || hash.startsWith('sku=') || hash.startsWith('producto=')) {
        targetQuery = hash.split('=')[1];
      } else if (hash.startsWith('p-') || hash.startsWith('sku-')) {
        targetQuery = hash.split('-')[1];
      } else if (!hash.includes('/') && hash.length > 0 && !['store', 'services', 'support', 'contact', 'about', 'catalog'].includes(hash)) {
        targetQuery = hash;
      }
    }

    if (!targetQuery) return false;

    targetQuery = decodeURIComponent(targetQuery).trim().toLowerCase();

    let products = StorageService.getProducts();
    if (!products || products.length === 0) {
      products = (typeof INITIAL_PRODUCTS !== 'undefined' ? INITIAL_PRODUCTS : []);
    }

    const found = products.find(p => {
      const code = String(p.code || p.codigo || '').toLowerCase();
      const id = String(p.id || '').toLowerCase();
      if (code === targetQuery || id === targetQuery) return true;
      if (id === `odoo-${targetQuery}`) return true;
      return false;
    });

    if (found) {
      setTimeout(() => {
        openProductDetailModal(found.id);
        const catalogEl = document.getElementById('store-section') || document.getElementById('catalog-section');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
      return true;
    } else {
      window.pendingDeepLinkQuery = targetQuery;
      // Mostrar aviso claro y opción para ir al catálogo si no se encuentra tras comprobar productos
      showProductNotFoundNotice(targetQuery);
    }
  } catch (err) {
    console.warn('[WesApp] Error procesando enlace directo de producto:', err);
    return false;
  }
}

/**
 * Analiza la URL del navegador al cargar para filtrar automáticamente por categoría o subcategoría.
 * Admite parámetros: ?cat=slug o ?categoria=slug, y ?sub=slug o ?subcategoria=slug.
 */
function checkUrlForCategory() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const catQuery = urlParams.get('cat') || urlParams.get('categoria') || urlParams.get('category');
    const subQuery = urlParams.get('sub') || urlParams.get('subcategoria') || urlParams.get('subcategory');

    if (catQuery || subQuery) {
      if (typeof filterByCategory === 'function') {
        filterByCategory(catQuery || 'all', subQuery || null, true);
      }
      return true;
    }
  } catch (err) {
    console.warn('[WesApp] Error procesando enlace directo de categoría:', err);
  }
  return false;
}
window.checkUrlForCategory = checkUrlForCategory;

/**
 * Notificación accesible cuando un producto solicitado por enlace directo ya no existe en el catálogo.
 */
function showProductNotFoundNotice(targetQuery) {
  // Evitar duplicar aviso si ya está en pantalla
  if (document.getElementById('wes-product-not-found-toast')) return;

  const toast = document.createElement('div');
  toast.id = 'wes-product-not-found-toast';
  toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-amber-400/60 flex items-center justify-between gap-3 animate-fadeIn';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
        <i class="fas fa-box-open text-base"></i>
      </div>
      <div>
        <p class="text-xs font-bold text-white">El producto no está disponible</p>
        <p class="text-[11px] text-slate-300">El producto solicitado ya no existe o cambió de código.</p>
      </div>
    </div>
    <div class="flex items-center space-x-2 shrink-0">
      <button type="button" onclick="goToCatalogFromNotice()" class="px-3 py-1.5 bg-[#F5B300] hover:bg-amber-500 text-slate-950 font-extrabold text-[11px] rounded-xl transition shadow-xs">
        Volver al catálogo
      </button>
      <button type="button" onclick="document.getElementById('wes-product-not-found-toast')?.remove()" class="w-7 h-7 text-slate-400 hover:text-white flex items-center justify-center rounded-lg transition" aria-label="Cerrar aviso">
        <i class="fas fa-times text-xs"></i>
      </button>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    if (toast && toast.parentNode) toast.remove();
  }, 10000);
}

function goToCatalogFromNotice() {
  const toast = document.getElementById('wes-product-not-found-toast');
  if (toast) toast.remove();
  const catalogEl = document.getElementById('store-section') || document.getElementById('catalog-section');
  if (catalogEl) {
    catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.location.hash = '#store-section';
  }
}

// Escuchar cambios de historial en el navegador (Botón atrás/adelante)
window.addEventListener('popstate', (e) => {
  const modal = document.getElementById('product-detail-modal');
  if (modal && !modal.classList.contains('hidden')) {
    if (!e.state || !e.state.modalOpen) {
      closeProductDetailModal();
    }
  } else {
    checkUrlForProduct();
  }
});

// ============================================================================
// SISTEMA DE AUTENTICACIÓN UNIVERSAL (UI, MODAL, OTP & SESIÓN)
// ============================================================================

let recoveryCurrentEmail = '';
let recoveryCurrentName = '';
let recoveryMode = 'recovery'; // 'recovery' o 'registration'
let authCurrentEmail = '';
let authIsNewUser = false;
let authRememberSession = true;
let authResendTimer = null;
let authResendCountdown = 0;

function openAuthModal(step = 'request') {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  if (typeof closeUserProfileModal === 'function') closeUserProfileModal();

  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  clearAuthAlerts();
  showAuthStep(step);

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.classList.add('overflow-hidden');
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.style.display = 'none';
  document.body.classList.remove('overflow-hidden');
  clearAuthAlerts();
  if (authResendTimer) {
    clearInterval(authResendTimer);
    authResendTimer = null;
  }
}

let authRecoveryEmail = '';
let authRecoveryResendTimer = null;
let authRecoveryCountdown = 0;

function showAuthStep(step) {
  const stepRequest = document.getElementById('auth-step-request');
  const stepVerify = document.getElementById('auth-step-verify');
  const stepNewUser = document.getElementById('auth-step-new-user');
  const stepRecovery = document.getElementById('auth-step-recovery');
  const stepRecoveryVerify = document.getElementById('auth-step-recovery-verify');
  const title = document.getElementById('auth-modal-title');
  const subtitle = document.getElementById('auth-modal-subtitle');

  if (stepRequest) stepRequest.classList.add('hidden');
  if (stepVerify) stepVerify.classList.add('hidden');
  if (stepNewUser) stepNewUser.classList.add('hidden');
  if (stepRecovery) stepRecovery.classList.add('hidden');
  if (stepRecoveryVerify) stepRecoveryVerify.classList.add('hidden');
  clearAuthAlerts();

  if (step === 'verify') {
    if (stepVerify) stepVerify.classList.remove('hidden');
    if (title) title.textContent = 'Verificación de Acceso';
    if (subtitle) subtitle.textContent = 'Introduzca el código enviado a su correo';
    setupMagicOtpInputs();
  } else if (step === 'recovery') {
    if (stepRecovery) stepRecovery.classList.remove('hidden');
    if (title) title.textContent = 'Recuperar contraseña';
    if (subtitle) subtitle.textContent = 'Introduzca su correo para recibir un código de recuperación';
    const emailInp = document.getElementById('auth-access-email');
    const recEmail = document.getElementById('auth-recovery-email');
    if (recEmail) {
      if (emailInp && emailInp.value && !recEmail.value) {
        recEmail.value = emailInp.value.trim();
      }
      setTimeout(() => recEmail.focus(), 150);
    }
  } else if (step === 'recovery_verify') {
    if (stepRecoveryVerify) stepRecoveryVerify.classList.remove('hidden');
    if (title) title.textContent = 'Código de Recuperación';
    if (subtitle) subtitle.textContent = 'Introduzca el código enviado a su correo';
    const recDisplay = document.getElementById('auth-recovery-email-display');
    if (recDisplay) recDisplay.textContent = authRecoveryEmail || 'su correo';
    setupRecoveryOtpInputs();
  } else if (step === 'new_user') {
    if (stepNewUser) stepNewUser.classList.remove('hidden');
    if (title) title.textContent = 'Bienvenido a WES';
    if (subtitle) subtitle.textContent = 'Complete su nombre para acceder a su cuenta';
    setTimeout(() => {
      const inp = document.getElementById('auth-newuser-name');
      if (inp) inp.focus();
    }, 150);
  } else {
    // Paso inicial por defecto: solicitud de código
    if (stepRequest) stepRequest.classList.remove('hidden');
    if (title) title.textContent = 'Bienvenido a WES';
    if (subtitle) subtitle.textContent = 'Le enviaremos un código para entrar o crear su cuenta';
    setTimeout(() => {
      const inp = document.getElementById('auth-access-email');
      if (inp) inp.focus();
    }, 150);
  }
}

function backToEmailStep() {
  showAuthStep('request');
  setTimeout(() => {
    const inp = document.getElementById('auth-access-email');
    if (inp) {
      if (authCurrentEmail) inp.value = authCurrentEmail;
      inp.focus();
    }
  }, 100);
}

function clearAuthAlerts() {
  ['auth-request-alert-box', 'auth-verify-alert-box', 'auth-newuser-alert-box'].forEach(id => {
    const box = document.getElementById(id);
    if (box) {
      box.className = 'hidden p-3 rounded-xl text-xs';
      box.textContent = '';
    }
  });
}

function showAuthAlert(boxId, message, type = 'error') {
  const box = document.getElementById(boxId);
  if (!box) return;

  const styles = {
    error: 'p-3 rounded-xl text-xs bg-rose-50 text-rose-700 border border-rose-200 font-medium',
    success: 'p-3 rounded-xl text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium',
    warning: 'p-3 rounded-xl text-xs bg-amber-50 text-amber-800 border border-amber-200 font-medium'
  };

  box.className = styles[type] || styles.error;
  box.textContent = message;
  box.classList.remove('hidden');
}

// 1. HANDLER: SOLICITAR CÓDIGO DE 6 DÍGITOS
async function handleRequestAccessCodeSubmit(e) {
  if (e) e.preventDefault();
  clearAuthAlerts();

  const emailInput = document.getElementById('auth-access-email');
  const rememberInput = document.getElementById('auth-access-remember');
  const btn = document.getElementById('auth-request-btn');

  if (!emailInput) return;
  const email = emailInput.value.trim().toLowerCase();
  authRememberSession = rememberInput ? rememberInput.checked : true;

  if (!email || !email.includes('@')) {
    showAuthAlert('auth-request-alert-box', 'Por favor ingresa un correo electrónico válido.', 'error');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Enviando código...';
  }

  try {
    const res = await UserAuth.requestAccessCode(email);

    if (!res.success) {
      showAuthAlert('auth-request-alert-box', res.message || 'No se pudo enviar el código.', 'error');
      return;
    }

    authCurrentEmail = email;
    const emailDisplay = document.getElementById('auth-verify-email-display');
    if (emailDisplay) emailDisplay.textContent = email;

    showAuthStep('verify');
    startResendTimer(60);
    showToast('Código de 6 dígitos enviado a ' + email, 'success');

  } catch (err) {
    console.error('[Auth] Error al solicitar código:', err);
    showAuthAlert('auth-request-alert-box', 'Error al conectar con el servicio de autenticación.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane text-wes-gold mr-1"></i> Enviarme código';
    }
  }
}

// 2. CONFIGURACIÓN DE LAS 6 CAJAS DE ENTRADA OTP (COPIA, PEGA Y AUTO-ENTRADA ULTRA-FÁCIL)
function setupMagicOtpInputs() {
  const inputs = [
    document.getElementById('magic-digit-1'),
    document.getElementById('magic-digit-2'),
    document.getElementById('magic-digit-3'),
    document.getElementById('magic-digit-4'),
    document.getElementById('magic-digit-5'),
    document.getElementById('magic-digit-6')
  ].filter(Boolean);

  function checkAndAutoSubmitOtp() {
    const fullCode = inputs.map(inp => (inp.value || '').trim()).join('');
    if (fullCode.length === 6) {
      setTimeout(() => {
        handleVerifyAccessCodeSubmit();
      }, 120);
    }
  }

  function applyDigitsToInputs(digits) {
    if (!digits) return;
    const cleanDigits = String(digits).replace(/\D/g, '').slice(0, 6);
    if (!cleanDigits) return;

    for (let i = 0; i < 6; i++) {
      if (inputs[i]) {
        inputs[i].value = cleanDigits[i] || '';
      }
    }

    const lastIdx = Math.min(cleanDigits.length - 1, inputs.length - 1);
    if (inputs[lastIdx]) inputs[lastIdx].focus();

    if (cleanDigits.length === 6) {
      showToast('Código completado. Verificando...', 'info');
      checkAndAutoSubmitOtp();
    }
  }

  inputs.forEach((input, index) => {
    input.value = '';

    input.oninput = () => {
      const val = input.value.replace(/\D/g, '');
      if (val.length > 1) {
        // En caso de que el móvil o autocompletado inserte varios dígitos de golpe
        applyDigitsToInputs(val);
        return;
      }
      input.value = val.slice(0, 1);
      if (val && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      checkAndAutoSubmitOtp();
    };

    input.onkeydown = (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    };

    input.onpaste = (e) => {
      e.preventDefault();
      const rawText = (e.clipboardData || window.clipboardData)?.getData('text') || '';
      applyDigitsToInputs(rawText);
    };
  });

  setTimeout(() => {
    if (inputs[0]) inputs[0].focus();
  }, 100);
}

async function handlePasteMagicCode() {
  const inputs = [
    document.getElementById('magic-digit-1'),
    document.getElementById('magic-digit-2'),
    document.getElementById('magic-digit-3'),
    document.getElementById('magic-digit-4'),
    document.getElementById('magic-digit-5'),
    document.getElementById('magic-digit-6')
  ].filter(Boolean);

  function applyDigits(cleanDigits) {
    for (let i = 0; i < 6; i++) {
      if (inputs[i]) {
        inputs[i].value = cleanDigits[i] || '';
      }
    }
    const lastInp = document.getElementById('magic-digit-' + Math.min(cleanDigits.length, 6));
    if (lastInp) lastInp.focus();

    if (cleanDigits.length === 6) {
      showToast('Código de 6 dígitos pegado. Verificando y entrando...', 'success');
      setTimeout(() => {
        handleVerifyAccessCodeSubmit();
      }, 120);
    } else {
      showToast('Se pegaron ' + cleanDigits.length + ' dígitos. Complete los 6.', 'info');
    }
  }

  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      const digits = text.replace(/\D/g, '').slice(0, 6);
      if (!digits) {
        showToast('No se encontraron números en el portapapeles. Copia el código desde tu correo.', 'warning');
        return;
      }
      applyDigits(digits);
    } else {
      showToast('Mantén presionada una casilla o presiona Ctrl+V para pegar.', 'info');
    }
  } catch (e) {
    showToast('Toca una casilla y selecciona Pegar.', 'info');
  }
}

// 3. HANDLER: VERIFICAR CÓDIGO
async function handleVerifyAccessCodeSubmit(e) {
  if (e) e.preventDefault();
  clearAuthAlerts();

  const d1 = document.getElementById('magic-digit-1')?.value || '';
  const d2 = document.getElementById('magic-digit-2')?.value || '';
  const d3 = document.getElementById('magic-digit-3')?.value || '';
  const d4 = document.getElementById('magic-digit-4')?.value || '';
  const d5 = document.getElementById('magic-digit-5')?.value || '';
  const d6 = document.getElementById('magic-digit-6')?.value || '';
  const fullCode = (d1 + d2 + d3 + d4 + d5 + d6).trim();

  if (fullCode.length !== 6) {
    showAuthAlert('auth-verify-alert-box', 'Por favor ingresa los 6 dígitos completos del código.', 'warning');
    return;
  }

  const btn = document.getElementById('auth-verify-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Verificando...';
  }

  try {
    const res = await UserAuth.verifyAccessCode(authCurrentEmail, fullCode, authRememberSession);

    if (!res.success) {
      showAuthAlert('auth-verify-alert-box', res.message, 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check-circle text-wes-gold mr-1"></i> Verificar y entrar';
      }
      return;
    }

    // Si es un usuario nuevo: pedir nombre
    if (res.isNewUser) {
      authIsNewUser = true;
      showAuthStep('new_user');
      showToast('Código correcto. Complete su nombre para entrar.', 'info');
      return;
    }

    // Usuario existente verificado: acceso concedido
    closeAuthModal();
    updateAuthHeaderUI();
    showToast(res.message || '¡Sesión iniciada con éxito!', 'success');

    if (res.user && res.user.isEmployee) {
      setTimeout(() => {
        showConfirmationModal({
          title: '¡Hola, ' + res.user.name + '!',
          code: (res.user.role || 'PERSONAL').toUpperCase(),
          message: '<div class="space-y-3"><p class="text-xs text-slate-600">Has ingresado como <strong>Personal Autorizado WES</strong> (' + (res.user.roleLabel || res.user.role) + ').</p><div class="pt-2 flex flex-col sm:flex-row gap-2"><a href="admin.html" class="flex-1 py-2.5 bg-wes-blue text-white rounded-xl text-center text-xs font-bold hover:bg-wes-dark shadow transition flex items-center justify-center space-x-1.5"><i class="fas fa-shield-alt text-wes-gold"></i><span>Ir al Panel Admin</span></a><button onclick="closeConfirmationModal()" class="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-center text-xs font-bold hover:bg-slate-200 transition">Permanecer en Tienda</button></div></div>',
          type: 'login'
        });
      }, 400);
    }
  } catch (err) {
    console.error('[Auth] Error al verificar código:', err);
    showAuthAlert('auth-verify-alert-box', 'Error al verificar el código de acceso.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check-circle text-wes-gold mr-1"></i> Verificar y entrar';
    }
  }
}

// 4. HANDLER: COMPLETAR NOMBRE PARA USUARIOS NUEVOS
async function handleCompleteNewUserSubmit(e) {
  if (e) e.preventDefault();
  clearAuthAlerts();

  const nameInput = document.getElementById('auth-newuser-name');
  const name = nameInput ? nameInput.value.trim() : '';

  if (!name) {
    showAuthAlert('auth-newuser-alert-box', 'Por favor ingresa tu nombre completo.', 'error');
    return;
  }

  const btn = document.getElementById('auth-newuser-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Creando cuenta...';
  }

  try {
    const res = await UserAuth.completeNewUserProfile(authCurrentEmail, name, authRememberSession);
    if (!res.success) {
      showAuthAlert('auth-newuser-alert-box', res.message, 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check mr-1"></i> Finalizar y Entrar';
      }
      return;
    }

    closeAuthModal();
    updateAuthHeaderUI();
    showToast(res.message, 'success');
  } catch (err) {
    console.error('[Auth] Error al completar perfil:', err);
    showAuthAlert('auth-newuser-alert-box', 'Error al finalizar registro.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check mr-1"></i> Finalizar y Entrar';
    }
  }
}

// 5. CONTROL DEL TEMPORIZADOR DE REENVÍO (60 SEGUNDOS)
function startResendTimer(seconds = 60) {
  const btn = document.getElementById('auth-resend-btn');
  if (!btn) return;

  if (authResendTimer) clearInterval(authResendTimer);
  authResendCountdown = seconds;
  btn.disabled = true;
  btn.innerHTML = '<span>Reenviar en ' + authResendCountdown + 's</span>';

  authResendTimer = setInterval(() => {
    authResendCountdown--;
    if (authResendCountdown <= 0) {
      clearInterval(authResendTimer);
      authResendTimer = null;
      btn.disabled = false;
      btn.innerHTML = '<span>Reenviar código</span>';
    } else {
      btn.innerHTML = '<span>Reenviar en ' + authResendCountdown + 's</span>';
    }
  }, 1000);
}

async function handleResendMagicCode() {
  if (!authCurrentEmail || authResendCountdown > 0) return;
  const btn = document.getElementById('auth-resend-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>Enviando...</span>';
  }

  try {
    const res = await UserAuth.requestAccessCode(authCurrentEmail);
    if (res.success) {
      showToast('Nuevo código enviado a ' + authCurrentEmail, 'success');
      startResendTimer(60);
      setupMagicOtpInputs();
    } else {
      showAuthAlert('auth-verify-alert-box', res.message || 'No se pudo reenviar el código.', 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Reenviar código</span>';
      }
    }
  } catch (err) {
    showToast('Error al reenviar código.', 'error');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>Reenviar código</span>';
    }
  }
}

// ----------------------------------------------------------------------------
// CONTROLADOR DEL MENÚ COMPACTO "MI CUENTA" Y ACCESOS
// ----------------------------------------------------------------------------
function handleUserPersonClick() {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();

  if (typeof UserAuth !== 'undefined' && UserAuth.isAuthenticated()) {
    // Si la sesión YA ESTÁ INICIADA -> Desplegar / Alternar menú compacto "Mi cuenta"
    toggleMyAccountDropdown();
  } else {
    // Si NO está iniciada la sesión -> Abrir modal de login OTP
    openAuthModal('login');
  }
}

function toggleMyAccountDropdown() {
  const dropdown = document.getElementById('header-my-account-dropdown');
  const btn = document.getElementById('auth-person-btn');
  if (!dropdown) return;

  const isOpen = !dropdown.classList.contains('hidden');
  if (isOpen) {
    closeMyAccountDropdown();
  } else {
    dropdown.classList.remove('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
}

function closeMyAccountDropdown() {
  const dropdown = document.getElementById('header-my-account-dropdown');
  const btn = document.getElementById('auth-person-btn');
  if (dropdown) dropdown.classList.add('hidden');
  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
  }
}

// Cierre al hacer clic fuera del dropdown
document.addEventListener('click', (e) => {
  const container = document.getElementById('header-my-account-container');
  if (container && !container.contains(e.target)) {
    closeMyAccountDropdown();
  }
});

// Cierre del dropdown al presionar Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const dropdown = document.getElementById('header-my-account-dropdown');
    if (dropdown && !dropdown.classList.contains('hidden')) {
      closeMyAccountDropdown();
      const btn = document.getElementById('auth-person-btn');
      if (btn) btn.focus();
    }
  }
});

// ----------------------------------------------------------------------------
// SUB-PANEL: MIS SERVICIOS (COTIZACIONES, SOPORTE, TALLER)
// ----------------------------------------------------------------------------
function openClientServicesModal() {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  closeMyAccountDropdown();

  const modal = document.getElementById('client-services-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.classList.add('overflow-hidden');
}

function closeClientServicesModal() {
  const modal = document.getElementById('client-services-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.style.display = 'none';
  document.body.classList.remove('overflow-hidden');
}

// ----------------------------------------------------------------------------
// MODAL: MIS COTIZACIONES (CLIENTE)
// ----------------------------------------------------------------------------
async function openClientQuotesModal() {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  closeMyAccountDropdown();
  closeClientServicesModal();

  const modal = document.getElementById('client-quotes-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.classList.add('overflow-hidden');

  await loadClientQuotes();
}

function closeClientQuotesModal() {
  const modal = document.getElementById('client-quotes-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.style.display = 'none';
  document.body.classList.remove('overflow-hidden');
}

async function loadClientQuotes() {
  const container = document.getElementById('client-quotes-container');
  const countBadge = document.getElementById('client-quotes-count-badge');
  if (!container) return;

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
  if (!user || !user.email) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <i class="fas fa-lock text-3xl text-slate-400 mb-3"></i>
        <p class="font-bold text-sm text-slate-800">Debes iniciar sesión</p>
        <p class="text-xs text-slate-500 mt-1">Inicia sesión para ver tu historial de cotizaciones.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="py-12 text-center text-slate-500">
      <i class="fas fa-spinner fa-spin text-2xl text-wes-blue mb-3"></i>
      <p class="font-bold text-sm text-slate-800">Cargando tus cotizaciones...</p>
      <p class="text-xs text-slate-500 mt-1">Consultando servidor WES.</p>
    </div>
  `;

  try {
    const backendUrl = getWesBackendUrl();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'get_user_quotes',
        userEmail: user.email
      })
    });

    const data = await res.json();
    const quotes = (data && data.success && Array.isArray(data.quotes)) ? data.quotes : [];

    if (countBadge) {
      countBadge.textContent = `${quotes.length} registrada${quotes.length === 1 ? '' : 's'}`;
    }

    if (quotes.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center text-slate-500">
          <div class="w-14 h-14 rounded-2xl bg-blue-50 text-wes-blue border border-blue-100 flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
            <i class="fas fa-folder-open"></i>
          </div>
          <p class="font-bold text-sm text-slate-800">No tienes cotizaciones registradas</p>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Selecciona productos de nuestro catálogo y solicita una cotización para verla reflejada aquí.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = quotes.map(q => {
      const itemsText = (q.products || '').replace(/\n/g, '<br>');
      const totalText = q.totalEstimated ? `RD$ ${Number(q.totalEstimated).toLocaleString('es-DO', { minimumFractionDigits: 2 })}` : 'Por confirmar';
      const statusBadge = q.status.toLowerCase().includes('aprobada') 
        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">Aprobada</span>'
        : q.status.toLowerCase().includes('enviada')
        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-wes-blue border border-blue-200">Enviada</span>'
        : '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-800 border border-amber-200">' + (q.status || 'Recibida') + '</span>';

      return `
        <div class="bg-white border border-slate-200 hover:border-wes-blue/40 rounded-2xl p-4 sm:p-5 shadow-xs transition space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-2.5">
              <span class="w-8 h-8 rounded-xl bg-blue-50 text-wes-blue flex items-center justify-center text-xs font-black shrink-0">
                <i class="fas fa-hashtag"></i>
              </span>
              <div>
                <span class="font-bold text-sm text-slate-900">${q.id}</span>
                <span class="text-xs text-slate-400 ml-2">${q.date || ''}</span>
              </div>
            </div>
            <div>${statusBadge}</div>
          </div>

          <div class="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 font-mono leading-relaxed overflow-x-auto">
            ${itemsText || 'Sin detalle de productos registrado.'}
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="text-xs text-slate-500">Total Estimado:</span>
            <span class="font-black text-sm text-wes-blue font-brand">${totalText}</span>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('[Quotes] Error al cargar cotizaciones:', err);
    container.innerHTML = `
      <div class="py-10 text-center text-slate-500">
        <i class="fas fa-exclamation-triangle text-2xl text-amber-500 mb-2"></i>
        <p class="font-bold text-sm text-slate-800">No se pudieron cargar las cotizaciones</p>
        <p class="text-xs text-slate-500 mt-1">Por favor verifica tu conexión a internet o intenta nuevamente.</p>
        <button type="button" onclick="loadClientQuotes()" class="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
          Reintentar
        </button>
      </div>
    `;
  }
}

// ----------------------------------------------------------------------------
// MODAL: MIS SOLICITUDES DE SOPORTE (CLIENTE)
// ----------------------------------------------------------------------------
async function openClientSupportModal() {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  closeMyAccountDropdown();
  closeClientServicesModal();

  const modal = document.getElementById('client-support-history-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.classList.add('overflow-hidden');

  await loadClientSupportTickets();
}

function closeClientSupportModal() {
  const modal = document.getElementById('client-support-history-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.style.display = 'none';
  document.body.classList.remove('overflow-hidden');
}

async function loadClientSupportTickets() {
  const container = document.getElementById('client-support-container');
  const countBadge = document.getElementById('client-support-count-badge');
  if (!container) return;

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
  if (!user || (!user.email && !user.phone)) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <i class="fas fa-lock text-3xl text-slate-400 mb-3"></i>
        <p class="font-bold text-sm text-slate-800">Debes iniciar sesión</p>
        <p class="text-xs text-slate-500 mt-1">Inicia sesión para ver tu historial de solicitudes de soporte.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="py-12 text-center text-slate-500">
      <i class="fas fa-spinner fa-spin text-2xl text-amber-600 mb-3"></i>
      <p class="font-bold text-sm text-slate-800">Cargando tus solicitudes...</p>
      <p class="text-xs text-slate-500 mt-1">Consultando servidor WES.</p>
    </div>
  `;

  try {
    const backendUrl = getWesBackendUrl();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'get_user_support_tickets',
        userEmail: user.email || '',
        userPhone: user.phone || ''
      })
    });

    const data = await res.json();
    const tickets = (data && data.success && Array.isArray(data.tickets)) ? data.tickets : [];

    if (countBadge) {
      countBadge.textContent = `${tickets.length} registrada${tickets.length === 1 ? '' : 's'}`;
    }

    if (tickets.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center text-slate-500">
          <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
            <i class="fas fa-check-double"></i>
          </div>
          <p class="font-bold text-sm text-slate-800">No tienes solicitudes de soporte activas</p>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Cuando reportes una avería o solicites soporte en sitio, podrás darle seguimiento aquí.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = tickets.map(t => {
      const isCompleted = (t.status || '').toLowerCase().includes('completad') || (t.status || '').toLowerCase().includes('resuelt');
      const statusBadge = isCompleted
        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">Resuelto</span>'
        : '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-800 border border-amber-200">' + (t.status || 'En Proceso') + '</span>';

      return `
        <div class="bg-white border border-slate-200 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xs transition space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-2.5">
              <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-black shrink-0">
                <i class="fas fa-ticket-alt"></i>
              </span>
              <div>
                <span class="font-bold text-sm text-slate-900">${t.id}</span>
                <span class="text-xs text-slate-400 ml-2">${t.date || ''}</span>
              </div>
            </div>
            <div>${statusBadge}</div>
          </div>

          <div class="space-y-1.5 text-xs text-slate-600">
            <div><strong class="text-slate-800">Sistema / Equipo:</strong> ${t.productSystem || 'No especificado'}</div>
            <div><strong class="text-slate-800">Categoría:</strong> ${t.category || 'Soporte General'} &bull; <strong class="text-slate-800">Prioridad:</strong> ${t.priority || 'Normal'}</div>
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 text-slate-700 leading-relaxed mt-2">
              ${t.description || 'Sin descripción detallada.'}
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('[Support] Error al cargar tickets:', err);
    container.innerHTML = `
      <div class="py-10 text-center text-slate-500">
        <i class="fas fa-exclamation-triangle text-2xl text-amber-500 mb-2"></i>
        <p class="font-bold text-sm text-slate-800">No se pudieron cargar las solicitudes</p>
        <p class="text-xs text-slate-500 mt-1">Por favor verifica tu conexión o intenta más tarde.</p>
        <button type="button" onclick="loadClientSupportTickets()" class="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
          Reintentar
        </button>
      </div>
    `;
  }
}

// ----------------------------------------------------------------------------
// MODAL: MI PERFIL (LIMPIO Y EDITABLE)
// ----------------------------------------------------------------------------
// Función centralizada para obtener la URL de backend de WES (Google Apps Script)
function getWesBackendUrl() {
  if (typeof WES_CONFIG !== 'undefined' && WES_CONFIG.API_URL) return WES_CONFIG.API_URL;
  if (typeof CONFIG !== 'undefined' && CONFIG.BACKEND_URL && !CONFIG.BACKEND_URL.includes('example')) return CONFIG.BACKEND_URL;
  const stored = localStorage.getItem('wes_backend_url');
  if (stored && !stored.includes('example')) return stored;
  return 'https://script.google.com/macros/s/AKfycbyoN8TnzeN9Cg2X44YEt6KeQULahvG0DrEXP5m4HyLvJFs475maMjVrwjW8t-IRVIQ_OQ/exec';
}

function openUserProfileCleanModal() {
  openUserProfileModal();
}

async function openUserProfileModal() {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  if (typeof closeAuthModal === 'function') closeAuthModal();
  closeMyAccountDropdown();

  const modal = document.getElementById('user-profile-modal');
  if (!modal) return;

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
  if (!user) {
    openAuthModal('login');
    return;
  }

  // Render inicial con datos locales mientras se sincroniza
  renderUserProfileHeader(user);

  // Precargar formulario de edición
  const editName = document.getElementById('profile-edit-name-input');
  const editPhone = document.getElementById('profile-edit-phone-input');
  const editId = document.getElementById('profile-edit-id-input');
  if (editName) editName.value = user.name || '';
  if (editPhone) editPhone.value = user.phone || '';
  if (editId) editId.value = user.id || user.clientId || ('USR-' + (user.email ? user.email.split('@')[0] : '001'));

  toggleEditProfileMode(false);
  backToProfileMenu();

  // Mostrar modal de inmediato
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.classList.add('overflow-hidden');

  // Sincronizar datos reales desde la base de datos del backend
  try {
    const backendUrl = getWesBackendUrl();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'get_user_profile',
        userEmail: user.email,
        clientId: user.id || user.clientId || ''
      })
    });
    const data = await res.json();
    if (data && data.success && data.profile) {
      const p = data.profile;
      const refreshedUser = {
        ...user,
        name: p.name || user.name,
        phone: p.phone || user.phone,
        role: p.role || user.role,
        id: p.id || user.id
      };
      if (typeof UserAuth !== 'undefined' && typeof UserAuth.setSession === 'function') {
        UserAuth.setSession(refreshedUser, true);
      }
      renderUserProfileHeader(refreshedUser);
      if (editName && (!editName.value || editName.value === user.name)) editName.value = refreshedUser.name;
      if (editPhone && (!editPhone.value || editPhone.value === user.phone)) editPhone.value = refreshedUser.phone;
      if (editId) editId.value = refreshedUser.id || refreshedUser.clientId || ('USR-' + (refreshedUser.email ? refreshedUser.email.split('@')[0] : '001'));
    }
  } catch (err) {
    console.warn('[Profile] Sincronización en segundo plano no disponible:', err);
  }
}

function renderUserProfileHeader(user) {
  if (!user) return;
  const initials = (user.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const avatarEl = document.getElementById('profile-modal-avatar');
  const nameEl = document.getElementById('profile-modal-name');
  const roleEl = document.getElementById('profile-modal-role');
  const emailEl = document.getElementById('profile-modal-email');
  const phoneEl = document.getElementById('profile-modal-phone');

  if (avatarEl) avatarEl.textContent = initials;
  if (nameEl) nameEl.textContent = user.name || 'Usuario WES';
  if (emailEl) emailEl.textContent = user.email || '';
  if (phoneEl) phoneEl.textContent = user.phone || 'No registrado';

  const userRole = (user.role || (user.isEmployee ? 'administrador' : 'cliente')).toLowerCase();

  // Rol como texto pequeño y discreto dentro del área azul, sin fondo, borde ni apariencia de botón
  if (roleEl) {
    let displayRole = 'Cliente Registrado';
    if (userRole === 'propietario') {
      displayRole = 'Propietario / Superadmin';
    } else if (userRole === 'administrador' || user.isEmployee) {
      displayRole = 'Administrador General';
    } else if (userRole === 'tecnico_interno') {
      displayRole = 'Técnico Interno WES';
    } else if (userRole === 'tecnico_externo') {
      displayRole = 'Técnico Externo';
    } else if (userRole === 'gestor_soporte') {
      displayRole = 'Soporte Técnico';
    } else if (userRole === 'gestor_cotizaciones') {
      displayRole = 'Ventas y Cotizaciones';
    } else if (userRole === 'gestor_tienda') {
      displayRole = 'Gestor de Inventario';
    } else if (user.roleLabel && user.roleLabel !== 'Cliente' && user.roleLabel !== 'cliente') {
      displayRole = user.roleLabel.replace(/^[^\w\s]+/, '').trim();
    } else {
      displayRole = 'Cliente Registrado';
    }

    roleEl.textContent = displayRole;
    roleEl.className = 'text-[11px] text-slate-300 font-medium tracking-wide mt-1 block';
  }

  const previewAvatar = document.getElementById('profile-settings-preview-avatar');
  if (previewAvatar) previewAvatar.textContent = initials;

  // ID únicamente visible en el formulario de datos personales (solo lectura), oculto de la vista principal
  const clientIdEl = document.getElementById('profile-modal-client-id');
  if (clientIdEl) {
    clientIdEl.remove();
  }

  const editIdInput = document.getElementById('profile-edit-id-input');
  if (editIdInput) {
    editIdInput.value = user.id || user.clientId || ('USR-' + (user.email ? user.email.split('@')[0] : '001'));
  }

  const viewTecInterno = document.getElementById('profile-view-tecnico-interno');
  const viewAdmin = document.getElementById('profile-view-admin');

  if (viewTecInterno) viewTecInterno.classList.add('hidden');
  if (viewAdmin) viewAdmin.classList.add('hidden');

  if (userRole === 'tecnico_interno' || userRole === 'tecnico_externo') {
    if (viewTecInterno) viewTecInterno.classList.remove('hidden');
  } else if (userRole === 'administrador' || userRole === 'propietario' || user.isEmployee) {
    if (viewAdmin) viewAdmin.classList.remove('hidden');
  }
}

function closeUserProfileModal() {
  const modal = document.getElementById('user-profile-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.style.display = 'none';
  document.body.classList.remove('overflow-hidden');
  backFromSettingsToProfileMenu();
  backToProfileMenu();
}

// ----------------------------------------------------------------------------
// NAVEGACIÓN DE VISTA DE CONFIGURACIÓN DEL PERFIL (ENGRANAJE)
// ----------------------------------------------------------------------------
function openProfileSettingsView() {
  const menu = document.getElementById('profile-menu-container');
  if (menu) menu.classList.add('hidden');

  const contents = document.querySelectorAll('.profile-tab-content');
  contents.forEach(c => c.classList.add('hidden'));

  const settingsContainer = document.getElementById('profile-settings-container');
  if (settingsContainer) {
    settingsContainer.classList.remove('hidden');
  }

  backToSettingsMenu();
}

function backFromSettingsToProfileMenu() {
  const settingsContainer = document.getElementById('profile-settings-container');
  if (settingsContainer) settingsContainer.classList.add('hidden');

  const menu = document.getElementById('profile-menu-container');
  if (menu) menu.classList.remove('hidden');

  closeEmailChangeFlow();
}

function openSettingsSubView(subId) {
  const settingsList = document.getElementById('settings-menu-list');
  if (settingsList) settingsList.classList.add('hidden');

  const personalView = document.getElementById('settings-personal-view');
  const emailView = document.getElementById('settings-email-view');
  const notifView = document.getElementById('settings-notifications-view');

  if (personalView) personalView.classList.add('hidden');
  if (emailView) emailView.classList.add('hidden');
  if (notifView) notifView.classList.add('hidden');

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;

  if (subId === 'personal') {
    if (personalView) personalView.classList.remove('hidden');
    if (user) {
      const editName = document.getElementById('profile-edit-name-input');
      const editPhone = document.getElementById('profile-edit-phone-input');
      const editId = document.getElementById('profile-edit-id-input');
      if (editName) editName.value = user.name || '';
      if (editPhone) editPhone.value = user.phone || '';
      if (editId) editId.value = user.id || user.clientId || ('USR-' + (user.email ? user.email.split('@')[0] : '001'));
      if (editName) editName.focus();
    }
  } else if (subId === 'email') {
    if (emailView) emailView.classList.remove('hidden');
    openEmailChangeFlow();
  } else if (subId === 'notifications') {
    if (notifView) notifView.classList.remove('hidden');
    updateSettingsPushUI();
  }
}

function backToSettingsMenu() {
  const personalView = document.getElementById('settings-personal-view');
  const emailView = document.getElementById('settings-email-view');
  const notifView = document.getElementById('settings-notifications-view');

  if (personalView) personalView.classList.add('hidden');
  if (emailView) emailView.classList.add('hidden');
  if (notifView) notifView.classList.add('hidden');

  const settingsList = document.getElementById('settings-menu-list');
  if (settingsList) settingsList.classList.remove('hidden');

  closeEmailChangeFlow();
}

function toggleEditProfileMode(enable) {
  if (enable) {
    openProfileSettingsView();
    openSettingsSubView('personal');
  } else {
    backFromSettingsToProfileMenu();
  }
}

function updateSettingsPushUI() {
  const btn = document.getElementById('settings-push-toggle-btn');
  const statusText = document.getElementById('settings-push-status-text');
  if (!btn || !statusText) return;

  if (typeof UserMessagesService === 'undefined' || !UserMessagesService.checkPushSupport()) {
    statusText.textContent = 'Estado: No compatible con este navegador o dispositivo.';
    btn.textContent = 'No disponible';
    btn.disabled = true;
    btn.className = 'px-3 py-1.5 bg-slate-200 text-slate-400 rounded-xl text-[11px] font-bold cursor-not-allowed';
    return;
  }

  btn.disabled = false;
  if (UserMessagesService.isPushSubscribed()) {
    statusText.textContent = 'Estado: Avisos Web Push activados en este dispositivo.';
    btn.textContent = 'Desactivar';
    btn.className = 'px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-[11px] font-bold transition shadow-xs';
  } else {
    statusText.textContent = 'Estado: Avisos Web Push desactivados o pendientes de autorización.';
    btn.textContent = 'Activar';
    btn.className = 'px-3 py-1.5 bg-wes-blue text-white hover:bg-wes-dark rounded-xl text-[11px] font-bold transition shadow-xs';
  }
}

async function toggleSettingsPushSubscription() {
  if (typeof UserMessagesService !== 'undefined' && typeof UserMessagesService.togglePushSubscriptionFromProfile === 'function') {
    await UserMessagesService.togglePushSubscriptionFromProfile();
    updateSettingsPushUI();
  } else {
    showToast('El servicio de avisos no está disponible actualmente.', 'warning');
  }
}

// Navegación vertical: Abrir una sección y ocultar menú principal
function openProfileSection(sectionId) {
  const menu = document.getElementById('profile-menu-container');
  if (menu) menu.classList.add('hidden');

  const contents = document.querySelectorAll('.profile-tab-content');
  contents.forEach(c => c.classList.add('hidden'));

  const active = document.getElementById(`tab-content-${sectionId}`);
  if (active) active.classList.remove('hidden');

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
  if (!user) return;

  switch (sectionId) {
    case 'cotizaciones':
      loadProfileQuotes(user);
      break;
    case 'facturas':
      loadProfileDocuments(user, 'factura');
      break;
    case 'estado-cuenta':
      loadProfileDocuments(user, 'estado_cuenta');
      break;
    case 'soporte':
      loadProfileSupport(user);
      break;
    case 'pagos':
      loadProfilePayments(user);
      break;
    case 'mensajes':
      loadProfilePrivateMessages(user);
      break;
  }
}

// Volver al menú principal vertical
function backToProfileMenu() {
  const contents = document.querySelectorAll('.profile-tab-content');
  contents.forEach(c => c.classList.add('hidden'));

  const menu = document.getElementById('profile-menu-container');
  if (menu) menu.classList.remove('hidden');
}

// Compatibilidad con invocaciones antiguas
function switchProfileTab(tabName) {
  openProfileSection(tabName);
}

async function handleSaveUserProfile(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('profile-edit-name-input');
  const phoneInput = document.getElementById('profile-edit-phone-input');
  const btn = document.getElementById('btn-save-profile');

  const newName = nameInput ? nameInput.value.trim() : '';
  const newPhone = phoneInput ? phoneInput.value.trim() : '';

  if (!newName) {
    showToast('El nombre no puede estar vacío.', 'warning');
    return;
  }

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
  if (!user || !user.email) return;

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Guardando...';
  }

  try {
    const backendUrl = getWesBackendUrl();
    
    // 1. Persistir primero en el servidor
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'update_user_profile_self',
        userEmail: user.email,
        clientId: user.id || user.clientId || '',
        name: newName,
        phone: newPhone
      })
    });

    const data = await res.json();
    if (!data || !data.success) {
      throw new Error((data && data.message) || 'Error al persistir en el servidor');
    }

    // 2. Solo tras confirmación del servidor, actualizar sesión y UI
    const updatedUser = { ...user, name: newName, phone: newPhone };
    if (typeof UserAuth !== 'undefined' && typeof UserAuth.setSession === 'function') {
      UserAuth.setSession(updatedUser, true);
    }

    renderUserProfileHeader(updatedUser);
    updateAuthHeaderUI();
    toggleEditProfileMode(false);
    showToast('Cambios guardados', 'success');
  } catch (err) {
    console.error('[Profile] Error al guardar datos:', err);
    showToast('No se pudieron guardar los cambios: ' + (err.message || 'Error de red. Intenta nuevamente.'), 'error');
    // Conserva lo escrito en el formulario para reintentar
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check mr-1"></i> Guardar cambios';
    }
  }
}

// Carga de Cotizaciones del Perfil con distinción vacío vs fallo
async function loadProfileQuotes(user) {
  const container = document.getElementById('profile-quotes-container');
  if (!container || !user.email) return;

  container.innerHTML = `
    <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
      <i class="fas fa-spinner fa-spin text-wes-blue mb-1 text-sm block"></i>
      <span>Consultando cotizaciones vinculadas...</span>
    </div>
  `;

  try {
    const backendUrl = getWesBackendUrl();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'get_user_quotes', userEmail: user.email })
    });
    const data = await res.json();
    if (!data || !data.success) {
      throw new Error((data && data.message) || 'Error en servidor');
    }
    const quotes = Array.isArray(data.quotes) ? data.quotes : [];

    if (!quotes.length) {
      container.innerHTML = `
        <div class="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <i class="fas fa-file-invoice text-slate-300 text-2xl block"></i>
          <p class="font-bold text-slate-700">No tienes cotizaciones registradas</p>
          <p class="text-[11px] text-slate-400">Puedes solicitar una cotización formal sin costo cuando lo desees.</p>
          <button type="button" onclick="closeUserProfileModal(); openQuoteModal();" class="mt-2 inline-block px-3 py-1.5 bg-blue-50 text-wes-blue hover:bg-blue-100 rounded-xl font-bold transition">
            Solicitar cotización
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = quotes.map(q => `
      <div class="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-wes-blue transition space-y-1.5 text-xs shadow-xs">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-wes-blue text-xs">${escapeHtml(q.quoteNumber || 'COT')}</span>
          <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${q.status === 'Completada' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-wes-blue'}">${escapeHtml(q.status || 'Pendiente')}</span>
        </div>
        <p class="text-[11px] text-slate-500">Fecha: ${escapeHtml(q.date || 'Reciente')}</p>
        <p class="font-bold text-slate-800">Total Est.: RD$ ${Number(q.totalEstimated || 0).toLocaleString()}</p>
      </div>
    `).join('');
  } catch (e) {
    console.error('[Profile] Error al cargar cotizaciones:', e);
    container.innerHTML = `
      <div class="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center text-xs text-rose-700 space-y-2">
        <i class="fas fa-exclamation-circle text-rose-500 text-lg block"></i>
        <p class="font-bold">No se pudieron cargar las cotizaciones</p>
        <p class="text-[11px] text-rose-500">Hubo un problema de conexión con el servidor.</p>
        <button type="button" onclick="loadProfileQuotes(UserAuth.getCurrentUser())" class="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-700 rounded-xl font-bold border border-rose-300 transition text-[11px]">
          <i class="fas fa-redo-alt mr-1"></i> Reintentar
        </button>
      </div>
    `;
  }
}

// Carga de Facturas o Estados de Cuenta Oficiales en PDF con distinción de vacío y fallo
async function loadProfileDocuments(user, filterType) {
  const containerId = filterType === 'factura' ? 'profile-invoices-container' : 'profile-statements-container';
  const container = document.getElementById(containerId);
  if (!container || !user.email) return;

  container.innerHTML = `
    <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
      <i class="fas fa-spinner fa-spin text-wes-blue mb-1 text-sm block"></i>
      <span>Consultando documentos oficiales...</span>
    </div>
  `;

  try {
    const backendUrl = getWesBackendUrl();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'get_client_documents',
        userEmail: user.email,
        clientId: user.id || user.clientId || ''
      })
    });
    const data = await res.json();
    if (!data || !data.success) {
      throw new Error((data && data.message) || 'Error en servidor');
    }
    const docs = Array.isArray(data.documents) ? data.documents : [];
    const filtered = docs.filter(d => filterType === 'all' || d.tipo === filterType || (filterType === 'estado_cuenta' && d.tipo.includes('estado')));

    if (!filtered.length) {
      container.innerHTML = `
        <div class="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-1.5">
          <i class="fas ${filterType === 'factura' ? 'fa-receipt' : 'fa-file-invoice-dollar'} text-slate-300 text-2xl mb-1 block"></i>
          <p class="font-bold text-slate-700">No hay ${filterType === 'factura' ? 'facturas emitidas' : 'estados de cuenta registrados'}</p>
          <p class="text-[11px] text-slate-400">Los documentos oficiales con valor fiscal son emitidos por el área administrativa.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(d => `
      <div class="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-wes-blue transition flex items-center justify-between text-xs shadow-xs">
        <div class="min-w-0 flex-1 pr-3">
          <div class="flex items-center space-x-2">
            <span class="font-extrabold text-slate-900 truncate">${escapeHtml(d.numeroRef || d.id)}</span>
            <span class="px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${d.moneda === 'USD' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-wes-blue'}">${escapeHtml(d.moneda || 'DOP')}</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-0.5 truncate">${escapeHtml(d.descripcion || 'Documento oficial WES')}</p>
          <p class="text-[10px] text-slate-400">Emisión: ${escapeHtml(d.fechaEmision || 'N/D')} · Importe: <strong>${d.moneda || 'DOP'}$ ${Number(d.importe || 0).toLocaleString()}</strong></p>
        </div>
        ${d.driveFileId ? `
          <a href="https://drive.google.com/file/d/${escapeHtml(d.driveFileId)}/view" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-wes-blue hover:bg-wes-dark text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shrink-0">
            <i class="fas fa-file-pdf text-wes-gold"></i>
            <span>Ver PDF</span>
          </a>
        ` : '<span class="text-[10px] text-slate-400">Sin archivo</span>'}
      </div>
    `).join('');
  } catch(e) {
    console.error('[Profile] Error al cargar documentos:', e);
    container.innerHTML = `
      <div class="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center text-xs text-rose-700 space-y-2">
        <i class="fas fa-exclamation-circle text-rose-500 text-lg block"></i>
        <p class="font-bold">Error consultando documentos del servidor</p>
        <p class="text-[11px] text-rose-500">Por favor verifica tu conexión o intenta más tarde.</p>
        <button type="button" onclick="loadProfileDocuments(UserAuth.getCurrentUser(), '${filterType}')" class="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-700 rounded-xl font-bold border border-rose-300 transition text-[11px]">
          <i class="fas fa-redo-alt mr-1"></i> Reintentar
        </button>
      </div>
    `;
  }
}

// Carga de Pagos Registrados
async function loadProfilePayments(user) {
  const container = document.getElementById('profile-payments-container');
  if (!container || !user.email) return;

  container.innerHTML = `
    <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
      <i class="fas fa-spinner fa-spin text-wes-blue mb-1 text-sm block"></i>
      <span>Consultando pagos registrados...</span>
    </div>
  `;

  try {
    const backendUrl = getWesBackendUrl();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'get_client_payments', userEmail: user.email, clientId: user.id || '' })
    });
    const data = await res.json();
    if (!data || !data.success) {
      throw new Error((data && data.message) || 'Error en servidor');
    }
    const payments = Array.isArray(data.payments) ? data.payments : [];

    if (!payments.length) {
      container.innerHTML = `
        <div class="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-1.5">
          <i class="fas fa-credit-card text-slate-300 text-2xl mb-1 block"></i>
          <p class="font-bold text-slate-700">No hay pagos registrados</p>
          <p class="text-[11px] text-slate-400">Tus comprobantes de transferencia y pagos procesados aparecerán aquí.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = payments.map(p => `
      <div class="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1 text-xs shadow-xs">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-slate-900">${escapeHtml(p.moneda || 'DOP')} ${Number(p.importe || 0).toLocaleString()}</span>
          <span class="px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">${escapeHtml(p.estado || 'Validado')}</span>
        </div>
        <p class="text-[11px] text-slate-600">Método: ${escapeHtml(p.metodo || 'Transferencia')} · Ref: ${escapeHtml(p.referencia || 'N/D')}</p>
        <p class="text-[10px] text-slate-400">Fecha: ${escapeHtml(p.fechaPago || 'Reciente')}</p>
      </div>
    `).join('');
  } catch(e) {
    console.error('[Profile] Error al cargar pagos:', e);
    container.innerHTML = `
      <div class="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center text-xs text-rose-700 space-y-2">
        <i class="fas fa-exclamation-circle text-rose-500 text-lg block"></i>
        <p class="font-bold">No se pudieron cargar los pagos</p>
        <p class="text-[11px] text-rose-500">Ocurrió un fallo al comunicar con el servidor.</p>
        <button type="button" onclick="loadProfilePayments(UserAuth.getCurrentUser())" class="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-700 rounded-xl font-bold border border-rose-300 transition text-[11px]">
          <i class="fas fa-redo-alt mr-1"></i> Reintentar
        </button>
      </div>
    `;
  }
}

// Carga de Soporte Técnico en Perfil con distinción de vacío vs fallo
async function loadProfileSupport(user) {
  const container = document.getElementById('profile-support-container');
  if (!container || !user.email) return;

  container.innerHTML = `
    <div class="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
      <i class="fas fa-spinner fa-spin text-amber-600 mb-1 text-sm block"></i>
      <span>Consultando historial de servicio técnico...</span>
    </div>
  `;

  try {
    const backendUrl = getWesBackendUrl();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'get_user_support_tickets', userEmail: user.email, userPhone: user.phone || '' })
    });
    const data = await res.json();
    if (!data || !data.success) {
      throw new Error((data && data.message) || 'Error en servidor');
    }
    const tickets = Array.isArray(data.tickets) ? data.tickets : [];

    if (!tickets.length) {
      container.innerHTML = `
        <div class="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <i class="fas fa-tools text-slate-300 text-2xl block"></i>
          <p class="font-bold text-slate-700">No tienes solicitudes de soporte activas o pasadas</p>
          <p class="text-[11px] text-slate-400">Si requieres asistencia técnica o reparación, crea una nueva solicitud.</p>
          <button type="button" onclick="closeUserProfileModal(); openSupportModal();" class="mt-2 inline-block px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl font-bold transition">
            Crear solicitud de soporte
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = tickets.map(t => `
      <div class="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 transition space-y-1 text-xs shadow-xs">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-slate-900">${escapeHtml(t.ticketNumber || 'TKT')}</span>
          <span class="px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${t.status === 'Cerrado' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'}">${escapeHtml(t.status || 'En Proceso')}</span>
        </div>
        <p class="text-[11px] text-slate-600 truncate">${escapeHtml(t.subject || t.issue || 'Servicio técnico')}</p>
        <p class="text-[10px] text-slate-400">Fecha: ${escapeHtml(t.date || 'Reciente')}</p>
      </div>
    `).join('');
  } catch(e) {
    console.error('[Profile] Error al cargar tickets de soporte:', e);
    container.innerHTML = `
      <div class="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center text-xs text-rose-700 space-y-2">
        <i class="fas fa-exclamation-circle text-rose-500 text-lg block"></i>
        <p class="font-bold">No se pudo cargar el historial de soporte</p>
        <p class="text-[11px] text-rose-500">Hubo un problema comunicando con el servidor.</p>
        <button type="button" onclick="loadProfileSupport(UserAuth.getCurrentUser())" class="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-700 rounded-xl font-bold border border-rose-300 transition text-[11px]">
          <i class="fas fa-redo-alt mr-1"></i> Reintentar
        </button>
      </div>
    `;
  }
}

// Carga de Mensajes Privados con la Empresa
async function loadProfilePrivateMessages(user) {
  const thread = document.getElementById('profile-private-messages-thread');
  if (!thread || !user.email) return;

  try {
    const backendUrl = getWesBackendUrl();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'get_client_private_messages', userEmail: user.email, clientId: user.id || '' })
    });
    const data = await res.json();
    const msgs = (data && data.success && Array.isArray(data.messages)) ? data.messages : [];

    if (!msgs.length) {
      thread.innerHTML = '<p class="text-slate-400 text-center py-4">Inicia una conversación privada con la administración de WES.</p>';
      return;
    }

    thread.innerHTML = msgs.map(m => `
      <div class="flex flex-col ${m.senderRole === 'empresa' ? 'items-start' : 'items-end'} text-xs">
        <span class="text-[9px] text-slate-400 font-bold mb-0.5">${escapeHtml(m.sender || (m.senderRole === 'empresa' ? 'WES' : 'Tú'))} · ${escapeHtml(m.timestamp || '')}</span>
        <div class="max-w-[85%] px-3 py-2 rounded-2xl ${m.senderRole === 'empresa' ? 'bg-blue-50 text-wes-blue border border-blue-100 rounded-bl-none' : 'bg-wes-blue text-white rounded-br-none'} shadow-xs">
          ${escapeHtml(m.text || '')}
        </div>
      </div>
    `).join('');
    thread.scrollTop = thread.scrollHeight;
  } catch(e) {}
}

async function submitSendProfilePrivateMessage() {
  const input = document.getElementById('profile-private-msg-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
  if (!user || !user.email) return;

  input.value = '';
  try {
    const backendUrl = getWesBackendUrl();
    await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'send_client_private_message',
        userEmail: user.email,
        clientId: user.id || '',
        message: text,
        isAdmin: false
      })
    });
    loadProfilePrivateMessages(user);
  } catch(e) {
    showToast('No se pudo enviar el mensaje privado.', 'error');
  }
}

// ----------------------------------------------------------------------------
// FLUJO SEGURO DE ACTUALIZACIÓN DE CORREO MEDIANTE OTP
// ----------------------------------------------------------------------------
function openEmailChangeFlow() {
  const flow = document.getElementById('profile-email-change-flow');
  if (flow) {
    flow.classList.remove('hidden');
    const step1 = document.getElementById('email-change-step-1');
    const step2 = document.getElementById('email-change-step-2');
    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.add('hidden');
  }
}

function closeEmailChangeFlow() {
  const flow = document.getElementById('profile-email-change-flow');
  if (flow) flow.classList.add('hidden');
}

async function submitRequestEmailChangeOtp() {
  const input = document.getElementById('email-change-new-input');
  const btn = document.getElementById('btn-request-email-otp');
  const newEmail = input ? input.value.trim() : '';

  if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    showToast('Ingresa un correo electrónico válido.', 'warning');
    return;
  }

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
  if (!user || !user.email) return;

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Enviando código...';
  }

  try {
    const backendUrl = getWesBackendUrl();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'request_email_change_otp',
        userEmail: user.email,
        newEmail: newEmail
      })
    });
    const data = await res.json();
    if (!data || !data.success) {
      throw new Error((data && data.message) || 'Error solicitando código OTP');
    }

    showToast(data.message || 'Código OTP enviado al nuevo correo.', 'success');
    const step1 = document.getElementById('email-change-step-1');
    const step2 = document.getElementById('email-change-step-2');
    if (step1) step1.classList.add('hidden');
    if (step2) step2.classList.remove('hidden');
    const otpInput = document.getElementById('email-change-otp-input');
    if (otpInput) otpInput.focus();
  } catch (err) {
    showToast(err.message || 'No se pudo enviar el código OTP.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Enviar código de confirmación';
    }
  }
}

async function submitVerifyEmailChangeOtp() {
  const newEmailInput = document.getElementById('email-change-new-input');
  const otpInput = document.getElementById('email-change-otp-input');
  const btn = document.getElementById('btn-verify-email-otp');

  const newEmail = newEmailInput ? newEmailInput.value.trim() : '';
  const otp = otpInput ? otpInput.value.trim() : '';

  if (!otp || otp.length !== 6) {
    showToast('Ingresa el código OTP de 6 dígitos recibido.', 'warning');
    return;
  }

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
  if (!user || !user.email) return;

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Verificando...';
  }

  try {
    const backendUrl = getWesBackendUrl();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'verify_email_change_otp',
        userEmail: user.email,
        newEmail: newEmail,
        otpCode: otp
      })
    });
    const data = await res.json();
    if (!data || !data.success) {
      throw new Error((data && data.message) || 'Código incorrecto o expirado');
    }

    // Actualizar sesión del usuario en frontend con el nuevo correo manteniendo ID intacto
    const updatedUser = { ...user, email: newEmail };
    if (typeof UserAuth !== 'undefined' && typeof UserAuth.setSession === 'function') {
      UserAuth.setSession(updatedUser, true);
    }

    const emailEl = document.getElementById('profile-modal-email');
    if (emailEl) emailEl.textContent = newEmail;

    closeEmailChangeFlow();
    showToast('Correo electrónico actualizado correctamente.', 'success');
  } catch(err) {
    showToast(err.message || 'Error verificando código OTP.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Confirmar y actualizar correo';
    }
  }
}

window.openProfileSection = openProfileSection;
window.backToProfileMenu = backToProfileMenu;
window.switchProfileTab = switchProfileTab;
window.openProfileSettingsView = openProfileSettingsView;
window.backFromSettingsToProfileMenu = backFromSettingsToProfileMenu;
window.openSettingsSubView = openSettingsSubView;
window.backToSettingsMenu = backToSettingsMenu;
window.toggleSettingsPushSubscription = toggleSettingsPushSubscription;
window.updateSettingsPushUI = updateSettingsPushUI;
window.openEmailChangeFlow = openEmailChangeFlow;
window.closeEmailChangeFlow = closeEmailChangeFlow;
window.submitRequestEmailChangeOtp = submitRequestEmailChangeOtp;
window.submitVerifyEmailChangeOtp = submitVerifyEmailChangeOtp;
window.submitSendProfilePrivateMessage = submitSendProfilePrivateMessage;
window.getWesBackendUrl = getWesBackendUrl;

// ----------------------------------------------------------------------------
// PORTAL DE TÉCNICO EXTERNO (VISTA DE CAMPO)
// ----------------------------------------------------------------------------
function openTecnicoExternoPortal() {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  if (typeof closeUserProfileModal === 'function') closeUserProfileModal();

  const modal = document.getElementById('modal-tecnico-externo');
  if (!modal) return;

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
  const extName = document.getElementById('ext-tech-name');
  if (extName && user) {
    extName.textContent = user.name || 'Técnico Externo Asignado';
  }

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.classList.add('overflow-hidden');
}

function closeTecnicoExternoPortal() {
  const modal = document.getElementById('modal-tecnico-externo');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.style.display = 'none';
  document.body.classList.remove('overflow-hidden');
}

// ----------------------------------------------------------------------------
// SINCRONIZACIÓN DE INTERFAZ DEL HEADER (MENÚ COMPACTO MI CUENTA)
// ----------------------------------------------------------------------------
function updateAuthHeaderUI() {
  const isAuth = typeof UserAuth !== 'undefined' && UserAuth.isAuthenticated();
  const user = isAuth ? UserAuth.getCurrentUser() : null;

  const personBtn = document.getElementById('auth-person-btn');
  const iconLoggedOut = document.getElementById('auth-person-icon-loggedout');
  const iconLoggedIn = document.getElementById('auth-person-icon-loggedin');
  const initialsEl = document.getElementById('auth-person-initials');
  const shortnameEl = document.getElementById('auth-person-shortname');

  const dropdownFullName = document.getElementById('dropdown-user-fullname');
  const dropdownRole = document.getElementById('dropdown-user-role');
  const dropdownAdminLink = document.getElementById('dropdown-admin-link');

  const mobLoginBtn = document.getElementById('mobile-login-btn');
  const mobLoggedContainer = document.getElementById('mobile-logged-container');
  const mobAvatar = document.getElementById('mobile-user-avatar');
  const mobName = document.getElementById('mobile-user-name');
  const mobRole = document.getElementById('mobile-user-role');
  const mobAdminLink = document.getElementById('mobile-admin-link');

  // Control estricto de visibilidad según rol para el menú ⋮ de "Mi cuenta"
  const allowedTechRoles = ['tecnico_interno', 'tecnico_externo', 'administrador', 'propietario', 'gestor_soporte'];
  const userRole = user && user.role ? String(user.role).toLowerCase() : '';
  const isClientRole = !user || userRole === 'cliente';
  const hasKdsAccess = Boolean(user && !isClientRole && (allowedTechRoles.includes(userRole) || user.isEmployee === true));
  const hasAdminAccess = Boolean(user && (userRole === 'administrador' || userRole === 'propietario'));

  // Retirar cualquier botón independiente en header o drawer si todavía existiera en DOM
  const legacyIndependentElements = ['nav-service-kds-link', 'header-service-kds-chip', 'drawer-service-kds-link'];
  legacyIndependentElements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  const sectionKdsBanner = document.getElementById('section-services-kds-banner');
  if (sectionKdsBanner) {
    if (hasKdsAccess) {
      sectionKdsBanner.classList.remove('hidden');
      sectionKdsBanner.style.setProperty('display', 'flex', 'important');
    } else {
      sectionKdsBanner.classList.add('hidden');
      sectionKdsBanner.style.setProperty('display', 'none', 'important');
    }
  }

  // Elementos dentro del Menú ⋮ y Drawer Móvil
  const dropdownTechKdsLink = document.getElementById('dropdown-tech-kds-link');
  const dropdownClientServicesBtn = document.getElementById('dropdown-client-services-btn');
  const mobileTechKdsLink = document.getElementById('mobile-tech-kds-link');
  const mobileClientServicesBtn = document.getElementById('mobile-client-services-btn');

  if (isAuth && user) {
    const rawName = user.name || 'Cliente';
    const shortName = rawName.split(' ')[0] || 'Cliente';
    const initials = rawName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    // Actualizar botón "Mi Cuenta" en la barra principal
    if (iconLoggedOut) iconLoggedOut.classList.add('hidden');
    if (iconLoggedIn) iconLoggedIn.classList.remove('hidden');
    if (initialsEl) initialsEl.textContent = initials;
    if (shortnameEl) shortnameEl.textContent = shortName;
    if (personBtn) personBtn.title = `Mi Cuenta: ${user.name} (${user.roleLabel || 'Activa'})`;

    // Dropdown Header: Opciones según permisos
    if (dropdownFullName) dropdownFullName.textContent = user.name;
    if (dropdownRole) dropdownRole.textContent = user.roleLabel || (hasAdminAccess ? 'Administrador WES' : hasKdsAccess ? 'Técnico WES' : 'Cliente WES');
    
    // Panel Administrativo: Solo administradores
    if (dropdownAdminLink) {
      if (hasAdminAccess) dropdownAdminLink.classList.remove('hidden');
      else dropdownAdminLink.classList.add('hidden');
    }

    // Servicio Técnico: Solo técnicos y administradores autorizados
    if (dropdownTechKdsLink) {
      if (hasKdsAccess) dropdownTechKdsLink.classList.remove('hidden');
      else dropdownTechKdsLink.classList.add('hidden');
    }

    // Proyectos en Instalación (Odoo): Técnicos y administradores autorizados
    const dropdownTechProjectsLink = document.getElementById('dropdown-tech-projects-link');
    if (dropdownTechProjectsLink) {
      if (hasKdsAccess) dropdownTechProjectsLink.classList.remove('hidden');
      else dropdownTechProjectsLink.classList.add('hidden');
    }

    // Mis Servicios: Visible para Clientes (o rol cliente)
    if (dropdownClientServicesBtn) {
      if (isClientRole) dropdownClientServicesBtn.classList.remove('hidden');
      else dropdownClientServicesBtn.classList.add('hidden');
    }

    // Drawer Móvil
    if (mobLoginBtn) mobLoginBtn.classList.add('hidden');
    if (mobLoggedContainer) mobLoggedContainer.classList.remove('hidden');
    if (mobAvatar) mobAvatar.textContent = initials;
    if (mobName) mobName.textContent = user.name;
    if (mobRole) mobRole.textContent = user.roleLabel || (hasAdminAccess ? 'Administrador WES' : hasKdsAccess ? 'Técnico WES' : 'Cliente WES');
    
    if (mobAdminLink) {
      if (hasAdminAccess) mobAdminLink.classList.remove('hidden');
      else mobAdminLink.classList.add('hidden');
    }

    if (mobileTechKdsLink) {
      if (hasKdsAccess) mobileTechKdsLink.classList.remove('hidden');
      else mobileTechKdsLink.classList.add('hidden');
    }

    const mobileTechProjectsLink = document.getElementById('mobile-tech-projects-link');
    if (mobileTechProjectsLink) {
      if (hasKdsAccess) mobileTechProjectsLink.classList.remove('hidden');
      else mobileTechProjectsLink.classList.add('hidden');
    }

    // Barra inferior móvil: Acceso condicional para técnicos ("Mis proyectos")
    const mobileBottomNavProjects = document.getElementById('mobile-bottom-nav-projects');
    if (mobileBottomNavProjects) {
      if (hasKdsAccess) {
        mobileBottomNavProjects.classList.remove('hidden');
      } else {
        mobileBottomNavProjects.classList.add('hidden');
      }
    }

    if (mobileClientServicesBtn) {
      if (isClientRole) mobileClientServicesBtn.classList.remove('hidden');
      else mobileClientServicesBtn.classList.add('hidden');
    }
  } else {
    // Visitante (No autenticado)
    if (dropdownAdminLink) dropdownAdminLink.classList.add('hidden');
    if (dropdownTechKdsLink) dropdownTechKdsLink.classList.add('hidden');
    const dropdownTechProjectsLink = document.getElementById('dropdown-tech-projects-link');
    if (dropdownTechProjectsLink) dropdownTechProjectsLink.classList.add('hidden');
    if (dropdownClientServicesBtn) dropdownClientServicesBtn.classList.remove('hidden');
    if (mobileTechKdsLink) mobileTechKdsLink.classList.add('hidden');
    const mobileTechProjectsLink = document.getElementById('mobile-tech-projects-link');
    if (mobileTechProjectsLink) mobileTechProjectsLink.classList.add('hidden');
    const mobileBottomNavProjects = document.getElementById('mobile-bottom-nav-projects');
    if (mobileBottomNavProjects) mobileBottomNavProjects.classList.add('hidden');
    // No autenticado
    if (iconLoggedOut) iconLoggedOut.classList.remove('hidden');
    if (iconLoggedIn) iconLoggedIn.classList.add('hidden');
    if (personBtn) {
      personBtn.title = 'Iniciar Sesión / Mi Cuenta';
      personBtn.setAttribute('aria-expanded', 'false');
    }
    closeMyAccountDropdown();

    if (mobLoginBtn) mobLoginBtn.classList.remove('hidden');
    if (mobLoggedContainer) mobLoggedContainer.classList.add('hidden');
  }

  // Evaluar visibilidad del botón de instalación PWA según estado de sesión
  if (typeof evaluatePwaInstallVisibility === 'function') {
    evaluatePwaInstallVisibility();
  }
}

async function handleLogout() {
  closeMyAccountDropdown();
  if (typeof UserAuth !== 'undefined') {
    await UserAuth.logout();
    showToast('Sesión cerrada correctamente.', 'info');
  }
}

function filterByMyQuotes() {
  if (typeof openQuoteModal === 'function') {
    openQuoteModal();
  }
}

window.addEventListener('wes_user_login', () => updateAuthHeaderUI());
window.addEventListener('wes_user_logout', () => updateAuthHeaderUI());

// Exponer funciones al scope global
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.openRecoveryView = openRecoveryView;
window.showLoginView = showLoginView;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleUserLoginSubmit = handleUserLoginSubmit;
window.handleUserRegisterSubmit = handleUserRegisterSubmit;
window.handleRecoveryStep1 = handleRecoveryStep1;
window.handleRecoveryStep2 = handleRecoveryStep2;
window.handleRecoveryStep3 = handleRecoveryStep3;
window.resendRecoveryCode = resendRecoveryCode;
window.handleLogout = handleLogout;
window.filterByMyQuotes = filterByMyQuotes;
window.updateAuthHeaderUI = updateAuthHeaderUI;
window.handleUserPersonClick = handleUserPersonClick;
window.openUserProfileModal = openUserProfileModal;
window.closeUserProfileModal = closeUserProfileModal;
window.openUserProfileCleanModal = openUserProfileCleanModal;
window.toggleEditProfileMode = toggleEditProfileMode;
window.handleSaveUserProfile = handleSaveUserProfile;
window.toggleMyAccountDropdown = toggleMyAccountDropdown;
window.closeMyAccountDropdown = closeMyAccountDropdown;
window.openClientServicesModal = openClientServicesModal;
window.closeClientServicesModal = closeClientServicesModal;
window.openClientQuotesModal = openClientQuotesModal;
window.closeClientQuotesModal = closeClientQuotesModal;
window.openClientSupportModal = openClientSupportModal;
window.closeClientSupportModal = closeClientSupportModal;
window.openMobileMenu = window.openMobileMenu || function() {
  const d = document.getElementById('mobile-menu-drawer');
  if (d) { d.classList.remove('translate-x-full'); document.body.classList.add('overflow-hidden'); }
};
window.closeMobileMenu = window.closeMobileMenu || function() {
  const d = document.getElementById('mobile-menu-drawer');
  if (d) { d.classList.add('translate-x-full'); document.body.classList.remove('overflow-hidden'); }
};

// ============================================================================
// NAVEGACIÓN MÓVIL INFERIOR (BOTTOM NAVIGATION BAR - 5 ACCIONES ESTÁNDAR)
// ============================================================================
// ============================================================================
// SELECTOR VISUAL DE CATEGORÍAS ESTILO ALIBABA (DOS COLUMNAS WES)
// ============================================================================
var activeVisualCategoryTab = 'cat-redes'; // Categoría predeterminada al abrir
window.activeVisualCategoryTab = activeVisualCategoryTab;

function openMobileCategoriesModal(targetCatId = null) {
  const modal = document.getElementById('wes-categories-modal');
  const sheet = document.getElementById('wes-categories-sheet');
  if (!modal || !sheet) return;

  // Si nos indican categoría objetivo o usamos la activa en AppState
  if (targetCatId) {
    activeVisualCategoryTab = targetCatId;
  } else if (AppState.selectedCategory && AppState.selectedCategory !== 'all') {
    activeVisualCategoryTab = AppState.selectedCategory;
  }

  // Renderizar contenido de dos columnas
  renderVisualCategorySidebar();
  renderVisualCategoryContent();

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0');
    sheet.classList.remove('translate-y-full');
    sheet.classList.remove('sm:scale-95');
  });
}

function closeMobileCategoriesModal() {
  const modal = document.getElementById('wes-categories-modal');
  const sheet = document.getElementById('wes-categories-sheet');
  if (!modal || !sheet) return;

  sheet.classList.add('translate-y-full');
  sheet.classList.add('sm:scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 250);
}

function renderVisualCategorySidebar() {
  const sidebar = document.getElementById('wes-cat-sidebar');
  if (!sidebar) return;

  if (typeof CategoriesCatalog === 'undefined') return;

  const mainCats = CategoriesCatalog.getMainCategories();
  
  // Asegurar que activeVisualCategoryTab sea válido
  const exists = mainCats.some(c => c.id === activeVisualCategoryTab || c.slug === activeVisualCategoryTab);
  if (!exists && mainCats.length > 0) {
    activeVisualCategoryTab = mainCats[0].id;
  }

  sidebar.innerHTML = mainCats.map(cat => {
    const isSelected = (cat.id === activeVisualCategoryTab || cat.slug === activeVisualCategoryTab);
    const activeClass = isSelected 
      ? 'bg-white text-wes-blue font-extrabold border-l-[3px] border-wes-gold shadow-2xs' 
      : 'text-slate-600 hover:bg-slate-200/60 font-semibold border-l-[3px] border-transparent';

    return `
      <button type="button" onclick="switchVisualCategoryTab('${cat.id}')" class="w-full py-3 px-2 text-left transition flex flex-col items-center justify-center text-center ${activeClass}">
        <div class="w-7 h-7 rounded-lg ${isSelected ? 'bg-wes-blue text-white' : 'bg-slate-200/90 text-slate-500'} flex items-center justify-center shrink-0 mb-1 transition text-xs">
          <i class="fas ${cat.icono || 'fa-tag'}"></i>
        </div>
        <div class="text-[10px] sm:text-[11px] leading-tight line-clamp-2 px-0.5">
          ${cat.nombre}
        </div>
      </button>
    `;
  }).join('');
}

function switchVisualCategoryTab(catId) {
  activeVisualCategoryTab = catId;
  renderVisualCategorySidebar();
  renderVisualCategoryContent();
}
window.switchVisualCategoryTab = switchVisualCategoryTab;

function renderVisualCategoryContent() {
  const container = document.getElementById('wes-cat-content');
  if (!container || typeof CategoriesCatalog === 'undefined') return;

  const activeCat = CategoriesCatalog.getById(activeVisualCategoryTab) || CategoriesCatalog.getBySlug(activeVisualCategoryTab);
  if (!activeCat) return;

  const subcats = CategoriesCatalog.getSubcategories(activeCat.id);

  // Cuadrícula limpia directa: 3 columnas en pantallas estándar, 2 en pantallas estrechas
  container.innerHTML = `
    <div>
      <div class="grid grid-cols-2 xs:grid-cols-3 gap-y-5 gap-x-2 sm:gap-x-4">
        
        <!-- Opción 1: Ver todos (Categoría completa) -->
        <button type="button" onclick="selectVisualCategory('${activeCat.id}')" class="group flex flex-col items-center text-center active:scale-95 transition">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 hover:bg-amber-50 border border-slate-200 group-hover:border-wes-gold flex items-center justify-center mb-1.5 transition shadow-2xs">
            <div class="w-8 h-8 rounded-full bg-wes-blue text-wes-gold flex items-center justify-center text-xs sm:text-sm shadow-xs">
              <i class="fas fa-layer-group"></i>
            </div>
          </div>
          <div class="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-wes-blue leading-tight line-clamp-2 max-w-[90px]">
            Ver todos
          </div>
        </button>

        <!-- Subcategorías con imagen circular sobre fondo claro -->
        ${subcats.map(sub => {
          return `
            <button type="button" onclick="selectVisualSubcategory('${sub.id}')" class="group flex flex-col items-center text-center active:scale-95 transition">
              
              <!-- Imagen Circular Limpia sobre Fondo Claro -->
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 hover:bg-slate-50 border border-slate-200/90 group-hover:border-wes-blue p-2 flex items-center justify-center mb-1.5 transition overflow-hidden shadow-2xs group-hover:scale-105">
                <img src="${sub.imagen_url}" alt="${sub.nombre}" class="w-full h-full object-contain" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'fas ${sub.icono || 'fa-box'}\\' style=\\'font-size: 20px; color: #0D2A5C;\\'></i>'">
              </div>

              <!-- Nombre Corto Centrado Debajo (Sin contadores) -->
              <div class="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-wes-blue leading-tight line-clamp-2 max-w-[95px] px-0.5">
                ${sub.nombre}
              </div>

            </button>
          `;
        }).join('')}

      </div>
    </div>
  `;
}

function selectVisualCategory(catId) {
  closeMobileCategoriesModal();
  setTimeout(() => {
    if (catId === 'all') {
      clearCategoryFilter();
    } else {
      filterByCategory(catId, null);
    }
  }, 150);
}
window.selectVisualCategory = selectVisualCategory;

function selectVisualSubcategory(subcatId) {
  closeMobileCategoriesModal();
  setTimeout(() => {
    filterBySubcategory(subcatId);
  }, 150);
}
window.selectVisualSubcategory = selectVisualSubcategory;

function selectMobileCategory(categoryName) {
  // Retrocompatibilidad con accesos previos
  if (categoryName === 'all') {
    selectVisualCategory('all');
  } else if (categoryName === 'ofertas') {
    closeMobileCategoriesModal();
    setTimeout(() => {
      filterByCategory('ofertas');
    }, 150);
  } else {
    // Si coincide con alguna categoría del catálogo
    if (typeof CategoriesCatalog !== 'undefined') {
      const match = CategoriesCatalog.getMainCategories().find(c => c.nombre.toLowerCase().includes(categoryName.toLowerCase()) || categoryName.toLowerCase().includes(c.nombre.toLowerCase()));
      if (match) {
        selectVisualCategory(match.id);
        return;
      }
    }
    closeMobileCategoriesModal();
    setTimeout(() => {
      filterByCategory(categoryName);
    }, 150);
  }
}
window.selectMobileCategory = selectMobileCategory;

window.openMobileCategoriesModal = openMobileCategoriesModal;
window.closeMobileCategoriesModal = closeMobileCategoriesModal;

// ============================================================================
// MANEJADOR PRINCIPAL DE NAVEGACIÓN MÓVIL (BARRA INFERIOR)
// ============================================================================
function handleMobileNavAction(action) {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  if (typeof window.closeMyAccountDropdown === 'function') window.closeMyAccountDropdown();

  // Actualizar indicador visual de pestaña activa en los botones de la barra
  const navBtns = document.querySelectorAll('.mobile-bottom-nav-btn');
  navBtns.forEach(btn => {
    const isTarget = btn.getAttribute('data-nav') === action;
    if (isTarget) {
      btn.classList.add('text-wes-blue');
      btn.classList.remove('text-slate-500');
    } else {
      btn.classList.remove('text-wes-blue');
      btn.classList.add('text-slate-500');
    }
  });

  switch (action) {
    case 'inicio': {
      // Desplazamiento al tope / sección inicial
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      break;
    }

    case 'categorias': {
      // Abrir selector de categorías reales WES
      openMobileCategoriesModal();
      break;
    }

    case 'notificaciones': {
      // Buzón de mensajes y avisos privados del cliente
      const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
      if (user) {
        if (typeof window.openUserMessagesModal === 'function') {
          window.openUserMessagesModal();
        }
      } else {
        if (typeof window.openAuthModal === 'function') {
          window.openAuthModal('login');
        }
      }
      break;
    }

    case 'proyectos': {
      // Apertura condicional de proyectos en ejecución (solo técnicos y supervisores)
      const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
      const allowedRoles = ['tecnico_interno', 'tecnico_externo', 'administrador', 'propietario', 'gestor_soporte'];
      const userRole = user && user.role ? String(user.role).toLowerCase() : '';
      const isAuthorized = Boolean(user && (allowedRoles.includes(userRole) || user.isEmployee === true));

      if (isAuthorized) {
        if (typeof window.openInstallationProjectsModal === 'function') {
          window.openInstallationProjectsModal();
        }
      } else {
        if (typeof showToast === 'function') {
          showToast('Acceso restringido a personal técnico autorizado.', 'warning');
        }
        if (!user && typeof window.openAuthModal === 'function') {
          window.openAuthModal('login');
        }
      }
      break;
    }

    case 'ventas': {
      // Abrir catálogo comercial de productos y cotizaciones
      const storeSection = document.getElementById('tienda');
      if (storeSection) {
        storeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      break;
    }

    case 'perfil': {
      // Área privada del cliente (extremo derecho)
      const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
      if (user) {
        if (typeof window.openUserProfileCleanModal === 'function') {
          window.openUserProfileCleanModal();
        } else if (typeof window.openUserProfileModal === 'function') {
          window.openUserProfileModal();
        }
      } else {
        if (typeof window.openAuthModal === 'function') {
          window.openAuthModal('login');
        }
      }
      break;
    }

    default:
      console.warn('Acción de navegación móvil no reconocida:', action);
  }
}

window.handleMobileNavAction = handleMobileNavAction;




// ============================================================================
// SISTEMA DE BANDEJA DE MENSAJES Y NOTIFICACIONES DE USUARIO (HEADER)
// ============================================================================
const UserMessagesService = (function() {
  const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbyoN8TnzeN9Cg2X44YEt6KeQULahvG0DrEXP5m4HyLvJFs475maMjVrwjW8t-IRVIQ_OQ/exec';
  const READ_STORAGE_KEY = 'wes_read_message_ids';
  const PUSH_LOCAL_KEY = 'wes_push_subscription_active';
  let cachedMessages = [];

  function getReadIds() {
    try {
      return JSON.parse(localStorage.getItem(READ_STORAGE_KEY) || '[]');
    } catch(e) { return []; }
  }

  async function markAsRead(id) {
    if (!id) return;
    const reads = getReadIds();
    if (!reads.includes(id)) {
      reads.push(id);
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(reads));
    }
    updateBadge();
    renderMessages();

    // Sincronizar lectura con el servidor
    try {
      const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
      if (user && user.email) {
        fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'mark_message_read_user',
            messageId: id,
            userEmail: user.email
          })
        }).catch(() => {});
      }
    } catch(e) {}
  }

  async function fetchMessagesForUser() {
    if (typeof UserAuth === 'undefined') return [];
    const user = UserAuth.getCurrentUser();
    if (!user || !user.email) return [];

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'get_user_direct_messages',
          userEmail: user.email
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.messages)) {
          cachedMessages = data.messages;
          updateBadge();
          return data.messages;
        }
      }
    } catch(e) {
      console.warn('[UserMessages] Error al consultar mensajes:', e);
    }
    return cachedMessages;
  }

  function updateBadge() {
    const badge = document.getElementById('header-user-messages-badge');
    const dropdownBadge = document.getElementById('dropdown-messages-badge');
    const mobileBadge = document.getElementById('mobile-messages-badge');
    const bottomNavBadge = document.getElementById('mobile-bottom-notifications-badge');

    if (typeof UserAuth === 'undefined' || !UserAuth.getCurrentUser()) {
      if (badge) badge.classList.add('hidden');
      if (dropdownBadge) dropdownBadge.classList.add('hidden');
      if (mobileBadge) mobileBadge.classList.add('hidden');
      if (bottomNavBadge) bottomNavBadge.classList.add('hidden');
      return;
    }

    const readIds = getReadIds();
    const unreadCount = cachedMessages.filter(m => !readIds.includes(m.id)).length;
    const countText = unreadCount > 9 ? '9+' : String(unreadCount);

    [badge, dropdownBadge, mobileBadge, bottomNavBadge].forEach(b => {
      if (b) {
        if (unreadCount > 0) {
          b.textContent = countText;
          b.classList.remove('hidden');
        } else {
          b.classList.add('hidden');
        }
      }
    });
  }

  // Comprobar estado de notificaciones Push del navegador
  function checkPushSupport() {
    return ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window);
  }

  function isPushSubscribed() {
    return localStorage.getItem(PUSH_LOCAL_KEY) === 'true' && Notification.permission === 'granted';
  }

  function updatePushUI() {
    const profileBtn = document.getElementById('profile-push-toggle-btn');
    const profileText = document.getElementById('profile-push-btn-text');
    const profileHint = document.getElementById('profile-push-status-hint');
    const modalLabel = document.getElementById('user-messages-push-label');
    const modalBtn = document.getElementById('user-messages-push-btn');

    const supported = checkPushSupport();
    if (!supported) {
      if (profileText) profileText.textContent = 'Notificaciones no admitidas en este navegador';
      if (profileHint) profileHint.textContent = 'Tu navegador actual no admite Web Push. Puedes añadir la app a tu pantalla de inicio.';
      if (modalLabel) modalLabel.innerHTML = 'Notificaciones: <span class="text-slate-400">No admitidas</span>';
      if (modalBtn) modalBtn.classList.add('hidden');
      return;
    }

    const granted = Notification.permission === 'granted';
    const active = isPushSubscribed();

    if (granted && active) {
      if (profileBtn) {
        profileBtn.className = 'w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-xs';
      }
      if (profileText) profileText.innerHTML = '<i class="fas fa-check-circle text-emerald-600 mr-1"></i>Notificaciones Push Activas';
      if (profileHint) profileHint.textContent = 'Tu dispositivo recibirá avisos discretos cuando WES te envíe un mensaje.';
      if (modalLabel) modalLabel.innerHTML = 'Notificaciones: <strong class="text-emerald-700">Activadas en este equipo</strong>';
      if (modalBtn) {
        modalBtn.textContent = 'Desactivar';
        modalBtn.className = 'px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-rose-600 border border-slate-300 rounded-lg text-[10px] font-bold shrink-0 transition';
      }
    } else {
      if (profileBtn) {
        profileBtn.className = 'w-full py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-xs';
      }
      if (profileText) profileText.innerHTML = '<i class="fas fa-bell text-amber-500 mr-1"></i>Activar Notificaciones Push';
      if (profileHint) profileHint.textContent = 'Recibe avisos discretos de mensajes directos y cotizaciones en tu teléfono.';
      if (modalLabel) modalLabel.innerHTML = 'Notificaciones en este navegador: <span class="text-slate-500">Inactivas</span>';
      if (modalBtn) {
        modalBtn.textContent = 'Activar';
        modalBtn.className = 'px-2.5 py-1 bg-wes-blue hover:bg-wes-dark text-white border border-wes-blue rounded-lg text-[10px] font-bold shrink-0 transition shadow-xs';
      }
    }
  }

  async function togglePushSubscriptionFromProfile() {
    if (!checkPushSupport()) {
      alert('Tu navegador no es compatible con Notificaciones Web Push estándar. En iPhone asegúrate de tener la app añadida a la Pantalla de Inicio en iOS 16.4 o superior.');
      return;
    }

    const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
    if (!user || !user.email) {
      alert('Debes iniciar sesión con tu correo para vincular las notificaciones de este dispositivo.');
      return;
    }

    if (isPushSubscribed()) {
      // Desactivar
      const confirmDeact = confirm('¿Deseas dejar de recibir notificaciones push en este dispositivo?');
      if (!confirmDeact) return;

      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          const endpoint = sub.endpoint;
          await sub.unsubscribe();
          fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'remove_push_subscription',
              data: { endpoint }
            })
          }).catch(() => {});
        }
      } catch(e) {}
      localStorage.removeItem(PUSH_LOCAL_KEY);
      updatePushUI();
      if (window.showToast) window.showToast('Notificaciones push desactivadas en este dispositivo.', 'info');
      return;
    }

    // Explicación de finalidad previa al permiso del navegador
    const confirmAct = confirm('WES solicitará permiso para enviarte notificaciones push discretas cuando recibas mensajes de soporte o cotizaciones.\n\n¿Deseas activar las notificaciones ahora?');
    if (!confirmAct) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Has rechazado las notificaciones o están bloqueadas en tu navegador. Puedes habilitarlas en la configuración de permisos del sitio.');
        updatePushUI();
        return;
      }

      // Obtener Service Worker activo
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();

      if (!sub) {
        // Clave VAPID pública oficial estándar para WES
        const dummyKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
        try {
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(dummyKey)
          });
        } catch(subErr) {
          console.warn('[Push] Error con applicationServerKey, intentando suscripción nativa:', subErr);
          sub = await reg.pushManager.subscribe({ userVisibleOnly: true });
        }
      }

      if (sub) {
        const subJson = sub.toJSON();
        const payloadData = {
          endpoint: sub.endpoint,
          keys: subJson.keys || { p256dh: 'browser_p256dh', auth: 'browser_auth' },
          email: user.email,
          userId: user.id || '',
          userAgent: navigator.userAgent,
          deviceType: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
        };

        const res = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'save_push_subscription',
            data: payloadData
          })
        });

        localStorage.setItem(PUSH_LOCAL_KEY, 'true');
        updatePushUI();
        if (window.showToast) {
          window.showToast('¡Notificaciones activadas exitosamente en este dispositivo!', 'success');
        } else {
          alert('¡Notificaciones activadas con éxito!');
        }
      }
    } catch(err) {
      console.warn('[UserMessages] Error activando push:', err);
      // Guardar preferencia local y registrar dispositivo
      localStorage.setItem(PUSH_LOCAL_KEY, 'true');
      updatePushUI();
      if (window.showToast) window.showToast('Notificaciones registradas en tu navegador.', 'info');
    }
  }

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function renderMessages() {
    const list = document.getElementById('user-messages-list');
    const recipient = document.getElementById('user-messages-recipient');
    if (!list) return;

    updatePushUI();

    const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
    if (recipient) {
      recipient.textContent = user ? `Para: ${user.name} (${user.email})` : 'Mensajes de gerencia y soporte';
    }

    if (!user) {
      list.innerHTML = `
        <div class="p-8 text-center text-slate-500 text-xs space-y-3">
          <i class="fas fa-user-lock text-3xl text-slate-300 block"></i>
          <p class="font-bold text-slate-800">Inicia sesión para ver tus mensajes y notificaciones</p>
          <p class="text-[11px] text-slate-400">Aquí podrás leer comunicados oficiales, cotizaciones y respuestas enviadas a tu cuenta.</p>
          <button type="button" onclick="closeUserMessagesModal(); openAuthModal('login');" class="px-4 py-2 bg-wes-blue text-white rounded-xl font-bold text-xs shadow-md">
            Iniciar Sesión
          </button>
        </div>
      `;
      return;
    }

    if (cachedMessages.length === 0) {
      list.innerHTML = `
        <div class="p-8 text-center text-slate-400 text-xs">
          <i class="fas fa-envelope-open text-3xl mb-2 text-slate-300 block"></i>
          <span class="font-medium text-slate-600 block">No tienes mensajes pendientes</span>
          <span class="text-[11px] text-slate-400 mt-1 block">Cualquier respuesta o notificación de WES aparecerá aquí.</span>
        </div>
      `;
      return;
    }

    const readIds = getReadIds();
    list.innerHTML = cachedMessages.map(m => {
      const isUnread = !readIds.includes(m.id);
      return `
        <div class="p-4 bg-white rounded-2xl border ${isUnread ? 'border-amber-400 ring-2 ring-amber-300/30 shadow-md' : 'border-slate-200'} space-y-2.5 transition">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              ${isUnread ? '<span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" title="Mensaje no leído"></span>' : '<i class="fas fa-check-double text-emerald-500 text-xs" title="Mensaje leído"></i>'}
              <span class="font-bold text-xs text-slate-900">${escapeHtml(m.sender || 'Equipo WES')}</span>
              ${isUnread ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800">Nuevo</span>' : ''}
            </div>
            <span class="text-[10px] text-slate-400 font-mono">${escapeHtml(m.date || '')}</span>
          </div>

          <div class="text-xs font-bold text-wes-blue">${escapeHtml(m.subject || 'Notificación WES')}</div>
          <p class="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            ${escapeHtml(m.content || '')}
          </p>

          <div class="pt-1 flex items-center justify-between text-xs">
            ${isUnread ? `
              <button type="button" onclick="UserMessagesService.markAsRead('${m.id}')" class="text-[11px] text-slate-500 hover:text-wes-blue font-semibold flex items-center space-x-1">
                <i class="far fa-check-circle"></i>
                <span>Marcar como leído</span>
              </button>
            ` : `
              <span class="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                <i class="fas fa-check"></i>
                <span>Leído</span>
              </span>
            `}

            <button type="button" onclick="UserMessagesService.jumpToChat('${m.id}', '${escapeHtml(m.content || '').replace(/'/g, "\\'")}', '${escapeHtml(m.suggestedPrompt || 'Hola, deseo consultar sobre este mensaje.').replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-[#0D2A5C] hover:bg-[#071836] text-amber-300 font-extrabold text-[11px] rounded-xl flex items-center space-x-1 shadow-xs transition active:scale-95">
              <i class="fas fa-comments"></i>
              <span>Interactuar en el Chat</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function jumpToChat(id, contentText, suggestedPrompt) {
    markAsRead(id);
    closeUserMessagesModal();
    if (typeof window.openChatWithMessageContext === 'function') {
      window.openChatWithMessageContext(contentText, suggestedPrompt);
    } else if (typeof window.toggleClientChat === 'function') {
      window.toggleClientChat();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function init() {
    setTimeout(fetchMessagesForUser, 3000);
    setInterval(fetchMessagesForUser, 30000);
    window.addEventListener('wes_user_login', () => {
      fetchMessagesForUser();
      updatePushUI();
    });
    window.addEventListener('wes_user_logout', () => {
      // Al cerrar sesión, desvincular recepción privada del usuario anterior
      try {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(reg => {
            reg.pushManager.getSubscription().then(sub => {
              if (sub) {
                fetch(BACKEND_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                  body: JSON.stringify({
                    action: 'remove_push_subscription',
                    data: { endpoint: sub.endpoint }
                  })
                }).catch(() => {});
              }
            });
          });
        }
      } catch(e) {}
      cachedMessages = [];
      localStorage.removeItem(PUSH_LOCAL_KEY);
      updateBadge();
      updatePushUI();
    });

    // Detectar si la URL solicita abrir mensajes (?openMessages=true)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('openMessages') === 'true') {
        setTimeout(openUserMessagesModal, 800);
      }
    } catch(e) {}
  }

  return {
    init,
    fetchMessagesForUser,
    renderMessages,
    markAsRead,
    jumpToChat,
    togglePushSubscriptionFromProfile,
    updatePushUI
  };
})();
window.UserMessagesService = UserMessagesService;
window.openUserMessagesModal = openUserMessagesModal;
window.closeUserMessagesModal = closeUserMessagesModal;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', UserMessagesService.init);
} else {
  UserMessagesService.init();
}

// Función de sincronización y limpieza de caché para aplicaciones móviles PWA
function forceRefreshApp() {
  if (window.showToast) window.showToast('Actualizando aplicación móvil WES...', 'info');
  if ('caches' in window) {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(regs => {
            regs.forEach(r => r.unregister());
            setTimeout(() => { window.location.reload(true); }, 300);
          });
        } else {
          setTimeout(() => { window.location.reload(true); }, 300);
        }
      });
  } else {
    window.location.reload(true);
  }
}

// 6. HANDLERS PARA RECUPERACIÓN DE CONTRASEÑA Y ACCESO
async function handleRequestRecoveryCodeSubmit(e) {
  if (e) e.preventDefault();
  clearAuthAlerts();

  const emailInp = document.getElementById('auth-recovery-email');
  const btn = document.getElementById('btn-request-recovery-code');
  if (!emailInp) return;
  const email = emailInp.value.trim().toLowerCase();

  if (!email || !email.includes('@')) {
    showAuthAlert('auth-recovery-alert-box', 'Por favor ingresa un correo electrónico válido.', 'error');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Enviando código...';
  }

  try {
    const res = await UserAuth.requestPasswordReset(email);
    if (!res.success) {
      showAuthAlert('auth-recovery-alert-box', res.message || 'No se pudo enviar el código de recuperación.', 'error');
      return;
    }

    authRecoveryEmail = email;
    showAuthStep('recovery_verify');
    startRecoveryResendTimer(60);
    showToast(res.message || ('Código de recuperación enviado a ' + email), 'success');
  } catch (err) {
    console.error('[Auth] Error solicitando código de recuperación:', err);
    showAuthAlert('auth-recovery-alert-box', 'Error al conectar con el servidor de recuperación. Intenta nuevamente.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-key text-wes-gold mr-1"></i> Enviar código de recuperación';
    }
  }
}

function setupRecoveryOtpInputs() {
  const inputs = [
    document.getElementById('recovery-digit-1'),
    document.getElementById('recovery-digit-2'),
    document.getElementById('recovery-digit-3'),
    document.getElementById('recovery-digit-4'),
    document.getElementById('recovery-digit-5'),
    document.getElementById('recovery-digit-6')
  ].filter(Boolean);

  function checkAndAutoSubmitRecovery() {
    const fullCode = inputs.map(inp => (inp.value || '').trim()).join('');
    if (fullCode.length === 6) {
      setTimeout(() => {
        handleVerifyRecoveryCodeSubmit();
      }, 120);
    }
  }

  function applyDigitsToRecoveryInputs(digits) {
    if (!digits) return;
    const cleanDigits = String(digits).replace(/\D/g, '').slice(0, 6);
    if (!cleanDigits) return;

    for (let i = 0; i < 6; i++) {
      if (inputs[i]) {
        inputs[i].value = cleanDigits[i] || '';
      }
    }

    const lastIdx = Math.min(cleanDigits.length - 1, inputs.length - 1);
    if (inputs[lastIdx]) inputs[lastIdx].focus();

    if (cleanDigits.length === 6) {
      showToast('Código completado. Verificando...', 'info');
      checkAndAutoSubmitRecovery();
    }
  }

  inputs.forEach((input, index) => {
    input.value = '';

    input.oninput = () => {
      const val = input.value.replace(/\D/g, '');
      if (val.length > 1) {
        applyDigitsToRecoveryInputs(val);
        return;
      }
      input.value = val.slice(0, 1);
      if (val && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      checkAndAutoSubmitRecovery();
    };

    input.onkeydown = (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    };

    input.onpaste = (e) => {
      e.preventDefault();
      const rawText = (e.clipboardData || window.clipboardData)?.getData('text') || '';
      applyDigitsToRecoveryInputs(rawText);
    };
  });

  setTimeout(() => {
    if (inputs[0]) inputs[0].focus();
  }, 100);
}

async function handlePasteRecoveryOtp() {
  const inputs = [
    document.getElementById('recovery-digit-1'),
    document.getElementById('recovery-digit-2'),
    document.getElementById('recovery-digit-3'),
    document.getElementById('recovery-digit-4'),
    document.getElementById('recovery-digit-5'),
    document.getElementById('recovery-digit-6')
  ].filter(Boolean);

  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      const cleanDigits = text.replace(/\D/g, '').slice(0, 6);
      if (!cleanDigits) {
        showToast('No se encontraron números en el portapapeles. Copia el código desde tu correo.', 'warning');
        return;
      }

      for (let i = 0; i < 6; i++) {
        if (inputs[i]) inputs[i].value = cleanDigits[i] || '';
      }
      const lastInp = document.getElementById('recovery-digit-' + Math.min(cleanDigits.length, 6));
      if (lastInp) lastInp.focus();

      if (cleanDigits.length === 6) {
        showToast('Código de recuperación pegado. Verificando...', 'success');
        setTimeout(() => handleVerifyRecoveryCodeSubmit(), 120);
      }
    } else {
      showToast('Toca una casilla y selecciona Pegar.', 'info');
    }
  } catch (e) {
    showToast('Toca una casilla y selecciona Pegar.', 'info');
  }
}

async function handleVerifyRecoveryCodeSubmit(e) {
  if (e) e.preventDefault();
  clearAuthAlerts();

  const d1 = document.getElementById('recovery-digit-1')?.value || '';
  const d2 = document.getElementById('recovery-digit-2')?.value || '';
  const d3 = document.getElementById('recovery-digit-3')?.value || '';
  const d4 = document.getElementById('recovery-digit-4')?.value || '';
  const d5 = document.getElementById('recovery-digit-5')?.value || '';
  const d6 = document.getElementById('recovery-digit-6')?.value || '';
  const fullCode = (d1 + d2 + d3 + d4 + d5 + d6).trim();

  if (fullCode.length !== 6) {
    showAuthAlert('auth-recovery-verify-alert-box', 'Por favor ingresa los 6 dígitos completos del código.', 'warning');
    return;
  }

  const btn = document.getElementById('auth-recovery-verify-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Verificando...';
  }

  try {
    const res = await UserAuth.verifyPasswordResetOtp(authRecoveryEmail, fullCode, true);
    if (!res.success) {
      showAuthAlert('auth-recovery-verify-alert-box', res.message || 'Código incorrecto o expirado.', 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check-circle text-wes-gold mr-1"></i> Verificar código y recuperar acceso';
      }
      return;
    }

    // Acceso recuperado con éxito
    closeAuthModal();
    updateAuthHeaderUI();
    showToast(res.message || '¡Acceso a tu cuenta recuperado con éxito!', 'success');
  } catch (err) {
    console.error('[Auth] Error al verificar código de recuperación:', err);
    showAuthAlert('auth-recovery-verify-alert-box', 'Error al verificar el código de recuperación.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check-circle text-wes-gold mr-1"></i> Verificar código y recuperar acceso';
    }
  }
}

function startRecoveryResendTimer(seconds = 60) {
  authRecoveryCountdown = seconds;
  const resendBtn = document.getElementById('auth-recovery-resend-btn');
  if (!resendBtn) return;

  resendBtn.disabled = true;
  resendBtn.textContent = 'Reenviar en ' + authRecoveryCountdown + 's';

  if (authRecoveryResendTimer) clearInterval(authRecoveryResendTimer);
  authRecoveryResendTimer = setInterval(() => {
    authRecoveryCountdown--;
    if (authRecoveryCountdown <= 0) {
      clearInterval(authRecoveryResendTimer);
      authRecoveryResendTimer = null;
      resendBtn.disabled = false;
      resendBtn.textContent = 'Reenviar código';
    } else {
      resendBtn.textContent = 'Reenviar en ' + authRecoveryCountdown + 's';
    }
  }, 1000);
}

async function handleResendRecoveryCode() {
  if (authRecoveryCountdown > 0 || !authRecoveryEmail) return;
  const resendBtn = document.getElementById('auth-recovery-resend-btn');
  if (resendBtn) {
    resendBtn.disabled = true;
    resendBtn.textContent = 'Reenviando...';
  }

  try {
    const res = await UserAuth.requestPasswordReset(authRecoveryEmail);
    if (!res.success) {
      showAuthAlert('auth-recovery-verify-alert-box', res.message || 'No se pudo reenviar el código.', 'error');
      if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.textContent = 'Reenviar código';
      }
      return;
    }

    startRecoveryResendTimer(60);
    showToast(res.message || 'Nuevo código de recuperación enviado.', 'success');
  } catch (e) {
    showAuthAlert('auth-recovery-verify-alert-box', 'Error al solicitar nuevo código.', 'error');
    if (resendBtn) {
      resendBtn.disabled = false;
      resendBtn.textContent = 'Reenviar código';
    }
  }
}

// Compatibilidad con invocaciones antiguas
function handleRequestRecoveryCode() {
  handleRequestRecoveryCodeSubmit();
}
function handlePasswordRecoverySubmit(e) {
  handleVerifyRecoveryCodeSubmit(e);
}

window.handleRequestRecoveryCodeSubmit = handleRequestRecoveryCodeSubmit;
window.handleVerifyRecoveryCodeSubmit = handleVerifyRecoveryCodeSubmit;
window.handlePasteRecoveryOtp = handlePasteRecoveryOtp;
window.handleResendRecoveryCode = handleResendRecoveryCode;
window.handleRequestRecoveryCode = handleRequestRecoveryCode;
window.handlePasswordRecoverySubmit = handlePasswordRecoverySubmit;
window.getProductDirectUrl = getProductDirectUrl;
window.openProductDetailModal = openProductDetailModal;
window.closeProductDetailModal = closeProductDetailModal;
window.showProductNotFoundNotice = showProductNotFoundNotice;
window.goToCatalogFromNotice = goToCatalogFromNotice;
window.AppState = AppState;


// ============================================================================
// MÓDULO: PROYECTOS EN INSTALACIÓN (ODOO ERP KANBAN)
// ============================================================================
var odooProjectsCache = [];
var odooProjectsPollingInterval = null;
window.odooProjectsCache = odooProjectsCache;
window.odooProjectsPollingInterval = odooProjectsPollingInterval;

function sanitizeOdooDescriptionHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';
  let clean = rawHtml.trim();

  // Eliminar etiquetas potencialmente peligrosas
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/on\w+="[^"]*"/gi, '');
  clean = clean.replace(/on\w+='[^']*'/gi, '');
  clean = clean.replace(/javascript:[^"']*/gi, '');

  // Formatear listas de verificación de Odoo (.o_checklist) de modo visual inmutable
  clean = clean.replace(/<li([^>]*)\bclass="([^"]*o_checked[^"]*)"([^>]*)>([\s\S]*?)<\/li>/gi, function(match, pre, cls, post, inner) {
    return '<li class="flex items-start space-x-2 text-slate-800 my-1"><span class="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-2xs"><i class="fas fa-check"></i></span><span class="line-through text-slate-500 flex-1">' + inner + '</span></li>';
  });

  clean = clean.replace(/<li([^>]*)\bclass="([^"]*o_checklist[^"]*|[^"]*)"([^>]*)>([\s\S]*?)<\/li>/gi, function(match, pre, cls, post, inner) {
    if (match.includes('fa-check')) return match;
    return '<li class="flex items-start space-x-2 text-slate-700 my-1"><span class="w-4 h-4 rounded border border-slate-300 bg-white flex items-center justify-center text-[10px] shrink-0 mt-0.5"></span><span class="flex-1">' + inner + '</span></li>';
  });

  return clean;
}

async function openInstallationProjectsModal() {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  if (typeof closeMyAccountDropdown === 'function') closeMyAccountDropdown();

  const modal = document.getElementById('modal-proyectos-instalacion');
  if (!modal) return;

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.classList.add('overflow-hidden');

  // Iniciar temporizador de auto-actualización cada 60 segundos
  if (odooProjectsPollingInterval) {
    clearInterval(odooProjectsPollingInterval);
  }
  odooProjectsPollingInterval = setInterval(() => {
    loadInstallationProjects(true);
  }, 60000);

  await loadInstallationProjects(false);
}

function closeInstallationProjectsModal() {
  const modal = document.getElementById('modal-proyectos-instalacion');
  if (!modal) return;

  modal.classList.add('hidden');
  modal.style.display = 'none';
  document.body.classList.remove('overflow-hidden');
  document.body.style.overflow = '';

  if (odooProjectsPollingInterval) {
    clearInterval(odooProjectsPollingInterval);
    odooProjectsPollingInterval = null;
  }
}

async function loadInstallationProjects(silent = false) {
  const grid = document.getElementById('odoo-projects-cards-grid');
  const loading = document.getElementById('odoo-projects-loading');
  const empty = document.getElementById('odoo-projects-empty-state');
  const totalCountEl = document.getElementById('odoo-projects-total-count');
  const lastSyncEl = document.getElementById('odoo-projects-last-sync');
  const alertBox = document.getElementById('odoo-connection-alert');
  const alertText = document.getElementById('odoo-connection-alert-text');

  if (!silent) {
    if (loading) loading.classList.remove('hidden');
    if (grid) grid.innerHTML = '';
    if (empty) empty.classList.add('hidden');
  }

  try {
    const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
    const sessionToken = (user && user.sessionToken) || localStorage.getItem('wes_session_token') || '';
    const adminToken = localStorage.getItem('wes_admin_token') || '';
    const userEmail = (user && user.email) || (function(){
      try {
        const adminSession = JSON.parse(sessionStorage.getItem('wes_admin_session') || '{}');
        return adminSession.email || 'ing.lmlh@gmail.com';
      } catch(e) { return 'ing.lmlh@gmail.com'; }
    })();

    const apiUrl = getWesBackendUrl();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'get_odoo_installation_projects',
        userEmail: userEmail,
        sessionToken: sessionToken,
        adminToken: adminToken
      })
    });

    const data = await response.json();

    if (data.success && Array.isArray(data.projects)) {
      odooProjectsCache = data.projects;
      window.odooProjectsCache = data.projects;
      if (alertBox) alertBox.classList.add('hidden');
      if (totalCountEl) totalCountEl.textContent = data.projects.length;

      // Actualizar badges
      const pBadge1 = document.getElementById('dropdown-projects-badge');
      const pBadge2 = document.getElementById('mobile-tech-projects-badge');
      if (pBadge1) {
        pBadge1.textContent = data.projects.length;
        pBadge1.classList.toggle('hidden', data.projects.length === 0);
      }
      if (pBadge2) {
        pBadge2.textContent = data.projects.length;
        pBadge2.classList.toggle('hidden', data.projects.length === 0);
      }

      if (lastSyncEl) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        lastSyncEl.textContent = `${dateStr}, ${timeStr}`;
      }

      renderInstallationProjectsGrid(odooProjectsCache);
    } else {
      console.warn('[Odoo Projects Sync Warning]:', data.message);
      if (alertBox && alertText) {
        alertText.textContent = 'No fue posible actualizar la información desde Odoo: ' + (data.message || 'Error de conexión');
        alertBox.classList.remove('hidden');
      }
      // Si ya teníamos datos previos en caché, mantenerlos para no dejar en blanco
      if (odooProjectsCache.length > 0) {
        renderInstallationProjectsGrid(odooProjectsCache);
      } else {
        if (grid) grid.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
      }
    }
  } catch (err) {
    console.error('Error cargando proyectos de Odoo:', err);
    if (alertBox && alertText) {
      alertText.textContent = 'No fue posible conectar con el servidor para actualizar los proyectos. Se mantendrá el reintento automático.';
      alertBox.classList.remove('hidden');
    }
    if (odooProjectsCache.length > 0) {
      renderInstallationProjectsGrid(odooProjectsCache);
    } else {
      if (grid) grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
    }
  } finally {
    if (loading) loading.classList.add('hidden');
  }
}

function renderInstallationProjectsGrid(projects) {
  const grid = document.getElementById('odoo-projects-cards-grid');
  const empty = document.getElementById('odoo-projects-empty-state');
  if (!grid) return;

  grid.innerHTML = '';

  if (!projects || projects.length === 0) {
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');

  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-300 transition flex flex-col p-4 sm:p-5 relative overflow-hidden group space-y-3';

    // Barra de acento institucional
    const accent = document.createElement('div');
    accent.className = 'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wes-gold via-amber-500 to-wes-blue';
    card.appendChild(accent);

    // 1. Encabezado del proyecto
    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'space-y-1';
    
    const titleEl = document.createElement('h4');
    titleEl.className = 'text-xs sm:text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 tracking-tight group-hover:text-wes-blue transition';
    titleEl.textContent = p.name || 'Proyecto sin título';
    titleEl.title = p.name || '';
    headerWrapper.appendChild(titleEl);

    // 2. Cliente asociado
    const clientWrapper = document.createElement('div');
    clientWrapper.className = 'flex items-center space-x-1.5 text-xs text-slate-600 font-semibold';
    clientWrapper.innerHTML = '<i class="fas fa-user-tie text-[11px] text-amber-600 shrink-0"></i><span class="truncate">' + escapeHtml(p.client || 'Cliente no especificado') + '</span>';
    headerWrapper.appendChild(clientWrapper);

    card.appendChild(headerWrapper);

    // Separador sutil
    const sep = document.createElement('div');
    sep.className = 'border-t border-slate-100 pt-2';
    card.appendChild(sep);

    // 3. Descripción completa
    const descContainer = document.createElement('div');
    descContainer.className = 'flex-1 text-xs text-slate-700 leading-relaxed overflow-y-auto max-h-56 pr-1 custom-scrollbar';

    if (p.description && typeof p.description === 'string' && p.description.trim() !== '' && p.description !== 'false') {
      const sanitizedDesc = sanitizeOdooDescriptionHtml(p.description);
      descContainer.innerHTML = '<div class="prose prose-xs max-w-none text-slate-700 space-y-1.5 leading-relaxed">' + sanitizedDesc + '</div>';
    } else {
      descContainer.innerHTML = '<p class="text-slate-400 italic text-[11px] flex items-center space-x-1.5"><i class="fas fa-info-circle text-[10px]"></i><span>Sin descripción registrada</span></p>';
    }

    card.appendChild(descContainer);

    grid.appendChild(card);
  });
}

function handleInstallationProjectsSearch(rawQuery) {
  const cache = Array.isArray(window.odooProjectsCache) ? window.odooProjectsCache : (Array.isArray(odooProjectsCache) ? odooProjectsCache : []);
  const query = (rawQuery || '').toLowerCase().trim();
  if (!query) {
    renderInstallationProjectsGrid(cache);
    const countEl = document.getElementById('odoo-projects-total-count');
    if (countEl) countEl.textContent = cache.length;
    return;
  }

  const filtered = cache.filter(p => {
    const name = (p.name || '').toLowerCase();
    const client = (p.client || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    return name.includes(query) || client.includes(query) || desc.includes(query);
  });

  renderInstallationProjectsGrid(filtered);
  const countEl = document.getElementById('odoo-projects-total-count');
  if (countEl) countEl.textContent = filtered.length;
}

window.openInstallationProjectsModal = openInstallationProjectsModal;
window.closeInstallationProjectsModal = closeInstallationProjectsModal;
window.loadInstallationProjects = loadInstallationProjects;
window.handleInstallationProjectsSearch = handleInstallationProjectsSearch;
