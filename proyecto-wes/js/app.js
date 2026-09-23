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
  supportImages: [],
  settings: StorageService.getCompanySettings(),
  backendUrl: localStorage.getItem('wes_backend_url') || ''
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
  checkCookieConsent();

  // Reaccionar a cambios de Feature Flags emitidos desde el portal administrativo
  window.addEventListener('wes_flags_changed', () => {
    applyFeatureFlags();
    renderProducts();
  });
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

  const wesCoords = [19.3877255, -70.531041]; // Autopista Ramón Cáceres, Plaza Megatone, Moca

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
        Autopista Ramón Cáceres, Plaza Megatone, Moca, Rep. Dominicana.
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

// 2. Renderizar catálogo de productos
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const flags = window.FeatureFlags ? window.FeatureFlags.getFlags() : {
    showPrices: true,
    enableQuotes: true,
    hideOutOfStock: false
  };

  let allProducts = StorageService.getProducts().filter(p => p.active !== false);

  // Filtrar si la categoría está activa en Feature Flags
  if (window.FeatureFlags) {
    allProducts = allProducts.filter(p => FeatureFlags.isCategoryActive(p.category));
  }

  // Filtrar productos sin stock inmediato si está encendido el toggle
  if (flags.hideOutOfStock) {
    allProducts = allProducts.filter(p => p.availability === 'Disponible');
  }
  
  // Extraer categorías y marcas únicas para poblar los filtros dinámicamente
  populateFilterOptions(allProducts);

  // Filtrado
  let filtered = allProducts.filter(product => {
    const matchCat = AppState.selectedCategory === 'all' || product.category === AppState.selectedCategory;
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
    return;
  }

  container.innerHTML = filtered.map(product => {
    const isAvail = product.availability === 'Disponible';
    const availClass = isAvail ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800';
    const waUrl = `https://wa.me/${AppState.settings.whatsapp}?text=${encodeURIComponent(`Hola WES, deseo consultar disponibilidad y precio sobre: ${product.name} (Código: ${product.code})`)}`;

    const priceHtml = flags.showPrices
      ? `RD$ ${(product.price || 0).toLocaleString()}`
      : `<span class="text-xs text-slate-500 font-bold italic">Consultar precio</span>`;

    const quoteBtnHtml = flags.enableQuotes
      ? `
        <button onclick="addToQuote('${product.id}')" title="Agregar a cotización" class="px-3.5 h-10 rounded-xl bg-wes-blue text-white hover:bg-wes-dark flex items-center space-x-1.5 text-xs font-semibold transition shadow-md hover:shadow-wes-blue/20">
          <i class="fas fa-cart-plus"></i>
          <span class="hidden sm:inline">Cotizar</span>
        </button>
      `
      : `
        <a href="${waUrl}" target="_blank" title="Consultar por WhatsApp" class="px-3.5 h-10 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center space-x-1 text-xs font-semibold transition">
          <span>Consultar</span>
        </a>
      `;

    const manualFeat = (product.features || []).find(f => typeof f === 'string' && f.startsWith('manual_url:'));
    const manualUrl = product.manualUrl || (manualFeat ? manualFeat.replace('manual_url:', '') : null);

    const visibleFeatures = (product.features || []).filter(f => typeof f === 'string' && !f.startsWith('manual_url:'));

    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
        <div class="relative h-56 bg-white flex items-center justify-center p-3 border-b border-slate-100 overflow-hidden">
          <img src="${product.image}" alt="${product.name}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500" loading="lazy">
          <span class="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${availClass} backdrop-blur-sm shadow-sm">
            ${product.availability}
          </span>
          <span class="absolute top-3 right-3 text-xs font-bold px-2 py-1 bg-slate-900/80 text-white rounded-md shadow-sm">
            ${product.brand}
          </span>
        </div>
        
        <div class="p-5 flex-1 flex flex-col">
          <div class="text-xs font-mono text-slate-500 mb-1 font-semibold">${product.code}</div>
          <h3 class="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-wes-blue transition">
            ${product.name}
          </h3>
          <p class="text-xs text-slate-600 mt-2 line-clamp-2">${product.description}</p>
          
          <div class="mt-3 pt-3 border-t border-slate-100 space-y-1">
            ${visibleFeatures.slice(0, 3).map(feat => `
              <div class="flex items-start text-xs text-slate-600">
                <i class="fas fa-check text-wes-gold mr-1.5 mt-0.5 text-[10px]"></i>
                <span class="line-clamp-1">${feat}</span>
              </div>
            `).join('')}
          </div>

          ${manualUrl ? `
            <div class="mt-3">
              <a href="${manualUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition">
                <i class="fas fa-file-pdf text-red-600"></i>
                <span>Descargar Manual Técnico (PDF)</span>
              </a>
            </div>
          ` : ''}

          <div class="mt-auto pt-4 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 block font-medium">Precio Ref:</span>
              <span class="text-lg font-bold text-wes-blue">
                ${priceHtml}
              </span>
            </div>
            
            <div class="flex space-x-2">
              <a href="${waUrl}" target="_blank" title="Consultar por WhatsApp" class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition shadow-sm">
                <i class="fab fa-whatsapp text-lg"></i>
              </a>
              ${quoteBtnHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function populateFilterOptions(products) {
  const catSelect = document.getElementById('category-filter');
  const brandSelect = document.getElementById('brand-filter');

  if (catSelect && catSelect.children.length <= 1) {
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      catSelect.appendChild(opt);
    });
  }

  if (brandSelect && brandSelect.children.length <= 1) {
    const brands = [...new Set(products.map(p => p.brand))];
    brands.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      brandSelect.appendChild(opt);
    });
  }
}

function resetProductFilters() {
  AppState.selectedCategory = 'all';
  AppState.selectedBrand = 'all';
  AppState.selectedAvailability = 'all';
  AppState.searchQuery = '';
  AppState.sortBy = 'featured';

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

  renderProducts();
}

// 3. Sistema de Carrito / Lista de Cotización
function addToQuote(productId) {
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
      title: '¡Solicitud enviada correctamente!',
      code: caseId,
      message: `Tu número de soporte es <strong>${caseId}</strong>. Hemos registrado los detalles y fotografías de tu reporte. Nuestro equipo técnico evaluará la situación y te contactará.`,
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

// 7. Formulario de Contacto General
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone ? form.phone.value.trim() : '';
  const email = form.email ? form.email.value.trim() : '';
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  // Guardar en buzón interno para el portal administrativo
  try {
    const contacts = JSON.parse(localStorage.getItem('wes_contact_messages') || '[]');
    contacts.unshift({
      id: 'CNT-' + Date.now().toString().slice(-4),
      date: new Date().toISOString(),
      name,
      phone,
      email,
      subject,
      message
    });
    localStorage.setItem('wes_contact_messages', JSON.stringify(contacts));
  } catch (err) {
    console.warn('Error guardando contacto:', err);
  }

  const waUrl = `https://wa.me/${AppState.settings.whatsapp}?text=${encodeURIComponent(`Hola WES, soy ${name}.\nAsunto: ${subject}\n\nMensaje: ${message}`)}`;
  
  showToast('¡Mensaje enviado con éxito! Se abrirá WhatsApp para comunicación directa.', 'success');
  window.open(waUrl, '_blank');
  form.reset();
}

// 8. Modales de Confirmación y Políticas
function showConfirmationModal({ title, code, message, type, data }) {
  const modal = document.getElementById('confirmation-modal');
  if (!modal) return;

  document.getElementById('conf-title').textContent = title;
  document.getElementById('conf-code').textContent = code;
  document.getElementById('conf-message').innerHTML = message;

  // Botón para WhatsApp con la referencia
  const waBtn = document.getElementById('conf-wa-btn');
  if (waBtn) {
    const text = type === 'quote' 
      ? `Hola WES, acabo de enviar la solicitud de cotización ${code}. Mi nombre es ${data.clientName}.`
      : `Hola WES, acabo de generar el caso de soporte ${code} con prioridad ${data.priority}. Mi nombre es ${data.clientName}.`;
    waBtn.href = `https://wa.me/${AppState.settings.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeConfirmationModal() {
  const modal = document.getElementById('confirmation-modal');
  if (modal) {
    modal.classList.add('hidden');
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
      renderProducts();
    });
  }

  const catSelect = document.getElementById('category-filter');
  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      AppState.selectedCategory = e.target.value;
      renderProducts();
    });
  }

  const brandSelect = document.getElementById('brand-filter');
  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      AppState.selectedBrand = e.target.value;
      renderProducts();
    });
  }

  const availSelect = document.getElementById('availability-filter');
  if (availSelect) {
    availSelect.addEventListener('change', (e) => {
      AppState.selectedAvailability = e.target.value;
      renderProducts();
    });
  }

  const sortSelect = document.getElementById('sort-filter');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Menú móvil
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.remove('translate-x-full');
      document.body.classList.add('overflow-hidden');
    });
  }

  if (mobileMenuClose && mobileMenuDrawer) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenuDrawer.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');
    });
  }

  // Cerrar menú móvil al hacer clic en un enlace
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuDrawer) {
        mobileMenuDrawer.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
      }
    });
  });

  // Formularios
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) quoteForm.addEventListener('submit', handleQuoteSubmit);

  const supportForm = document.getElementById('support-form');
  if (supportForm) supportForm.addEventListener('submit', handleSupportSubmit);

  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
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
