// ============================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// TABLERO KDS DE SERVICIO TÉCNICO (ESTILO MCDONALD'S) - js/servicio_tecnico.js
// Control de Tiempos (0-3d Verde, 3-5d Amarillo, >5d Rojo), Notas y Terminados
// ============================================================================

const KDSService = (function() {
  const STORAGE_KEY = 'wes_support_tickets';

  // Datos de muestra iniciales (proyectos formales WES)
  function getSampleServices() {
    const now = Date.now();
    const h = 3600 * 1000;
    const d = 24 * h;

    return [
      {
        id: 'SRV-2026-0001',
        clientName: 'Góndola González',
        phone: '(809) 578-4320',
        whatsapp: '18095784320',
        email: 'gondolagonzalez@gmail.com',
        productSystem: 'Levantamiento para Cotización de Motor CAME 800 kg',
        category: 'Motores y Portones',
        address: 'Moca, Rep. Dominicana',
        description: 'Levantamiento para cotización de motor CAME 800 kg. Recepción informó que el cliente está solicitando levantamiento para instalación de motor.',
        priority: 'Normal',
        status: 'Nuevo',
        createdAt: new Date(now - (5 * h)).toISOString(), // Hace 5 horas (VERDE)
        date: new Date(now - (5 * h)).toISOString(),
        internalNotes: [
          { text: 'Recepción informó que el cliente está solicitando levantamiento para instalación de motor.', time: new Date(now - (4 * h)).toISOString(), author: 'Recepción' }
        ]
      },
      {
        id: 'SRV-2026-0002',
        clientName: 'Coopcibao (Banco Tuntir)',
        phone: '(809) 578-5520',
        whatsapp: '18095785520',
        email: 'soporte@coopcibao.com',
        productSystem: 'Inversor Trace 4 Kilo',
        category: 'Energía y Respaldo',
        address: 'Sucursal Coopcibao, Moca',
        description: 'Mantenimiento de inversor en laboratorio y pruebas reinstalación de inversor. Se desmontó del espacio porque uno de los ventiladores estaba fuera de funcionamiento. Diagnóstico del técnico para revisión y laboratorio y cambio de componente en mantenimiento.',
        priority: 'Alta',
        status: 'En laboratorio',
        createdAt: new Date(now - (2.5 * d)).toISOString(), // Hace 2.5 días (AMARILLO: 2 a 4 días)
        date: new Date(now - (2.5 * d)).toISOString(),
        internalNotes: [
          { text: 'Se desmontó del espacio porque uno de los ventiladores estaba fuera de funcionamiento. Diagnóstico técnico para revisión en laboratorio y cambio de componente en mantenimiento.', time: new Date(now - (2 * d)).toISOString(), author: 'Téc. Soporte' },
          { text: 'Inversor en banco de pruebas. En proceso de mantenimiento y reemplazo de ventilador.', time: new Date(now - (1 * d)).toISOString(), author: 'Laboratorio WES' }
        ]
      },
      {
        id: 'SRV-2026-0003',
        clientName: 'Supermercado Central Moca',
        phone: '(809) 578-8899',
        whatsapp: '18095788899',
        email: 'gerencia@supercentral.com.do',
        productSystem: 'Sistema de 16 Cámaras IP Dahua',
        category: 'CCTV y Seguridad',
        address: 'Autopista Duarte Km 2, Moca',
        description: 'NVR sin acceso remoto desde la aplicación móvil. 4 cámaras con pérdida de video.',
        priority: 'Urgente',
        status: 'En reparación',
        createdAt: new Date(now - (4.8 * d)).toISOString(), // Hace 4.8 días (ROJO: +4 DÍAS ATRASADO)
        date: new Date(now - (4.8 * d)).toISOString(),
        internalNotes: [
          { text: 'Reportado por gerencia. Switch PoE con puerto quemado.', time: new Date(now - (4.8 * d)).toISOString(), author: 'Wilson R.' },
          { text: 'Se cotizó reemplazo de switch PoE Dahua 8 puertos.', time: new Date(now - (2 * d)).toISOString(), author: 'Ventas WES' }
        ]
      }
    ];
  }

  // Obtener todos los servicios registrados (soporte web + KDS)
  function getAllServices() {
    try {
      let tickets = [];
      const rawSupport = localStorage.getItem(STORAGE_KEY);
      if (rawSupport) {
        tickets = JSON.parse(rawSupport);
      }

      // Si no hay tickets, inicializar con los proyectos formales
      if (!Array.isArray(tickets) || tickets.length === 0) {
        tickets = getSampleServices();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      } else {
        // Migración automática al actualizar proyectos formales
        const samples = getSampleServices();
        let changed = false;
        tickets = tickets.map(t => {
          if (t.id === 'SRV-2026-0001' && (t.clientName === 'Ing. Carlos Mendoza' || !t.clientName)) {
            changed = true;
            return { ...t, clientName: samples[0].clientName, productSystem: samples[0].productSystem, description: samples[0].description, internalNotes: samples[0].internalNotes };
          }
          if (t.id === 'SRV-2026-0002' && (t.clientName === 'Dra. Patricia Almanzar' || !t.clientName)) {
            changed = true;
            return { ...t, clientName: samples[1].clientName, productSystem: samples[1].productSystem, description: samples[1].description, internalNotes: samples[1].internalNotes };
          }
          return t;
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
        }
      }

      return tickets;
    } catch (e) {
      console.warn('[KDSService] Error cargando tickets:', e);
      return getSampleServices();
    }
  }

  function saveAllServices(tickets) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      window.dispatchEvent(new CustomEvent('wes_kds_updated', { detail: tickets }));
    } catch (e) {
      console.error('[KDSService] Error guardando tickets:', e);
    }
  }

  // Cálculo de estado por edad del ticket (Semáforo WES):
  // 0 - 2 días (< 48h): Verde (Al Día)
  // 2 - 4 días (48h a 96h): Amarillo (Atención)
  // > 4 días (> 96h): Rojo (Atrasado)
  function calculateTimeState(service) {
    if (service.status === 'Terminado' || service.status === 'Resuelto' || service.status === 'Cerrado') {
      return {
        key: 'finished',
        label: 'TERMINADO',
        colorClass: 'emerald',
        badgeBg: 'bg-emerald-600 text-white',
        borderClass: 'border-emerald-600/60',
        headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white',
        timeText: service.finishedAt ? `Completado el ${formatShortDate(service.finishedAt)}` : 'Completado',
        elapsedHours: 0,
        elapsedDays: 0,
        isFinished: true
      };
    }

    const createdTime = new Date(service.createdAt || service.date || Date.now()).getTime();
    const now = Date.now();
    const diffMs = Math.max(0, now - createdTime);
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    let timeText = '';
    if (diffHours < 1) {
      const mins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      timeText = `Hace ${mins} min`;
    } else if (diffHours < 24) {
      const hrs = Math.floor(diffHours);
      const mins = Math.floor((diffHours - hrs) * 60);
      timeText = `Hace ${hrs}h ${mins}m`;
    } else {
      const days = Math.floor(diffDays);
      const remHours = Math.floor((diffDays - days) * 24);
      timeText = `${days}d ${remHours}h transcurridos`;
    }

    // Regla semafórica solicitada:
    if (diffDays < 2) {
      // 0 a 2 días: VERDE (Al Día)
      return {
        key: 'green',
        label: 'AL DÍA (0-2 DÍAS)',
        colorClass: 'green',
        badgeBg: 'bg-emerald-500 text-white',
        borderClass: 'border-emerald-500 hover:border-emerald-600',
        headerBg: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white',
        pulse: false,
        timeText,
        diffHours,
        diffDays,
        isFinished: false
      };
    } else if (diffDays < 4) {
      // Pasado 2 días hasta 4 días: AMARILLO (Atención)
      return {
        key: 'yellow',
        label: 'ATENCIÓN (+2 DÍAS)',
        colorClass: 'yellow',
        badgeBg: 'bg-amber-400 text-slate-950 font-black',
        borderClass: 'border-amber-400 ring-2 ring-amber-300/60 shadow-md',
        headerBg: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black',
        pulse: false,
        timeText: `⚠️ ${timeText}`,
        diffHours,
        diffDays,
        isFinished: false
      };
    } else {
      // Pasado 4 días: ROJO (Atrasado)
      return {
        key: 'red',
        label: 'ATRASADO (+4 DÍAS)',
        colorClass: 'red',
        badgeBg: 'bg-rose-600 text-white font-black animate-pulse',
        borderClass: 'border-rose-600 ring-4 ring-rose-500/40 shadow-xl shadow-rose-600/20',
        headerBg: 'bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white font-black',
        pulse: true,
        timeText: `🚨 ${timeText} (ATRASADO)`,
        diffHours,
        diffDays,
        isFinished: false
      };
    }
  }

  function formatShortDate(dateStr) {
    if (!dateStr) return 'Hoy';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  return {
    getServices() {
      return getAllServices();
    },

    calculateTimeState,
    formatShortDate,

    // Crear un nuevo servicio técnico con fecha de inicio inmediata
    createService({ clientName, phone, productSystem, description, address, priority }) {
      if (!clientName || !clientName.trim()) {
        return { success: false, message: 'Ingresa el nombre del cliente.' };
      }
      if (!phone || !phone.trim()) {
        return { success: false, message: 'Ingresa el teléfono de contacto.' };
      }

      const services = getAllServices();
      const nextNum = services.length + 1;
      const caseId = `SRV-2026-${String(nextNum).padStart(4, '0')}`;
      const now = new Date().toISOString();

      const newService = {
        id: caseId,
        clientName: clientName.trim(),
        phone: phone.trim(),
        whatsapp: phone.replace(/\D/g, ''),
        email: '',
        productSystem: (productSystem || 'Servicio General WES').trim(),
        category: 'Servicio Técnico',
        address: (address || 'Taller WES Moca').trim(),
        description: (description || 'Mantenimiento / Reparación').trim(),
        priority: priority || 'Normal',
        status: 'Nuevo',
        createdAt: now,
        date: now,
        internalNotes: [
          {
            text: 'Servicio registrado e ingresado al tablero KDS.',
            time: now,
            author: (typeof UserAuth !== 'undefined' && UserAuth.getCurrentUser()?.name) || 'Sistema'
          }
        ]
      };

      services.unshift(newService);
      saveAllServices(services);

      // Si Supabase está disponible, registrar en nube
      if (window.WesDB && WesDB.isConfigured()) {
        try {
          WesDB.createSupportTicket({
            ticketCode: caseId,
            name: newService.clientName,
            phone: newService.phone,
            email: 'wes.inform@gmail.com',
            serviceType: newService.productSystem,
            location: newService.address,
            description: newService.description
          });
        } catch (e) {}
      }

      return { success: true, service: newService };
    },

    // Agregar una nota de avance a la tarjeta (cajetín)
    addNote(serviceId, noteText, authorName) {
      if (!noteText || !noteText.trim()) return false;

      const services = getAllServices();
      const target = services.find(s => s.id === serviceId);
      if (!target) return false;

      if (!Array.isArray(target.internalNotes)) {
        target.internalNotes = [];
      }

      const noteEntry = {
        text: noteText.trim(),
        time: new Date().toISOString(),
        author: authorName || (typeof UserAuth !== 'undefined' && UserAuth.getCurrentUser()?.name) || 'Técnico'
      };

      target.internalNotes.push(noteEntry);
      saveAllServices(services);
      return noteEntry;
    },

    // Marcar como TERMINADO
    markAsFinished(serviceId) {
      const services = getAllServices();
      const target = services.find(s => s.id === serviceId);
      if (!target) return false;

      const now = new Date().toISOString();
      target.status = 'Terminado';
      target.finishedAt = now;

      if (!Array.isArray(target.internalNotes)) {
        target.internalNotes = [];
      }

      const author = (typeof UserAuth !== 'undefined' && UserAuth.getCurrentUser()?.name) || 'Técnico';
      target.internalNotes.push({
        text: `✓ Servicio marcado como TERMINADO y completado exitosamente.`,
        time: now,
        author: author
      });

      saveAllServices(services);
      return true;
    },

    // Reabrir un servicio terminado
    reopenService(serviceId) {
      const services = getAllServices();
      const target = services.find(s => s.id === serviceId);
      if (!target) return false;

      target.status = 'En atención';
      delete target.finishedAt;

      const author = (typeof UserAuth !== 'undefined' && UserAuth.getCurrentUser()?.name) || 'Supervisor';
      target.internalNotes.push({
        text: `↩ Servicio reabierto para atención técnica continua.`,
        time: new Date().toISOString(),
        author: author
      });

      saveAllServices(services);
      return true;
    },

    // Métodos para el Chip de Menú y Modal "Soporte en Curso"
    updateNavOngoingBadge,
    openOngoingSupportModal,
    closeOngoingSupportModal,
    renderOngoingSupportModal,
    toggleQuickNewServiceForm,
    handleQuickServiceSubmit,
    handleOngoingNoteSubmit,
    handleOngoingFinish
  };
})();

// =========================================================================
// GESTIÓN DEL MODAL Y CHIP DE "SOPORTE EN CURSO" (PARA TÉCNICOS)
// =========================================================================
let ongoingFilter = 'all'; // 'all', 'green', 'yellow', 'red'
let ongoingSearch = '';

function updateNavOngoingBadge() {
  if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return;
  try {
    const services = KDSService.getServices();
    let activeCount = 0;
    let redCount = 0;
    let yellowCount = 0;

    services.forEach(s => {
      const state = KDSService.calculateTimeState(s);
      if (!state.isFinished) {
        activeCount++;
        if (state.key === 'red') redCount++;
        else if (state.key === 'yellow') yellowCount++;
      }
    });

    const badgeIds = ['nav-ongoing-badge', 'nav-ongoing-badge-mobile', 'drawer-ongoing-badge'];
    badgeIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = id === 'drawer-ongoing-badge' ? `${activeCount} Activos` : activeCount;
        // Si hay proyectos atrasados (+4 días en rojo), alertar con pulso rojo
        if (redCount > 0) {
          el.className = id === 'drawer-ongoing-badge'
            ? 'text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse'
            : 'px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-600 text-white font-mono animate-pulse shadow-xs';
        } else if (yellowCount > 0) {
          el.className = id === 'drawer-ongoing-badge'
            ? 'text-[9px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider'
            : 'px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 font-mono shadow-xs';
        } else {
          el.className = id === 'drawer-ongoing-badge'
            ? 'text-[9px] bg-wes-gold text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider'
            : 'px-1.5 py-0.2 rounded-full text-[10px] font-black bg-wes-gold text-slate-950 font-mono shadow-xs';
        }
      }
    });
  } catch (e) {
    console.warn('[KDSService] Error actualizando badge:', e);
  }
}

function openOngoingSupportModal() {
  const modal = document.getElementById('ongoing-support-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.classList.add('overflow-hidden');
    renderOngoingSupportModal();
  } else {
    window.location.href = 'servicio-tecnico.html';
  }
}

function closeOngoingSupportModal() {
  const modal = document.getElementById('ongoing-support-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.classList.remove('overflow-hidden');
  }
}

function toggleQuickNewServiceForm() {
  const formContainer = document.getElementById('ongoing-quick-form-container');
  if (formContainer) {
    formContainer.classList.toggle('hidden');
    if (!formContainer.classList.contains('hidden')) {
      document.getElementById('quick-srv-client')?.focus();
    }
  }
}

function setOngoingFilter(key) {
  ongoingFilter = key;
  ['all', 'green', 'yellow', 'red'].forEach(k => {
    const btn = document.getElementById(`ongoing-flt-${k}`);
    if (btn) {
      if (k === key) {
        btn.className = 'px-3 py-1.5 rounded-xl border-2 bg-white border-wes-gold text-slate-900 font-bold text-xs transition flex items-center space-x-1.5 shadow-sm ring-2 ring-wes-gold/20';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl border bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 font-medium text-xs transition flex items-center space-x-1.5';
      }
    }
  });
  renderOngoingSupportModal();
}

function handleOngoingSearch(val) {
  ongoingSearch = (val || '').trim();
  renderOngoingSupportModal();
}

function renderOngoingSupportModal(filterKey) {
  if (filterKey) ongoingFilter = filterKey;
  const container = document.getElementById('ongoing-tickets-list');
  if (!container) return;

  const services = KDSService.getServices();
  let countActive = 0;
  let countGreen = 0;
  let countYellow = 0;
  let countRed = 0;

  services.forEach(s => {
    const state = KDSService.calculateTimeState(s);
    if (!state.isFinished) {
      countActive++;
      if (state.key === 'green') countGreen++;
      else if (state.key === 'yellow') countYellow++;
      else if (state.key === 'red') countRed++;
    }
  });

  // Actualizar contadores
  const elAll = document.getElementById('ongoing-count-all');
  const elGrn = document.getElementById('ongoing-count-green');
  const elYel = document.getElementById('ongoing-count-yellow');
  const elRed = document.getElementById('ongoing-count-red');
  if (elAll) elAll.textContent = countActive;
  if (elGrn) elGrn.textContent = countGreen;
  if (elYel) elYel.textContent = countYellow;
  if (elRed) elRed.textContent = countRed;

  // Filtrar activos
  const activeTickets = services.filter(s => {
    const state = KDSService.calculateTimeState(s);
    if (state.isFinished) return false;

    if (ongoingFilter === 'green' && state.key !== 'green') return false;
    if (ongoingFilter === 'yellow' && state.key !== 'yellow') return false;
    if (ongoingFilter === 'red' && state.key !== 'red') return false;

    if (ongoingSearch) {
      const q = ongoingSearch.toLowerCase();
      const matchName = (s.clientName || '').toLowerCase().includes(q);
      const matchDesc = (s.description || '').toLowerCase().includes(q);
      const matchSys = (s.productSystem || '').toLowerCase().includes(q);
      const matchId = (s.id || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchSys && !matchId) return false;
    }
    return true;
  });

  // Ordenar: primero los atrasados (rojos), luego amarillos, luego verdes
  activeTickets.sort((a, b) => {
    const stateA = KDSService.calculateTimeState(a);
    const stateB = KDSService.calculateTimeState(b);
    return (stateB.diffHours || 0) - (stateA.diffHours || 0);
  });

  if (activeTickets.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500 col-span-1 md:col-span-2">
        <div class="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3 text-2xl shadow-sm">
          <i class="fas fa-check-double text-emerald-500"></i>
        </div>
        <p class="font-bold text-sm text-slate-800">No hay solicitudes pendientes en esta vista</p>
        <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Todo el soporte técnico de esta categoría se encuentra al día o completado.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = activeTickets.map(s => {
    const state = KDSService.calculateTimeState(s);
    const cleanPhone = (s.phone || '').replace(/\D/g, '');
    const waUrl = `https://wa.me/1${cleanPhone}?text=${encodeURIComponent(`Hola ${s.clientName}, le escribimos de Warn Electrical Services respecto a su servicio ${s.id}.`)}`;
    const startDateText = KDSService.formatShortDate(s.createdAt || s.date);
    const notes = Array.isArray(s.internalNotes) ? s.internalNotes : [];

    const notesHtml = notes.length > 0 
      ? notes.map(n => `
        <div class="p-2 bg-slate-100 rounded-lg border border-slate-200 text-[11px] leading-relaxed">
          <div class="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
            <span class="font-bold text-amber-700">${n.author || 'Técnico'}</span>
            <span>${KDSService.formatShortDate(n.time)}</span>
          </div>
          <p class="text-slate-700">${n.text}</p>
        </div>
      `).join('')
      : '<p class="text-[11px] text-slate-400 italic p-1">Sin notas registradas aún.</p>';

    return `
      <div class="bg-white rounded-2xl border-2 ${state.borderClass} overflow-hidden shadow-sm hover:shadow-md flex flex-col transition">
        
        <!-- Encabezado Semafórico -->
        <div class="${state.headerBg} px-3.5 py-2.5 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="font-mono font-black text-xs tracking-wider">${s.id}</span>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/25 backdrop-blur-xs">
              ${state.label}
            </span>
          </div>
          <span class="text-xs font-bold tracking-tight">
            ${state.timeText}
          </span>
        </div>

        <!-- Contenido Principal -->
        <div class="p-4 flex-1 space-y-3 text-xs bg-white text-slate-800">
          
          <!-- Nombre Principal del Cliente y Fecha de Inicio -->
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-1 border-b border-slate-100 pb-2.5">
            <div class="min-w-0 flex-1">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Nombre Principal / Solicitante</span>
              <h4 class="font-black text-sm text-slate-900 truncate" title="${s.clientName}">${s.clientName}</h4>
              ${s.company && s.company !== 'N/A' ? `<span class="text-[11px] text-slate-500 font-medium">${s.company}</span>` : ''}
            </div>
            <div class="text-[11px] text-slate-500 shrink-0 text-left sm:text-right">
              <span class="block text-[10px] text-slate-400 font-bold uppercase">Fecha de Inicio</span>
              <span class="text-slate-700 font-semibold flex items-center sm:justify-end">
                <i class="far fa-calendar-alt text-[10px] mr-1 text-slate-400"></i>
                ${startDateText}
              </span>
            </div>
          </div>

          <!-- Equipo o Sistema -->
          <div>
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Equipo / Sistema</span>
            <p class="font-extrabold text-xs text-wes-blue leading-snug">${s.productSystem || 'Servicio Técnico WES'}</p>
          </div>

          <!-- Breve Descripción -->
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Breve Descripción del Problema:</span>
            <p class="text-slate-700 leading-relaxed text-xs">${s.description || 'Sin descripción adicional.'}</p>
          </div>

          <!-- Cliente (Nombre Completo en una sola línea + Icono pequeño de llamada) -->
          <div class="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">Cliente</span>
            <div class="flex items-center justify-between gap-2">
              <h4 class="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug flex-1" title="${s.clientName}">${s.clientName}</h4>
              ${cleanPhone ? `
                <a href="tel:${cleanPhone}" class="w-6 h-6 rounded-md bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 flex items-center justify-center transition shrink-0 ml-1.5" title="Llamar: ${s.phone}">
                  <i class="fas fa-phone-alt text-[9px]"></i>
                </a>
              ` : ''}
            </div>
            ${s.company && s.company !== 'N/A' ? `<span class="text-[10px] text-slate-500 font-medium block mt-0.5">${s.company}</span>` : ''}
          </div>

          <!-- Paso para escribir notas -->
          <div class="pt-2 border-t border-slate-200">
            <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1.5 flex items-center">
              <i class="fas fa-sticky-note text-amber-500 mr-1.5"></i>
              Notas y Avances del Trabajo (${notes.length})
            </span>
            <div class="max-h-24 overflow-y-auto space-y-1 mb-2 pr-1">
              ${notesHtml}
            </div>
            <form onsubmit="handleOngoingNoteSubmit('${s.id}', event)" class="flex items-center space-x-1.5">
              <input type="text" id="ongoing-note-input-${s.id}" placeholder="Escribir avance técnico..." required class="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition shadow-xs">
              <button type="submit" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition shrink-0 shadow-xs" title="Guardar nota">
                <i class="fas fa-paper-plane text-[10px]"></i>
              </button>
            </form>
          </div>

        </div>

        <!-- Botón Terminado -->
        <div class="p-3 bg-slate-50 border-t border-slate-200">
          <button onclick="handleOngoingFinish('${s.id}')" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center space-x-2">
            <i class="fas fa-check-circle text-sm"></i>
            <span>Terminado</span>
          </button>
        </div>

      </div>
    `;
  }).join('');
}

function handleOngoingNoteSubmit(serviceId, e) {
  e.preventDefault();
  const input = document.getElementById(`ongoing-note-input-${serviceId}`);
  if (!input || !input.value.trim()) return;

  KDSService.addNote(serviceId, input.value.trim());
  input.value = '';
  renderOngoingSupportModal();
  if (typeof showToast === 'function') showToast('Nota de avance registrada.', 'success');
}

function handleOngoingFinish(serviceId) {
  if (!confirm(`¿Marcar la solicitud ${serviceId} como TERMINADO?`)) return;
  KDSService.markAsFinished(serviceId);
  updateNavOngoingBadge();
  renderOngoingSupportModal();
  if (typeof showToast === 'function') showToast(`Solicitud ${serviceId} completada exitosamente.`, 'success');
}

function handleQuickServiceSubmit(e) {
  e.preventDefault();
  const client = document.getElementById('quick-srv-client').value;
  const phone = document.getElementById('quick-srv-phone').value;
  const equipment = document.getElementById('quick-srv-equipment').value;
  const description = document.getElementById('quick-srv-desc').value;
  const priority = document.getElementById('quick-srv-priority').value;

  const res = KDSService.createService({
    clientName: client,
    phone,
    productSystem: equipment,
    description,
    priority
  });

  if (res.success) {
    document.getElementById('form-quick-new-service').reset();
    toggleQuickNewServiceForm();
    updateNavOngoingBadge();
    renderOngoingSupportModal();
    if (typeof showToast === 'function') showToast(`¡Solicitud ${res.service.id} ingresada con fecha actual!`, 'success');
  } else {
    alert(res.message || 'Error al guardar');
  }
}

if (typeof window !== 'undefined') {
  window.KDSService = KDSService;
  window.openOngoingSupportModal = openOngoingSupportModal;
  window.closeOngoingSupportModal = closeOngoingSupportModal;
  window.renderOngoingSupportModal = renderOngoingSupportModal;
  window.setOngoingFilter = setOngoingFilter;
  window.handleOngoingSearch = handleOngoingSearch;
  window.toggleQuickNewServiceForm = toggleQuickNewServiceForm;
  window.handleQuickServiceSubmit = handleQuickServiceSubmit;
  window.handleOngoingNoteSubmit = handleOngoingNoteSubmit;
  window.handleOngoingFinish = handleOngoingFinish;
  window.updateNavOngoingBadge = updateNavOngoingBadge;
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('wes_kds_updated', updateNavOngoingBadge);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KDSService };
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateNavOngoingBadge();
      setInterval(updateNavOngoingBadge, 60000);
    });
  } else {
    updateNavOngoingBadge();
    setInterval(updateNavOngoingBadge, 60000);
  }
}

