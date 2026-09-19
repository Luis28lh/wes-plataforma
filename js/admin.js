// ==========================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// Lógica del Panel Administrativo Privado (admin.js)
// ==========================================

const AdminState = {
  isAuthenticated: false,
  activeTab: 'quotes', // 'quotes', 'support', 'products', 'settings'
  searchFilter: ''
};

// Credenciales administrativas por defecto (editables en localStorage)
const ADMIN_CREDENTIALS = {
  user: localStorage.getItem('wes_admin_user') || 'admin',
  pass: localStorage.getItem('wes_admin_pass') || 'wes2026'
};

function openAdminLogin() {
  const modal = document.getElementById('admin-login-modal');
  if (!modal) return;

  if (AdminState.isAuthenticated) {
    showAdminDashboard();
    return;
  }

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  const userInput = document.getElementById('admin-user-input');
  if (userInput) userInput.focus();
}

function closeAdminLogin() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const form = e.target;
  const user = form.user.value.trim();
  const pass = form.pass.value.trim();

  if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
    AdminState.isAuthenticated = true;
    closeAdminLogin();
    showToast('Sesión de administrador iniciada correctamente.', 'success');
    showAdminDashboard();
  } else {
    showToast('Usuario o contraseña incorrectos.', 'error');
  }
}

function adminLogout() {
  AdminState.isAuthenticated = false;
  const dashboard = document.getElementById('admin-dashboard-modal');
  if (dashboard) {
    dashboard.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
  showToast('Has cerrado la sesión administrativa.', 'info');
}

function showAdminDashboard() {
  const modal = document.getElementById('admin-dashboard-modal');
  if (!modal) return;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  updateAdminMetrics();
  switchAdminTab(AdminState.activeTab);
}

function closeAdminDashboard() {
  const modal = document.getElementById('admin-dashboard-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function switchAdminTab(tab) {
  AdminState.activeTab = tab;
  
  // Actualizar estilos de los botones de pestañas
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    if (btn.dataset.tab === tab) {
      btn.classList.add('bg-wes-blue', 'text-white');
      btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
    } else {
      btn.classList.remove('bg-wes-blue', 'text-white');
      btn.classList.add('text-slate-600', 'hover:bg-slate-100');
    }
  });

  if (tab === 'quotes') renderAdminQuotes();
  else if (tab === 'support') renderAdminSupport();
  else if (tab === 'products') renderAdminProducts();
  else if (tab === 'settings') renderAdminSettings();
}

function updateAdminMetrics() {
  const quotes = StorageService.getQuotes();
  const support = StorageService.getSupportTickets();
  const products = StorageService.getProducts();

  const countQuotesEl = document.getElementById('admin-stat-quotes');
  const countSupportEl = document.getElementById('admin-stat-support');
  const countProductsEl = document.getElementById('admin-stat-products');

  if (countQuotesEl) countQuotesEl.textContent = quotes.length;
  if (countSupportEl) countSupportEl.textContent = support.filter(s => s.status !== 'Cerrado' && s.status !== 'Resuelto').length;
  if (countProductsEl) countProductsEl.textContent = products.filter(p => p.active !== false).length;
}

// ==========================================
// PESTAÑA 1: GESTIÓN DE COTIZACIONES
// ==========================================
function renderAdminQuotes() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;

  const quotes = StorageService.getQuotes();
  const filter = (AdminState.searchFilter || '').toLowerCase();

  const filtered = quotes.filter(q => {
    if (!filter) return true;
    return q.id.toLowerCase().includes(filter) ||
           q.clientName.toLowerCase().includes(filter) ||
           q.company.toLowerCase().includes(filter) ||
           q.phone.includes(filter) ||
           q.email.toLowerCase().includes(filter);
  });

  const statusOptions = ['Recibida', 'En revisión', 'Cotización enviada', 'En espera del cliente', 'Aprobada', 'Rechazada', 'Cerrada'];

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div class="relative flex-1 w-full max-w-md">
          <i class="fas fa-search absolute left-3.5 top-3 text-slate-400 text-sm"></i>
          <input type="text" placeholder="Buscar por cliente, cotización, teléfono..." 
            value="${AdminState.searchFilter}"
            oninput="handleAdminSearch(this.value)"
            class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-wes-blue focus:outline-none">
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="exportQuotesToCSV()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition">
            <i class="fas fa-file-csv text-emerald-600"></i>
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase">
              <tr>
                <th class="px-4 py-3">Código</th>
                <th class="px-4 py-3">Fecha</th>
                <th class="px-4 py-3">Cliente / Empresa</th>
                <th class="px-4 py-3">Contacto</th>
                <th class="px-4 py-3">Productos</th>
                <th class="px-4 py-3">Total Est.</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${filtered.length === 0 ? `
                <tr><td colspan="8" class="text-center py-10 text-slate-400">No se encontraron solicitudes de cotización</td></tr>
              ` : filtered.map(q => `
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="px-4 py-3 font-mono font-bold text-wes-blue">${q.id}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-slate-500">${q.date.slice(0, 10)}</td>
                  <td class="px-4 py-3">
                    <div class="font-bold text-slate-800">${q.clientName}</div>
                    <div class="text-[11px] text-slate-400">${q.company}</div>
                  </td>
                  <td class="px-4 py-3">
                    <div><i class="fab fa-whatsapp text-emerald-500 mr-1"></i>${q.whatsapp || q.phone}</div>
                    <div class="text-[11px] text-slate-400">${q.email}</div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-block bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                      ${q.items ? q.items.length : 0} producto(s)
                    </span>
                  </td>
                  <td class="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                    RD$ ${(q.totalEstimated || 0).toLocaleString()}
                  </td>
                  <td class="px-4 py-3">
                    <select onchange="updateQuoteStatus('${q.id}', this.value)" class="text-xs border border-slate-200 rounded px-2 py-1 bg-white font-medium focus:ring-1 focus:ring-wes-blue">
                      ${statusOptions.map(opt => `<option value="${opt}" ${q.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                    </select>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button onclick="viewQuoteDetail('${q.id}')" class="p-1.5 text-wes-blue hover:bg-blue-50 rounded transition" title="Ver detalles completos">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function updateQuoteStatus(id, newStatus) {
  const quotes = StorageService.getQuotes();
  const q = quotes.find(item => item.id === id);
  if (q) {
    q.status = newStatus;
    StorageService.saveQuotes(quotes);
    showToast(`Estado de ${id} actualizado a "${newStatus}"`, 'success');
  }
}

function viewQuoteDetail(id) {
  const quotes = StorageService.getQuotes();
  const q = quotes.find(item => item.id === id);
  if (!q) return;

  const modal = document.getElementById('admin-detail-modal');
  const title = document.getElementById('admin-detail-title');
  const content = document.getElementById('admin-detail-content');

  title.textContent = `Cotización ${q.id} — ${q.clientName}`;
  content.innerHTML = `
    <div class="space-y-4 text-xs">
      <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div><strong>Fecha:</strong> ${q.date}</div>
        <div><strong>Tipo de Cliente:</strong> ${q.clientType || 'Personal'}</div>
        <div><strong>Empresa:</strong> ${q.company || 'N/A'}</div>
        <div><strong>RNC / Cédula:</strong> ${q.taxId || 'N/A'}</div>
        <div><strong>Teléfono:</strong> ${q.phone}</div>
        <div><strong>WhatsApp:</strong> ${q.whatsapp}</div>
        <div><strong>Correo:</strong> ${q.email}</div>
        <div><strong>Ciudad:</strong> ${q.city}</div>
        <div><strong>Contacto preferido:</strong> ${q.contactMethod}</div>
        <div><strong>Estado actual:</strong> <span class="font-bold text-wes-blue">${q.status}</span></div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 mb-2">Productos Solicitados:</h4>
        <div class="border border-slate-200 rounded-lg overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-slate-100 font-bold">
              <tr>
                <th class="p-2">Código</th>
                <th class="p-2">Producto</th>
                <th class="p-2 text-center">Cant.</th>
                <th class="p-2 text-right">Precio Ref.</th>
                <th class="p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${(q.items || []).map(i => `
                <tr>
                  <td class="p-2 font-mono">${i.code}</td>
                  <td class="p-2 font-medium">${i.name}</td>
                  <td class="p-2 text-center">${i.quantity}</td>
                  <td class="p-2 text-right">RD$ ${(i.price || 0).toLocaleString()}</td>
                  <td class="p-2 text-right font-bold">RD$ ${(i.price * i.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot class="bg-slate-50 font-bold border-t border-slate-200">
              <tr>
                <td colspan="4" class="p-2 text-right">Total Estimado:</td>
                <td class="p-2 text-right text-wes-blue">RD$ ${(q.totalEstimated || 0).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 mb-1">Comentarios del Cliente:</h4>
        <div class="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700 italic">
          ${q.comments || 'Sin comentarios adicionales.'}
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 mb-1">Notas Internas de Seguimiento:</h4>
        <textarea id="quote-internal-note" class="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-wes-blue" rows="3" placeholder="Añade notas para el equipo de ventas...">${q.internalNotes || ''}</textarea>
        <button onclick="saveQuoteInternalNote('${q.id}')" class="mt-2 px-3 py-1.5 bg-wes-blue text-white rounded text-xs font-semibold hover:bg-opacity-90">
          Guardar Nota
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function saveQuoteInternalNote(id) {
  const noteEl = document.getElementById('quote-internal-note');
  if (!noteEl) return;
  const quotes = StorageService.getQuotes();
  const q = quotes.find(item => item.id === id);
  if (q) {
    q.internalNotes = noteEl.value.trim();
    StorageService.saveQuotes(quotes);
    showToast('Nota interna actualizada.', 'success');
  }
}

function exportQuotesToCSV() {
  const quotes = StorageService.getQuotes();
  if (quotes.length === 0) {
    showToast('No hay datos para exportar.', 'warning');
    return;
  }

  let csv = 'ID,Fecha,Cliente,Empresa,Telefono,WhatsApp,Email,Ciudad,TotalEstimado,Estado\n';
  quotes.forEach(q => {
    csv += `"${q.id}","${q.date}","${q.clientName}","${q.company}","${q.phone}","${q.whatsapp}","${q.email}","${q.city}",${q.totalEstimated},"${q.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `WES_Cotizaciones_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  showToast('Archivo CSV de cotizaciones descargado.', 'success');
}

// ==========================================
// PESTAÑA 2: GESTIÓN DE SOPORTE TÉCNICO
// ==========================================
function renderAdminSupport() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;

  const tickets = StorageService.getSupportTickets();
  const filter = (AdminState.searchFilter || '').toLowerCase();

  const filtered = tickets.filter(t => {
    if (!filter) return true;
    return t.id.toLowerCase().includes(filter) ||
           t.clientName.toLowerCase().includes(filter) ||
           t.company.toLowerCase().includes(filter) ||
           t.phone.includes(filter) ||
           t.email.toLowerCase().includes(filter) ||
           t.category.toLowerCase().includes(filter);
  });

  const statusOptions = ['Recibido', 'En revisión', 'Cliente contactado', 'Visita programada', 'En proceso', 'Resuelto', 'Cerrado'];

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div class="relative flex-1 w-full max-w-md">
          <i class="fas fa-search absolute left-3.5 top-3 text-slate-400 text-sm"></i>
          <input type="text" placeholder="Buscar caso de soporte por cliente, falla, ID..." 
            value="${AdminState.searchFilter}"
            oninput="handleAdminSearch(this.value)"
            class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-wes-blue focus:outline-none">
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="exportSupportToCSV()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition">
            <i class="fas fa-file-csv text-emerald-600"></i>
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase">
              <tr>
                <th class="px-4 py-3">Caso</th>
                <th class="px-4 py-3">Fecha</th>
                <th class="px-4 py-3">Cliente / Ubicación</th>
                <th class="px-4 py-3">Problema</th>
                <th class="px-4 py-3">Prioridad</th>
                <th class="px-4 py-3">Fotos</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${filtered.length === 0 ? `
                <tr><td colspan="8" class="text-center py-10 text-slate-400">No hay tickets de soporte registrados</td></tr>
              ` : filtered.map(t => {
                const prioBadge = t.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                                  t.priority === 'Media' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700';
                return `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="px-4 py-3 font-mono font-bold text-wes-blue">${t.id}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-slate-500">${t.date.slice(0, 10)}</td>
                    <td class="px-4 py-3">
                      <div class="font-bold text-slate-800">${t.clientName}</div>
                      <div class="text-[11px] text-slate-400 truncate max-w-xs">${t.address}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-medium text-slate-800">${t.category}</div>
                      <div class="text-[11px] text-slate-400 truncate max-w-xs">${t.productSystem || ''}</div>
                    </td>
                    <td class="px-4 py-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold ${prioBadge}">
                        ${t.priority}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="inline-block bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                        <i class="fas fa-camera text-slate-400 mr-1"></i>${(t.images || []).length}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <select onchange="updateSupportStatus('${t.id}', this.value)" class="text-xs border border-slate-200 rounded px-2 py-1 bg-white font-medium focus:ring-1 focus:ring-wes-blue">
                        ${statusOptions.map(opt => `<option value="${opt}" ${t.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                      </select>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <button onclick="viewSupportDetail('${t.id}')" class="p-1.5 text-wes-blue hover:bg-blue-50 rounded transition" title="Ver detalles y fotos">
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function updateSupportStatus(id, newStatus) {
  const tickets = StorageService.getSupportTickets();
  const t = tickets.find(item => item.id === id);
  if (t) {
    t.status = newStatus;
    StorageService.saveSupportTickets(tickets);
    showToast(`Estado de soporte ${id} cambiado a "${newStatus}"`, 'success');
  }
}

function viewSupportDetail(id) {
  const tickets = StorageService.getSupportTickets();
  const t = tickets.find(item => item.id === id);
  if (!t) return;

  const modal = document.getElementById('admin-detail-modal');
  const title = document.getElementById('admin-detail-title');
  const content = document.getElementById('admin-detail-content');

  title.textContent = `Caso de Soporte ${t.id} — ${t.category}`;
  content.innerHTML = `
    <div class="space-y-4 text-xs">
      <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div><strong>Fecha y Hora:</strong> ${t.date}</div>
        <div><strong>Prioridad:</strong> <span class="font-bold text-red-600">${t.priority}</span></div>
        <div><strong>Cliente:</strong> ${t.clientName}</div>
        <div><strong>Empresa:</strong> ${t.company || 'N/A'}</div>
        <div><strong>Teléfono:</strong> ${t.phone}</div>
        <div><strong>WhatsApp:</strong> ${t.whatsapp}</div>
        <div><strong>Correo:</strong> ${t.email}</div>
        <div><strong>Ubicación:</strong> ${t.address}</div>
        <div><strong>Nº Factura / Orden:</strong> ${t.orderNumber || 'N/A'}</div>
        <div><strong>Sistema Afectado:</strong> ${t.productSystem || 'No indicado'}</div>
        <div><strong>Horario de Contacto:</strong> ${t.preferredTime}</div>
        <div><strong>Método de Contacto:</strong> ${t.contactMethod}</div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 mb-1">Descripción del Problema:</h4>
        <div class="p-3 bg-slate-50 rounded border border-slate-200 text-slate-700 leading-relaxed">
          ${t.description}
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 mb-2">Fotografías de Evidencia Adjuntas (${(t.images || []).length}):</h4>
        ${(!t.images || t.images.length === 0) ? `
          <p class="text-slate-400 italic">No se adjuntaron fotografías para este caso.</p>
        ` : `
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            ${t.images.map((img, i) => `
              <div class="relative group rounded-lg overflow-hidden border border-slate-200 bg-black h-36 flex items-center justify-center">
                <img src="${img}" alt="Evidencia #${i+1}" class="w-full h-full object-cover group-hover:opacity-90 transition">
                <a href="${img}" target="_blank" class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition text-white font-bold text-xs">
                  <i class="fas fa-external-link-alt mr-1"></i> Ampliar Foto
                </a>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <div>
        <h4 class="font-bold text-slate-800 mb-1">Notas Técnicas y Seguimiento Interno:</h4>
        <textarea id="support-internal-note" class="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-wes-blue" rows="3" placeholder="Técnico asignado, fecha de visita acordada, componentes a reemplazar...">${t.internalNotes || ''}</textarea>
        <button onclick="saveSupportInternalNote('${t.id}')" class="mt-2 px-3 py-1.5 bg-wes-blue text-white rounded text-xs font-semibold hover:bg-opacity-90">
          Guardar Nota de Soporte
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function saveSupportInternalNote(id) {
  const noteEl = document.getElementById('support-internal-note');
  if (!noteEl) return;
  const tickets = StorageService.getSupportTickets();
  const t = tickets.find(item => item.id === id);
  if (t) {
    t.internalNotes = noteEl.value.trim();
    StorageService.saveSupportTickets(tickets);
    showToast('Nota técnica guardada.', 'success');
  }
}

function exportSupportToCSV() {
  const tickets = StorageService.getSupportTickets();
  if (tickets.length === 0) {
    showToast('No hay tickets para exportar.', 'warning');
    return;
  }

  let csv = 'ID,Fecha,Cliente,Telefono,Email,Categoria,Prioridad,Estado,Direccion\n';
  tickets.forEach(t => {
    csv += `"${t.id}","${t.date}","${t.clientName}","${t.phone}","${t.email}","${t.category}","${t.priority}","${t.status}","${t.address}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `WES_Soporte_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  showToast('Archivo CSV de soporte descargado.', 'success');
}

// ==========================================
// PESTAÑA 3: GESTIÓN DE PRODUCTOS
// ==========================================
function renderAdminProducts() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;

  const products = StorageService.getProducts();

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 class="font-bold text-slate-800 text-sm">Catálogo de Productos WES</h3>
          <p class="text-xs text-slate-500">Agrega, edita precios o activa/desactiva productos en tiempo real.</p>
        </div>
        <button onclick="openProductEditModal()" class="px-4 py-2 bg-wes-blue text-white rounded-lg text-xs font-semibold hover:bg-wes-dark flex items-center space-x-1.5 transition">
          <i class="fas fa-plus"></i>
          <span>Nuevo Producto</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${products.map(p => `
          <div class="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between shadow-sm ${p.active === false ? 'opacity-60 bg-slate-50' : ''}">
            <div class="flex space-x-3">
              <img src="${p.image}" alt="${p.name}" class="w-16 h-16 object-cover rounded-lg border border-slate-200">
              <div class="flex-1 min-w-0">
                <span class="text-[10px] font-mono font-bold text-slate-400 block">${p.code}</span>
                <h4 class="font-bold text-xs text-slate-800 truncate">${p.name}</h4>
                <span class="text-[11px] text-slate-500">${p.category} | ${p.brand}</span>
                <div class="font-bold text-wes-blue text-xs mt-1">RD$ ${(p.price || 0).toLocaleString()}</div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button onclick="toggleProductActive('${p.id}')" class="px-2.5 py-1 rounded text-[11px] font-bold ${p.active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}">
                ${p.active !== false ? 'Activo en Tienda' : 'Desactivado'}
              </button>
              <div class="space-x-1">
                <button onclick="openProductEditModal('${p.id}')" class="p-1.5 text-wes-blue hover:bg-blue-50 rounded" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProduct('${p.id}')" class="p-1.5 text-rose-500 hover:bg-rose-50 rounded" title="Eliminar">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleProductActive(id) {
  const products = StorageService.getProducts();
  const p = products.find(item => item.id === id);
  if (p) {
    p.active = p.active === false ? true : false;
    StorageService.saveProducts(products);
    renderAdminProducts();
    renderProducts();
    showToast(`Producto ${p.name} ${p.active ? 'activado' : 'desactivado'}.`, 'info');
  }
}

function deleteProduct(id) {
  if (!confirm('¿Estás seguro de eliminar este producto del catálogo?')) return;
  let products = StorageService.getProducts();
  products = products.filter(p => p.id !== id);
  StorageService.saveProducts(products);
  renderAdminProducts();
  renderProducts();
  showToast('Producto eliminado.', 'success');
}

function openProductEditModal(id = null) {
  const modal = document.getElementById('admin-product-edit-modal');
  if (!modal) return;

  const form = document.getElementById('product-edit-form');
  form.reset();

  if (id) {
    const products = StorageService.getProducts();
    const p = products.find(item => item.id === id);
    if (p) {
      form.productId.value = p.id;
      form.name.value = p.name;
      form.code.value = p.code;
      form.brand.value = p.brand;
      form.category.value = p.category;
      form.price.value = p.price;
      form.availability.value = p.availability;
      form.image.value = p.image;
      form.description.value = p.description;
      form.features.value = (p.features || []).join('\n');
    }
  } else {
    form.productId.value = '';
    form.code.value = 'WES-PROD-' + Math.floor(100 + Math.random() * 900);
    form.image.value = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80';
  }

  modal.classList.remove('hidden');
}

function closeProductEditModal() {
  const modal = document.getElementById('admin-product-edit-modal');
  if (modal) modal.classList.add('hidden');
}

function handleProductSave(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.productId.value;
  const products = StorageService.getProducts();

  const productData = {
    id: id || ('prod-' + Date.now()),
    name: form.name.value.trim(),
    code: form.code.value.trim(),
    brand: form.brand.value.trim(),
    category: form.category.value.trim(),
    price: parseFloat(form.price.value) || 0,
    availability: form.availability.value,
    image: form.image.value.trim(),
    description: form.description.value.trim(),
    features: form.features.value.split('\n').filter(f => f.trim().length > 0),
    active: true
  };

  if (id) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) products[index] = productData;
  } else {
    products.unshift(productData);
  }

  StorageService.saveProducts(products);
  closeProductEditModal();
  renderAdminProducts();
  renderProducts();
  showToast('Producto guardado correctamente.', 'success');
}

// ==========================================
// PESTAÑA 4: CONFIGURACIÓN GENERAL WES
// ==========================================
function renderAdminSettings() {
  const container = document.getElementById('admin-tab-content');
  if (!container) return;

  const s = StorageService.getCompanySettings();
  const currentBackend = localStorage.getItem('wes_backend_url') || '';

  container.innerHTML = `
    <div class="bg-white rounded-xl border border-slate-200 p-6 space-y-6 max-w-3xl">
      <div>
        <h3 class="font-bold text-slate-800 text-base">Configuración Operativa de la Empresa</h3>
        <p class="text-xs text-slate-500">Actualiza datos de contacto, horarios y la URL del backend de Apps Script.</p>
      </div>

      <form onsubmit="handleSettingsSave(e)" id="admin-settings-form" class="space-y-4 text-xs">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nombre Comercial:</label>
            <input type="text" name="name" value="${s.name}" class="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-wes-blue" required>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Eslogan Corporativo:</label>
            <input type="text" name="slogan" value="${s.slogan}" class="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-wes-blue">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Teléfono Principal:</label>
            <input type="text" name="phone" value="${s.phone}" class="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-wes-blue" required>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">WhatsApp (sin espacios ni guiones):</label>
            <input type="text" name="whatsapp" value="${s.whatsapp}" class="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-wes-blue" required>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Correo General (Cotizaciones):</label>
            <input type="email" name="emailGeneral" value="${s.emailGeneral}" class="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-wes-blue" required>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Correo de Soporte Técnico:</label>
            <input type="email" name="emailSupport" value="${s.emailSupport}" class="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-wes-blue" required>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Dirección Física de la Sede:</label>
          <input type="text" name="address" value="${s.address}" class="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-wes-blue" required>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Horario Lunes a Viernes:</label>
            <input type="text" name="scheduleWeek" value="${s.scheduleWeek}" class="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-wes-blue">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Horario Sábados:</label>
            <input type="text" name="scheduleSat" value="${s.scheduleSat}" class="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-wes-blue">
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200">
          <label class="block font-bold text-wes-blue mb-1">
            <i class="fas fa-link mr-1"></i> URL del Endpoint de Google Apps Script Web App:
          </label>
          <input type="url" name="backendUrl" value="${currentBackend}" placeholder="https://script.google.com/macros/s/.../exec" class="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-wes-blue">
          <p class="text-[11px] text-slate-400 mt-1">Conecta el formulario directamente con Google Sheets y envíos automáticos de correos con Gmail.</p>
        </div>

        <div class="pt-2">
          <button type="submit" class="px-5 py-2.5 bg-wes-blue text-white rounded-lg text-xs font-bold hover:bg-wes-dark shadow transition">
            Guardar Configuración
          </button>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById('admin-settings-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        name: form.name.value.trim(),
        slogan: form.slogan.value.trim(),
        phone: form.phone.value.trim(),
        whatsapp: form.whatsapp.value.trim(),
        whatsappDisplay: form.phone.value.trim(),
        emailGeneral: form.emailGeneral.value.trim(),
        emailSupport: form.emailSupport.value.trim(),
        address: form.address.value.trim(),
        scheduleWeek: form.scheduleWeek.value.trim(),
        scheduleSat: form.scheduleSat.value.trim(),
        googleMapsEmbed: s.googleMapsEmbed
      };

      StorageService.saveCompanySettings(updated);
      AppState.settings = updated;
      
      const beUrl = form.backendUrl.value.trim();
      localStorage.setItem('wes_backend_url', beUrl);
      AppState.backendUrl = beUrl;

      renderCompanyInfo();
      showToast('Configuración actualizada con éxito.', 'success');
    });
  }
}

function handleAdminSearch(val) {
  AdminState.searchFilter = val;
  if (AdminState.activeTab === 'quotes') renderAdminQuotes();
  else if (AdminState.activeTab === 'support') renderAdminSupport();
}

function closeAdminDetailModal() {
  const modal = document.getElementById('admin-detail-modal');
  if (modal) modal.classList.add('hidden');
}
