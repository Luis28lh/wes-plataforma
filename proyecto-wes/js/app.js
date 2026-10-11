// ==========================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// Lógica Principal de la Aplicación Web (app.js)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Estado global de la aplicación
const AppState = {
  cart: [],
  selectedCategory: 'all',
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

  // Reaccionar a cambios de Feature Flags emitidos desde el portal administrativo
  window.addEventListener('wes_flags_changed', () => {
    applyFeatureFlags();
    renderProducts();
  });

  // Sincronización en segundo plano con Supabase si está disponible
  if (window.WesDB && window.WesDB.isConfigured()) {
    window.WesDB.getProducts().then(remoteProducts => {
      if (Array.isArray(remoteProducts) && remoteProducts.length >= 200) {
        StorageService.saveProducts(remoteProducts);
        renderProducts();
        if (typeof populateFilterOptions === 'function') {
          populateFilterOptions(remoteProducts);
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

// Función utilitaria para emparejar categorías tolerando sinónimos, slugs y títulos
function matchesCategoryFilter(product, selectedCat) {
  if (!selectedCat || selectedCat === 'all') return true;
  const sel = String(selectedCat).toLowerCase().trim();
  const cat = String(product.category || '').toLowerCase().trim();
  const catId = String(product.categoria_id || '').toLowerCase().trim();

  if (cat === sel || catId === sel) return true;

  // Cámaras / CCTV
  if (sel.includes('camara') || sel.includes('cctv')) {
    return cat.includes('camara') || cat.includes('cctv') || catId === 'camaras' || catId === 'grabadores';
  }
  // Acceso / Portones / Automatización
  if (sel.includes('acceso') && !sel.includes('accesorio')) {
    return (cat.includes('acceso') && !cat.includes('accesorio')) || catId === 'acceso' || catId === 'cerraduras' || catId === 'automatizacion';
  }
  // Energía / Baterías / Respaldo
  if (sel.includes('energia') || sel.includes('bateria') || sel.includes('respaldo')) {
    return cat.includes('energia') || cat.includes('bateria') || catId === 'energia';
  }
  // Accesorios / Cableado / Redes
  if (sel.includes('accesorio') || sel.includes('cable') || sel.includes('red')) {
    return cat.includes('accesorio') || cat.includes('cable') || cat.includes('red') || catId === 'cables' || catId === 'redes';
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
      matchCat = matchesCategoryFilter(product, AppState.selectedCategory);
    }

    const matchBrand = AppState.selectedBrand === 'all' || product.brand === AppState.selectedBrand;
    const matchAvail = AppState.selectedAvailability === 'all' || product.availability === AppState.selectedAvailability;
    const query = AppState.searchQuery.toLowerCase();
    const matchSearch = !query || 
      product.name.toLowerCase().includes(query) ||
      product.code.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);
    return matchCat && matchBrand && matchAvail && matchSearch;
  });

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
      <div onclick="openProductDetailModal('${product.id}')" class="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer hover:border-wes-blue/50">
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

function filterByCategory(categoryName, subFilter = null) {
  AppState.selectedCategory = categoryName;
  AppState.catalogVisibleCount = AppState.catalogPageSize || 24;
  if (subFilter) {
    AppState.offerSubFilter = subFilter;
  }
  
  const catSelect = document.getElementById('category-filter');
  if (catSelect) {
    const hasOption = Array.from(catSelect.options).some(o => o.value.toLowerCase() === categoryName.toLowerCase());
    if (hasOption) {
      catSelect.value = categoryName;
    } else {
      catSelect.value = (categoryName === 'ofertas') ? 'ofertas' : 'all';
    }
  }

  syncCategoryPillsUI(categoryName);
  renderProducts();

  const storeSection = document.getElementById('tienda');
  if (storeSection) {
    storeSection.scrollIntoView({ behavior: 'smooth' });
  }
}
window.filterByCategory = filterByCategory;

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

  const ticketData = {
    id: caseId,
    date: now,
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
    document.body.classList.remove('overflow-hidden');
  }
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

  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  const userProfileModal = document.getElementById('user-profile-modal');
  if (userProfileModal) {
    userProfileModal.addEventListener('click', (e) => {
      if (e.target === userProfileModal) closeUserProfileModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuthModal();
      closeUserProfileModal();
      closeConfirmationModal();
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

  // 4. Manual de Instalación
  const manualFeat = (product.features || []).find(f => typeof f === 'string' && f.startsWith('manual_url:'));
  let manualUrl = product.manualUrl || product.manual_url || (manualFeat ? manualFeat.replace('manual_url:', '') : null);
  const manualBtn = document.getElementById('detail-download-manual-btn');
  if (manualBtn) {
    if (manualUrl) {
      manualBtn.href = manualUrl;
      manualBtn.classList.remove('hidden');
    } else {
      manualBtn.href = '#';
      manualBtn.classList.add('hidden');
    }
  }

  // Consulta asíncrona de manual en base de datos si existe registro oficial
  if (window.WesDB && typeof window.WesDB.getManual === 'function') {
    window.WesDB.getManual(product.id, product.code || product.codigo).then(dbManual => {
      if (dbManual && dbManual.archivo_url && manualBtn) {
        manualBtn.href = dbManual.archivo_url;
        manualBtn.classList.remove('hidden');
      }
    }).catch(() => {});
  }

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
        btn.className = 'px-4 py-2 font-bold text-xs rounded-xl transition bg-wes-blue text-white shadow-sm';
        content.classList.remove('hidden');
      } else {
        btn.className = 'px-4 py-2 font-bold text-xs rounded-xl transition text-slate-600 hover:bg-slate-100';
        content.classList.add('hidden');
      }
    }
  });
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
      return false;
    }
  } catch (err) {
    console.warn('[WesApp] Error procesando enlace directo de producto:', err);
    return false;
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
let recoveryDemoCode = '';

function openAuthModal(tab = 'login') {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  if (typeof closeUserProfileModal === 'function') closeUserProfileModal();

  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  switchAuthTab(tab);
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
}

function switchAuthTab(tab) {
  const tabLoginBtn = document.getElementById('auth-tab-btn-login');
  const tabRegisterBtn = document.getElementById('auth-tab-btn-register');
  const contentLogin = document.getElementById('auth-content-login');
  const contentRegister = document.getElementById('auth-content-register');
  const contentRecovery = document.getElementById('auth-content-recovery');
  const tabsBar = document.getElementById('auth-tabs-bar');
  const title = document.getElementById('auth-modal-title');
  const subtitle = document.getElementById('auth-modal-subtitle');

  if (tabsBar) tabsBar.classList.remove('hidden');
  if (contentRecovery) contentRecovery.classList.add('hidden');
  clearAuthAlerts();

  if (tab === 'login') {
    if (contentLogin) contentLogin.classList.remove('hidden');
    if (contentRegister) contentRegister.classList.add('hidden');
    if (tabLoginBtn) {
      tabLoginBtn.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-white text-wes-blue shadow-sm';
    }
    if (tabRegisterBtn) {
      tabRegisterBtn.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-500 hover:text-slate-800';
    }
    if (title) title.textContent = 'Iniciar Sesión';
    if (subtitle) subtitle.textContent = 'Acceso unificado para Empleados y Clientes';
    setTimeout(() => {
      const input = document.getElementById('login-identifier');
      if (input) input.focus();
    }, 150);
  } else {
    if (contentLogin) contentLogin.classList.add('hidden');
    if (contentRegister) contentRegister.classList.remove('hidden');
    if (tabRegisterBtn) {
      tabRegisterBtn.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-white text-wes-blue shadow-sm';
    }
    if (tabLoginBtn) {
      tabLoginBtn.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-500 hover:text-slate-800';
    }
    if (title) title.textContent = 'Crear Cuenta WES';
    if (subtitle) subtitle.textContent = 'Registro opcional para Clientes';
    setupPhoneInputsMask();
    setTimeout(() => {
      const input = document.getElementById('register-name');
      if (input) input.focus();
    }, 150);
  }
}

function openRecoveryView() {
  recoveryMode = 'recovery';
  recoveryCurrentName = '';
  const tabsBar = document.getElementById('auth-tabs-bar');
  const contentLogin = document.getElementById('auth-content-login');
  const contentRegister = document.getElementById('auth-content-register');
  const contentRecovery = document.getElementById('auth-content-recovery');
  const title = document.getElementById('auth-modal-title');
  const subtitle = document.getElementById('auth-modal-subtitle');

  if (tabsBar) tabsBar.classList.add('hidden');
  if (contentLogin) contentLogin.classList.add('hidden');
  if (contentRegister) contentRegister.classList.add('hidden');
  if (contentRecovery) contentRecovery.classList.remove('hidden');

  if (title) title.textContent = 'Recuperar Contraseña';
  if (subtitle) subtitle.textContent = 'Código de seguridad de 4 dígitos por correo';

  showRecoveryStep(1);
  clearAuthAlerts();

  setTimeout(() => {
    const input = document.getElementById('recovery-email');
    if (input) {
      const loginId = document.getElementById('login-identifier');
      if (loginId && loginId.value && loginId.value.includes('@')) {
        input.value = loginId.value.trim();
      }
      input.focus();
    }
  }, 150);
}

function showLoginView() {
  switchAuthTab('login');
}

function showRecoveryStep(stepNum) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`recovery-step-${i}`);
    if (el) {
      if (i === stepNum) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  if (btn) {
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isPass ? 'fas fa-eye-slash text-xs text-wes-blue' : 'fas fa-eye text-xs';
    }
  }
}

function clearAuthAlerts() {
  ['login-alert-box', 'register-alert-box', 'recovery-alert-box-1', 'recovery-alert-box-2', 'recovery-alert-box-3'].forEach(id => {
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

// HANDLER DE LOGIN
function handleUserLoginSubmit(e) {
  e.preventDefault();
  clearAuthAlerts();

  const idInput = document.getElementById('login-identifier');
  const passInput = document.getElementById('login-password');
  const remInput = document.getElementById('login-remember');
  const submitBtn = document.getElementById('login-submit-btn');

  if (!idInput || !passInput) return;

  const identifier = idInput.value.trim();
  const password = passInput.value;
  const remember = remInput ? remInput.checked : true;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Iniciando sesión...';
  }

  setTimeout(() => {
    try {
      const res = UserAuth.login(identifier, password, remember);

      if (!res.success) {
        showAuthAlert('login-alert-box', res.message, 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-1"></i> Iniciar Sesión';
        }
        return;
      }

      closeAuthModal();
      updateAuthHeaderUI();
      showToast(res.message, 'success');

      if (res.user && res.user.isEmployee) {
        setTimeout(() => {
          showConfirmationModal({
            title: `¡Hola, ${res.user.name}!`,
            code: res.user.role.toUpperCase(),
            message: `
              <div class="space-y-3">
                <p class="text-xs text-slate-600">Has iniciado sesión con credenciales de <strong>Personal WES</strong> (${res.user.roleLabel}).</p>
                <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  Puedes seguir navegando en la tienda o dirigirte a la consola de administración corporativa.
                </div>
                <div class="pt-2 flex flex-col sm:flex-row gap-2">
                  <a href="admin.html" class="flex-1 py-2.5 bg-wes-blue text-white rounded-xl text-center text-xs font-bold hover:bg-wes-dark shadow transition flex items-center justify-center space-x-1.5">
                    <i class="fas fa-shield-alt text-wes-gold"></i>
                    <span>Ir al Panel Admin</span>
                  </a>
                  <button onclick="closeConfirmationModal()" class="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-center text-xs font-bold hover:bg-slate-200 transition">
                    Permanecer en Tienda
                  </button>
                </div>
              </div>
            `,
            type: 'login'
          });
        }, 500);
      }
    } catch (err) {
      console.error(err);
      showAuthAlert('login-alert-box', 'Error al procesar el inicio de sesión.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-1"></i> Iniciar Sesión';
      }
    }
  }, 350);
}

// HANDLER DE REGISTRO DE CLIENTE (SOLO NOMBRE Y CORREO)
async function handleUserRegisterSubmit(e) {
  e.preventDefault();
  clearAuthAlerts();

  const nameInput = document.getElementById('register-name');
  const emailInput = document.getElementById('register-email');
  const submitBtn = document.getElementById('register-submit-btn');

  if (!nameInput || !emailInput) return;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Enviando código de 4 dígitos...';
  }

  try {
    const res = await UserAuth.requestRegistrationOtp(name, email);

    if (!res.success) {
      showAuthAlert('register-alert-box', res.message, 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane text-xs mr-1"></i> Continuar con Código de 4 Dígitos';
      }
      return;
    }

    recoveryCurrentEmail = email;
    recoveryCurrentName = name;
    recoveryMode = 'registration';
    recoveryDemoCode = res.codeDemo || '';

    // Cambiar vista a ingreso de código OTP
    const tabsBar = document.getElementById('auth-tabs-bar');
    const contentLogin = document.getElementById('auth-content-login');
    const contentRegister = document.getElementById('auth-content-register');
    const contentRecovery = document.getElementById('auth-content-recovery');
    const title = document.getElementById('auth-modal-title');
    const subtitle = document.getElementById('auth-modal-subtitle');

    if (tabsBar) tabsBar.classList.add('hidden');
    if (contentLogin) contentLogin.classList.add('hidden');
    if (contentRegister) contentRegister.classList.add('hidden');
    if (contentRecovery) contentRecovery.classList.remove('hidden');

    if (title) title.textContent = 'Configurar Contraseña';
    if (subtitle) subtitle.textContent = 'Código de seguridad de 4 dígitos enviado por correo';

    const displayEmail = document.getElementById('recovery-target-email-display');
    if (displayEmail) displayEmail.textContent = email;

    const demoBanner = document.getElementById('recovery-demo-code-banner');
    const demoVal = document.getElementById('recovery-demo-code-val');
    if (demoBanner && demoVal && res.codeDemo) {
      demoVal.textContent = res.codeDemo;
      demoBanner.classList.remove('hidden');
    }

    showRecoveryStep(2);
    setupOtpInputs();
    showToast(`Código de 4 dígitos enviado a ${email}`, 'info');

  } catch (err) {
    console.error(err);
    showAuthAlert('register-alert-box', 'Error al procesar el registro.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane text-xs mr-1"></i> Continuar con Código de 4 Dígitos';
    }
  }
}

// RECUPERACIÓN - PASO 1 (SOLICITAR CÓDIGO)
async function handleRecoveryStep1(e) {
  e.preventDefault();
  clearAuthAlerts();

  const emailInput = document.getElementById('recovery-email');
  const btn = document.getElementById('btn-send-code');
  if (!emailInput) return;

  const email = emailInput.value.trim().toLowerCase();
  recoveryCurrentEmail = email;

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Enviando código...';
  }

  try {
    const res = await UserAuth.requestPasswordReset(email);

    if (!res.success) {
      showAuthAlert('recovery-alert-box-1', res.message, 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane mr-1"></i> Enviar Código de 4 Dígitos';
      }
      return;
    }

    recoveryDemoCode = res.codeDemo || '';

    const displayEmail = document.getElementById('recovery-target-email-display');
    if (displayEmail) displayEmail.textContent = email;

    const demoBanner = document.getElementById('recovery-demo-code-banner');
    const demoVal = document.getElementById('recovery-demo-code-val');
    if (demoBanner && demoVal && res.codeDemo) {
      demoVal.textContent = res.codeDemo;
      demoBanner.classList.remove('hidden');
    }

    showRecoveryStep(2);
    setupOtpInputs();
    showToast(`Código de 4 dígitos enviado a ${email}`, 'info');

  } catch (err) {
    showAuthAlert('recovery-alert-box-1', 'Ocurrió un error al enviar el código.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane mr-1"></i> Enviar Código de 4 Dígitos';
    }
  }
}

// SETUP DE LAS 4 CAJAS NUMÉRICAS OTP
function setupOtpInputs() {
  const inputs = [
    document.getElementById('otp-digit-1'),
    document.getElementById('otp-digit-2'),
    document.getElementById('otp-digit-3'),
    document.getElementById('otp-digit-4')
  ].filter(Boolean);

  inputs.forEach((input, index) => {
    input.value = '';
    
    input.oninput = (e) => {
      const val = input.value.replace(/\D/g, '');
      input.value = val.slice(0, 1);
      if (val && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    };

    input.onkeydown = (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    };

    input.onpaste = (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 4);
      for (let i = 0; i < paste.length; i++) {
        if (inputs[i]) inputs[i].value = paste[i];
      }
      if (paste.length === 4) {
        inputs[3].focus();
      }
    };
  });

  if (inputs[0]) inputs[0].focus();
}

// RECUPERACIÓN - PASO 2 (VERIFICAR CÓDIGO)
function handleRecoveryStep2(e) {
  e.preventDefault();
  clearAuthAlerts();

  const d1 = document.getElementById('otp-digit-1')?.value || '';
  const d2 = document.getElementById('otp-digit-2')?.value || '';
  const d3 = document.getElementById('otp-digit-3')?.value || '';
  const d4 = document.getElementById('otp-digit-4')?.value || '';
  const fullCode = `${d1}${d2}${d3}${d4}`.trim();

  if (fullCode.length !== 4) {
    showAuthAlert('recovery-alert-box-2', 'Por favor ingresa los 4 dígitos del código.', 'warning');
    return;
  }

  const res = UserAuth.verifyResetCode(recoveryCurrentEmail, fullCode);
  if (!res.success) {
    showAuthAlert('recovery-alert-box-2', res.message, 'error');
    return;
  }

  showRecoveryStep(3);
  setTimeout(() => {
    const input = document.getElementById('new-password');
    if (input) input.focus();
  }, 150);
}

async function resendRecoveryCode() {
  if (!recoveryCurrentEmail) return;
  showToast('Reenviando nuevo código de 4 dígitos...', 'info');
  let res;
  if (recoveryMode === 'registration') {
    res = await UserAuth.requestRegistrationOtp(recoveryCurrentName || 'Cliente', recoveryCurrentEmail);
  } else {
    res = await UserAuth.requestPasswordReset(recoveryCurrentEmail);
  }
  if (res && res.success && res.codeDemo) {
    recoveryDemoCode = res.codeDemo;
    const demoVal = document.getElementById('recovery-demo-code-val');
    if (demoVal) demoVal.textContent = res.codeDemo;
    showToast(`Nuevo código enviado: ${res.codeDemo}`, 'success');
  }
}

// RECUPERACIÓN / CONFIGURACIÓN - PASO 3 (GUARDAR CONTRASEÑA)
function handleRecoveryStep3(e) {
  e.preventDefault();
  clearAuthAlerts();

  const newPass = document.getElementById('new-password')?.value || '';
  const confirmPass = document.getElementById('confirm-new-password')?.value || '';
  const d1 = document.getElementById('otp-digit-1')?.value || '';
  const d2 = document.getElementById('otp-digit-2')?.value || '';
  const d3 = document.getElementById('otp-digit-3')?.value || '';
  const d4 = document.getElementById('otp-digit-4')?.value || '';
  const fullCode = `${d1}${d2}${d3}${d4}`.trim();

  let res;
  if (recoveryMode === 'registration') {
    res = UserAuth.completeRegistration(recoveryCurrentEmail, fullCode, newPass, confirmPass);
  } else {
    res = UserAuth.resetPassword(recoveryCurrentEmail, fullCode, newPass, confirmPass);
  }

  if (!res.success) {
    showAuthAlert('recovery-alert-box-3', res.message, 'error');
    return;
  }

  updateAuthHeaderUI();

  // Personalizar paso 4 según si fue registro o recuperación
  const step4Title = document.getElementById('recovery-step4-title');
  const step4Desc = document.getElementById('recovery-step4-desc');
  const step4Btn = document.getElementById('recovery-step4-btn');

  if (recoveryMode === 'registration') {
    if (step4Title) step4Title.textContent = '¡Cuenta Creada Exitosamente!';
    if (step4Desc) step4Desc.textContent = `Tu contraseña ha sido configurada y tu sesión está iniciada como Cliente WES. ¡Bienvenido/a, ${recoveryCurrentName || ''}!`;
    if (step4Btn) {
      step4Btn.textContent = 'Empezar a Explorar la Tienda';
      step4Btn.onclick = () => closeAuthModal();
    }
    showToast(`¡Bienvenido/a a WES, ${recoveryCurrentName || 'Cliente'}!`, 'success');
  } else {
    if (step4Title) step4Title.textContent = '¡Contraseña Actualizada!';
    if (step4Desc) step4Desc.textContent = 'Tu clave ha sido reconfigurada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.';
    if (step4Btn) {
      step4Btn.textContent = 'Iniciar Sesión Ahora';
      step4Btn.onclick = () => showLoginView();
    }
  }

  showRecoveryStep(4);
}

// ----------------------------------------------------------------------------
// CONTROLADOR DEL ICONO DE LA PERSONA Y MODAL DE PERFIL
// ----------------------------------------------------------------------------
function handleUserPersonClick() {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();

  if (typeof UserAuth !== 'undefined' && UserAuth.isAuthenticated()) {
    // Si la sesión YA ESTÁ INICIADA -> Mostrar modal con todos los datos de esa persona
    openUserProfileModal();
  } else {
    // Si NO está iniciada la sesión -> Mandar la inicialización (abrir modal de login)
    openAuthModal('login');
  }
}

function openUserProfileModal() {
  if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  if (typeof closeAuthModal === 'function') closeAuthModal();

  const modal = document.getElementById('user-profile-modal');
  if (!modal) return;

  const user = typeof UserAuth !== 'undefined' ? UserAuth.getCurrentUser() : null;
  if (!user) {
    openAuthModal('login');
    return;
  }

  const initials = (user.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const avatarEl = document.getElementById('profile-modal-avatar');
  const nameEl = document.getElementById('profile-modal-name');
  const roleEl = document.getElementById('profile-modal-role');
  const emailEl = document.getElementById('profile-modal-email');
  const phoneEl = document.getElementById('profile-modal-phone');
  const adminBtn = document.getElementById('profile-modal-admin-btn');
  const quotesBtn = document.getElementById('profile-modal-quotes-btn');

  if (avatarEl) avatarEl.textContent = initials;
  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (phoneEl) phoneEl.textContent = user.phone || 'No registrado';

  if (roleEl) {
    roleEl.textContent = user.roleLabel || (user.isEmployee ? 'Personal WES' : 'Cliente WES');
    roleEl.className = user.isEmployee 
      ? 'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-wes-blue text-wes-gold border border-wes-gold/50 shadow-sm'
      : 'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-wes-gold text-wes-dark shadow-sm';
  }

  if (adminBtn) {
    if (user.isEmployee) adminBtn.classList.remove('hidden');
    else adminBtn.classList.add('hidden');
  }

  if (quotesBtn) {
    if (user.isEmployee) quotesBtn.classList.add('hidden');
    else quotesBtn.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.classList.add('overflow-hidden');
}

function closeUserProfileModal() {
  const modal = document.getElementById('user-profile-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.style.display = 'none';
  document.body.classList.remove('overflow-hidden');
}

// ----------------------------------------------------------------------------
// SINCRONIZACIÓN DE INTERFAZ DEL HEADER (ICONO DE PERSONA LIMPIO)
// ----------------------------------------------------------------------------
function updateAuthHeaderUI() {
  const isAuth = typeof UserAuth !== 'undefined' && UserAuth.isAuthenticated();
  const user = isAuth ? UserAuth.getCurrentUser() : null;

  const personBtn = document.getElementById('auth-person-btn');
  const iconLoggedOut = document.getElementById('auth-person-icon-loggedout');
  const iconLoggedIn = document.getElementById('auth-person-icon-loggedin');
  const initialsEl = document.getElementById('auth-person-initials');

  const mobLoginBtn = document.getElementById('mobile-login-btn');
  const mobLoggedContainer = document.getElementById('mobile-logged-container');
  const mobAvatar = document.getElementById('mobile-user-avatar');
  const mobName = document.getElementById('mobile-user-name');
  const mobRole = document.getElementById('mobile-user-role');
  const mobAdminLink = document.getElementById('mobile-admin-link');

  if (isAuth && user) {
    const initials = (user.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    // Actualizar icono en la barra principal
    if (iconLoggedOut) iconLoggedOut.classList.add('hidden');
    if (iconLoggedIn) iconLoggedIn.classList.remove('hidden');
    if (initialsEl) initialsEl.textContent = initials;
    if (personBtn) personBtn.title = `Mi Cuenta: ${user.name} (${user.roleLabel || 'Activa'})`;

    // Drawer Móvil
    if (mobLoginBtn) mobLoginBtn.classList.add('hidden');
    if (mobLoggedContainer) mobLoggedContainer.classList.remove('hidden');
    if (mobAvatar) mobAvatar.textContent = initials;
    if (mobName) mobName.textContent = user.name;
    if (mobRole) mobRole.textContent = user.roleLabel || 'Cliente WES';
    if (mobAdminLink) {
      if (user.isEmployee) mobAdminLink.classList.remove('hidden');
      else mobAdminLink.classList.add('hidden');
    }
  } else {
    // No autenticado
    if (iconLoggedOut) iconLoggedOut.classList.remove('hidden');
    if (iconLoggedIn) iconLoggedIn.classList.add('hidden');
    if (personBtn) personBtn.title = 'Iniciar Sesión / Mi Cuenta';

    if (mobLoginBtn) mobLoginBtn.classList.remove('hidden');
    if (mobLoggedContainer) mobLoggedContainer.classList.add('hidden');
  }
}

function handleLogout() {
  if (typeof UserAuth !== 'undefined') {
    UserAuth.logout();
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
window.openMobileMenu = window.openMobileMenu || function() {
  const d = document.getElementById('mobile-menu-drawer');
  if (d) { d.classList.remove('translate-x-full'); document.body.classList.add('overflow-hidden'); }
};
window.closeMobileMenu = window.closeMobileMenu || function() {
  const d = document.getElementById('mobile-menu-drawer');
  if (d) { d.classList.add('translate-x-full'); document.body.classList.remove('overflow-hidden'); }
};



