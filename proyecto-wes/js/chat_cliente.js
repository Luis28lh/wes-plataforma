// ============================================================================
// WARN ELECTRICAL SERVICES, SRL (WES)
// ASISTENTE VIRTUAL Y CHAT ORIENTADO AL CLIENTE (TALLER 3 - AIDET)
// js/chat_cliente.js · Consultas públicas, estado de tickets y cotizaciones
// ============================================================================

(function() {
  'use strict';

  // Base de conocimientos técnicos y comerciales de WES
  const WES_KB = {
    empresa: {
      nombre: "Warn Electrical Services, SRL (WES)",
      ubicacion: "Moca, Provincia Espaillat, República Dominicana",
      horario: "Lunes a Viernes de 7:30 AM a 6:00 PM | Sábados de 8:00 AM a 1:00 PM",
      telefono: "(849) 207-5474",
      whatsapp: "18492075474",
      whatsappUrl: "https://wa.me/18492075474"
    },
    servicios: [
      {
        nombre: "Motores para Portones Eléctricos",
        detalle: "Instalación, mantenimiento y reparación de motores corredizos y batientes marca CAME (modelos BXV 400kg, 600kg, 800kg y 1000kg industriales). Garantía de repuestos y servicio técnico en Moca y todo el Cibao."
      },
      {
        nombre: "Sistemas de Inversores y Energía de Respaldo",
        detalle: "Diagnóstico en laboratorio, banco de pruebas, reparación de tarjetas electrónicas, cambio de componentes/ventiladores y mantenimiento para inversores Trace, Magnum y Outback, además de bancos de baterías AGM, Gel y Litio."
      },
      {
        nombre: "Cámaras de Seguridad CCTV y Alarmas",
        detalle: "Instalación de cámaras IP de alta definición Dahua y Hikvision, grabadores NVR/DVR, cableado estructurado y configuración de visualización remota en celulares mediante app DMSS."
      },
      {
        nombre: "Control de Acceso e Intercomunicadores",
        detalle: "Sistemas biométricos de huella y reconocimiento facial ZKTeco, tarjetas de proximidad, cerraduras electromagnéticas y videoporteros Dahua residenciales y comerciales."
      }
    ]
  };

  // Estado del flujo conversacional interactivo
  let chatSession = {
    isOpen: false,
    step: 'idle',
    chatHistory: [], // Historial multiturno para Gemini
    ticketDraft: {
      name: '',
      phone: '',
      equipment: '',
      address: '',
      description: ''
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Inicializar el widget de chat en la página
  function initClientChat() {
    renderChatLauncherAndModal();
    setupChatEvents();
  
    // Ajuste dinámico de teclado virtual en móviles (iOS Safari & Android Chrome)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        const modal = document.getElementById('wes-chat-modal');
        if (modal && chatSession.isOpen && window.innerWidth < 640) {
          modal.style.height = window.visualViewport.height + 'px';
          modal.style.top = window.visualViewport.offsetTop + 'px';
          scrollToBottom();
        }
      });
      window.visualViewport.addEventListener('scroll', () => {
        const modal = document.getElementById('wes-chat-modal');
        if (modal && chatSession.isOpen && window.innerWidth < 640) {
          modal.style.top = window.visualViewport.offsetTop + 'px';
        }
      });
    }
}

  function renderChatLauncherAndModal() {
    if (document.getElementById('wes-client-chat-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'wes-client-chat-wrapper';
    wrapper.innerHTML = `
      <!-- Botón Flotante Lanzador (Esquina Inferior Derecha) -->
      <div id="wes-chat-launcher" class="fixed bottom-6 right-6 z-40 flex items-center group cursor-pointer" onclick="toggleClientChat()" title="Chatear con el Asistente WES">
        <span class="hidden sm:inline-flex mr-2.5 px-3 py-1 bg-slate-900/90 text-wes-gold text-xs font-bold rounded-xl shadow-lg border border-wes-gold/40 backdrop-blur-xs transition group-hover:scale-105 pointer-events-none items-center space-x-1.5">
          <i class="fas fa-sparkles text-amber-400 text-[10px]"></i>
          <span>Sofía - Asistente WES</span>
        </span>
        <button type="button" aria-label="Abrir Asistente Virtual WES" class="w-14 h-14 bg-gradient-to-tr from-slate-950 via-wes-blue to-slate-900 border-2 border-wes-gold text-wes-gold rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative focus:outline-none focus:ring-4 focus:ring-wes-gold/30">
          <i id="wes-chat-launcher-icon" class="fas fa-headset text-2xl transition-transform duration-300"></i>
          <span class="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs animate-pulse" title="Asistente en línea"></span>
        </button>
      </div>

      <!-- Ventana del Chat de Clientes (Móvil Full / Desktop Ventana Flotante Elegante) -->
      <div id="wes-chat-modal" class="fixed inset-x-0 bottom-0 top-0 sm:top-auto sm:bottom-24 sm:right-6 sm:left-auto z-50 w-full sm:w-[410px] h-[100dvh] sm:h-[620px] max-h-[100dvh] sm:max-h-[88vh] bg-[#f8fafc] sm:rounded-3xl shadow-2xl border-0 sm:border sm:border-slate-200/90 flex-col overflow-hidden hidden transition-all duration-300 animate-fadeIn text-slate-800 font-sans">
        
        <!-- Encabezado Azul Marino Sofía WES -->
        <div class="px-4 py-3.5 bg-gradient-to-r from-[#071836] via-[#0D2A5C] to-[#0A224A] text-white flex items-center justify-between shadow-lg shrink-0 border-b border-[#F5B300]/30">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <img src="assets/sofia-avatar.jpg" alt="Sofía" class="w-11 h-11 rounded-full object-cover border-2 border-[#F5B300] shadow-md ring-2 ring-white/10">
              <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#071836] rounded-full shadow-xs"></span>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-extrabold text-sm tracking-wide text-white font-brand" id="wes-chat-header-title">Sofía</h3>
                <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  En línea
                </span>
              </div>
              <p class="text-[11px] text-slate-300">Asistente WES · Soporte y cotizaciones</p>
            </div>
          </div>

          <!-- Controles del Encabezado: Reiniciar y Cerrar -->
          <div class="flex items-center space-x-1">
            <button onclick="confirmResetClientChat()" type="button" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition active:scale-95 focus:outline-none" title="Reiniciar conversación">
              <i class="fas fa-redo-alt text-xs"></i>
            </button>
            <button onclick="toggleClientChat()" type="button" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition active:scale-95 focus:outline-none" title="Cerrar chat">
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Área de Mensajes Desplazable con Fondo Claro Texturizado WES -->
        <div id="wes-chat-messages" class="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 text-xs bg-[#f4f6f9] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
          <!-- Mensaje de Bienvenida Inicial -->
          <div class="flex items-end space-x-2 animate-fadeIn">
            <img src="assets/sofia-avatar.jpg" alt="Sofía" class="w-7 h-7 rounded-full object-cover border border-[#F5B300]/80 shrink-0 mb-4 shadow-xs">
            <div class="max-w-[85%]">
              <div class="bg-white p-3.5 rounded-2xl rounded-bl-none border border-slate-200/80 shadow-xs leading-relaxed text-slate-800">
                <p class="font-medium text-slate-900">¡Hola! Soy Sofía, asesora técnica de Warn Electrical Services. ¿En qué le puedo asistir hoy?</p>
              </div>
              <span class="text-[10px] text-slate-400 mt-1 ml-1 block font-mono">Justo ahora</span>
            </div>
          </div>
        </div>

        <!-- Formulario de Entrada de Texto adaptado a teclados móviles -->
        <form id="wes-chat-input-form" onsubmit="handleChatSubmit(event)" class="p-2.5 sm:p-3 bg-white border-t border-slate-200/90 flex items-center space-x-2 shrink-0 shadow-lg">
          <input type="text" id="wes-chat-user-input" placeholder="Escribe tu consulta o pregunta..." autocomplete="off" class="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-base sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D2A5C] focus:bg-white transition">
          <button type="submit" class="w-10 h-10 bg-[#0D2A5C] hover:bg-[#071836] active:scale-95 text-[#F5B300] rounded-2xl flex items-center justify-center transition shadow-md border border-[#F5B300]/40 shrink-0" title="Enviar mensaje">
            <i class="fas fa-paper-plane text-xs"></i>
          </button>
        </form>

        <!-- Pie de página sutil -->
        <div class="px-3.5 py-1.5 bg-slate-100/90 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between shrink-0">
          <span class="flex items-center space-x-1.5">
            <i class="fas fa-shield-alt text-emerald-600"></i>
            <span>Warn Electrical Services (WES)</span>
          </span>
          <a href="${WES_KB.empresa.whatsappUrl}" target="_blank" class="text-emerald-700 font-bold hover:underline flex items-center space-x-1">
            <i class="fab fa-whatsapp text-emerald-600"></i>
            <span>WhatsApp Directo</span>
          </a>
        </div>

      </div>
    `;
    document.body.appendChild(wrapper);
  }

  
  function getCurrentMessageTime() {
    try {
      const d = new Date();
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }
function setupChatEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatSession.isOpen) {
        toggleClientChat();
      }
    });

    window.addEventListener('wes_ai_config_updated', (e) => {
      const wrapper = document.getElementById('wes-client-chat-wrapper');
      if (e.detail && e.detail.enabled === false) {
        if (wrapper) wrapper.classList.add('hidden');
      } else {
        if (!wrapper) {
          renderChatLauncherAndModal();
        } else {
          wrapper.classList.remove('hidden');
        }
      }
    });
  }

  // Abrir o cerrar la ventana de chat
  function toggleClientChat() {
    const modal = document.getElementById('wes-chat-modal');
    const icon = document.getElementById('wes-chat-launcher-icon');
    if (!modal) return;

    chatSession.isOpen = !chatSession.isOpen;

    if (chatSession.isOpen) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (icon) {
        icon.className = 'fas fa-chevron-down text-xl';
      }
      setTimeout(() => {
        document.getElementById('wes-chat-user-input')?.focus();
        scrollToBottom();
      }, 100);
    } else {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      if (icon) {
        icon.className = 'fas fa-headset text-2xl';
      }
    }
  }

  function scrollToBottom() {
    const msgContainer = document.getElementById('wes-chat-messages');
    if (msgContainer) {
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }
  }

  function appendUserMessage(text) {
    const msgContainer = document.getElementById('wes-chat-messages');
    if (!msgContainer) return;

    const timeStr = getCurrentMessageTime();
    const div = document.createElement('div');
    div.className = 'flex justify-end animate-fadeIn';
    div.innerHTML = `
      <div class="max-w-[85%] flex flex-col items-end">
        <div class="bg-[#0D2A5C] text-white px-4 py-2.5 rounded-2xl rounded-br-none shadow-sm leading-relaxed text-xs font-normal">
          ${escapeHtml(text)}
        </div>
        ${timeStr ? `<span class="text-[10px] text-slate-400 mt-1 mr-1 font-mono">${timeStr}</span>` : ''}
      </div>
    `;
    msgContainer.appendChild(div);
    scrollToBottom();
  }

  function appendBotMessage(htmlContent) {
    const msgContainer = document.getElementById('wes-chat-messages');
    if (!msgContainer) return;

    const timeStr = getCurrentMessageTime();
    const div = document.createElement('div');
    div.className = 'flex items-end space-x-2 animate-fadeIn';
    div.innerHTML = `
      <img src="assets/sofia-avatar.jpg" alt="Sofía" class="w-7 h-7 rounded-full object-cover border border-[#F5B300]/80 shrink-0 mb-4 shadow-xs">
      <div class="max-w-[88%] flex flex-col items-start">
        <div class="bg-white p-3.5 rounded-2xl rounded-bl-none border border-slate-200/90 shadow-xs leading-relaxed text-slate-800 text-xs">
          ${htmlContent}
        </div>
        ${timeStr ? `<span class="text-[10px] text-slate-400 mt-1 ml-1 font-mono">${timeStr}</span>` : ''}
      </div>
    `;
    msgContainer.appendChild(div);
    scrollToBottom();
  }

  function appendTypingIndicator() {
    const msgContainer = document.getElementById('wes-chat-messages');
    if (!msgContainer) return null;

    const existing = document.getElementById('wes-chat-typing');
    if (existing) return existing;

    const div = document.createElement('div');
    div.id = 'wes-chat-typing';
    div.className = 'flex items-start space-x-2 animate-fadeIn';
    div.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-wes-dark via-wes-blue to-slate-900 text-wes-gold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs border border-wes-gold/30">
        <i class="fas fa-robot animate-pulse"></i>
      </div>
      <div class="bg-white px-3.5 py-2.5 rounded-2xl rounded-tl-none border border-slate-200/90 shadow-xs text-slate-600 text-xs flex items-center space-x-2">
        <div class="flex items-center space-x-1">
          <span class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style="animation-delay: 0s;"></span>
          <span class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style="animation-delay: 0.18s;"></span>
          <span class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style="animation-delay: 0.36s;"></span>
        </div>
        <span class="text-[11px] font-medium text-slate-500">Asistente WES está escribiendo...</span>
      </div>
    `;
    msgContainer.appendChild(div);
    scrollToBottom();
    return div;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('wes-chat-typing');
    if (el) el.remove();
  }

  // Simular tiempo de digitación / razonamiento natural humano (entre 3.5s y 5.5s, promedio ~4.5s - 5s)
  function getNaturalTypingDelay(replyText = '') {
    const textLen = replyText ? replyText.length : 150;
    if (textLen < 120) {
      return 3200 + Math.floor(Math.random() * 1000); // 3.2s a 4.2s
    } else if (textLen > 400) {
      return 4500 + Math.floor(Math.random() * 1200); // 4.5s a 5.7s (~5 segundos)
    } else {
      return 3800 + Math.floor(Math.random() * 1400); // 3.8s a 5.2s (~5 segundos)
    }
  }

  const PROMPT_VERSION = '3.2 - Corto, Amable y Directo (Máximo 2 Líneas)';
  const DEFAULT_SYSTEM_PROMPT = "Eres Sofía, Asesora Técnica y Comercial Oficial de Warn Electrical Services, SRL (WES) en Moca, República Dominicana.\n" +
    "Atiendes con calidez dominicana, amabilidad y precisión profesional.\n\n" +
    "REGLAS ESTRICTAS DE RESPUESTA:\n" +
    "1. LONGITUD Y FORMATO (CONSULTAS NORMALES):\n" +
    "   - Máximo 2 frases y 40 palabras en total.\n" +
    "   - Responde primero exactamente lo preguntado.\n" +
    "   - Si falta información imprescindible, haz como máximo UNA sola pregunta concreta al final.\n" +
    "   - No uses rodeos, saludos repetidos ni frases de relleno genéricas.\n\n" +
    "2. SALUDO E IDENTIDAD:\n" +
    "   - Preséntate amablemente como Sofía de WES ÚNICAMENTE en el primer mensaje de la conversación si el usuario saluda o pregunta quién eres.\n" +
    "   - En mensajes posteriores, NO vuelvas a saludar ni repitas tu presentación.\n\n" +
    "3. CONTINUIDAD Y CONTEXTO:\n" +
    "   - Conserva siempre el hilo, producto, cantidades y el tipo de negocio conversado previamente. Si el usuario pregunta \"¿Necesitan wifi?\", responde en estricta referencia al producto en discusión (por ejemplo cámaras CCTV o control de acceso).\n\n" +
    "4. PRECISIÓN TÉCNICA Y OBJETIVIDAD:\n" +
    "   - En cámaras cableadas (DVR/NVR), aclara que graban de forma autónoma sin internet y que el Wi-Fi/red solo se requiere para monitoreo remoto en el celular.\n" +
    "   - NUNCA afirmes que una cantidad de cámaras cubre perfectamente un local sin conocer sus dimensiones o distribución.\n" +
    "   - No agregues listas de características no solicitadas, ventajas comerciales, teléfonos ni WhatsApp si no han sido pedidos expresamente.\n" +
    "   - No inventes precios, disponibilidad ni productos inexistentes.\n\n" +
    "5. EXCEPCIÓN DE AMPLIACIÓN:\n" +
    "   - Amplía la explicación con detalles técnicos ÚNICAMENTE cuando el usuario solicite explícitamente detalles (ej. \"explícame con más detalle\"), desglose técnico o advertencias de seguridad.\n\n" +
    "6. HORARIOS Y SEDE:\n" +
    "   - Lunes a Viernes de 8:00 AM a 6:00 PM | Sábados de 8:00 AM a 1:00 PM (cerramos a la 1:00 PM). Domingos cerrado. Sede: Autopista Ramón Cáceres, Moca.";

  async function queryAIBackend(userMessage) {
    const backendUrl = localStorage.getItem('wes_backend_url') || 'https://script.google.com/macros/s/AKfycbyoN8TnzeN9Cg2X44YEt6KeQULahvG0DrEXP5m4HyLvJFs475maMjVrwjW8t-IRVIQ_OQ/exec';
    
    // Fallback local solo si el administrador configuró una clave en este navegador
    let localApiKey = '';
    try {
      const stored = localStorage.getItem('wes_ai_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.enabled === false) return { disabled: true };
        localApiKey = parsed.apiKey || '';
      }
    } catch (e) {}

    // 1. Consultar vía Backend Seguro en Google Apps Script
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000);

      const payload = {
        action: 'query_gemini_chat',
        data: {
          message: userMessage,
          history: chatSession.chatHistory || [],
          clientFallbackKey: localApiKey
        }
      };

      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.reply) {
          if (data.assistantName) {
            const hTitle = document.getElementById('wes-chat-header-title');
            if (hTitle) hTitle.textContent = data.assistantName + ' - Asistente WES';
          }
          return { ok: true, reply: data.reply, model: data.model, assistantName: data.assistantName || 'Sofía' };
        } else if (data && data.errorType) {
          return { ok: false, errorType: data.errorType, message: data.message };
        }
      }
    } catch (err) {
      console.warn('[WES Chat] Error consultando backend central de IA:', err);
    }

    // 2. Respaldo directo en cliente SOLO si existe clave local en este navegador
    if (localApiKey && localApiKey.length > 5) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(localApiKey);
        
        let contents = [];
        if (Array.isArray(chatSession.chatHistory)) {
          contents = chatSession.chatHistory.slice(-8).map(h => ({
            role: h.role,
            parts: [{ text: h.content }]
          }));
        }
        contents.push({ role: 'user', parts: [{ text: userMessage }] });

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: DEFAULT_SYSTEM_PROMPT }] },
            contents: contents,
            generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim();
          if (reply) return { ok: true, reply, model: 'gemini-2.0-flash (local-fallback)', assistantName: 'Sofía' };
        }
      } catch (locErr) {
        console.warn('[WES Chat] Fallback local falló:', locErr);
      }
    }

    return {
      ok: false,
      errorType: 'AI_UNAVAILABLE',
      message: 'En este momento nuestro asistente virtual no pudo procesar la respuesta. Por favor reintente su consulta o comuníquese con nosotros por WhatsApp.'
    };
  }

  // Manejar clics de los chips de sugerencia rápida
  function handleQuickChipClick(topic) {
    if (topic === 'ticket') {
      appendUserMessage('Quiero consultar el estado de mi ticket.');
      chatSession.step = 'awaiting_ticket_query';
      appendBotMessage(`
        <p class="font-bold text-slate-900 mb-1">🔍 Consulta de Estado de Servicio</p>
        <p class="text-slate-600 mb-2">Por favor escribe el <strong>código de tu ticket</strong> (ejemplo: <code>SRV-2026-0001</code> o solo <code>0001</code>), o tu número de teléfono registrado:</p>
        <div class="flex flex-wrap gap-1.5 pt-1">
          <button type="button" onclick="querySpecificTicket('SRV-2026-0001')" class="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 border border-slate-300 text-slate-700 rounded-md text-[10px] font-mono">SRV-2026-0001</button>
          <button type="button" onclick="querySpecificTicket('SRV-2026-0002')" class="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 border border-slate-300 text-slate-700 rounded-md text-[10px] font-mono">SRV-2026-0002</button>
        </div>
      `);
    } else if (topic === 'motores') {
      appendUserMessage('¿Qué opciones de motores para portones tienen?');
      appendBotMessage(`
        <p class="font-bold text-slate-900 mb-1">⚡ Motores para Portones Eléctricos CAME</p>
        <p class="text-slate-600 mb-2">${WES_KB.servicios[0].detalle}</p>
        <div class="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1 text-slate-700 mb-2 text-xs">
          <div>• <strong>CAME BXV 400kg / 600kg:</strong> Residencial rápido y silencioso.</div>
          <div>• <strong>CAME BXV 800kg / 1000kg:</strong> Alto tráfico y condominios.</div>
        </div>
        <p class="text-slate-600 text-xs">¿Deseas una cotización para un modelo específico? Indícanos por aquí si tu portón es corredizo o batiente y tus datos de contacto; uno de nuestros asesores comerciales te llamará para preparar tu cotización formal.</p>
      `);
    } else if (topic === 'inversores') {
      appendUserMessage('¿Dan mantenimiento a inversores en laboratorio?');
      appendBotMessage(`
        <p class="font-bold text-slate-900 mb-1">🔋 Laboratorio Especializado de Inversores WES</p>
        <p class="text-slate-600 mb-2">${WES_KB.servicios[1].detalle}</p>
        <p class="text-slate-600 mb-2 text-xs">Contamos con banco de pruebas y técnicos certificados para marcas como <strong>Trace Engineering, Magnum Energy y Outback</strong>.</p>
        <p class="text-slate-600 text-xs">Si tu equipo presenta fallas o requiere mantenimiento preventivo, déjanos por aquí la marca, modelo y tu número telefónico, y coordinamos la recepción técnica en nuestro laboratorio.</p>
      `);
    } else if (topic === 'horarios') {
      appendUserMessage('¿Cuáles son los horarios y ubicación del taller WES?');
      appendBotMessage(`
        <p class="font-bold text-slate-900 mb-1">📍 Warn Electrical Services, SRL</p>
        <p class="text-slate-700 mb-1.5 text-xs"><strong>Dirección:</strong> ${WES_KB.empresa.ubicacion}</p>
        <p class="text-slate-700 mb-2 text-xs"><strong>Horario de Atención:</strong><br>${WES_KB.empresa.horario}</p>
        <p class="text-slate-600 text-xs">Brindamos cobertura directa para Moca, Santiago, Licey, Salcedo, La Vega y toda la región del Cibao. ¿En qué más podemos ayudarte hoy?</p>
      `);
    } else if (topic === 'soporte') {
      appendUserMessage('Necesito solicitar un servicio técnico.');
      startServiceRequestFlow();
    }
  }

  // Buscar un ticket y mostrar ÚNICAMENTE información pública para el cliente (Taller 3 Security & Privacy)
  function findTicketPublicStatus(query) {
    if (!query || !query.trim()) return null;
    const cleanQuery = query.trim().toUpperCase();

    if (typeof KDSService === 'undefined' || typeof KDSService.getServices !== 'function') {
      return null;
    }

    const services = KDSService.getServices();
    const digitsOnly = cleanQuery.replace(/\D/g, '');

    const match = services.find(s => {
      const sId = (s.id || '').toUpperCase();
      const sPhone = (s.phone || '').replace(/\D/g, '');
      const sClient = (s.clientName || '').toUpperCase();

      if (sId === cleanQuery) return true;
      if (cleanQuery.length >= 4 && sId.includes(cleanQuery)) return true;
      if (digitsOnly.length >= 4 && sId.endsWith(digitsOnly)) return true;
      if (digitsOnly.length >= 7 && sPhone.includes(digitsOnly)) return true;
      if (cleanQuery.length >= 4 && sClient.includes(cleanQuery)) return true;
      return false;
    });

    return match || null;
  }

  function querySpecificTicket(ticketCode) {
    appendUserMessage(`Consultar ticket ${ticketCode}`);
    executeTicketSearch(ticketCode);
  }

  function executeTicketSearch(query) {
    const ticket = findTicketPublicStatus(query);

    if (!ticket) {
      appendBotMessage(`
        <div class="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 mb-2">
          <div class="flex items-center space-x-1.5 font-bold mb-1">
            <i class="fas fa-exclamation-circle text-rose-600"></i>
            <span>No se encontró ningún ticket con esa referencia</span>
          </div>
          <p class="text-[11px] text-rose-700">Verifica el número de orden (ej. <code>SRV-2026-0001</code>) o el teléfono con el que fue registrado.</p>
        </div>
        <p class="text-slate-600">¿Deseas que un técnico de recepción te asista directamente?</p>
        <p class="text-[11px] text-slate-600 mt-2">Si no recuerda su número de ticket, por favor indíquenos en este chat su Nombre completo y Teléfono registrado para ayudarle a ubicar su equipo en el taller.</p>
      `);
      return;
    }

    const state = typeof KDSService !== 'undefined' ? KDSService.calculateTimeState(ticket) : { label: ticket.status || 'En Proceso' };
    const dateFormatted = typeof KDSService !== 'undefined' ? KDSService.formatShortDate(ticket.createdAt || ticket.date) : 'Reciente';

    // Regla de Seguridad Taller 3: Aislamiento estricto de notas de laboratorio internas.
    // Solo se muestra el estatus general y confirmación pública.
    let statusBadgeClass = 'bg-blue-600 text-white';
    let statusText = ticket.status || 'En Atención';

    if (ticket.status === 'Terminado' || ticket.status === 'Resuelto') {
      statusBadgeClass = 'bg-emerald-600 text-white';
      statusText = 'Listo / Terminado para Entrega';
    } else if (ticket.status === 'En laboratorio') {
      statusBadgeClass = 'bg-amber-500 text-slate-950 font-bold';
      statusText = 'En Laboratorio Técnico (En Pruebas)';
    } else if (ticket.status === 'En reparación') {
      statusBadgeClass = 'bg-indigo-600 text-white';
      statusText = 'En Reparación / Mantenimiento';
    } else if (ticket.status === 'Nuevo') {
      statusBadgeClass = 'bg-emerald-600 text-white';
      statusText = 'Ingresado / En Cola de Atención';
    }

    appendBotMessage(`
      <div class="p-3 bg-white rounded-xl border-2 border-wes-gold/50 shadow-sm space-y-2">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <span class="font-mono font-black text-wes-blue text-xs tracking-wider">${escapeHtml(ticket.id)}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${statusBadgeClass}">
            ${escapeHtml(statusText)}
          </span>
        </div>
        <div class="space-y-1 text-slate-700">
          <div><span class="text-slate-400 font-bold">Cliente:</span> <strong>${escapeHtml(ticket.clientName)}</strong></div>
          <div><span class="text-slate-400 font-bold">Equipo:</span> <strong>${escapeHtml(ticket.productSystem || 'Servicio Técnico')}</strong></div>
          <div><span class="text-slate-400 font-bold">Ubicación:</span> ${escapeHtml(ticket.address || 'Taller WES Moca')}</div>
          <div><span class="text-slate-400 font-bold">Fecha de Ingreso:</span> ${escapeHtml(dateFormatted)}</div>
        </div>
        <div class="p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-600">
          <span class="font-bold text-slate-800 block mb-0.5"><i class="fas fa-info-circle text-amber-500 mr-1"></i>Información al Cliente:</span>
          ${escapeHtml(ticket.description || 'Su equipo se encuentra en proceso de atención técnica por el equipo de WES.')}
        </div>
        <div class="pt-1 flex items-center justify-between text-[10px]">
          <span class="text-slate-400 font-medium">Prioridad: <strong>${escapeHtml(ticket.priority || 'Normal')}</strong></span>
          <span class="text-slate-500 font-semibold">Taller WES Moca</span>
        </div>
      </div>
    `);

    chatSession.step = 'idle';
  }

  // Flujo Human-in-the-Loop para generar una solicitud de soporte asistida (Taller 3)
  function startServiceRequestFlow(presetEquipment = '') {
    chatSession.step = 'drafting_ticket';
    chatSession.ticketDraft = {
      name: '',
      phone: '',
      equipment: presetEquipment || '',
      address: '',
      description: ''
    };

    appendBotMessage(`
      <p class="font-bold text-slate-900 mb-1">🛠️ Registro Asistido de Solicitud Técnica</p>
      <p class="text-slate-600 mb-2">Con gusto preparamos tu solicitud. Para ingresar tu orden directamente a nuestro sistema, por favor indícame:</p>
      <div class="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-950 space-y-1 mb-2">
        <div>1. <strong>Tu Nombre Completo</strong></div>
        <div>2. <strong>Tu Teléfono o WhatsApp</strong></div>
        <div>3. <strong>Equipo y Falla</strong> que presenta</div>
      </div>
      <p class="text-[11px] text-slate-500">Puedes escribirlo todo en un solo mensaje. Ejemplo:<br><em>"Carlos Peña, 809-578-1234, Moca, mi inversor Trace no enciende."</em></p>
    `);
  }

  function handleDraftParsing(text) {
    // Extracción inteligente de datos
    const phoneMatch = text.match(/(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // Separar posibles partes
    const parts = text.split(/[,;\n]+/).map(p => p.trim()).filter(Boolean);
    let name = parts[0] || 'Cliente Web';
    if (phone && name.includes(phone)) {
      name = 'Cliente WES';
    }

    const description = text;

    chatSession.ticketDraft.name = name;
    chatSession.ticketDraft.phone = phone || '(809) ';
    chatSession.ticketDraft.address = 'Moca, Rep. Dominicana';
    chatSession.ticketDraft.equipment = chatSession.ticketDraft.equipment || 'Revisión Técnica General';
    chatSession.ticketDraft.description = description;

    // Presentar borrador con Human-in-the-Loop para confirmación antes de guardar
    appendBotMessage(`
      <div class="p-3 bg-white rounded-xl border border-amber-300 shadow-sm space-y-2">
        <div class="flex items-center space-x-1.5 font-bold text-amber-900 text-xs border-b border-amber-100 pb-1.5">
          <i class="fas fa-clipboard-check text-amber-600"></i>
          <span>Borrador de Solicitud de Servicio Técnico</span>
        </div>
        <p class="text-[11px] text-slate-600">Por favor confirma los datos antes de ingresarlo al sistema:</p>
        <div class="space-y-1 text-slate-700 text-xs">
          <div><span class="text-slate-400 font-bold">Cliente:</span> <strong>${escapeHtml(chatSession.ticketDraft.name)}</strong></div>
          <div><span class="text-slate-400 font-bold">Teléfono:</span> <strong>${escapeHtml(chatSession.ticketDraft.phone)}</strong></div>
          <div><span class="text-slate-400 font-bold">Detalle del requerimiento:</span> ${escapeHtml(chatSession.ticketDraft.description)}</div>
        </div>
        <div class="pt-2 flex items-center space-x-2">
          <button type="button" onclick="confirmTicketDraft()" class="flex-1 py-2 bg-wes-blue hover:bg-wes-dark text-white rounded-xl font-bold text-xs transition shadow-xs flex items-center justify-center space-x-1 border border-wes-gold/40">
            <i class="fas fa-check text-wes-gold"></i>
            <span>Confirmar e Ingresar Ticket</span>
          </button>
          <button type="button" onclick="cancelTicketDraft()" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition">
            Cancelar
          </button>
        </div>
      </div>
    `);
  }

  function confirmTicketDraft() {
    if (typeof KDSService === 'undefined' || typeof KDSService.createService !== 'function') {
      appendBotMessage(`
        <p class="text-rose-600 font-bold">No fue posible conectar con el sistema de órdenes en este momento.</p>
        <p class="text-slate-600">Por favor comunícate directamente por WhatsApp al <a href="${WES_KB.empresa.whatsappUrl}" class="text-emerald-600 font-bold">${WES_KB.empresa.telefono}</a>.</p>
      `);
      return;
    }

    const draft = chatSession.ticketDraft;
    const res = KDSService.createService({
      clientName: draft.name || 'Cliente WES',
      phone: draft.phone && draft.phone.length > 5 ? draft.phone : '(849) 207-5474',
      productSystem: draft.equipment || 'Servicio Técnico Solicitado',
      address: draft.address || 'Moca, Rep. Dominicana',
      description: draft.description || 'Solicitud generada desde el Asistente Virtual Web.',
      priority: 'Normal'
    });

    if (res.success) {
      appendBotMessage(`
        <div class="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 space-y-2">
          <div class="flex items-center space-x-1.5 font-black text-emerald-800 text-xs">
            <i class="fas fa-check-circle text-emerald-600 text-sm"></i>
            <span>¡Solicitud Registrada Exitosamente!</span>
          </div>
          <p class="text-xs">Tu orden ha sido ingresada en tiempo real al tablero de nuestros técnicos de taller con el código:</p>
          <div class="p-2 bg-white rounded-lg border border-emerald-200 text-center font-mono font-black text-sm text-wes-blue">
            ${escapeHtml(res.service.id)}
          </div>
          <p class="text-[11px] text-emerald-800">Un técnico de WES se pondrá en contacto contigo a la brevedad para coordinar la revisión.</p>
        </div>
      `);
      chatSession.step = 'idle';
      chatSession.ticketDraft = {};
    } else {
      appendBotMessage(`
        <p class="text-rose-600 font-bold">${escapeHtml(res.message || 'Error al guardar la solicitud')}</p>
      `);
    }
  }

  function cancelTicketDraft() {
    chatSession.step = 'idle';
    chatSession.ticketDraft = {};
    appendBotMessage('<p class="text-slate-600">Solicitud cancelada. ¿En qué más te puedo asistir?</p>');
  }

  // Procesamiento principal de mensajes enviados por el usuario
  async function handleChatSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('wes-chat-user-input');
    const submitBtn = document.querySelector('#wes-chat-input-form button[type="submit"]');
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = '';

    // Bloquear controles mientras el asistente analiza y escribe la respuesta
    input.disabled = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    const origPlaceholder = input.placeholder || 'Escribe tu consulta o número de ticket...';
    input.placeholder = 'Asistente WES está escribiendo...';

    appendUserMessage(query);

    const startTime = Date.now();
    appendTypingIndicator();

    try {
      // 1. Si estábamos esperando el código del ticket
      if (chatSession.step === 'awaiting_ticket_query') {
        const targetDelay = 2200 + Math.floor(Math.random() * 800);
        const elapsed = Date.now() - startTime;
        if (targetDelay > elapsed) await new Promise(r => setTimeout(r, targetDelay - elapsed));
        removeTypingIndicator();
        executeTicketSearch(query);
        return;
      }

      // 2. Si estábamos en el flujo de borrador de ticket
      if (chatSession.step === 'drafting_ticket') {
        const targetDelay = 2200 + Math.floor(Math.random() * 800);
        const elapsed = Date.now() - startTime;
        if (targetDelay > elapsed) await new Promise(r => setTimeout(r, targetDelay - elapsed));
        removeTypingIndicator();
        handleDraftParsing(query);
        return;
      }

      const lower = query.toLowerCase().trim();

      // 3. Detección automática si el usuario escribió un código de ticket directamente
      if (/^\s*(SRV|TKT)[-\s]?[A-Z0-9-]{3,}\s*$/i.test(query) || /^\s*\d{4}\s*$/.test(query) || /srv-\d{4}-\d{4}/i.test(lower)) {
        const targetDelay = 2200 + Math.floor(Math.random() * 800);
        const elapsed = Date.now() - startTime;
        if (targetDelay > elapsed) await new Promise(r => setTimeout(r, targetDelay - elapsed));
        removeTypingIndicator();
        executeTicketSearch(query);
        return;
      }

      // 4. Intención explícita de consultar ticket o estado de orden técnica
      if (/(consultar ticket|ver ticket|estado de ticket|estatus de orden|consultar orden|ver mi orden|como va mi equipo)/i.test(lower)) {
        const targetDelay = 2000 + Math.floor(Math.random() * 800);
        const elapsed = Date.now() - startTime;
        if (targetDelay > elapsed) await new Promise(r => setTimeout(r, targetDelay - elapsed));
        removeTypingIndicator();
        chatSession.step = 'awaiting_ticket_query';
        appendBotMessage(`
          <p class="font-bold text-slate-900 mb-1">🔍 Consulta de Ticket Técnico WES</p>
          <p class="text-slate-600">Por favor indíqueme el <strong>código de su ticket</strong> (ejemplo: <code>SRV-2026-0001</code> o solo <code>0001</code>) o su número de teléfono registrado en el taller:</p>
        `);
        return;
      }

      // 4.1 Detección inteligente de consultas sobre horarios y cierre de hoy (Respuesta de MÁXIMO 2 LÍNEAS)
      const isHoursQuery = /(hasta\s+qu[eé]\s+hora|qu[eé]\s+hora\s+(est[aá]n|cierran|abren)|a\s+qu[eé]\s+hora|horario|est[aá]n\s+abiertos|abierto\s+hoy|hora\s+est[aá]n|esta\s+que\s+hora|s[aá]bado)/i.test(lower);
      const asksAboutSaturday = /(s[aá]bado|sabados|fin de semana)/i.test(lower);
      if (isHoursQuery) {
        let scheduleReply = '';
        if (asksAboutSaturday) {
          scheduleReply = "Los sábados laboramos de 8:00 a.m. a 1:00 p.m. ¿Deseas visitarnos en el taller o programar un servicio técnico?";
        } else {
          try {
            const nowRD = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santo_Domingo" }));
            const day = nowRD.getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
            if (day >= 1 && day <= 5) {
              scheduleReply = "Hoy estamos laborando hasta las 6:00 p.m. ¿En qué podemos servirle hoy?";
            } else if (day === 6) {
              scheduleReply = "Hoy sábado estamos laborando hasta la 1:00 p.m. ¿En qué podemos servirle hoy?";
            } else {
              scheduleReply = "Hoy domingo nuestras oficinas están cerradas; abrimos mañana lunes a las 8:00 a.m. ¿En qué podemos servirle?";
            }
          } catch (e) {
            scheduleReply = "Nuestro horario regular es de lunes a viernes de 8:00 a.m. a 6:00 p.m., y sábados hasta la 1:00 p.m. ¿En qué podemos servirle hoy?";
          }
        }

        const targetDelay = getNaturalTypingDelay(scheduleReply);
        const elapsed = Date.now() - startTime;
        if (targetDelay > elapsed) await new Promise(r => setTimeout(r, targetDelay - elapsed));
        removeTypingIndicator();

        appendBotMessage(`
          <p class="leading-relaxed text-slate-800">${escapeHtml(scheduleReply).replace(/\n/g, '<br>')}</p>
        `);
        if (!chatSession.chatHistory) chatSession.chatHistory = [];
        chatSession.chatHistory.push({ role: 'user', content: query });
        chatSession.chatHistory.push({ role: 'model', content: scheduleReply });
        if (chatSession.chatHistory.length > 16) chatSession.chatHistory = chatSession.chatHistory.slice(-16);
        return;
      }

      // 5. Toda consulta conversacional va al backend de Inteligencia Artificial (Google Gemini)
      const aiResult = await queryAIBackend(query);

      // Calcular tiempo de digitación / razonamiento natural (entre 3.5s y 5.5s, "muchas veces 5 segundos")
      const replyContent = (aiResult && aiResult.ok && aiResult.reply) ? aiResult.reply : '';
      const targetDelay = getNaturalTypingDelay(replyContent);
      const elapsed = Date.now() - startTime;
      const remaining = targetDelay - elapsed;

      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }

      removeTypingIndicator();

      if (aiResult && aiResult.ok && aiResult.reply) {
        // Respuesta puramente conversacional en burbuja limpia, SIN botones externos (MÁXIMO 2 LÍNEAS)
        appendBotMessage(`
          <div class="space-y-1.5">
            <div class="flex items-center space-x-1.5 text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-0.5">
              <i class="fas fa-sparkles text-amber-500"></i>
              <span>Respuesta Asistente WES IA</span>
            </div>
            <div class="leading-relaxed text-slate-800 text-xs">
              ${escapeHtml(aiResult.reply).replace(/\n\n/g, '<br>').replace(/\n/g, '<br>')}
            </div>
          </div>
        `);
        
        // Actualizar memoria conversacional con rol user y model
        if (!chatSession.chatHistory) chatSession.chatHistory = [];
        chatSession.chatHistory.push({ role: 'user', content: query });
        chatSession.chatHistory.push({ role: 'model', content: aiResult.reply });
        if (chatSession.chatHistory.length > 16) chatSession.chatHistory = chatSession.chatHistory.slice(-16);
        return;
      }

      // 6. Aviso veraz cuando el servicio de IA no responde (Sin respuestas simuladas por palabras clave)
      const errNotice = (aiResult && aiResult.message) 
        ? aiResult.message 
        : 'En este momento nuestro asistente virtual no pudo procesar la respuesta. Por favor reintente o comuníquese por WhatsApp.';

      appendBotMessage(`
        <div class="space-y-2">
          <div class="flex items-center space-x-1.5 text-[10px] text-amber-800 font-bold uppercase tracking-wider mb-0.5">
            <i class="fas fa-exclamation-triangle text-amber-600"></i>
            <span>Asistente Sofía - Aviso de Servicio</span>
          </div>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(errNotice)}</p>
          <div class="pt-2 border-t border-slate-200 flex flex-wrap gap-2 items-center text-[11px]">
            <button type="button" onclick="retryUserQuery('${escapeHtml(query).replace(/'/g, "\\'")}')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition shadow-xs flex items-center space-x-1">
              <i class="fas fa-redo-alt text-[10px]"></i>
              <span>Reintentar</span>
            </button>
            <a href="${WES_KB.empresa.whatsappUrl}" target="_blank" rel="noopener" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-xs flex items-center space-x-1">
              <i class="fab fa-whatsapp text-[11px]"></i>
              <span>WhatsApp Directo</span>
            </a>
          </div>
        </div>
      `);
    } finally {
      // Restaurar controles y foco
      if (input) {
        input.disabled = false;
        input.placeholder = origPlaceholder;
        setTimeout(() => input.focus(), 60);
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  }

  // Exportar funciones a window para interacción con el DOM
    function retryUserQuery(q) {
    const input = document.getElementById('wes-chat-user-input');
    if (input) {
      input.value = q;
      handleChatSubmit(new Event('submit'));
    }
  }

  
  function confirmResetClientChat() {
    if (!confirm('¿Deseas reiniciar la conversación con Sofía? Se borrarán los mensajes anteriores.')) {
      return;
    }
    chatSession.chatHistory = [];
    chatSession.step = 'idle';
    chatSession.ticketDraft = { name: '', phone: '', equipment: '', address: '', description: '' };
    
    const msgContainer = document.getElementById('wes-chat-messages');
    if (msgContainer) {
      msgContainer.innerHTML = `
        <div class="flex items-end space-x-2 animate-fadeIn">
          <img src="assets/sofia-avatar.jpg" alt="Sofía" class="w-7 h-7 rounded-full object-cover border border-[#F5B300]/80 shrink-0 mb-4 shadow-xs">
          <div class="max-w-[85%]">
            <div class="bg-white p-3.5 rounded-2xl rounded-bl-none border border-slate-200/80 shadow-xs leading-relaxed text-slate-800">
              <p class="font-medium text-slate-900">¡Hola! Soy Sofía, asesora técnica de Warn Electrical Services. ¿En qué le puedo asistir hoy?</p>
            </div>
            <span class="text-[10px] text-slate-400 mt-1 ml-1 block font-mono">Justo ahora</span>
          </div>
        </div>
      `;
    }
    const input = document.getElementById('wes-chat-user-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }
if (typeof window !== 'undefined') {
    window.toggleClientChat = toggleClientChat;
    window.confirmResetClientChat = confirmResetClientChat;
    window.handleQuickChipClick = handleQuickChipClick;
    window.handleChatSubmit = handleChatSubmit;
    window.retryUserQuery = retryUserQuery;
    window.querySpecificTicket = querySpecificTicket;
    window.startServiceRequestFlow = startServiceRequestFlow;
    window.confirmTicketDraft = confirmTicketDraft;
    window.cancelTicketDraft = cancelTicketDraft;

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initClientChat);
      } else {
        initClientChat();
      }
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WES_KB, findTicketPublicStatus };
  }

})();
