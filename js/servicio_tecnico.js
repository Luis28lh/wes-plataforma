// ============================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// TABLERO KDS DE SERVICIO TÉCNICO (ESTILO MCDONALD'S) - js/servicio_tecnico.js
// Control de Tiempos (0-3d Verde, 3-5d Amarillo, >5d Rojo), Notas y Terminados
// ============================================================================

const KDSService = (function() {
  const STORAGE_KEY = 'wes_support_tickets';

  // Datos de muestra iniciales (si no hay tickets registrados)
  function getSampleServices() {
    const now = Date.now();
    const h = 3600 * 1000;
    const d = 24 * h;

    return [
      {
        id: 'SRV-2026-0001',
        clientName: 'Ing. Carlos Mendoza',
        phone: '(809) 578-1234',
        whatsapp: '18095781234',
        email: 'carlos.mendoza@gmail.com',
        productSystem: 'Motor Portón CAME BXV 1000KG',
        category: 'Motores y Portones',
        address: 'Av. Ramón Cáceres #45, Moca',
        description: 'Instalación de motor corredizo y programación de 4 controles remotos TOPD4RBS.',
        priority: 'Normal',
        status: 'Nuevo',
        createdAt: new Date(now - (5 * h)).toISOString(), // Hace 5 horas (VERDE)
        date: new Date(now - (5 * h)).toISOString(),
        internalNotes: [
          { text: 'Equipo recibido en almacén. Técnico asignado: Wilson R.', time: new Date(now - (4 * h)).toISOString(), author: 'Recepción' }
        ]
      },
      {
        id: 'SRV-2026-0002',
        clientName: 'Dra. Patricia Almanzar',
        phone: '(849) 220-4567',
        whatsapp: '18492204567',
        email: 'clinica.almanzar@gmail.com',
        productSystem: 'Inversor Prostec 1.5kW Onda Pura',
        category: 'Energía y Respaldo',
        address: 'Calle Sánchez #12, Centro de Moca',
        description: 'El inversor no conmuta a baterías durante corte de luz. Alarma sonora activa.',
        priority: 'Alta',
        status: 'En diagnóstico',
        createdAt: new Date(now - (3.5 * d)).toISOString(), // Hace 3.5 días (AMARILLO)
        date: new Date(now - (3.5 * d)).toISOString(),
        internalNotes: [
          { text: 'Se desmontó en sitio y se llevó al taller técnico WES.', time: new Date(now - (3 * d)).toISOString(), author: 'Téc. Soporte' },
          { text: 'Verificada etapa de conmutación. Esperando fusible térmico.', time: new Date(now - (1 * d)).toISOString(), author: 'Téc. Soporte' }
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
        createdAt: new Date(now - (6.2 * d)).toISOString(), // Hace 6.2 días (ROJO CRÍTICO)
        date: new Date(now - (6.2 * d)).toISOString(),
        internalNotes: [
          { text: 'Reportado por gerencia. Switch PoE con puerto quemado.', time: new Date(now - (5.5 * d)).toISOString(), author: 'Wilson R.' },
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

      // Si no hay tickets, inicializar con los ejemplos realistas
      if (!Array.isArray(tickets) || tickets.length === 0) {
        tickets = getSampleServices();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
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

  // Cálculo de estado por edad del ticket:
  // 0 - 3 días (< 72h): Verde (Al Día)
  // 3 - 5 días (72h a 120h): Amarillo (Atención)
  // > 5 días (> 120h): Rojo (Crítico / Atrasado)
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

    // Regla de colores solicitada por el usuario:
    if (diffDays < 3) {
      // 0 a 3 días: VERDE
      return {
        key: 'green',
        label: 'AL DÍA (0-3 DÍAS)',
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
    } else if (diffDays < 5) {
      // Pasado 3 días hasta 5 días: AMARILLO
      return {
        key: 'yellow',
        label: 'ATENCIÓN (+3 DÍAS)',
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
      // Pasado 5 días: ROJO CRÍTICO
      return {
        key: 'red',
        label: 'CRÍTICO (+5 DÍAS)',
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
    }
  };
})();

window.KDSService = KDSService;
