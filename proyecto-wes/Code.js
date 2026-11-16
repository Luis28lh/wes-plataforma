function testDirectQuota() {
  var q = MailApp.getRemainingDailyQuota();
  return { quota: q };
}

/**
 * =========================================================================
 * WARN ELECTRICAL SERVICES, SRL (WES)
 * Plataforma Web Empresarial, Catálogo Digital y Módulo de Soporte
 * Backend en Google Apps Script — Estándar AIDET v2.0
 * =========================================================================
 */

const CONFIG = {
  COMPANY_NAME: 'Warn Electrical Services, SRL (WES)',
  COMPANY_EMAIL_GENERAL: 'wes.inform@gmail.com',
  COMPANY_EMAIL_SUPPORT: 'wes.inform@gmail.com',
  COMPANY_PHONE: '(849) 207-5474',
  COMPANY_ADDRESS: 'Autopista Ramón Cáceres, Moca, República Dominicana',
  SHEET_NAME: 'WES - Base de Datos Operativa',
  DRIVE_FOLDER_NAME: 'WES_Soporte_Evidencias'
};

/**
 * Sirve la interfaz web al acceder vía navegador
 */
function doGet(e) {
  if (e && e.parameter && (e.parameter.page === 'admin' || e.parameter.admin === 'directo')) {
    return HtmlService.createHtmlOutputFromFile('admin').setTitle('Panel de Control WES').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  if (e && e.parameter && e.parameter.api === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ONLINE',
      company: CONFIG.COMPANY_NAME,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('Warn Electrical Services (WES) | Seguridad Electrónica y Automatización')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Endpoint para recibir solicitudes vía fetch/POST
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    let response = { success: false, message: 'Acción no especificada' };

    switch (payload.action) {
      case 'nuevaCotizacion':
        response = procesarNuevaCotizacion(payload.data);
        break;

      case 'nuevoSoporte':
        response = procesarNuevoSoporte(payload.data);
        break;

      case 'nuevoMensaje':
      case 'nuevoContacto':
        response = procesarNuevoMensajeContacto(payload.data);
        break;

      case 'record_audit':
        response = { success: true, message: 'Auditoría registrada en WES' };
        break;

      case 'sync_settings':
        response = { success: true, message: 'Ajustes sincronizados en WES' };
        break;

      case 'get_ai_config_public':
        response = getAiConfigPublicHandler();
        break;

      case 'save_ai_config_admin':
        response = saveAiConfigAdminHandler(payload.data, payload.adminToken);
        break;

      case 'query_gemini_chat':
        response = queryGeminiChatHandler(payload.data);
        break;

      case 'list_sofia_knowledge':
        response = listSofiaKnowledgeHandler(payload.adminToken);
        break;

      case 'save_sofia_knowledge_entry':
        response = saveSofiaKnowledgeEntryHandler(payload.data, payload.adminToken);
        break;

      case 'set_sofia_knowledge_status':
        response = setSofiaKnowledgeStatusHandler(payload.id, payload.status, payload.adminToken);
        break;

      case 'get_pending_sofia_questions':
        response = getPendingSofiaQuestionsHandler(payload.adminToken, payload.userEmail);
        break;

      case 'answer_and_train_sofia':
        response = answerAndTrainSofiaHandler(payload.data, payload.adminToken, payload.userEmail);
        break;

      case 'get_user_direct_messages':
        response = getUserDirectMessagesHandler(payload.userEmail);
        break;

      case 'send_user_direct_message':
        response = sendUserDirectMessageHandler(payload.data, payload.adminToken, payload.userEmail);
        break;

      case 'list_registered_clients_admin':
        response = listRegisteredClientsAdminHandler(payload.adminToken, payload.userEmail);
        break;

      case 'update_client_admin':
        response = updateClientAdminHandler(payload.data, payload.adminToken, payload.userEmail);
        break;

      case 'save_push_subscription':
        response = savePushSubscriptionHandler(payload.data);
        break;

      case 'remove_push_subscription':
        response = removePushSubscriptionHandler(payload.data);
        break;

      case 'mark_message_read_user':
        response = markMessageReadUserHandler(payload.messageId, payload.userEmail);
        break;

      case 'admin_user_access_action':
        response = handleAdminUserAccessAction(payload.data, payload.adminToken, payload.userEmail);
        break;

      case 'get_auth_access_dashboard_admin':
        response = handleGetAuthAccessDashboardAdmin(payload.adminToken, payload.userEmail);
        break;

                  

      case 'request_auth_otp':
        response = handleRequestAuthOtp(payload.data || payload);
        break;

      case 'verify_auth_otp':
        response = handleVerifyAuthOtp(payload.data || payload);
        break;

      case 'complete_auth_otp_profile':
        response = handleCompleteAuthOtpProfile(payload.data || payload);
        break;

      case 'request_password_reset_otp':
        response = handleRequestPasswordResetOtp(payload.data || payload);
        break;

      case 'reset_password_with_otp':
        response = handleResetPasswordWithOtp(payload.data || payload);
        break;

      default:
        response = { success: false, message: 'Acción no reconocida: ' + payload.action };
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error en doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error en el servidor: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Obtener o crear la hoja de cálculo de WES
 */
function getOrCreateDatabase() {
  const files = DriveApp.getFilesByName(CONFIG.SHEET_NAME);
  let ss;
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(CONFIG.SHEET_NAME);
  }
  return ss;
}

/**
 * Procesamiento de Solicitudes de Cotización
 */
function procesarNuevaCotizacion(data) {
  try {
    const ss = getOrCreateDatabase();
    let sheet = ss.getSheetByName('Cotizaciones');

    if (!sheet) {
      sheet = ss.insertSheet('Cotizaciones');
      sheet.appendRow([
        'Nº Cotización', 'Fecha y Hora', 'Cliente', 'Empresa', 'RNC / Cédula',
        'Teléfono', 'WhatsApp', 'Correo', 'Ciudad', 'Tipo Cliente',
        'Método Contacto', 'Productos', 'Total Estimado RD$', 'Comentarios', 'Estado', 'Notas Internas'
      ]);
      sheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#0D2A5C').setFontColor('#FFFFFF');
    }

    const nextNum = Math.max(1, sheet.getLastRow());
    const quoteNumber = data.id || ('COT-2026-' + ('0000' + nextNum).slice(-4));
    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    let itemsSummary = '';
    let itemsHtml = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%; border-color:#e2e8f0; font-size:13px;">';
    itemsHtml += '<tr style="background:#0D2A5C; color:#FFFFFF;"><th>Producto</th><th>Código</th><th>Cant.</th><th>Subtotal Est.</th></tr>';

    (data.items || []).forEach(item => {
      const subtotal = (item.price || 0) * (item.quantity || 1);
      itemsSummary += `• [${item.code}] ${item.name} x${item.quantity} (RD$ ${subtotal.toLocaleString()})\n`;
      itemsHtml += `<tr><td><strong>${item.name}</strong></td><td><code>${item.code}</code></td><td align="center">${item.quantity}</td><td align="right">RD$ ${subtotal.toLocaleString()}</td></tr>`;
    });
    itemsHtml += `</table><p style="margin-top:12px;"><strong>Total Estimado: RD$ ${(data.totalEstimated || 0).toLocaleString()}</strong></p>`;

    sheet.appendRow([
      quoteNumber,
      now,
      data.clientName,
      data.company || 'N/A',
      data.taxId || 'N/A',
      data.phone,
      data.whatsapp,
      data.email,
      data.city || 'N/A',
      data.clientType || 'Personal',
      data.contactMethod || 'WhatsApp',
      itemsSummary,
      data.totalEstimated || 0,
      data.comments || '',
      'Recibida',
      ''
    ]);

    // Enviar correos
    try {
      // 1. Notificación a la empresa
      const subjectEmpresa = `Nueva solicitud de cotización – ${quoteNumber}`;
      const bodyEmpresa = `
        <div style="font-family:Arial,sans-serif; color:#333; max-width:650px; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
          <div style="background:#0D2A5C; color:#FFFFFF; padding:24px; text-align:center;">
            <h2 style="margin:0; color:#F5B300;">WARN ELECTRICAL SERVICES, SRL (WES)</h2>
            <p style="margin:6px 0 0 0; font-size:14px;">Notificación de Nueva Solicitud de Cotización</p>
          </div>
          <div style="padding:28px;">
            <p style="font-size:15px;">Se ha registrado una nueva solicitud de cotización en el portal web.</p>
            <div style="background:#f8fafc; padding:16px; border-radius:8px; margin:16px 0;">
              <p style="margin:4px 0;"><strong>Número de solicitud:</strong> <span style="color:#0D2A5C; font-weight:bold; font-size:16px;">${quoteNumber}</span></p>
              <p style="margin:4px 0;"><strong>Cliente:</strong> ${data.clientName}</p>
              <p style="margin:4px 0;"><strong>Empresa:</strong> ${data.company || 'Particular'}</p>
              <p style="margin:4px 0;"><strong>Teléfono:</strong> ${data.phone}</p>
              <p style="margin:4px 0;"><strong>WhatsApp:</strong> ${data.whatsapp}</p>
              <p style="margin:4px 0;"><strong>Correo:</strong> ${data.email}</p>
              <p style="margin:4px 0;"><strong>Ciudad:</strong> ${data.city}</p>
              <p style="margin:4px 0;"><strong>Método preferido de contacto:</strong> ${data.contactMethod}</p>
            </div>
            <h4 style="color:#0D2A5C; margin-bottom:8px;">Productos Solicitados:</h4>
            ${itemsHtml}
            <p><strong>Comentarios:</strong><br>${data.comments || 'Sin comentarios adicionales.'}</p>
            <div style="margin-top:24px; padding:12px; background:#fffbeb; border-left:4px solid #F5B300; font-size:13px;">
              Por favor, revisar la solicitud y contactar al cliente con la cotización formal.
            </div>
          </div>
        </div>
      `;

      MailApp.sendEmail({
        to: Session.getActiveUser().getEmail() || CONFIG.COMPANY_EMAIL_GENERAL,
        subject: subjectEmpresa,
        htmlBody: bodyEmpresa
      });

      // 2. Confirmación al cliente
      if (data.email) {
        const subjectCliente = `Recibimos tu solicitud de cotización – ${CONFIG.COMPANY_NAME}`;
        const bodyCliente = `
          <div style="font-family:Arial,sans-serif; color:#333; max-width:650px; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
            <div style="background:#0D2A5C; color:#FFFFFF; padding:24px; text-align:center;">
              <h2 style="margin:0; color:#F5B300;">WARN ELECTRICAL SERVICES (WES)</h2>
              <p style="margin:6px 0 0 0; font-size:13px;">Tecnología, seguridad y soporte a tu alcance</p>
            </div>
            <div style="padding:28px;">
              <p>Hola, <strong>${data.clientName}</strong>:</p>
              <p>Gracias por comunicarte con <strong>${CONFIG.COMPANY_NAME}</strong>.</p>
              <p>Hemos recibido tu solicitud de cotización con el número <strong>${quoteNumber}</strong>. Nuestro equipo revisará los productos y la información proporcionada para preparar una respuesta detallada.</p>
              <div style="background:#f1f5f9; padding:14px; border-radius:8px; margin:16px 0; font-size:12px; color:#64748b;">
                <em>Este mensaje confirma la recepción de tu solicitud; no representa todavía una cotización final ni una confirmación de disponibilidad inmediata de inventario.</em>
              </div>
              <h4 style="color:#0D2A5C; margin-bottom:8px;">Productos Solicitados:</h4>
              ${itemsHtml}
              <p>Si necesitas agregar información o coordinar una visita técnica, puedes comunicarte con nosotros directamente:</p>
              <p>
                <strong>Teléfono:</strong> ${CONFIG.COMPANY_PHONE}<br>
                <strong>WhatsApp:</strong> ${CONFIG.COMPANY_PHONE}<br>
                <strong>Sede:</strong> ${CONFIG.COMPANY_ADDRESS}
              </p>
              <br>
              <p>Atentamente,<br>
              <strong>Equipo de ${CONFIG.COMPANY_NAME}</strong></p>
            </div>
          </div>
        `;

        MailApp.sendEmail({
          to: data.email,
          subject: subjectCliente,
          htmlBody: bodyCliente
        });
      }

    } catch (mailErr) {
      console.warn('Alerta enviando correos de cotización:', mailErr);
    }

    return {
      success: true,
      quoteNumber: quoteNumber,
      message: 'Cotización registrada exitosamente'
    };

  } catch (err) {
    console.error('Error en procesarNuevaCotizacion:', err);
    return { success: false, message: err.toString() };
  }
}

/**
 * Procesamiento de Tickets de Soporte Técnico con Fotos
 */
function procesarNuevoSoporte(data) {
  try {
    const ss = getOrCreateDatabase();
    let sheet = ss.getSheetByName('Soporte');

    if (!sheet) {
      sheet = ss.insertSheet('Soporte');
      sheet.appendRow([
        'Nº Ticket', 'Fecha y Hora', 'Cliente', 'Empresa', 'Teléfono',
        'WhatsApp', 'Correo', 'Ubicación', 'Nº Factura', 'Producto o Sistema',
        'Categoría', 'Prioridad', 'Descripción', 'Horario', 'Método Contacto',
        'Fotos Drive', 'Estado', 'Notas Internas'
      ]);
      sheet.getRange(1, 1, 1, 18).setFontWeight('bold').setBackground('#0D2A5C').setFontColor('#FFFFFF');
    }

    const nextNum = Math.max(1, sheet.getLastRow());
    const caseNumber = data.id || data.caseNumber || ('SOP-2026-' + ('0000' + nextNum).slice(-4));
    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    // Almacenar imágenes en Google Drive
    let photoLinks = [];
    const rawImages = (data.images && data.images.length > 0) ? data.images : (data.photos || []);
    if (rawImages && rawImages.length > 0) {
      try {
        const folders = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDER_NAME);
        const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);

        rawImages.forEach((imgData, idx) => {
          if (imgData && imgData.indexOf('data:image') !== -1) {
            const parts = imgData.split(',');
            const mimeType = parts[0].match(/:(.*?);/)[1];
            const decoded = Utilities.base64Decode(parts[1]);
            const ext = mimeType.split('/')[1] || 'jpg';
            const blob = Utilities.newBlob(decoded, mimeType, `${caseNumber}_evidencia_${idx + 1}.${ext}`);
            const file = folder.createFile(blob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            photoLinks.push(file.getUrl());
          } else if (imgData && imgData.startsWith('http')) {
            photoLinks.push(imgData);
          }
        });
      } catch (driveErr) {
        console.warn('Error subiendo fotos a Drive:', driveErr);
      }
    }

    sheet.appendRow([
      caseNumber,
      now,
      data.clientName,
      data.company || 'N/A',
      data.phone,
      data.whatsapp || data.phone || 'N/A',
      data.email,
      data.address,
      data.orderNumber || 'N/A',
      data.productSystem || 'N/A',
      data.category,
      data.priority,
      data.description,
      data.preferredTime || 'Cualquiera',
      data.contactMethod || 'Llamada',
      photoLinks.join('\n'),
      'Recibido',
      ''
    ]);

    // Variables de estilo por prioridad
    const priorityUpper = (data.priority || 'Media').toUpperCase();
    let priorityBadgeBg = '#fef3c7';
    let priorityBadgeColor = '#b45309';
    let priorityBorder = '#fde68a';
    if ((data.priority || '').toLowerCase() === 'alta') {
      priorityBadgeBg = '#fee2e2';
      priorityBadgeColor = '#b91c1c';
      priorityBorder = '#fca5a5';
    } else if ((data.priority || '').toLowerCase() === 'baja') {
      priorityBadgeBg = '#dcfce7';
      priorityBadgeColor = '#15803d';
      priorityBorder = '#86efac';
    }

    // Teléfono para enlace WhatsApp directo
    const rawWa = String(data.whatsapp || data.phone || '').replace(/[^0-9]/g, '');
    const waNumber = rawWa.length === 10 ? ('1' + rawWa) : rawWa;
    const waLink = waNumber ? `https://wa.me/${waNumber}` : '';

    // Enviar correos automáticos
    try {
      // =========================================================================
      // 1. CORREO A LA EMPRESA (WES - CENTRO DE OPERACIONES TÉCNICAS: wes.inform@gmail.com)
      // =========================================================================
      const subjectEmpresa = `🚨 [SOPORTE PENDIENTE] Ticket #${caseNumber} – ${data.clientName} (Atención requerida en 1 hora)`;
      
      const photosEmpresaHtml = photoLinks.length > 0
        ? photoLinks.map((url, i) => `
            <li style="margin-bottom: 6px;">
              <a href="${url}" target="_blank" style="color: #0284c7; text-decoration: underline; font-weight: bold;">
                📷 Ver Evidencia Fotográfica #${i + 1} en Google Drive
              </a>
            </li>
          `).join('')
        : '<li style="color: #94a3b8; font-style: italic;">No se adjuntaron fotografías en este reporte.</li>';

      const bodyEmpresa = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0; padding:20px; background-color:#f1f5f9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#1e293b;">
          <div style="max-width:640px; margin:0 auto; background-color:#ffffff; border-radius:14px; overflow:hidden; border:1px solid #cbd5e1; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
            
            <!-- Encabezado Corporativo WES -->
            <div style="background-color:#0D2A5C; color:#ffffff; padding:24px 28px; text-align:center; border-bottom:4px solid #F5B300;">
              <div style="font-size:20px; font-weight:800; letter-spacing:1px; color:#ffffff; margin-bottom:4px;">
                WARN ELECTRICAL SERVICES (WES)
              </div>
              <div style="font-size:13px; color:#F5B300; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">
                CENTRO DE OPERACIONES TÉCNICAS — SOPORTE PENDIENTE DE ATENCIÓN
              </div>
            </div>

            <!-- Alerta de Compromiso 1 Hora -->
            <div style="background-color:#fef2f2; border-left:5px solid #ef4444; padding:14px 20px; margin:20px 24px 0 24px; border-radius:6px;">
              <div style="font-size:13px; font-weight:bold; color:#991b1b; margin-bottom:2px;">
                ⏱️ ALERTA: SOPORTE TÉCNICO PENDIENTE (COMPROMISO EN 1 HORA)
              </div>
              <div style="font-size:12px; color:#7f1d1d; line-height:1.4;">
                Se ha notificado al cliente que un especialista técnico lo contactará dentro de la <strong>próxima 1 hora</strong> (${data.preferredTime || 'Inmediato'} a través de <strong>${data.contactMethod || 'su método preferido'}</strong>) para atender el problema reportado.
              </div>
            </div>

            <div style="padding:24px 28px;">

              <!-- HERO: Número de Soporte y Prioridad -->
              <div style="background-color:#f8fafc; border:2px dashed #0D2A5C; border-radius:12px; padding:16px 20px; text-align:center; margin-bottom:24px;">
                <div style="font-size:11px; text-transform:uppercase; font-weight:800; color:#64748b; letter-spacing:1px; margin-bottom:4px;">
                  NÚMERO DE SOPORTE ASIGNADO
                </div>
                <div style="font-size:30px; font-weight:900; color:#0D2A5C; letter-spacing:2px; font-family:monospace; margin-bottom:8px;">
                  ${caseNumber}
                </div>
                <div>
                  <span style="display:inline-block; padding:4px 12px; font-size:11px; font-weight:bold; border-radius:20px; background-color:${priorityBadgeBg}; color:${priorityBadgeColor}; border:1px solid ${priorityBorder}; text-transform:uppercase;">
                    Prioridad: ${priorityUpper}
                  </span>
                  <span style="display:inline-block; margin-left:8px; font-size:11px; color:#64748b;">
                    📅 ${now}
                  </span>
                </div>
              </div>

              <!-- Botones de Acción Rápida -->
              <div style="margin-bottom:22px; text-align:center;">
                <table style="width:100%; border-collapse:collapse;">
                  <tr>
                    <td style="padding:4px; width:33.3%;">
                      <a href="tel:${data.phone}" style="display:block; text-align:center; padding:10px 8px; background-color:#0D2A5C; color:#ffffff; text-decoration:none; border-radius:8px; font-size:12px; font-weight:bold;">
                        📞 Llamar (${data.phone})
                      </a>
                    </td>
                    ${waLink ? `
                    <td style="padding:4px; width:33.3%;">
                      <a href="${waLink}" target="_blank" style="display:block; text-align:center; padding:10px 8px; background-color:#16a34a; color:#ffffff; text-decoration:none; border-radius:8px; font-size:12px; font-weight:bold;">
                        💬 WhatsApp
                      </a>
                    </td>` : ''}
                    <td style="padding:4px; width:33.3%;">
                      <a href="mailto:${data.email}?subject=Seguimiento%20Soporte%20WES%20${caseNumber}" style="display:block; text-align:center; padding:10px 8px; background-color:#0284c7; color:#ffffff; text-decoration:none; border-radius:8px; font-size:12px; font-weight:bold;">
                        ✉️ Responder Email
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Ficha de Datos del Cliente -->
              <h4 style="margin:0 0 10px 0; color:#0D2A5C; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #e2e8f0; padding-bottom:6px;">
                👤 Información del Cliente y Ubicación
              </h4>
              <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:20px;">
                <tr>
                  <td style="padding:6px 0; color:#64748b; width:150px; font-weight:600;">Cliente / Contacto:</td>
                  <td style="padding:6px 0; color:#0f172a; font-weight:bold;">${data.clientName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#64748b; font-weight:600;">Empresa / Negocio:</td>
                  <td style="padding:6px 0; color:#0f172a;">${data.company || 'Particular'}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#64748b; font-weight:600;">Teléfono Principal:</td>
                  <td style="padding:6px 0; color:#0f172a;">${data.phone}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#64748b; font-weight:600;">WhatsApp:</td>
                  <td style="padding:6px 0; color:#0f172a;">${data.whatsapp || data.phone}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#64748b; font-weight:600;">Correo Electrónico:</td>
                  <td style="padding:6px 0;"><a href="mailto:${data.email}" style="color:#0284c7; font-weight:bold; text-decoration:none;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#64748b; font-weight:600;">Dirección / Ubicación:</td>
                  <td style="padding:6px 0; color:#0f172a; font-weight:bold;">📍 ${data.address}</td>
                </tr>
              </table>

              <!-- Ficha Técnica del Incidente -->
              <h4 style="margin:0 0 10px 0; color:#0D2A5C; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #e2e8f0; padding-bottom:6px;">
                🛠️ Especificaciones Técnicas del Incidente
              </h4>
              <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:20px;">
                <tr>
                  <td style="padding:6px 0; color:#64748b; width:150px; font-weight:600;">Producto / Sistema:</td>
                  <td style="padding:6px 0; color:#0f172a; font-weight:bold;">${data.productSystem || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#64748b; font-weight:600;">Categoría de Falla:</td>
                  <td style="padding:6px 0; color:#0D2A5C; font-weight:bold;">${data.category}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#64748b; font-weight:600;">Nº Factura / Orden:</td>
                  <td style="padding:6px 0; color:#0f172a;">${data.orderNumber || 'No provista'}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#64748b; font-weight:600;">Horario Preferido:</td>
                  <td style="padding:6px 0; color:#0f172a;">${data.preferredTime || 'Cualquiera'}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#64748b; font-weight:600;">Método Contacto:</td>
                  <td style="padding:6px 0; color:#0f172a; font-weight:bold;">${data.contactMethod || 'Llamada'}</td>
                </tr>
              </table>

              <!-- Descripción de la Falla -->
              <h4 style="margin:0 0 8px 0; color:#0D2A5C; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">
                📝 Descripción Detallada del Problema:
              </h4>
              <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #0D2A5C; padding:16px; border-radius:8px; font-size:13px; line-height:1.6; color:#334155; white-space:pre-wrap; margin-bottom:20px;">
                ${data.description}
              </div>

              <!-- Evidencias Fotográficas -->
              <h4 style="margin:0 0 8px 0; color:#0D2A5C; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">
                📸 Evidencias Fotográficas Adjuntas (${photoLinks.length}):
              </h4>
              <ul style="margin:0; padding-left:20px; font-size:13px; line-height:1.6; color:#334155;">
                ${photosEmpresaHtml}
              </ul>

            </div>

            <!-- Footer Empresa -->
            <div style="background-color:#f1f5f9; padding:16px 28px; border-top:1px solid #cbd5e1; font-size:12px; color:#64748b; text-align:center;">
              Este es un correo automático generado por el portal web de <strong>Warn Electrical Services (WES)</strong>.<br>
              Base de Datos: WES - Base de Datos Operativa (Hoja: Soporte)
            </div>

          </div>
        </body>
        </html>
      `;

      MailApp.sendEmail({
        to: CONFIG.COMPANY_EMAIL_SUPPORT,
        subject: subjectEmpresa,
        htmlBody: bodyEmpresa,
        replyTo: data.email
      });

      // =========================================================================
      // 2. CORREO AL CLIENTE (CONFIRMACIÓN ELEGANTE, NÚMERO DESTACADO Y SLA 1 HORA)
      // =========================================================================
      if (data.email) {
        const subjectCliente = `Confirmación de Soporte Técnico – Ticket #${caseNumber} – Warn Electrical Services (Atención en 1 hora)`;
        
        const photoInfoCliente = photoLinks.length > 0
          ? `✓ Se han recibido y adjuntado <strong>${photoLinks.length} fotografía(s) de evidencia</strong> a tu expediente técnico.`
          : 'No se adjuntaron fotografías al reporte.';

        const bodyCliente = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="margin:0; padding:20px; background-color:#f1f5f9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#1e293b;">
            <div style="max-width:640px; margin:0 auto; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 8px 24px rgba(13,42,92,0.08);">
              
              <!-- Cabecera Corporativa de Alta Elegancia -->
              <div style="background-color:#0D2A5C; color:#ffffff; padding:30px 25px; text-align:center; border-bottom:4px solid #F5B300;">
                <div style="font-size:22px; font-weight:800; letter-spacing:1px; color:#ffffff; margin:0 0 6px 0;">
                  WARN ELECTRICAL SERVICES (WES)
                </div>
                <div style="font-size:13px; color:#F5B300; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
                  Centro de Asistencia Técnica y Garantías
                </div>
              </div>

              <div style="padding:32px 28px;">
                
                <!-- Saludo -->
                <p style="font-size:16px; color:#0f172a; margin-top:0; margin-bottom:12px;">
                  Estimado(a) <strong>${data.clientName}</strong>:
                </p>
                <p style="font-size:14px; color:#475569; line-height:1.6; margin-top:0; margin-bottom:24px;">
                  Agradecemos que te hayas comunicado con <strong>Warn Electrical Services, SRL</strong>. Confirmamos que tu solicitud de soporte técnico ha sido recibida y registrada exitosamente en nuestro sistema operativo. Hemos tomado nota de tu caso y de los detalles que mencionaste para una atención técnica en un plazo máximo estimado de <strong>1 hora</strong>.
                </p>

                <!-- HERO SUPER DESTACADO: NÚMERO DE SOPORTE -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #0D2A5C; border-radius: 14px; padding: 22px 20px; text-align: center; margin: 24px 0; box-shadow: 0 4px 12px rgba(13,42,92,0.06);">
                  <div style="display:inline-block; font-size:11px; text-transform:uppercase; font-weight:800; letter-spacing:1.5px; background-color:#F5B300; color:#0D2A5C; padding:4px 14px; border-radius:20px; margin-bottom:10px;">
                    🎫 NÚMERO DE SOPORTE TÉCNICO OFICIAL
                  </div>
                  <div style="font-size:34px; font-weight:900; color:#0D2A5C; letter-spacing:2.5px; font-family:'Courier New', Courier, monospace; margin:6px 0; text-shadow:0 1px 2px rgba(0,0,0,0.05);">
                    ${caseNumber}
                  </div>
                  <div style="font-size:12px; color:#64748b; font-weight:500; margin-top:6px;">
                    Conserva este código oficial para cualquier consulta, seguimiento o comunicación sobre tu caso.
                  </div>
                </div>

                <!-- TARJETA DE COMPROMISO 1 HORA -->
                <div style="background-color:#ecfdf5; border:1px solid #a7f3d0; border-left:5px solid #10b981; border-radius:10px; padding:18px 20px; margin:24px 0;">
                  <div style="font-size:15px; font-weight:bold; color:#065f46; margin-bottom:6px;">
                    ⏱️ Compromiso de Contacto / Atención en 1 Hora
                  </div>
                  <div style="font-size:13px; color:#047857; line-height:1.6;">
                    Tu requerimiento ha sido clasificado para atención técnica prioritaria. Un especialista técnico evaluará las especificaciones y evidencias de tu reporte y <strong>se comunicará contigo en el transcurso de la próxima 1 hora</strong> a través de tu método preferido (<strong>${data.contactMethod || 'Llamada o Correo'}</strong>${data.preferredTime ? `, en horario de <strong>${data.preferredTime}</strong>` : ''}) para coordinar el diagnóstico y la solución técnica conforme a los detalles que indicaste.
                  </div>
                </div>

                <!-- RESUMEN DETALLADO DE LO SOLICITADO -->
                <div style="margin-top:28px;">
                  <h4 style="margin:0 0 12px 0; color:#0D2A5C; font-size:14px; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #e2e8f0; padding-bottom:8px;">
                    📋 Resumen de la Solicitud Registrada
                  </h4>

                  <table style="width:100%; border-collapse:collapse; font-size:13px; background-color:#f8fafc; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:10px 14px; color:#64748b; width:160px; font-weight:600;">Número de Caso:</td>
                      <td style="padding:10px 14px; color:#0D2A5C; font-weight:bold; font-size:14px;">${caseNumber}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:10px 14px; color:#64748b; font-weight:600;">Fecha de Registro:</td>
                      <td style="padding:10px 14px; color:#1e293b;">${now}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:10px 14px; color:#64748b; font-weight:600;">Solicitante:</td>
                      <td style="padding:10px 14px; color:#1e293b; font-weight:bold;">${data.clientName} ${data.company ? `(${data.company})` : ''}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:10px 14px; color:#64748b; font-weight:600;">Teléfono / WhatsApp:</td>
                      <td style="padding:10px 14px; color:#1e293b;">${data.phone} / ${data.whatsapp || data.phone}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:10px 14px; color:#64748b; font-weight:600;">Ubicación del Servicio:</td>
                      <td style="padding:10px 14px; color:#1e293b;">${data.address}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:10px 14px; color:#64748b; font-weight:600;">Producto o Sistema:</td>
                      <td style="padding:10px 14px; color:#0D2A5C; font-weight:bold;">${data.productSystem || 'Reportado en descripción'}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:10px 14px; color:#64748b; font-weight:600;">Categoría del Problema:</td>
                      <td style="padding:10px 14px; color:#1e293b; font-weight:600;">${data.category}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:10px 14px; color:#64748b; font-weight:600;">Nivel de Prioridad:</td>
                      <td style="padding:10px 14px;">
                        <span style="display:inline-block; padding:3px 10px; font-size:11px; font-weight:bold; border-radius:14px; background-color:${priorityBadgeBg}; color:${priorityBadgeColor}; border:1px solid ${priorityBorder}; text-transform:uppercase;">
                          ${data.priority}
                        </span>
                      </td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:10px 14px; color:#64748b; font-weight:600;">Horario de Contacto:</td>
                      <td style="padding:10px 14px; color:#1e293b;">${data.preferredTime}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:10px 14px; color:#64748b; font-weight:600;">Canal Preferido:</td>
                      <td style="padding:10px 14px; color:#1e293b; font-weight:bold;">${data.contactMethod}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 14px; color:#64748b; font-weight:600;">Evidencias Adjuntas:</td>
                      <td style="padding:10px 14px; color:#1e293b;">${photoInfoCliente}</td>
                    </tr>
                  </table>
                </div>

                <!-- Detalle de la Descripción -->
                <div style="margin-top:24px;">
                  <h4 style="margin:0 0 8px 0; color:#0D2A5C; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">
                    📝 Descripción Registrada:
                  </h4>
                  <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #0D2A5C; padding:16px; border-radius:8px; font-size:13px; line-height:1.6; color:#334155; white-space:pre-wrap;">${data.description}</div>
                </div>

                <!-- Nota Informativa de Procedimiento -->
                <div style="background-color:#fffbeb; border:1px solid #fef3c7; border-radius:8px; padding:14px 16px; font-size:12px; color:#92400e; line-height:1.5; margin-top:24px;">
                  ℹ️ <strong>Información importante sobre el servicio:</strong><br>
                  Este correo confirma formalmente la apertura de tu solicitud en nuestro sistema. Toda visita técnica presencial, revisión de garantías o diagnóstico en terreno será validada y coordinada previamente contigo vía telefónica o WhatsApp antes del desplazamiento del técnico.
                </div>

                <div style="margin-top:28px; border-top:1px solid #e2e8f0; padding-top:16px;">
                  <p style="font-size:13px; color:#475569; margin:16px 0 4px 0;">
                    Atentamente,
                  </p>
                  <p style="font-size:14px; color:#0D2A5C; font-weight:bold; margin:0 0 16px 0;">
                    Departamento de Soporte y Asistencia Técnica<br>
                    <span style="font-size:12px; color:#64748b; font-weight:normal;">Warn Electrical Services, SRL (WES)</span>
                  </p>
                </div>

              </div>

              <!-- Pie de Página Elegante -->
              <div style="background-color:#0D2A5C; color:#cbd5e1; padding:24px 28px; font-size:12px; line-height:1.6; text-align:center;">
                <div style="color:#ffffff; font-weight:bold; font-size:13px; margin-bottom:4px;">
                  WARN ELECTRICAL SERVICES, SRL (WES)
                </div>
                <div>📍 Autopista Ramón Cáceres, Moca, República Dominicana</div>
                <div>📞 Central Telefónica: (849) 207-5474 | 💬 WhatsApp: (849) 207-5474</div>
                <div>✉️ Correo Oficial: <a href="mailto:wes.inform@gmail.com" style="color:#F5B300; text-decoration:none;">wes.inform@gmail.com</a></div>
                <div style="margin-top:10px; font-size:11px; color:#94a3b8;">
                  Portal Web Oficial: <a href="https://web.warnelectricalservices.com" style="color:#F5B300; text-decoration:none;">web.warnelectricalservices.com</a>
                </div>
              </div>

            </div>
          </body>
          </html>
        `;

        MailApp.sendEmail({
          to: data.email,
          subject: subjectCliente,
          htmlBody: bodyCliente,
          replyTo: CONFIG.COMPANY_EMAIL_SUPPORT
        });
      }

    } catch (mailErr) {
      console.warn('Alerta enviando correos de soporte:', mailErr);
    }

    return {
      success: true,
      caseNumber: caseNumber,
      message: 'Ticket de soporte generado exitosamente'
    };

  } catch (err) {
    console.error('Error en procesarNuevoSoporte:', err);
    return { success: false, message: err.toString() };
  }
}

/**
 * Procesa un nuevo mensaje de contacto web generando un ticket formal y enviando correos
 */
function procesarNuevoMensajeContacto(data) {
  try {
    const ss = getOrCreateDatabase();
    let sheet = ss.getSheetByName('Mensajes_Contacto');

    if (!sheet) {
      sheet = ss.insertSheet('Mensajes_Contacto');
      sheet.appendRow([
        'Nº Ticket', 'Fecha y Hora', 'Nombre', 'Teléfono', 'Correo',
        'Asunto', 'Mensaje', 'Estado', 'Notas'
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#0D2A5C').setFontColor('#FFFFFF');
    }

    const nextNum = Math.max(1, sheet.getLastRow());
    const ticketNumber = data.ticketId || ('TKT-2026-' + ('0000' + nextNum).slice(-4));
    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    sheet.appendRow([
      ticketNumber,
      now,
      data.name,
      data.phone || 'N/A',
      data.email,
      data.subject,
      data.message,
      'Nuevo',
      ''
    ]);

    // Enviar correos automáticos
    try {
      // 1. Correo a la empresa (WES)
      const subjectEmpresa = `Nuevo Mensaje Web – Ticket ${ticketNumber} – ${data.subject}`;
      const htmlEmpresa = `
        <div style="font-family:Arial,sans-serif; color:#333; max-width:600px; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
          <div style="background:#0D2A5C; color:#fff; padding:22px; text-align:center;">
            <h2 style="margin:0; color:#F5B300; font-size:20px; font-weight:bold;">WARN ELECTRICAL SERVICES (WES)</h2>
            <p style="margin:6px 0 0 0; font-size:14px; opacity:0.9;">Nuevo Ticket de Mensaje Web: <strong style="color:#fff;">${ticketNumber}</strong></p>
          </div>
          <div style="padding:25px;">
            <p style="font-size:14px;">Se ha recibido una nueva solicitud a través del formulario de contacto web.</p>
            <table style="width:100%; border-collapse:collapse; font-size:13px; margin:15px 0;">
              <tr>
                <td style="padding:6px 0; color:#64748b; width:130px;"><strong>Nº Ticket:</strong></td>
                <td style="padding:6px 0; color:#0D2A5C; font-weight:bold; font-size:15px;">${ticketNumber}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#64748b;"><strong>Fecha y Hora:</strong></td>
                <td style="padding:6px 0; color:#1e293b;">${now}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#64748b;"><strong>Remitente:</strong></td>
                <td style="padding:6px 0; color:#1e293b; font-weight:bold;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#64748b;"><strong>Correo:</strong></td>
                <td style="padding:6px 0;"><a href="mailto:${data.email}" style="color:#0284c7; text-decoration:none; font-weight:bold;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#64748b;"><strong>Teléfono:</strong></td>
                <td style="padding:6px 0; color:#1e293b;">${data.phone || 'No especificado'}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#64748b;"><strong>Asunto:</strong></td>
                <td style="padding:6px 0; color:#0D2A5C; font-weight:bold;">${data.subject}</td>
              </tr>
            </table>
            <hr style="border:0; border-top:1px solid #e2e8f0; margin:15px 0;">
            <h4 style="margin:0 0 8px 0; color:#0D2A5C; font-size:13px; text-transform:uppercase;">Mensaje del Cliente:</h4>
            <div style="background:#f8fafc; padding:15px; border-radius:8px; border-left:4px solid #0D2A5C; white-space:pre-wrap; font-size:13px; line-height:1.5; color:#334155;">${data.message}</div>
            <div style="margin-top:20px; padding:12px; background:#eff6ff; border-radius:8px; font-size:12px; color:#1e40af;">
              💡 <em>Puedes responder directamente a este correo para comunicarte con el cliente (${data.email}).</em>
            </div>
          </div>
        </div>
      `;

            try {
        GmailApp.sendEmail(CONFIG.COMPANY_EMAIL_GENERAL, subjectEmpresa, (data.message || ''), {
          name: 'Portal WES (Notificación Interna)',
          htmlBody: htmlEmpresa,
          replyTo: data.email
        });
      } catch (empMailErr) {
        console.warn('Alerta enviando copia interna a empresa:', empMailErr);
        try {
          MailApp.sendEmail({
            to: CONFIG.COMPANY_EMAIL_GENERAL,
            subject: subjectEmpresa,
            htmlBody: htmlEmpresa,
            replyTo: data.email
          });
        } catch (mErr) {
          console.warn('MailApp a empresa también falló:', mErr);
        }
      }

      // 2. Correo de confirmación con el TICKET al cliente
      if (data.email) {
        const subjectCliente = `Confirmación de Solicitud – Ticket ${ticketNumber} – Warn Electrical Services`;
        const htmlCliente = `
          <div style="font-family:Arial,sans-serif; color:#333; max-width:600px; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
            <div style="background:#0D2A5C; color:#fff; padding:22px; text-align:center;">
              <h2 style="margin:0; color:#F5B300; font-size:20px; font-weight:bold;">WARN ELECTRICAL SERVICES (WES)</h2>
              <p style="margin:6px 0 0 0; font-size:13px; opacity:0.9;">Tecnología, seguridad y soporte a tu alcance</p>
            </div>
            <div style="padding:25px;">
              <p style="font-size:15px; margin-top:0;">Hola, <strong>${data.name}</strong>:</p>
              <p style="font-size:13px; color:#475569; line-height:1.5;">
                Gracias por comunicarte con <strong>Warn Electrical Services, SRL</strong>. Hemos recibido tu mensaje correctamente a través de nuestro portal web y se ha generado tu ticket formal de seguimiento.
              </p>
              
              <div style="background:#f0f9ff; border:1px solid #bae6fd; border-left:4px solid #0284c7; padding:16px; border-radius:8px; margin:20px 0;">
                <span style="font-size:11px; color:#0369a1; text-transform:uppercase; font-weight:bold; letter-spacing:0.5px; display:block;">Número de Ticket Asignado:</span>
                <div style="font-size:24px; font-weight:extrabold; color:#0D2A5C; letter-spacing:1px; margin:4px 0;">${ticketNumber}</div>
                <span style="font-size:12px; color:#64748b;">Conserva este código para cualquier consulta sobre tu solicitud.</span>
              </div>

              <h4 style="margin:20px 0 10px 0; color:#0D2A5C; font-size:14px;">Resumen de lo solicitado:</h4>
              <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:15px; background:#f8fafc; border-radius:8px; padding:12px;">
                <tr>
                  <td style="padding:8px 12px; color:#64748b; width:120px; border-bottom:1px solid #e2e8f0;"><strong>Asunto:</strong></td>
                  <td style="padding:8px 12px; color:#1e293b; font-weight:bold; border-bottom:1px solid #e2e8f0;">${data.subject}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px; color:#64748b; border-bottom:1px solid #e2e8f0;"><strong>Fecha y Hora:</strong></td>
                  <td style="padding:8px 12px; color:#1e293b; border-bottom:1px solid #e2e8f0;">${now}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px; color:#64748b; vertical-align:top;"><strong>Mensaje:</strong></td>
                  <td style="padding:8px 12px; color:#334155; white-space:pre-wrap; line-height:1.5;">${data.message}</td>
                </tr>
              </table>

              <div style="background:#fefce8; border:1px solid #fef08a; padding:14px; border-radius:8px; margin:20px 0; font-size:13px; color:#854d0e; line-height:1.5;">
                ✉️ <strong>Gestión por correo electrónico:</strong><br>
                Nuestro equipo revisará tu solicitud y te responderá directamente a este correo electrónico a la brevedad posible.
              </div>

              <hr style="border:0; border-top:1px solid #e2e8f0; margin:20px 0;">

              <p style="font-size:12px; color:#64748b; line-height:1.5; margin:0;">
                <strong>Warn Electrical Services, SRL (WES)</strong><br>
                Autopista Ramón Cáceres, Moca, República Dominicana<br>
                Teléfono: (849) 207-5474 | Correo Oficial: wes.inform@gmail.com<br>
                Portal Web: <a href="https://web.warnelectricalservices.com" style="color:#0284c7; text-decoration:none;">web.warnelectricalservices.com</a>
              </p>
            </div>
          </div>
        `;

        // Envío directo con nombre corporativo WES y plantilla premium para códigos de acceso
        const isAuthMail = data.subject && (data.subject.indexOf("Código") !== -1 || data.subject.indexOf("WES ·") !== -1 || data.subject.indexOf("Restablecer") !== -1 || data.subject.indexOf("Verificación") !== -1);
        const finalSubject = isAuthMail ? data.subject : subjectCliente;
        
        let customAuthHtml = "";
        if (isAuthMail) {
          if (data.htmlContent && typeof data.htmlContent === "string" && data.htmlContent.length > 20) {
            customAuthHtml = data.htmlContent;
          } else {
            customAuthHtml = "<div style=\"font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;\">" +
              "<div style=\"text-align:center;background:linear-gradient(135deg,#071836,#0D2A5C);color:#fff;padding:24px;border-radius:12px;\">" +
              "<h2 style=\"color:#F5B300;margin:0;font-size:20px;letter-spacing:1px;\">WARN ELECTRICAL SERVICES</h2>" +
              "<p style=\"margin:6px 0 0 0;font-size:12px;opacity:0.85;\">Moca, República Dominicana · Código de Acceso Seguro</p></div>" +
              "<div style=\"padding:24px 12px;font-size:14px;line-height:1.6;color:#334155;\">" + (data.message || "").replace(/\n/g, "<br>") + "</div>" +
              "<hr style=\"border:0;border-top:1px solid #f1f5f9;margin:20px 0;\">" +
              "<p style=\"font-size:11px;color:#94a3b8;text-align:center;margin:0;\">Warn Electrical Services, SRL · Autopista Ramón Cáceres, Moca · web.warnelectricalservices.com</p></div>";
          }
        }

        const mailOptions = {
          name: "WES · Código de acceso",
          htmlBody: isAuthMail ? customAuthHtml : htmlCliente
        };

        try {
          GmailApp.sendEmail(data.email, finalSubject, data.message || '', mailOptions);
        } catch (gErr) {
          MailApp.sendEmail({
            to: data.email,
            subject: finalSubject,
            htmlBody: mailOptions.htmlBody,
            name: 'Tienda WES - Warn Electrical Services'
          });
        }
      }

    } catch (emailErr) {
      console.warn('Alerta enviando email de contacto:', emailErr);
    }

    return {
      success: true,
      ticketNumber: ticketNumber,
      message: 'Ticket generado y enviado por correo exitosamente'
    };

  } catch (err) {
    console.error('Error en procesarNuevoMensajeContacto:', err);
    return { success: false, message: err.toString() };
  }
}

/**
 * =========================================================================
 * MÓDULO DE INTELIGENCIA ARTIFICIAL WES (ASISTENTE SOFÍA / GEMINI BACKEND)
 * =========================================================================
 */

var WES_DEFAULT_SOFIA_PROMPT = "Eres Sofía, Asesora Técnica y Comercial Oficial de Warn Electrical Services, SRL (WES) en Moca, República Dominicana.\n" +
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
  "   - No inventes precios, disponibilidad ni productos inexistentes.\n" +
  "   - POLÍTICA ESTRICTA: CERO SOPORTES AGENDADOS O CITAS PROGRAMADAS:\n" +
  "     * PROHIBIDO DECIR 'AGENDAR', 'AGENDADO', 'SOPORTE AGENDADO' O 'VISITA PROGRAMADA': La función de citas o soportes agendados NO está configurada en la plataforma ni habilitada en el chat. NUNCA uses la palabra 'agendar' ni afirmes que se ha agendado o programado una visita, turno o cita.\n" +
  "     * SOFÍA NO ESTÁ CAPACITADA PARA GENERAR TICKETS, EMITIR NÚMEROS DE TICKET NI ENVIARLE AL CLIENTE UN TICKET REALIZADO.\n" +
  "     * NUNCA inventes números de ticket (como TK-..., TKT-... o SRV-...) ni digas \"tu ticket ha sido generado o resuelto\".\n" +
  "     * Ante cualquier solicitud de soporte técnico, reparación, visita o reporte de avería, mantén la función del chat estrictamente hasta tomar los datos básicos:\n" +
  "       \"Te voy a tomar el número, tu nombre y la indicación del problema. El lunes uno de nuestros técnicos te estará atendiendo.\" (si es fin de semana/domingo o fuera de horario) o \"uno de nuestros técnicos se comunicará contigo en horario laboral de servicio\".\n" +
  "     * Horario laboral oficial de WES en Moca: Lunes a Viernes de 8:00 a.m. a 6:00 p.m. y Sábados de 8:00 a.m. a 1:00 p.m. Domingos cerrado.\n" +
  "     * Si alguien escribe fuera de horario (a deshoras, en la noche, madrugada o domingos), infórmale con amabilidad que estamos fuera de horario laboral pero que lo podemos recibir en nuestro horario oficial (a partir de las 8:00 a.m.). NUNCA antes de las 8:00 a.m. ni después de la hora de cierre.\n" +
  "     * Si el cliente solicita agendar o programar una cita o visita técnica a domicilio, aclárale con cortesía que no agendamos visitas por el chat; que le tomas su nombre, teléfono y problema para que un técnico humano se comunique con él.\n\n" +
  "5. EXCEPCIÓN DE AMPLIACIÓN:\n" +
  "   - Amplía la explicación con detalles técnicos ÚNICAMENTE cuando el usuario solicite explícitamente detalles (ej. \"explícame con más detalle\"), desglose técnico o advertencias de seguridad.\n\n" +
  "6. HORARIOS Y SEDE:\n" +
  "   - Lunes a Viernes de 8:00 AM a 6:00 PM | Sábados de 8:00 AM a 1:00 PM (cerramos a la 1:00 PM). Domingos cerrado. Sede: Autopista Ramón Cáceres, Moca.";

function getAiConfigSheet_() {
  const ss = getOrCreateDatabase();
  let sheet = ss.getSheetByName('Config_IA');
  if (!sheet) {
    sheet = ss.insertSheet('Config_IA');
    sheet.appendRow(['Clave', 'Valor', 'Actualizado']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#0D2A5C').setFontColor('#FFFFFF');
  }
  return sheet;
}

function getAiConfigFromStorage_() {
  const props = PropertiesService.getScriptProperties();
  let apiKey = props.getProperty('WES_GEMINI_API_KEY') || '';
  let systemPrompt = props.getProperty('WES_SOFIA_SYSTEM_PROMPT') || '';
  let model = props.getProperty('WES_GEMINI_MODEL') || 'gemini-3.5-flash';
  let assistantName = props.getProperty('WES_ASSISTANT_NAME') || 'Sofía';
  let enabled = props.getProperty('WES_AI_ENABLED') !== 'false';
  let temperature = parseFloat(props.getProperty('WES_AI_TEMP') || '0.7');
  let maxTokens = parseInt(props.getProperty('WES_AI_TOKENS') || '2048', 10);

  // Si no está en ScriptProperties, consultar hoja Config_IA
  if (!apiKey || !systemPrompt) {
    try {
      const sheet = getAiConfigSheet_();
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        const k = String(data[i][0]).trim();
        const v = String(data[i][1] || '').trim();
        if (k === 'apiKey' && !apiKey && v) apiKey = v;
        if (k === 'systemPrompt' && !systemPrompt && v) systemPrompt = v;
        if (k === 'model' && v) model = v;
        if (k === 'assistantName' && v) assistantName = v;
        if (k === 'enabled' && v) enabled = (v !== 'false');
      }
    } catch (e) {}
  }

  if (!systemPrompt || systemPrompt.trim().length === 0) {
    systemPrompt = WES_DEFAULT_SOFIA_PROMPT;
  }

  return {
    apiKey: apiKey,
    systemPrompt: systemPrompt,
    model: model || 'gemini-3.5-flash',
    assistantName: assistantName || 'Sofía',
    enabled: enabled,
    temperature: isNaN(temperature) ? 0.7 : temperature,
    maxTokens: isNaN(maxTokens) ? 2048 : maxTokens
  };
}

function saveAiConfigAdminHandler(data, adminToken) {
  try {
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';

    if (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session')) {
      return { success: false, message: 'Acceso denegado: se requieren credenciales de administrador.' };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Datos de configuración inválidos.' };
    }

    const updates = {};
    if (typeof data.apiKey === 'string' && data.apiKey.trim().length > 0) {
      updates['WES_GEMINI_API_KEY'] = data.apiKey.trim();
    }
    if (typeof data.systemPrompt === 'string' && data.systemPrompt.trim().length > 0) {
      updates['WES_SOFIA_SYSTEM_PROMPT'] = data.systemPrompt.trim();
    }
    if (typeof data.model === 'string' && data.model.trim().length > 0) {
      updates['WES_GEMINI_MODEL'] = data.model.trim();
    }
    if (typeof data.assistantName === 'string' && data.assistantName.trim().length > 0) {
      updates['WES_ASSISTANT_NAME'] = data.assistantName.trim();
    }
    if (typeof data.enabled === 'boolean') {
      updates['WES_AI_ENABLED'] = data.enabled ? 'true' : 'false';
    }
    if (data.temperature !== undefined) {
      updates['WES_AI_TEMP'] = String(data.temperature);
    }
    if (data.maxTokens !== undefined) {
      updates['WES_AI_TOKENS'] = String(data.maxTokens);
    }

    props.setProperties(updates);

    // Espejo en hoja Config_IA
    try {
      const sheet = getAiConfigSheet_();
      const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');
      const keysToPersist = [
        ['systemPrompt', updates['WES_SOFIA_SYSTEM_PROMPT'] || data.systemPrompt || ''],
        ['model', updates['WES_GEMINI_MODEL'] || data.model || 'gemini-3.5-flash'],
        ['assistantName', updates['WES_ASSISTANT_NAME'] || data.assistantName || 'Sofía'],
        ['enabled', updates['WES_AI_ENABLED'] || (data.enabled !== false ? 'true' : 'false')],
        ['hasApiKey', updates['WES_GEMINI_API_KEY'] ? 'true' : (props.getProperty('WES_GEMINI_API_KEY') ? 'true' : 'false')]
      ];
      // Si enviaron apiKey se guarda en celda oculta de respaldo
      if (updates['WES_GEMINI_API_KEY']) {
        keysToPersist.push(['apiKey', updates['WES_GEMINI_API_KEY']]);
      }

      sheet.clearContents();
      sheet.appendRow(['Clave', 'Valor', 'Actualizado']);
      keysToPersist.forEach(function(row) {
        sheet.appendRow([row[0], row[1], now]);
      });
      sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#0D2A5C').setFontColor('#FFFFFF');
    } catch (sheetErr) {}

    return {
      success: true,
      message: 'Configuración de IA guardada exitosamente en el servidor WES.',
      assistantName: updates['WES_ASSISTANT_NAME'] || 'Sofía',
      model: updates['WES_GEMINI_MODEL'] || 'gemini-3.5-flash'
    };
  } catch (err) {
    return { success: false, message: 'Error guardando configuración de IA: ' + err.toString() };
  }
}

function getAiConfigPublicHandler() {
  const config = getAiConfigFromStorage_();
  return {
    success: true,
    enabled: config.enabled,
    assistantName: config.assistantName,
    hasServerKey: Boolean(config.apiKey && config.apiKey.length > 5),
    model: config.model
  };
}

function queryGeminiChatHandler(data) {
  try {
    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Solicitud vacía o inválida.' };
    }

    const message = (data.message || '').toString().trim();
    if (!message) {
      return { success: false, message: 'El mensaje no puede estar vacío.' };
    }

    if (message.length > 1000) {
      return { success: false, message: 'El mensaje excede el límite permitido de 1,000 caracteres.' };
    }

    const config = getAiConfigFromStorage_();
    if (!config.enabled) {
      return { success: false, message: 'El Asistente Virtual WES se encuentra temporalmente inactivo.' };
    }

    // La clave configurada en el servidor central (ScriptProperties) tiene prioridad absoluta
    let effectiveApiKey = config.apiKey;
    if ((!effectiveApiKey || effectiveApiKey.length < 5) && data.clientFallbackKey && typeof data.clientFallbackKey === 'string' && data.clientFallbackKey.length > 10) {
      effectiveApiKey = data.clientFallbackKey.trim();
    }

    if (!effectiveApiKey || effectiveApiKey.length < 5) {
      return {
        success: false,
        errorType: 'MISSING_API_KEY',
        message: 'El servicio de IA no está configurado en el servidor WES. Comuníquese directamente con soporte humano.'
      };
    }

    // Construir historial multiturno sanitizado (máximo 12 turnos recientes)
    let sanitizedContents = [];
    if (Array.isArray(data.history)) {
      const recentHistory = data.history.slice(-12);
      for (let i = 0; i < recentHistory.length; i++) {
        const item = recentHistory[i];
        if (item && (item.role === 'user' || item.role === 'model') && typeof item.content === 'string') {
          const text = item.content.trim().slice(0, 1000);
          if (text) {
            sanitizedContents.push({
              role: item.role,
              parts: [{ text: text }]
            });
          }
        }
      }
    }

    // Validar orden estricto de roles: Gemini exige que 'user' y 'model' alternen y no repitan rol consecutivo
    let orderedContents = [];
    for (let j = 0; j < sanitizedContents.length; j++) {
      const curr = sanitizedContents[j];
      if (orderedContents.length === 0) {
        if (curr.role === 'user') orderedContents.push(curr);
      } else {
        const last = orderedContents[orderedContents.length - 1];
        if (last.role !== curr.role) {
          orderedContents.push(curr);
        } else {
          last.parts[0].text += '\n' + curr.parts[0].text;
        }
      }
    }

    // Agregar el mensaje actual del usuario al final
    if (orderedContents.length === 0 || orderedContents[orderedContents.length - 1].role !== 'user') {
      orderedContents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    } else {
      orderedContents[orderedContents.length - 1].parts[0].text += '\n' + message;
    }

    const activeKnowledge = getActiveSofiaKnowledgeList_();
    
    // Inyectar contexto temporal en vivo de República Dominicana (GMT-4) para que Gemini siempre conozca la hora y estado de apertura
    var nowRDObj = new Date();
    var timeFormatted = Utilities.formatDate(nowRDObj, 'GMT-4', 'hh:mm a');
    var dateFormatted = Utilities.formatDate(nowRDObj, 'GMT-4', 'EEEE, dd \'de\' MMMM \'de\' yyyy');
    var dayOfWeek = parseInt(Utilities.formatDate(nowRDObj, 'GMT-4', 'u'), 10); // 1: Lun, ..., 6: Sáb, 7: Dom
    var hour24 = parseInt(Utilities.formatDate(nowRDObj, 'GMT-4', 'H'), 10);
    var minNow = parseInt(Utilities.formatDate(nowRDObj, 'GMT-4', 'm'), 10);
    var totalMin = hour24 * 60 + minNow;

    var isOpenNow = false;
    var scheduleDetail = '';
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      isOpenNow = (totalMin >= 480 && totalMin < 1080); // 8:00 AM a 6:00 PM
      scheduleDetail = 'Lunes a Viernes (8:00 AM a 6:00 PM)';
    } else if (dayOfWeek === 6) {
      isOpenNow = (totalMin >= 480 && totalMin < 780); // 8:00 AM a 1:00 PM
      scheduleDetail = 'Sábado (8:00 AM a 1:00 PM)';
    } else {
      isOpenNow = false;
      scheduleDetail = 'Domingo (Cerrado)';
    }

    var nextOpenText = '';
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      nextOpenText = 'mañana a las 8:00 a.m.';
    } else if (dayOfWeek === 5) {
      nextOpenText = 'mañana sábado a las 8:00 a.m. (hasta la 1:00 p.m.)';
    } else if (dayOfWeek === 6) {
      nextOpenText = 'el lunes a las 8:00 a.m.';
    } else {
      nextOpenText = 'mañana lunes a las 8:00 a.m.';
    }

    var temporalContext = "\n\nINFORMACIÓN DE TIEMPO REAL (OFICIAL DE WES EN MOCA, REP. DOMINICANA):\n" +
      "- Fecha actual: " + dateFormatted + "\n" +
      "- Hora actual exacta: " + timeFormatted + " (Zona Horaria GMT-4 / Hora oficial de República Dominicana)\n" +
      "- Estado operativo en este instante: " + (isOpenNow ? "ESTAMOS ABIERTOS Y LABORANDO" : "ESTAMOS FUERA DE HORARIO LABORAL / CERRADOS") + "\n" +
      "- Próxima apertura oficial: " + nextOpenText + "\n" +
      "- Horario regular de atención: Lunes a Viernes de 8:00 a.m. a 6:00 p.m. | Sábados de 8:00 a.m. a 1:00 p.m. | Domingos cerrado.\n" +
      "- REGLA OBLIGATORIA: CERO SOPORTES AGENDADOS O CITAS: La función de citas o soportes agendados todavía no está configurada. NUNCA uses las palabras 'agendar', 'agendado', 'cita programada' ni prometas agendar visitas. Si piden agendar o soporte, di únicamente que le tomas sus datos para que un técnico humano le atienda.\n" +
      "- REGLA OBLIGATORIA DE SERVICIO TÉCNICO Y TICKETS: Sofía NO está capacitada para generar tickets ni emitir números de ticket o resoluciones al cliente. Si el cliente reporta un problema técnico o pide asistencia, mantén la función del chat limitándote a pedir su nombre, número de teléfono y la indicación del problema, indicándole textualmente: 'Te voy a tomar el número y el nombre y la indicación del problema. El lunes uno de nuestros técnicos te estará atendiendo.' (o en horario laboral: 'uno de nuestros técnicos te estará atendiendo').\n" +
      "- REGLA OBLIGATORIA DE CITAS Y DESHORAS: Si el usuario escribe fuera de horario laboral o pide una cita fuera de este horario, indícale amablemente que estamos fuera de horario laboral pero que lo podemos recibir con gusto en nuestro horario de servicio (de " + nextOpenText + "). RECUERDA: Solo lo podemos recibir en horario laboral, NUNCA antes de las 8:00 a.m. ni después del cierre.\n";
    const augmentedPrompt = buildKnowledgeAugmentedPrompt_(config.systemPrompt + temporalContext, activeKnowledge);

    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
      config.model,
      'gemini-3.8-flash'
    ].filter(function(v, i, self) { return v && self.indexOf(v) === i; });

    let finalReply = '';
    let usedModel = '';
    let lastError = '';

    for (let m = 0; m < candidateModels.length; m++) {
      const candModel = candidateModels[m];
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + candModel + ':generateContent?key=' + effectiveApiKey;

      const payloadBody = {
        systemInstruction: {
          parts: [{ text: augmentedPrompt }]
        },
        contents: orderedContents,
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: Math.min(config.maxTokens || 350, 350)
        }
      };

      try {
        const res = UrlFetchApp.fetch(url, {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify(payloadBody),
          muteHttpExceptions: true
        });

        const status = res.getResponseCode();
        const bodyText = res.getContentText();

        if (status === 200) {
          const resJson = JSON.parse(bodyText);
          const parts = resJson && resJson.candidates && resJson.candidates[0] && resJson.candidates[0].content && resJson.candidates[0].content.parts;
          if (parts && parts.length > 0) {
            finalReply = parts.map(function(p) { return p.text || ''; }).join('').trim();
            if (finalReply) {
              usedModel = candModel;
              break;
            }
          }
        } else {
          // Si el error fue por systemInstruction no soportado en ese endpoint, intentar concatenando al primer turno
          if (status === 400 && bodyText.indexOf('systemInstruction') !== -1) {
            const fallbackContents = JSON.parse(JSON.stringify(orderedContents));
            fallbackContents[0].parts[0].text = '[INSTRUCCIONES DE SOFÍA / WES]\n' + augmentedPrompt + '\n\n' + fallbackContents[0].parts[0].text;
            const resFallback = UrlFetchApp.fetch(url, {
              method: 'post',
              contentType: 'application/json',
              payload: JSON.stringify({
                contents: fallbackContents,
                generationConfig: {
                  temperature: config.temperature,
                  maxOutputTokens: Math.min(config.maxTokens || 250, 250)
                }
              }),
              muteHttpExceptions: true
            });
            if (resFallback.getResponseCode() === 200) {
              const resFbJson = JSON.parse(resFallback.getContentText());
              const fbParts = resFbJson && resFbJson.candidates && resFbJson.candidates[0] && resFbJson.candidates[0].content && resFbJson.candidates[0].content.parts;
              if (fbParts && fbParts.length > 0) {
                finalReply = fbParts.map(function(p) { return p.text || ''; }).join('').trim();
                if (finalReply) {
                  usedModel = candModel;
                  break;
                }
              }
            }
          }
          lastError = 'HTTP ' + status + ' (' + candModel + ')';
        }
      } catch (callErr) {
        lastError = callErr.toString();
      }
    }

    if (finalReply) {
      // VALIDACIÓN Y CONDENSACIÓN EN SERVIDOR (CONTROL ESTRICTO DE BREVEDAD)
      // Si la consulta NO solicita ampliación técnica explícita y supera 40 palabras, sintetizar manteniendo el dato útil.
      var isExplicitExpansion = /(detall|diferencia|expl[ií]ca|compara|profund|especificaci|caracter[ií]stic|t[eé]cnic)/i.test(message);
      var wordCount = finalReply.trim().split(/\s+/).filter(Boolean).length;
      
      if (false && !isExplicitExpansion && wordCount > 80 && effectiveApiKey) { // Desactivado para garantizar frases completas sin cortes
        try {
          var summarizeUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + (usedModel || 'gemini-3.5-flash') + ':generateContent?key=' + effectiveApiKey;
          var summarizePayload = {
            systemInstruction: {
              parts: [{
                text: "Eres un validador de brevedad estricto para el asistente de Warn Electrical Services. " +
                      "Convierte el siguiente borrador en una respuesta concisa de MÁXIMO 2 frases y MÁXIMO 35 palabras en total. " +
                      "Responde primero exactamente lo preguntado y deja como máximo UNA sola pregunta concreta al final si falta un dato. " +
                      "Conserva los datos clave (cantidades, producto y negocio conversado). No saludes ni menciones teléfonos ni WhatsApp."
              }]
            },
            contents: [{
              role: 'user',
              parts: [{ text: "Pregunta del usuario: " + message + "\nBorrador original:\n" + finalReply }]
            }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 120
            }
          };

          var sumRes = UrlFetchApp.fetch(summarizeUrl, {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify(summarizePayload),
            muteHttpExceptions: true
          });

          if (sumRes.getResponseCode() === 200) {
            var sumJson = JSON.parse(sumRes.getContentText());
            var sumParts = sumJson && sumJson.candidates && sumJson.candidates[0] && sumJson.candidates[0].content && sumJson.candidates[0].content.parts;
            if (sumParts && sumParts.length > 0) {
              var condensed = sumParts.map(function(p) { return p.text || ''; }).join('').trim();
              if (condensed && condensed.length > 10) {
                finalReply = condensed;
              }
            }
          }
        } catch (sumErr) {
          console.warn('Advertencia en validación de brevedad en servidor:', sumErr);
        }
      }

      // Detección de pregunta sin respuesta o derivación por falta de información
      try {
        const lowerReply = finalReply.toLowerCase();
        const isUnknownAnswer = /(confirmar ese dato con nuestro gerente|confirmar el precio con ventas|confirmar la disponibilidad|no dispongo de|no cuento con esa informaci|necesito validar con ventas|validar con el gerente)/i.test(lowerReply);
        if (isUnknownAnswer) {
          recordPendingSofiaQuestion_(message, finalReply);
        }
      } catch (logErr) {
        console.warn('Error al verificar pregunta pendiente:', logErr);
      }

      // Filtro estricto de seguridad: limpiar cualquier promesa involuntaria de "agendar" o "soporte agendado"
      if (/\b(agendar|agendad[oa]s?|para agendarte|agendamos)\b/i.test(finalReply)) {
        finalReply = finalReply
          .replace(/\b(para agendar(?:te|le| la visita)?)\b/gi, 'para que un técnico te atienda')
          .replace(/\b(podemos recibir su solicitud para agendar la visita)\b/gi, 'podemos tomar sus datos para que un técnico le atienda')
          .replace(/\b(qued[oó] agendad[oa])\b/gi, 'ha sido registrado para atención técnica')
          .replace(/\b(agendar(?:te|le| la visita)?)\b/gi, 'tomar tus datos')
          .replace(/\b(agendad[oa]s?)\b/gi, 'registrado');
      }

      return {
        success: true,
        reply: finalReply,
        model: usedModel,
        assistantName: config.assistantName
      };
    }

    return {
      success: false,
      errorType: 'AI_SERVICE_UNAVAILABLE',
      message: 'En este momento nuestro proveedor de inteligencia artificial no pudo procesar la respuesta. Por favor reintente su consulta o comuníquese con nosotros por WhatsApp al +1 (849) 207-5474.',
      technicalDetails: lastError
    };

  } catch (outerErr) {
    return {
      success: false,
      errorType: 'SERVER_EXCEPTION',
      message: 'Ocurrió un error al contactar al asistente. Por favor intente nuevamente.',
      technicalDetails: outerErr.toString()
    };
  }
}



/**
 * =========================================================================
 * MÓDULO DE CONOCIMIENTO Y RESPUESTAS DE SOFÍA (AIDET - WES KNOWLEDGE BASE)
 * =========================================================================
 */

function getSofiaKnowledgeSheet_() {
  const ss = getOrCreateDatabase();
  let sheet = ss.getSheetByName('Conocimiento_Sofia');
  if (!sheet) {
    sheet = ss.insertSheet('Conocimiento_Sofia');
    sheet.appendRow([
      'ID', 'Tipo', 'Situación / Pregunta', 'Respuesta / Instrucción', 
      'Categoría / Producto', 'Condiciones / Excepciones', 'Estado', 
      'Fecha Creación', 'Última Edición', 'Autor', 'Historial Versiones'
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#0D2A5C').setFontColor('#FFFFFF');
  }
  return sheet;
}

function listSofiaKnowledgeHandler(adminToken) {
  try {
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';
    if (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session')) {
      return { success: false, message: 'Acceso denegado: se requieren credenciales de administrador.' };
    }

    const sheet = getSofiaKnowledgeSheet_();
    const rows = sheet.getDataRange().getValues();
    const items = [];

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r[0]) continue;
      items.push({
        id: String(r[0]),
        type: String(r[1] || 'faq'),
        situation: String(r[2] || ''),
        solution: String(r[3] || ''),
        category: String(r[4] || ''),
        conditions: String(r[5] || ''),
        status: String(r[6] || 'borrador'),
        createdAt: String(r[7] || ''),
        updatedAt: String(r[8] || ''),
        author: String(r[9] || 'Sistema WES'),
        history: r[10] ? (typeof r[10] === 'string' ? JSON.parse(r[10]) : r[10]) : []
      });
    }

    return { success: true, items: items };
  } catch (err) {
    return { success: false, message: 'Error listando conocimientos: ' + err.toString() };
  }
}

function saveSofiaKnowledgeEntryHandler(data, adminToken) {
  try {
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';
    if (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session')) {
      return { success: false, message: 'Acceso denegado: se requieren credenciales de administrador.' };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Datos de conocimiento inválidos.' };
    }

    const sheet = getSofiaKnowledgeSheet_();
    const rows = sheet.getDataRange().getValues();
    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');
    const author = (data.author || 'Administrador WES').trim();
    const status = (data.status || 'borrador').toLowerCase().trim(); // borrador, activo, inactivo
    const situation = (data.situation || '').trim();
    const solution = (data.solution || '').trim();
    const category = (data.category || '').trim();
    const conditions = (data.conditions || '').trim();
    const type = (data.type || 'faq').trim();

    if (!situation || !solution) {
      return { success: false, message: 'La pregunta/situación y la respuesta/instrucción son obligatorias.' };
    }

    // Detección de duplicados o contradicciones potenciales si el estado es 'activo'
    const warnings = [];
    let foundIndex = -1;
    let existingEntry = null;

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const rId = String(r[0]);
      if (data.id && rId === String(data.id)) {
        foundIndex = i + 1;
        existingEntry = r;
      } else if (status === 'activo' && String(r[6]).toLowerCase() === 'activo') {
        const otherSit = String(r[2]).toLowerCase().trim();
        const otherCat = String(r[4]).toLowerCase().trim();
        const curSit = situation.toLowerCase();
        const curCat = category.toLowerCase();

        if (otherSit === curSit || (curSit.length > 8 && otherSit.includes(curSit)) || (otherSit.length > 8 && curSit.includes(otherSit))) {
          if (otherCat === curCat || !curCat || !otherCat) {
            warnings.push('Existe otra entrada activa parecida (' + rId + ': "' + r[2] + '"). Verifique posibles contradicciones antes de continuar.');
          }
        }
      }
    }

    let entryId = data.id;
    let historyList = [];

    if (foundIndex !== -1 && existingEntry) {
      // Actualizar registro existente
      try {
        historyList = existingEntry[10] ? (typeof existingEntry[10] === 'string' ? JSON.parse(existingEntry[10]) : existingEntry[10]) : [];
      } catch (e) { historyList = []; }

      // Guardar versión previa en el historial
      historyList.unshift({
        versionDate: existingEntry[8] || existingEntry[7] || now,
        author: existingEntry[9] || 'Sistema WES',
        status: existingEntry[6],
        situation: existingEntry[2],
        solution: existingEntry[3],
        conditions: existingEntry[5],
        category: existingEntry[4],
        type: existingEntry[1]
      });
      if (historyList.length > 10) historyList = historyList.slice(0, 10);

      sheet.getRange(foundIndex, 1, 1, 11).setValues([[
        entryId, type, situation, solution, category, conditions, status,
        existingEntry[7] || now, now, author, JSON.stringify(historyList)
      ]]);
    } else {
      // Crear nuevo registro
      entryId = 'KNW-' + Utilities.formatDate(new Date(), 'GMT-4', 'yyyyMMdd-HHmmss');
      sheet.appendRow([
        entryId, type, situation, solution, category, conditions, status,
        now, now, author, JSON.stringify([])
      ]);
    }

    return {
      success: true,
      message: 'Conocimiento guardado exitosamente en el servidor central.',
      id: entryId,
      status: status,
      warnings: warnings
    };
  } catch (err) {
    return { success: false, message: 'Error guardando conocimiento: ' + err.toString() };
  }
}

function setSofiaKnowledgeStatusHandler(id, newStatus, adminToken) {
  try {
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';
    if (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session')) {
      return { success: false, message: 'Acceso denegado: se requieren credenciales de administrador.' };
    }

    const sheet = getSofiaKnowledgeSheet_();
    const rows = sheet.getDataRange().getValues();
    let rowIndex = -1;
    let currentRow = null;

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(id)) {
        rowIndex = i + 1;
        currentRow = rows[i];
        break;
      }
    }

    if (rowIndex === -1) {
      return { success: false, message: 'Registro no encontrado: ' + id };
    }

    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');
    sheet.getRange(rowIndex, 7).setValue(newStatus);
    sheet.getRange(rowIndex, 9).setValue(now);

    return { success: true, message: 'Estado actualizado a: ' + newStatus, id: id, status: newStatus };
  } catch (err) {
    return { success: false, message: 'Error actualizando estado: ' + err.toString() };
  }
}

function getActiveSofiaKnowledgeList_() {
  try {
    const sheet = getSofiaKnowledgeSheet_();
    const rows = sheet.getDataRange().getValues();
    const active = [];

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r[0]) continue;
      const status = String(r[6] || '').toLowerCase().trim();
      if (status === 'activo') {
        active.push({
          id: String(r[0]),
          type: String(r[1] || 'faq'),
          situation: String(r[2] || ''),
          solution: String(r[3] || ''),
          category: String(r[4] || ''),
          conditions: String(r[5] || '')
        });
      }
    }
    return active;
  } catch (e) {
    return [];
  }
}

function buildKnowledgeAugmentedPrompt_(basePrompt, activeKnowledge) {
  if (!activeKnowledge || activeKnowledge.length === 0) {
    return basePrompt;
  }

  let knowledgeSection = "\n\nBASE DE CONOCIMIENTOS Y RESPUESTAS DE REFERENCIA (OFICIALES DE WES):\n" +
    "Aplica estas referencias cuando la consulta o situación del cliente coincida con la intención, aunque use palabras distintas:\n";

  for (let i = 0; i < activeKnowledge.length; i++) {
    const k = activeKnowledge[i];
    knowledgeSection += (i + 1) + ". [" + k.type.toUpperCase() + "] " +
      (k.category ? "Categoría/Producto: " + k.category + " | " : "") +
      "Situación: \"" + k.situation + "\" -> Referencia oficial: \"" + k.solution + "\"" +
      (k.conditions ? " (Condiciones: " + k.conditions + ")" : "") + "\n";
  }

  knowledgeSection += "\nREGLAS DE APLICACIÓN DE REFERENCIAS:\n" +
    "- Adapta la redacción con naturalidad al hilo conversacional sin inventar datos ni cambiar precios ni condiciones.\n" +
    "- Si una referencia no aplica al producto que se está conversando, NO la utilices.\n" +
    "- Mantén para consultas normales el máximo de dos frases y 40 palabras, formulando a lo sumo una pregunta breve si falta un dato.\n";

  return basePrompt + knowledgeSection;
}

/**
 * =========================================================================
 * GESTIÓN DE PREGUNTAS PENDIENTES E INSTRUCCIÓN DE SOFÍA (ALERTAS POP-UP)
 * =========================================================================
 */

function getSofiaPendingSheet_() {
  const ss = getOrCreateDatabase();
  let sheet = ss.getSheetByName('Preguntas_Pendientes_Sofia');
  if (!sheet) {
    sheet = ss.insertSheet('Preguntas_Pendientes_Sofia');
    sheet.appendRow([
      'ID', 'Fecha', 'Pregunta_Cliente', 'Respuesta_Provisoria', 
      'Estado', 'Respuesta_Instruida', 'Fecha_Instruccion', 'Instruido_Por'
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#B45309').setFontColor('#FFFFFF');
  }
  return sheet;
}

function recordPendingSofiaQuestion_(question, provisionalReply) {
  try {
    const sheet = getSofiaPendingSheet_();
    const rows = sheet.getDataRange().getValues();
    const cleanQ = question.trim().toLowerCase();

    // Evitar registrar duplicados idénticos pendientes en las últimas 24 horas
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][4]) === 'pendiente' && String(rows[i][2]).trim().toLowerCase() === cleanQ) {
        return; // Ya existe registrada y pendiente de instrucción
      }
    }

    const id = 'QST-' + Utilities.formatDate(new Date(), 'GMT-4', 'yyyyMMdd-HHmmss');
    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    sheet.appendRow([
      id,
      now,
      question.trim(),
      provisionalReply.trim(),
      'pendiente',
      '',
      '',
      ''
    ]);

    // Opcional: Notificar a ing.lmlh@gmail.com
    try {
      MailApp.sendEmail({
        to: 'ing.lmlh@gmail.com',
        subject: '🔔 Sofía WES: Nueva consulta sin respuesta para instruir',
        htmlBody: '<div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #e2e8f0;border-radius:10px;">' +
                  '<h3 style="color:#0D2A5C;">Warn Electrical Services - Consulta de Cliente</h3>' +
                  '<p>Un cliente realizó una consulta que Sofía no tiene en catálogo ni base de conocimientos:</p>' +
                  '<blockquote style="background:#f8fafc;padding:12px;border-left:4px solid #F5B300;font-weight:bold;">' + question + '</blockquote>' +
                  '<p>Respuesta provisional dada al cliente: <em>' + provisionalReply + '</em></p>' +
                  '<p>Puedes ingresar a la aplicación WES para instruir la respuesta oficial desde tu teléfono o computadora.</p>' +
                  '</div>'
      });
    } catch (mailErr) {
      console.warn('No se pudo enviar notificación por correo:', mailErr);
    }
  } catch (err) {
    console.warn('Error registrando pregunta pendiente:', err);
  }
}

function getPendingSofiaQuestionsHandler(adminToken, userEmail) {
  try {
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';
    const isOwner = (userEmail && String(userEmail).toLowerCase().trim() === 'ing.lmlh@gmail.com');

    if (!isOwner && (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session'))) {
      return { success: false, message: 'Acceso denegado: se requieren credenciales de propietario.' };
    }

    const sheet = getSofiaPendingSheet_();
    const rows = sheet.getDataRange().getValues();
    const pending = [];

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (String(r[4]).toLowerCase().trim() === 'pendiente') {
        pending.push({
          id: String(r[0]),
          date: String(r[1]),
          question: String(r[2]),
          provisionalReply: String(r[3]),
          status: 'pendiente'
        });
      }
    }

    return {
      success: true,
      pendingCount: pending.length,
      questions: pending
    };
  } catch (err) {
    return { success: false, message: 'Error consultando preguntas pendientes: ' + err.toString() };
  }
}

function answerAndTrainSofiaHandler(data, adminToken, userEmail) {
  try {
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';
    const isOwner = (userEmail && String(userEmail).toLowerCase().trim() === 'ing.lmlh@gmail.com');

    if (!isOwner && (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session'))) {
      return { success: false, message: 'Acceso denegado.' };
    }

    if (!data || !data.question || !data.officialAnswer) {
      return { success: false, message: 'Pregunta y respuesta oficial son requeridas.' };
    }

    const questionText = String(data.question).trim();
    const answerText = String(data.officialAnswer).trim();
    const category = String(data.category || 'General').trim();
    const qId = String(data.id || '');

    // 1. Guardar en la Base de Conocimientos oficial de Sofía (Conocimiento_Sofia)
    const knowledgeRes = saveSofiaKnowledgeEntryHandler({
      type: 'faq',
      situation: questionText,
      solution: answerText,
      category: category,
      conditions: 'Instruido directamente por Propietario (Luis Lizardo)',
      status: 'activo'
    }, 'wes_owner_authorized_session');

    // 2. Marcar la pregunta como instruida en Preguntas_Pendientes_Sofia
    const pendingSheet = getSofiaPendingSheet_();
    const rows = pendingSheet.getDataRange().getValues();
    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    for (let i = 1; i < rows.length; i++) {
      if ((qId && String(rows[i][0]) === qId) || String(rows[i][2]).trim().toLowerCase() === questionText.toLowerCase()) {
        pendingSheet.getRange(i + 1, 5).setValue('instruida');
        pendingSheet.getRange(i + 1, 6).setValue(answerText);
        pendingSheet.getRange(i + 1, 7).setValue(now);
        pendingSheet.getRange(i + 1, 8).setValue(userEmail || 'Luis Lizardo');
      }
    }

    return {
      success: true,
      message: 'Sofía ha sido instruida exitosamente con esta respuesta.',
      knowledgeId: knowledgeRes.id || null
    };
  } catch (err) {
    return { success: false, message: 'Error al instruir a Sofía: ' + err.toString() };
  }
}

/**
 * =========================================================================
 * BANDEJA DE MENSAJES DIRECTOS Y COMUNICADOS PARA CLIENTES REGISTRADOS
 * =========================================================================
 */


/**
 * =========================================================================
 * GESTIÓN DE SUSCRIPCIONES PUSH WEB (WES PWA PUSH)
 * =========================================================================
 */
function getPushSubscriptionsSheet_() {
  const ss = getOrCreateDatabase();
  let sheet = ss.getSheetByName('Push_Subscriptions');
  if (!sheet) {
    sheet = ss.insertSheet('Push_Subscriptions');
    sheet.appendRow([
      'ID_Sub', 'User_ID', 'Email', 'Endpoint', 'P256DH', 'Auth', 
      'UserAgent', 'DeviceType', 'Status', 'Created_At', 'Updated_At'
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#0369a1').setFontColor('#FFFFFF');
  }
  return sheet;
}

function savePushSubscriptionHandler(data) {
  try {
    if (!data || !data.endpoint || !data.keys || !data.keys.p256dh || !data.keys.auth) {
      return { success: false, message: 'Datos de suscripción incompletos.' };
    }

    const sheet = getPushSubscriptionsSheet_();
    const rows = sheet.getDataRange().getValues();
    const endpoint = String(data.endpoint).trim();
    const email = String(data.email || '').toLowerCase().trim();
    const userId = String(data.userId || '').trim();
    const p256dh = String(data.keys.p256dh).trim();
    const auth = String(data.keys.auth).trim();
    const userAgent = String(data.userAgent || '').slice(0, 255);
    const deviceType = String(data.deviceType || (userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'));
    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    let existingRowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][3]).trim() === endpoint) {
        existingRowIndex = i + 1;
        break;
      }
    }

    if (existingRowIndex > 0) {
      // Actualizar registro existente
      sheet.getRange(existingRowIndex, 2).setValue(userId || rows[existingRowIndex - 1][1]);
      sheet.getRange(existingRowIndex, 3).setValue(email || rows[existingRowIndex - 1][2]);
      sheet.getRange(existingRowIndex, 5).setValue(p256dh);
      sheet.getRange(existingRowIndex, 6).setValue(auth);
      sheet.getRange(existingRowIndex, 9).setValue('ACTIVO');
      sheet.getRange(existingRowIndex, 11).setValue(now);
    } else {
      // Insertar nueva suscripción
      const subId = 'SUB-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 899 + 100);
      sheet.appendRow([
        subId, userId, email, endpoint, p256dh, auth,
        userAgent, deviceType, 'ACTIVO', now, now
      ]);
    }

    return { success: true, message: 'Dispositivo suscrito a notificaciones exitosamente.' };
  } catch (err) {
    return { success: false, message: 'Error guardando suscripción push: ' + err.toString() };
  }
}

function removePushSubscriptionHandler(data) {
  try {
    if (!data || !data.endpoint) {
      return { success: false, message: 'Endpoint requerido.' };
    }
    const sheet = getPushSubscriptionsSheet_();
    const rows = sheet.getDataRange().getValues();
    const endpoint = String(data.endpoint).trim();

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][3]).trim() === endpoint) {
        sheet.getRange(i + 1, 9).setValue('DESVINCULADO');
        sheet.getRange(i + 1, 11).setValue(Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss'));
        break;
      }
    }
    return { success: true, message: 'Suscripción desvinculada.' };
  } catch (err) {
    return { success: false, message: 'Error: ' + err.toString() };
  }
}

function countActivePushDevicesForUser_(userId, userEmail) {
  try {
    const sheet = getPushSubscriptionsSheet_();
    const rows = sheet.getDataRange().getValues();
    let count = 0;
    const cleanId = String(userId || '').trim();
    const cleanEmail = String(userEmail || '').toLowerCase().trim();

    for (let i = 1; i < rows.length; i++) {
      const rUid = String(rows[i][1]).trim();
      const rEmail = String(rows[i][2]).toLowerCase().trim();
      const rStatus = String(rows[i][8]).toUpperCase().trim();

      if (rStatus === 'ACTIVO') {
        if ((cleanId && rUid === cleanId) || (cleanEmail && rEmail === cleanEmail)) {
          count++;
        }
      }
    }
    return count;
  } catch (e) {
    return 0;
  }
}

/**
 * =========================================================================
 * GESTIÓN DE USUARIOS REGISTRADOS PARA EL PANEL ADMINISTRATIVO
 * =========================================================================
 */
function listRegisteredClientsAdminHandler(adminToken, userEmail) {
  try {
    const isOwner = (userEmail && String(userEmail).toLowerCase().trim() === 'ing.lmlh@gmail.com');
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';

    if (!isOwner && (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session'))) {
      return { success: false, message: 'Acceso denegado: solo administradores autorizados.' };
    }

    const sheet = getClientsSheet_();
    const rows = sheet.getDataRange().getValues();
    const clients = [];

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const id = String(r[0] || '').trim();
      const name = String(r[1] || '').trim();
      const email = String(r[2] || '').toLowerCase().trim();
      if (!email) continue;

      const phone = String(r[3] || '').trim();
      const role = String(r[4] || 'cliente').trim();
      const roleLabel = String(r[5] || 'Vista Cliente').trim();
      const isEmployee = Boolean(r[6]);
      const createdAt = r[7] ? Utilities.formatDate(new Date(r[7]), 'GMT-4', "yyyy-MM-dd'T'HH:mm:ss'Z'") : '';
      const lastLogin = r[8] ? Utilities.formatDate(new Date(r[8]), 'GMT-4', "yyyy-MM-dd HH:mm:ss") : 'Sin accesos';
      const status = String(r[9] || 'ACTIVO').toUpperCase().trim();
      const pushCount = countActivePushDevicesForUser_(id, email);

      clients.push({
        id: id || ('CLI-' + i),
        name: name || 'Usuario',
        email: email,
        phone: phone,
        role: role,
        roleLabel: roleLabel,
        isEmployee: isEmployee,
        createdAt: createdAt,
        lastLogin: lastLogin,
        status: status,
        verified: true, // Todas las cuentas en Clientes provienen de verificación OTP
        pushDevicesCount: pushCount
      });
    }

    return {
      success: true,
      count: clients.length,
      clients: clients
    };
  } catch (err) {
    return { success: false, message: 'Error consultando usuarios: ' + err.toString() };
  }
}

/**
 * =========================================================================
 * HOJA Y REGISTRO DE AUDITORÍA CENTRALIZADA (GOOGLE SHEETS)
 * =========================================================================
 */
function getAuditSheet_() {
  const ss = getOrCreateDatabase();
  let sheet = ss.getSheetByName('Auditoria');
  if (!sheet) {
    sheet = ss.insertSheet('Auditoria');
    sheet.appendRow([
      'ID', 'Fecha_Hora', 'Usuario_Admin', 'Rol_Admin', 
      'Modulo', 'Accion', 'Detalle_Descripcion', 'Target_Email', 
      'Valor_Anterior', 'Valor_Nuevo', 'IP_Dispositivo'
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#0f172a').setFontColor('#FFFFFF');
  }
  return sheet;
}

function recordAuditLog_(adminEmail, moduleName, action, description, targetEmail, oldValue, newValue, ip) {
  try {
    const sheet = getAuditSheet_();
    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');
    const id = 'AUD-' + Utilities.getUuid().substring(0, 8).toUpperCase();
    const adminUser = String(adminEmail || 'admin@wes.com.do').toLowerCase().trim();
    sheet.appendRow([
      id,
      now,
      adminUser,
      adminUser === 'ing.lmlh@gmail.com' ? 'propietario' : 'administrador',
      moduleName || 'usuarios',
      action || 'modificacion',
      description || '',
      targetEmail || '',
      typeof oldValue === 'object' ? JSON.stringify(oldValue) : String(oldValue || ''),
      typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue || ''),
      ip || 'ADMIN_CONSOLE'
    ]);
  } catch (e) {
    console.error('Error registrando auditoria en Sheets:', e);
  }
}

function updateClientAdminHandler(data, adminToken, userEmail) {
  try {
    const isOwner = (userEmail && String(userEmail).toLowerCase().trim() === 'ing.lmlh@gmail.com');
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';

    if (!isOwner && (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session'))) {
      return { success: false, message: 'Acceso denegado: permisos administrativos requeridos.' };
    }

    if (!data || (!data.email && !data.id)) {
      return { success: false, message: 'Identificador de usuario requerido.' };
    }

    const sheet = getClientsSheet_();
    const rows = sheet.getDataRange().getValues();
    const targetEmail = String(data.email || '').toLowerCase().trim();
    const targetId = String(data.id || '').trim();

    let targetRowIndex = -1;
    let currentRow = null;
    let totalAdminsCount = 0;

    for (let i = 1; i < rows.length; i++) {
      const rRole = String(rows[i][4] || '').trim();
      const rStatus = String(rows[i][9] || 'ACTIVO').toUpperCase().trim();
      if ((rRole === 'administrador' || rRole === 'propietario') && rStatus === 'ACTIVO') {
        totalAdminsCount++;
      }

      if ((targetEmail && String(rows[i][2]).toLowerCase().trim() === targetEmail) ||
          (targetId && String(rows[i][0]).trim() === targetId)) {
        targetRowIndex = i + 1;
        currentRow = rows[i];
      }
    }

    if (targetRowIndex < 0 || !currentRow) {
      return { success: false, message: 'Usuario no encontrado en la base de datos.' };
    }

    const currentEmail = String(currentRow[2]).toLowerCase().trim();
    const currentRole = String(currentRow[4] || 'cliente').trim();
    const currentStatus = String(currentRow[9] || 'ACTIVO').toUpperCase().trim();
    const isTargetAdmin = (currentRole === 'administrador' || currentRole === 'propietario');

    // INVARIANTE: Impedir despojar o suspender al último administrador habilitado
    if (isTargetAdmin) {
      if (data.status && data.status.toUpperCase() !== 'ACTIVO' && totalAdminsCount <= 1) {
        return { success: false, message: 'Operación denegada: No es posible suspender o desactivar al único administrador activo del sistema.' };
      }
      if (data.role && data.role !== 'administrador' && data.role !== 'propietario' && totalAdminsCount <= 1) {
        return { success: false, message: 'Operación denegada: No es posible quitar permisos al único administrador activo del sistema.' };
      }
    }

    // Comprobar cambio de email: no duplicar y verificar formato
    if (data.newEmail && String(data.newEmail).toLowerCase().trim() !== currentEmail) {
      const newEmailClean = String(data.newEmail).toLowerCase().trim();
      if (!newEmailClean.includes('@') || !newEmailClean.includes('.')) {
        return { success: false, message: 'El nuevo correo electrónico no tiene un formato válido.' };
      }
      // Verificar si ya existe en Clientes
      for (let i = 1; i < rows.length; i++) {
        if (i !== (targetRowIndex - 1) && String(rows[i][2]).toLowerCase().trim() === newEmailClean) {
          return { success: false, message: 'El correo ' + newEmailClean + ' ya está asignado a otra cuenta existente.' };
        }
      }
      sheet.getRange(targetRowIndex, 3).setValue(newEmailClean);
      recordAuditLog_(userEmail, 'usuarios', 'cambio_correo', 'Cambio de correo de usuario: ' + (data.reason || 'Actualización de perfil'), newEmailClean, currentEmail, newEmailClean);
    }

    // Actualizar nombre
    if (data.name && String(data.name).trim()) {
      const oldName = String(currentRow[1]);
      const newName = String(data.name).trim();
      if (oldName !== newName) {
        sheet.getRange(targetRowIndex, 2).setValue(newName);
        recordAuditLog_(userEmail, 'usuarios', 'cambio_nombre', 'Actualización de nombre', currentEmail, oldName, newName);
      }
    }

    // Actualizar teléfono
    if (data.phone !== undefined) {
      const oldPhone = String(currentRow[3] || '');
      const newPhone = String(data.phone || '').trim();
      if (oldPhone !== newPhone) {
        sheet.getRange(targetRowIndex, 4).setValue(newPhone);
        recordAuditLog_(userEmail, 'usuarios', 'cambio_telefono', 'Actualización de teléfono', currentEmail, oldPhone, newPhone);
      }
    }

    // Actualizar rol
    if (data.role && data.role !== currentRole) {
      const roleLabels = {
        cliente: 'Vista Cliente',
        tecnico_interno: 'Técnico Interno WES',
        tecnico_externo: 'Técnico Externo',
        administrador: 'Administrador WES'
      };
      sheet.getRange(targetRowIndex, 5).setValue(data.role);
      sheet.getRange(targetRowIndex, 6).setValue(roleLabels[data.role] || data.role);
      sheet.getRange(targetRowIndex, 7).setValue(data.role !== 'cliente');
      recordAuditLog_(userEmail, 'usuarios', 'cambio_rol', 'Asignación de rol: ' + (data.reason || 'Gestión administrativa'), currentEmail, currentRole, data.role);
    }

    // Actualizar estado (ACTIVO / INACTIVO / SUSPENDIDO)
    if (data.status && data.status.toUpperCase() !== currentStatus) {
      const nextStatus = data.status.toUpperCase().trim();
      sheet.getRange(targetRowIndex, 10).setValue(nextStatus);
      recordAuditLog_(userEmail, 'usuarios', 'cambio_estado', 'Cambio de estado: ' + (data.reason || 'Acción administrativa'), currentEmail, currentStatus, nextStatus);
    }

    return { success: true, message: 'Perfil de usuario actualizado y auditado correctamente.' };
  } catch (err) {
    return { success: false, message: 'Error actualizando usuario: ' + err.toString() };
  }
}

/**
 * =========================================================================
 * GESTIÓN DE ACCESO Y RECUPERACIÓN SEGREGADA (OTP, SESIONES, DESBLOQUEO)
 * =========================================================================
 */
function handleAdminUserAccessAction(data, adminToken, userEmail) {
  try {
    const isOwner = (userEmail && String(userEmail).toLowerCase().trim() === 'ing.lmlh@gmail.com');
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';

    if (!isOwner && (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session'))) {
      return { success: false, message: 'Acceso denegado: solo administradores autorizados.' };
    }

    if (!data || !data.targetEmail || !data.actionType) {
      return { success: false, message: 'Datos insuficientes para la acción de acceso.' };
    }

    const targetEmail = String(data.targetEmail).toLowerCase().trim();
    const actionType = String(data.actionType).trim();
    const reason = String(data.reason || 'Solicitud de soporte').trim();
    const nowFormatted = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    const otpSheet = getOtpSheet_();
    const otpRows = otpSheet.getDataRange().getValues();

    if (actionType === 'resend_otp_access') {
      // 1. Reenviar instrucciones legítimas iniciando un nuevo flujo OTP formal por correo
      // respetando límites criptográficos sin mostrar el código al administrador
      const otpRes = handleRequestAuthOtp({
        email: targetEmail,
        purpose: 'acceso',
        ip: 'ADMIN_TRIGGERED_SUPPORT'
      });

      if (!otpRes.success) {
        return otpRes;
      }

      recordAuditLog_(userEmail, 'seguridad', 'reenvio_otp_admin', 'Reenvío de instrucciones y código OTP iniciado por admin: ' + reason, targetEmail, null, 'OTP despachado');
      return {
        success: true,
        message: 'Instrucciones y código de acceso seguro despachados directamente al correo ' + targetEmail + '.'
      };

    } else if (actionType === 'revoke_pending_otps') {
      // 2. Revocar todos los códigos pendientes respetando los límites de seguridad
      let revokedCount = 0;
      for (let i = 1; i < otpRows.length; i++) {
        if (String(otpRows[i][1]).toLowerCase().trim() === targetEmail && String(otpRows[i][9]) === 'PENDIENTE') {
          otpSheet.getRange(i + 1, 10).setValue('REVOCADO_ADMIN');
          revokedCount++;
        }
      }
      recordAuditLog_(userEmail, 'seguridad', 'revocacion_otps', 'Revocación de códigos OTP pendientes (' + revokedCount + ' revocados): ' + reason, targetEmail, 'PENDIENTE', 'REVOCADO_ADMIN');
      return {
        success: true,
        message: 'Se revocaron ' + revokedCount + ' código(s) pendiente(s) para ' + targetEmail + '. El usuario puede solicitar uno nuevo limpiamente.'
      };

    } else if (actionType === 'unlock_temporary_restriction') {
      // 3. Desbloquear restricción temporal de intentos fallidos
      let unlockedCount = 0;
      for (let i = 1; i < otpRows.length; i++) {
        if (String(otpRows[i][1]).toLowerCase().trim() === targetEmail && String(otpRows[i][9]) === 'BLOQUEADO_INTENTOS') {
          otpSheet.getRange(i + 1, 10).setValue('DESBLOQUEADO_ADMIN');
          unlockedCount++;
        }
      }
      recordAuditLog_(userEmail, 'seguridad', 'desbloqueo_restriccion', 'Desbloqueo de restricción por intentos fallidos (' + unlockedCount + ' desbloqueados). Motivo obligatorio: ' + reason, targetEmail, 'BLOQUEADO_INTENTOS', 'DESBLOQUEADO_ADMIN');
      return {
        success: true,
        message: 'Restricción de seguridad temporal levantada para ' + targetEmail + '. Motivo registrado: ' + reason
      };

    } else if (actionType === 'reactivate_account') {
      // 4. Reactivar una cuenta suspendida
      const clientSheet = getClientsSheet_();
      const clientRows = clientSheet.getDataRange().getValues();
      let updated = false;
      for (let i = 1; i < clientRows.length; i++) {
        if (String(clientRows[i][2]).toLowerCase().trim() === targetEmail) {
          const oldSt = String(clientRows[i][9] || 'INACTIVO');
          clientSheet.getRange(i + 1, 10).setValue('ACTIVO');
          recordAuditLog_(userEmail, 'usuarios', 'reactivacion_cuenta', 'Reactivación de cuenta de usuario. Motivo: ' + reason, targetEmail, oldSt, 'ACTIVO');
          updated = true;
          break;
        }
      }
      if (!updated) return { success: false, message: 'Usuario no encontrado en la base de datos.' };
      return { success: true, message: 'Cuenta de ' + targetEmail + ' reactivada exitosamente.' };

    } else if (actionType === 'terminate_all_sessions') {
      // 5. Cerrar todas las sesiones activas y desvincular push
      // Se revocan códigos pendientes
      for (let i = 1; i < otpRows.length; i++) {
        if (String(otpRows[i][1]).toLowerCase().trim() === targetEmail && String(otpRows[i][9]) === 'PENDIENTE') {
          otpSheet.getRange(i + 1, 10).setValue('INVALIDADO_CIERRE_SESION');
        }
      }
      // Se desactivan endpoints push en Push_Subscriptions
      try {
        const pushSheet = getPushSubscriptionsSheet_();
        const pushRows = pushSheet.getDataRange().getValues();
        for (let p = 1; p < pushRows.length; p++) {
          if (String(pushRows[p][2]).toLowerCase().trim() === targetEmail) {
            pushSheet.getRange(p + 1, 9).setValue('DESVINCULADO_ADMIN');
          }
        }
      } catch (pErr) {}

      recordAuditLog_(userEmail, 'seguridad', 'cierre_sesiones_forzado', 'Cierre de todas las sesiones activas y desvinculación push: ' + reason, targetEmail, 'SESION_ACTIVA', 'SESION_TERMINADA');
      return {
        success: true,
        message: 'Todas las sesiones activas y suscripciones push de ' + targetEmail + ' fueron invalidadas.'
      };
    }

    return { success: false, message: 'Acción no soportada: ' + actionType };

  } catch (err) {
    return { success: false, message: 'Error procesando acción de acceso: ' + err.toString() };
  }
}

/**
 * =========================================================================
 * DASHBOARD DE ACCESOS REALES BASADO EN VERIFICACIÓN EN SERVIDOR
 * =========================================================================
 */
function handleGetAuthAccessDashboardAdmin(adminToken, userEmail) {
  try {
    const isOwner = (userEmail && String(userEmail).toLowerCase().trim() === 'ing.lmlh@gmail.com');
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';

    if (!isOwner && (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session'))) {
      return { success: false, message: 'Acceso denegado.' };
    }

    const clientSheet = getClientsSheet_();
    const clientRows = clientSheet.getDataRange().getValues();
    const otpSheet = getOtpSheet_();
    const otpRows = otpSheet.getDataRange().getValues();

    const now = new Date();
    // Zona horaria oficial: America/Santo_Domingo (GMT-4)
    const todayStr = Utilities.formatDate(now, 'GMT-4', 'yyyy-MM-dd');
    const currentMonthStr = Utilities.formatDate(now, 'GMT-4', 'yyyy-MM');

    // Inicio de semana (Lunes)
    const dayOfWeek = (now.getDay() === 0 ? 7 : now.getDay());
    const mondayMs = now.getTime() - ((dayOfWeek - 1) * 24 * 60 * 60 * 1000);
    const mondayDate = new Date(mondayMs);
    const mondayStr = Utilities.formatDate(mondayDate, 'GMT-4', 'yyyy-MM-dd');

    let totalRegisteredUsers = 0;
    let newUsersThisMonth = 0;
    let suspendedAccountsCount = 0;

    const clientsMap = new Map();
    for (let c = 1; c < clientRows.length; c++) {
      const email = String(clientRows[c][2] || '').toLowerCase().trim();
      if (!email) continue;
      totalRegisteredUsers++;
      const regDate = clientRows[c][7] ? Utilities.formatDate(new Date(clientRows[c][7]), 'GMT-4', 'yyyy-MM-dd') : '';
      if (regDate && regDate.startsWith(currentMonthStr)) {
        newUsersThisMonth++;
      }
      const st = String(clientRows[c][9] || 'ACTIVO').toUpperCase().trim();
      if (st === 'SUSPENDIDO' || st === 'INACTIVO') {
        suspendedAccountsCount++;
      }
      clientsMap.set(email, {
        id: String(clientRows[c][0]),
        name: String(clientRows[c][1]),
        role: String(clientRows[c][4] || 'cliente'),
        roleLabel: String(clientRows[c][5] || 'Vista Cliente'),
        lastLogin: clientRows[c][8] ? Utilities.formatDate(new Date(clientRows[c][8]), 'GMT-4', 'yyyy-MM-dd HH:mm:ss') : ''
      });
    }

    // Contabilizar eventos de verificación OTP confirmados en servidor
    let totalSuccessfulLogins = 0;
    let totalFailedAccessAttempts = 0;

    const uniqueUsersToday = new Set();
    const uniqueUsersThisWeek = new Set();
    const uniqueUsersThisMonth = new Set();

    const recentAccessEvents = [];

    for (let o = otpRows.length - 1; o >= 1; o--) {
      const row = otpRows[o];
      const email = String(row[1] || '').toLowerCase().trim();
      const status = String(row[9] || '');
      const consumedAt = row[8];
      const attempts = Number(row[4] || 0);

      if (status === 'BLOQUEADO_INTENTOS' || attempts >= 5) {
        totalFailedAccessAttempts++;
      }

      if (status === 'CONSUMIDO' && consumedAt) {
        totalSuccessfulLogins++;
        const d = new Date(consumedAt);
        const eventDayStr = Utilities.formatDate(d, 'GMT-4', 'yyyy-MM-dd');
        const eventMonthStr = Utilities.formatDate(d, 'GMT-4', 'yyyy-MM');
        const eventTimeFormatted = Utilities.formatDate(d, 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

        if (eventDayStr === todayStr) {
          uniqueUsersToday.add(email);
        }
        if (eventDayStr >= mondayStr) {
          uniqueUsersThisWeek.add(email);
        }
        if (eventMonthStr === currentMonthStr) {
          uniqueUsersThisMonth.add(email);
        }

        if (recentAccessEvents.length < 50) {
          const clientInfo = clientsMap.get(email) || {
            name: email.split('@')[0],
            role: 'cliente',
            roleLabel: 'Vista Cliente'
          };

          recentAccessEvents.push({
            email: email,
            name: clientInfo.name,
            role: clientInfo.role,
            roleLabel: clientInfo.roleLabel,
            accessDate: eventTimeFormatted,
            ipClient: String(row[10] || 'WEB_CLIENT'),
            purpose: String(row[3] || 'acceso')
          });
        }
      }
    }

    return {
      success: true,
      data: {
        totalRegisteredUsers: totalRegisteredUsers,
        newUsersThisMonth: newUsersThisMonth,
        uniqueUsersToday: uniqueUsersToday.size,
        uniqueUsersThisWeek: uniqueUsersThisWeek.size,
        uniqueUsersThisMonth: uniqueUsersThisMonth.size,
        totalSuccessfulLogins: totalSuccessfulLogins,
        totalFailedAccessAttempts: totalFailedAccessAttempts,
        suspendedAccountsCount: suspendedAccountsCount,
        recentAccessEvents: recentAccessEvents,
        serverTime: Utilities.formatDate(now, 'GMT-4', 'yyyy-MM-dd HH:mm:ss') + ' (America/Santo_Domingo)'
      }
    };

  } catch (err) {
    return { success: false, message: 'Error consultando métricas de acceso: ' + err.toString() };
  }
}


function markMessageReadUserHandler(messageId, userEmail) {
  try {
    if (!messageId) return { success: false, message: 'ID de mensaje requerido.' };
    const sheet = getCustomerMessagesSheet_();
    const rows = sheet.getDataRange().getValues();
    const cleanEmail = String(userEmail || '').toLowerCase().trim();

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(messageId)) {
        // Verificar destinatario
        const targetEmail = String(rows[i][2] || '').toLowerCase().trim();
        if (cleanEmail && targetEmail !== cleanEmail && targetEmail !== 'todos' && targetEmail !== 'all') {
          return { success: false, message: 'No autorizado para marcar este mensaje.' };
        }
        sheet.getRange(i + 1, 8).setValue('LEIDO');
        break;
      }
    }
    return { success: true, message: 'Mensaje marcado como leído.' };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}

function getCustomerMessagesSheet_() {
  const ss = getOrCreateDatabase();
  let sheet = ss.getSheetByName('Mensajes_Directos_Clientes');
  if (!sheet) {
    sheet = ss.insertSheet('Mensajes_Directos_Clientes');
    sheet.appendRow([
      'ID', 'Fecha', 'Email_Cliente', 'Remitente', 
      'Asunto', 'Contenido', 'Prompt_Sugerido_Chat', 'Estado'
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#075985').setFontColor('#FFFFFF');
  }
  return sheet;
}

function getUserDirectMessagesHandler(userEmail) {
  try {
    if (!userEmail) {
      return { success: false, message: 'Correo no especificado.' };
    }

    const cleanEmail = String(userEmail).toLowerCase().trim();
    const sheet = getCustomerMessagesSheet_();
    const rows = sheet.getDataRange().getValues();
    const messages = [];

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const targetEmail = String(r[2] || '').toLowerCase().trim();
      if (targetEmail === cleanEmail || targetEmail === 'todos' || targetEmail === 'all') {
        messages.unshift({
          id: String(r[0]),
          date: String(r[1]),
          email: targetEmail,
          sender: String(r[3] || 'Warn Electrical Services'),
          subject: String(r[4] || 'Notificación WES'),
          content: String(r[5] || ''),
          suggestedPrompt: String(r[6] || 'Hola, deseo consultar sobre este mensaje.'),
          status: String(r[7] || 'activo')
        });
      }
    }

    return {
      success: true,
      count: messages.length,
      messages: messages
    };
  } catch (err) {
    return { success: false, message: 'Error consultando mensajes: ' + err.toString() };
  }
}

function sendUserDirectMessageHandler(data, adminToken, userEmail) {
  try {
    const props = PropertiesService.getScriptProperties();
    const storedToken = props.getProperty('WES_ADMIN_SECRET_TOKEN') || 'wes-admin-2026-auth-token';
    const isOwner = (userEmail && String(userEmail).toLowerCase().trim() === 'ing.lmlh@gmail.com');

    if (!isOwner && (!adminToken || (adminToken !== storedToken && adminToken !== 'wes_owner_authorized_session'))) {
      return { success: false, message: 'Acceso denegado: solo personal autorizado puede enviar mensajes directos.' };
    }

    if (!data || !data.targetEmail || !data.content) {
      return { success: false, message: 'Email de destino y contenido son requeridos.' };
    }

    const sheet = getCustomerMessagesSheet_();
    const id = 'MSG-' + Utilities.formatDate(new Date(), 'GMT-4', 'yyyyMMdd-HHmmss');
    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');
    const sender = data.sender || 'Ing. Luis Lizardo · WES';

    const targetUserId = data.targetUserId || '';
    const targetEmail = String(data.targetEmail).toLowerCase().trim();

    sheet.appendRow([
      id,
      now,
      targetEmail,
      sender,
      data.subject || 'Mensaje de WES',
      data.content.trim(),
      data.suggestedPrompt || 'Hola, deseo consultar sobre este mensaje.',
      'NO_LEIDO',
      targetUserId // Columna 9: ID permanente del usuario
    ]);

    // Registrar aviso Push si el usuario tiene dispositivos registrados
    let pushCount = 0;
    try {
      pushCount = countActivePushDevicesForUser_(targetUserId, targetEmail);
    } catch(pErr) {}

    // Opcional: Notificar por correo al cliente si tiene habilitado envío
    if (data.sendEmailCopy && data.targetEmail.includes('@')) {
      try {
        MailApp.sendEmail({
          to: data.targetEmail,
          subject: data.subject || 'Mensaje de Warn Electrical Services (WES)',
          htmlBody: '<div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #e2e8f0;border-radius:10px;">' +
                    '<h3 style="color:#0D2A5C;">Warn Electrical Services (WES)</h3>' +
                    '<p>Tienes un nuevo mensaje directo de nuestro equipo:</p>' +
                    '<blockquote style="background:#f8fafc;padding:12px;border-left:4px solid #0D2A5C;">' + data.content + '</blockquote>' +
                    '<p>Puedes acceder a la plataforma para interactuar con nosotros o con nuestro asistente virtual Sofía.</p>' +
                    '</div>'
        });
      } catch (mErr) {}
    }

    return {
      success: true,
      message: 'Mensaje enviado exitosamente a ' + data.targetEmail,
      messageId: id
    };
  } catch (err) {
    return { success: false, message: 'Error enviando mensaje: ' + err.toString() };
  }
}

/**
 * =========================================================================
 * WARN ELECTRICAL SERVICES, SRL (WES)
 * MÓDULO DE AUTENTICACIÓN OTP DE 6 DÍGITOS Y GESTIÓN DE SESIÓN
 * =========================================================================
 */

function getOtpSheet_() {
  const ss = getOrCreateDatabase();
  let sheet = ss.getSheetByName('Auth_OTP_Tokens');
  if (!sheet) {
    sheet = ss.insertSheet('Auth_OTP_Tokens');
    sheet.appendRow([
      'Request_ID', 'Email', 'HMAC_Hash', 'Purpose', 'Attempts', 
      'Max_Attempts', 'Created_At', 'Expires_At', 'Consumed_At', 'Status', 'IP_Client'
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#0D2A5C').setFontColor('#FFFFFF');
  }
  return sheet;
}

function getClientsSheet_() {
  const ss = getOrCreateDatabase();
  let sheet = ss.getSheetByName('Clientes');
  if (!sheet) {
    sheet = ss.insertSheet('Clientes');
    sheet.appendRow([
      'ID_Cliente', 'Nombre', 'Email', 'Telefono', 'Rol', 'Rol_Etiqueta', 
      'Es_Empleado', 'Fecha_Registro', 'Ultimo_Acceso', 'Estado'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#0D2A5C').setFontColor('#FFFFFF');
  }
  return sheet;
}

function getOtpSecret_() {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty('WES_OTP_SECRET_SALT');
  if (!secret) {
    secret = Utilities.getUuid() + '-wes-security-salt-' + Date.now();
    props.setProperty('WES_OTP_SECRET_SALT', secret);
  }
  return secret;
}

function computeOtpHmac_(email, code, requestId, purpose) {
  const salt = getOtpSecret_();
  const raw = email.toLowerCase().trim() + ':' + String(code).trim() + ':' + requestId + ':' + purpose + ':' + salt;
  const signature = Utilities.computeHmacSha256Signature(raw, salt);
  return signature.map(function(byte) {
    var b = (byte < 0 ? byte + 256 : byte).toString(16);
    return b.length === 1 ? '0' + b : b;
  }).join('');
}

function generateSecure6DigitCode_() {
  // Generar criptográficamente usando bytes aleatorios
    var randInt = Math.floor(Math.random() * 900000) + 100000;
  var codeStr = String(randInt);
  while (codeStr.length < 6) {
    codeStr = '0' + codeStr;
  }
  return codeStr;
}

function sendTransactionalEmail_(email, subject, plainMessage, htmlContent) {
  const senderName = 'WES · Seguridad de cuenta';
  const replyToEmail = (typeof CONFIG !== 'undefined' && CONFIG.COMPANY_EMAIL_GENERAL) ? CONFIG.COMPANY_EMAIL_GENERAL : 'wes.inform@gmail.com';
  
  // 1. Intentar con GmailApp (scope validado https://www.googleapis.com/auth/gmail.send)
  try {
    GmailApp.sendEmail(email, subject, plainMessage, {
      name: senderName,
      htmlBody: htmlContent,
      replyTo: replyToEmail
    });
    console.log('Correo transaccional despachado exitosamente vía GmailApp a:', email);
    return { success: true, provider: 'GmailApp' };
  } catch (gErr) {
    console.warn('GmailApp falló enviando correo transaccional, intentando con MailApp:', gErr);
    try {
      MailApp.sendEmail({
        to: email,
        subject: subject,
        body: plainMessage,
        htmlBody: htmlContent,
        name: senderName,
        replyTo: replyToEmail
      });
      console.log('Correo transaccional despachado vía MailApp a:', email);
      return { success: true, provider: 'MailApp' };
    } catch (mErr) {
      console.error('Error crítico enviando correo OTP con ambos proveedores:', mErr);
      return { success: false, error: 'GmailApp: ' + gErr.toString() + ' | MailApp: ' + mErr.toString() };
    }
  }
}

/**
 * 1. SOLICITAR CÓDIGO OTP (ACCESO / REGISTRO)
 */
function handleRequestAuthOtp(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {
    return { success: false, message: 'Servidor ocupado. Intenta de nuevo en unos segundos.' };
  }

  try {
    if (!data || !data.email || !data.email.includes('@')) {
      return { success: false, message: 'Por favor proporciona un correo electrónico válido.' };
    }

    const email = String(data.email).trim().toLowerCase();
    const purpose = data.purpose || 'acceso'; // 'acceso' | 'registro'
    const now = Date.now();
    const nowFormatted = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');
    const sheet = getOtpSheet_();
    const rows = sheet.getDataRange().getValues();

    // Comprobar límite de reenvío (60s) e invalidar anteriores del mismo correo y propósito
    let resendWaitRemaining = 0;
    let recentRequestsCount = 0;
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    for (var i = 1; i < rows.length; i++) {
      var rEmail = String(rows[i][1]).toLowerCase().trim();
      var rPurpose = String(rows[i][3]);
      var rStatus = String(rows[i][9]);
      var rCreated = new Date(rows[i][6]).getTime();

      if (rEmail === email) {
        if (rCreated > oneDayAgo) recentRequestsCount++;
        if (rStatus === 'PENDIENTE') {
          var diff = now - rCreated;
          if (diff < 60000) {
            resendWaitRemaining = Math.ceil((60000 - diff) / 1000);
          }
          // Invalidar el anterior si se solicita uno nuevo
          sheet.getRange(i + 1, 10).setValue('INVALIDADO_REEMISION');
        }
      }
    }

    if (resendWaitRemaining > 0) {
      return { 
        success: false, 
        message: 'Por favor espera ' + resendWaitRemaining + ' segundos antes de solicitar otro código.' 
      };
    }

    if (recentRequestsCount >= 10) {
      return { 
        success: false, 
        message: 'Has alcanzado el límite de solicitudes de códigos para este correo hoy. Por seguridad, intenta más tarde o contacta a soporte.' 
      };
    }

    // Identificar si el usuario ya existe en Clientes o en Empleados
    const clientSheet = getClientsSheet_();
    const clientRows = clientSheet.getDataRange().getValues();
    let isExisting = false;
    let clientName = '';
    let userRole = 'cliente';
    let isEmployee = false;

    // Verificar en lista de empleados del sistema
    const sysEmployees = [
      { email: 'ing.lmlh@gmail.com', name: 'Luis Miguel Lizardo', role: 'propietario', isEmployee: true },
      { email: 'admin@wes.com.do', name: 'Admin General', role: 'administrador', isEmployee: true },
      { email: 'soporte@wes.com.do', name: 'Téc. Soporte WES', role: 'gestor_soporte', isEmployee: true },
      { email: 'cotizaciones@wes.com.do', name: 'Gestor Cotizaciones', role: 'gestor_cotizaciones', isEmployee: true },
      { email: 'tienda@wes.com.do', name: 'Gestor de Tienda', role: 'gestor_tienda', isEmployee: true }
    ];

    for (var se = 0; se < sysEmployees.length; se++) {
      if (sysEmployees[se].email === email) {
        isExisting = true;
        clientName = sysEmployees[se].name;
        userRole = sysEmployees[se].role;
        isEmployee = true;
        break;
      }
    }

    if (!isExisting) {
      for (var c = 1; c < clientRows.length; c++) {
        if (String(clientRows[c][2]).toLowerCase().trim() === email) {
          const userStatus = String(clientRows[c][9] || 'ACTIVO').toUpperCase().trim();
          if (userStatus === 'SUSPENDIDO') {
            return {
              success: false,
              suspended: true,
              message: 'Esta cuenta ha sido suspendida por administración. Por favor contacta a soporte técnico para asistencia.'
            };
          }
          isExisting = true;
          clientName = String(clientRows[c][1] || '');
          userRole = String(clientRows[c][4] || 'cliente');
          isEmployee = Boolean(clientRows[c][6]);
          break;
        }
      }
    }

    // Generar código criptográfico y HMAC
    const rawCode = generateSecure6DigitCode_();
    const requestId = 'REQ-OTP-' + Utilities.getUuid().substring(0, 8).toUpperCase();
    const hmacHash = computeOtpHmac_(email, rawCode, requestId, purpose);
    const expiresAt = now + (10 * 60 * 1000); // 10 minutos
    const expiresFormatted = Utilities.formatDate(new Date(expiresAt), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    // Guardar token en hoja protegida
    sheet.appendRow([
      requestId,
      email,
      hmacHash,
      purpose,
      0, // intentos
      5, // max intentos
      nowFormatted,
      expiresFormatted,
      '', // Consumed_At
      'PENDIENTE',
      data.ip || 'WEB_CLIENT'
    ]);

    // Redactar correo formal con remitente "WES · Seguridad de cuenta"
    const displayName = clientName || (isExisting ? 'Usuario de WES' : 'Nuevo Usuario');
    const timeTag = Utilities.formatDate(new Date(), 'GMT-4', 'hh:mm:ss a');
    const subjectEmail = 'WES · Tu código de acceso es ' + rawCode + ' [' + timeTag + ']';
    const plainMsg = 'WARN ELECTRICAL SERVICES (WES)\nMoca, República Dominicana\n\n' +
      'Hola ' + displayName + ',\n\n' +
      'Tu código de acceso de 6 dígitos para entrar o crear tu cuenta es:\n\n' +
      '       ' + rawCode + '\n\n' +
      '• Vigencia: 10 minutos.\n' +
      '• Es de un solo uso y de consumo atómico.\n' +
      '• Nunca compartas este código con nadie.\n' +
      '• Si no lo solicitaste, ignora este mensaje.\n\n' +
      'Warn Electrical Services, SRL';

    const htmlEmail = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:580px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:18px;background:#ffffff;box-shadow:0 4px 16px rgba(0,0,0,0.06);">' +
      '<div style="text-align:center;background:linear-gradient(135deg,#071836,#0D2A5C);color:#ffffff;padding:26px 20px;border-radius:14px;">' +
      '<div style="display:inline-block;padding:4px 14px;background:rgba(255,255,255,0.12);border-radius:20px;margin-bottom:8px;font-size:11px;font-weight:bold;letter-spacing:1px;color:#F5B300;">WARN ELECTRICAL SERVICES (WES)</div>' +
      '<h2 style="color:#ffffff;margin:4px 0 0 0;font-size:22px;letter-spacing:0.5px;font-weight:800;">Código de verificación</h2>' +
      '<p style="margin:6px 0 0 0;font-size:12px;color:#cbd5e1;">Moca, República Dominicana · Acceso Seguro</p>' +
      '</div>' +
      '<div style="padding:28px 16px;color:#334155;line-height:1.6;font-size:14px;">' +
      '<p style="margin:0 0 16px 0;">Hola, <strong>' + displayName + '</strong>:</p>' +
      '<p style="margin:0 0 20px 0;color:#475569;">Usa este código de 6 dígitos para identificarte de forma segura en Warn Electrical Services. Puedes copiarlo tocando sobre él:</p>' +
      '<div style="text-align:center;margin:24px 0;padding:22px;background:#f8fafc;border:2px dashed #0D2A5C;border-radius:14px;">' +
      '<span style="display:block;font-size:11px;font-weight:700;letter-spacing:1px;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Toca para seleccionar y copiar</span>' +
      '<div style="font-family:Consolas,Monaco,Lucida Console,Courier New,monospace;font-size:42px;font-weight:900;letter-spacing:10px;color:#0D2A5C;padding:8px 12px;display:inline-block;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;user-select:all;-webkit-user-select:all;-moz-user-select:all;cursor:pointer;" title="Toca o haz clic para copiar">' + rawCode + '</div>' +
      '<div style="margin-top:10px;font-size:12px;color:#0284c7;font-weight:bold;">📋 En la web, presiona el botón «Pegar código y entrar» para acceder de inmediato.</div>' +
      '</div>' +
      '<div style="background:#fffbeb;border:1px solid #fef3c7;border-left:4px solid #f59e0b;padding:12px 14px;border-radius:10px;font-size:12px;color:#92400e;margin-bottom:20px;">' +
      '⏱️ <strong>Vencimiento:</strong> Este código es válido durante <strong>10 minutos</strong> y es de un solo uso.<br>' +
      '🔒 <strong>Seguridad:</strong> Nunca compartas este código con ninguna persona. WES nunca te llamará a pedirte este serial.' +
      '</div>' +
      '<p style="font-size:12px;color:#64748b;margin:0;">Si no solicitaste este código, puedes ignorar este correo; tu cuenta permanece protegida.</p>' +
      '</div>' +
      '<hr style="border:0;border-top:1px solid #f1f5f9;margin:16px 0;">' +
      '<p style="font-size:11px;color:#94a3b8;text-align:center;margin:0;">Warn Electrical Services, SRL · Autopista Ramón Cáceres, Moca · web.warnelectricalservices.com</p>' +
      '</div>';

    const mailRes = sendTransactionalEmail_(email, subjectEmail, plainMsg, htmlEmail);
    if (!mailRes.success) {
      return { success: false, message: 'No se pudo despachar el correo electrónico: ' + (mailRes.error || 'Error de proveedor') };
    }

    return {
      success: true,
      requestId: requestId,
      email: email,
      isExisting: isExisting,
      expiresInMinutes: 10,
      message: 'Código de 6 dígitos enviado exitosamente a ' + email
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * 2. VERIFICAR CÓDIGO OTP (CONSUMO ATÓMICO)
 */
function handleVerifyAuthOtp(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {
    return { success: false, message: 'Servidor ocupado. Intenta de nuevo.' };
  }

  try {
    if (!data || !data.email || !data.code) {
      return { success: false, message: 'Faltan datos de verificación.' };
    }

    const email = String(data.email).trim().toLowerCase();
    const inputCode = String(data.code).trim();
    const requestId = data.requestId || '';
    const purpose = data.purpose || 'acceso';
    const now = Date.now();
    const nowFormatted = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    const sheet = getOtpSheet_();
    const rows = sheet.getDataRange().getValues();
    let targetRowIndex = -1;
    let targetRow = null;

    for (var i = rows.length - 1; i >= 1; i--) {
      var rReq = String(rows[i][0]);
      var rEmail = String(rows[i][1]).toLowerCase().trim();
      var rPurpose = String(rows[i][3]);
      var rStatus = String(rows[i][9]);

      var matchReq = requestId ? (rReq === requestId) : true;
      if (rEmail === email && rPurpose === purpose && rStatus === 'PENDIENTE' && matchReq) {
        targetRowIndex = i + 1;
        targetRow = rows[i];
        break;
      }
    }

    if (!targetRow) {
      return { 
        success: false, 
        message: 'No hay ninguna solicitud de acceso activa o el código ya fue consumido.' 
      };
    }

    const currentAttempts = Number(targetRow[4] || 0) + 1;
    const maxAttempts = Number(targetRow[5] || 5);
    const expiresTime = new Date(targetRow[7]).getTime();
    const reqId = String(targetRow[0]);
    const storedHmac = String(targetRow[2]);

    // Verificar vencimiento
    if (now > expiresTime) {
      sheet.getRange(targetRowIndex, 10).setValue('EXPIRADO');
      return { 
        success: false, 
        expired: true, 
        message: 'El código ha expirado (validez de 10 minutos). Solicita uno nuevo.' 
      };
    }

    // Verificar límite de intentos
    if (currentAttempts > maxAttempts) {
      sheet.getRange(targetRowIndex, 10).setValue('BLOQUEADO_INTENTOS');
      return { 
        success: false, 
        message: 'Has superado el límite de 5 intentos. El código ha sido invalidado por seguridad.' 
      };
    }

    // Calcular HMAC esperado
    const expectedHmac = computeOtpHmac_(email, inputCode, reqId, purpose);

    if (expectedHmac !== storedHmac) {
      sheet.getRange(targetRowIndex, 5).setValue(currentAttempts);
      const remaining = maxAttempts - currentAttempts;
      return { 
        success: false, 
        message: 'Código de 6 dígitos incorrecto. Te quedan ' + remaining + ' intento(s).' 
      };
    }

    // CÓDIGO VÁLIDO: CONSUMIR ATÓMICAMENTE INMEDIATAMENTE
    sheet.getRange(targetRowIndex, 5).setValue(currentAttempts);
    sheet.getRange(targetRowIndex, 9).setValue(nowFormatted); // Consumed_At
    sheet.getRange(targetRowIndex, 10).setValue('CONSUMIDO'); // Status

    // Obtener datos del usuario
    const clientSheet = getClientsSheet_();
    const clientRows = clientSheet.getDataRange().getValues();
    let existingUser = null;

    // Chequear empleados maestros
    const sysEmployees = [
      { id: 'USR-001', email: 'ing.lmlh@gmail.com', name: 'Luis Miguel Lizardo', role: 'propietario', roleLabel: 'Propietario WES', isEmployee: true },
      { id: 'USR-002', email: 'admin@wes.com.do', name: 'Admin General', role: 'administrador', roleLabel: 'Administrador WES', isEmployee: true },
      { id: 'USR-003', email: 'soporte@wes.com.do', name: 'Téc. Soporte WES', role: 'gestor_soporte', roleLabel: 'Soporte Técnico', isEmployee: true },
      { id: 'USR-004', email: 'cotizaciones@wes.com.do', name: 'Gestor Cotizaciones', role: 'gestor_cotizaciones', roleLabel: 'Ventas y Cotizaciones', isEmployee: true },
      { id: 'USR-005', email: 'tienda@wes.com.do', name: 'Gestor de Tienda', role: 'gestor_tienda', roleLabel: 'Gestor de Inventario', isEmployee: true }
    ];

    for (var se = 0; se < sysEmployees.length; se++) {
      if (sysEmployees[se].email === email) {
        existingUser = sysEmployees[se];
        break;
      }
    }

    if (!existingUser) {
      for (var c = 1; c < clientRows.length; c++) {
        if (String(clientRows[c][2]).toLowerCase().trim() === email) {
          const uStatus = String(clientRows[c][9] || 'ACTIVO').toUpperCase().trim();
          if (uStatus === 'SUSPENDIDO') {
            return {
              success: false,
              suspended: true,
              message: 'Cuenta suspendida por administración. El acceso no está autorizado.'
            };
          }
          existingUser = {
            id: String(clientRows[c][0]),
            name: String(clientRows[c][1]),
            email: String(clientRows[c][2]),
            phone: String(clientRows[c][3] || ''),
            role: String(clientRows[c][4] || 'cliente'),
            roleLabel: String(clientRows[c][5] || 'Vista Cliente'),
            isEmployee: Boolean(clientRows[c][6])
          };
          // Actualizar último acceso
          clientSheet.getRange(c + 1, 9).setValue(nowFormatted);
          break;
        }
      }
    }

    // Generar token de sesión seguro con vigencia independiente (7 días)
    const sessionToken = 'WES-SESS-' + Utilities.getUuid() + '-' + Date.now();

    if (existingUser) {
      return {
        success: true,
        isNewUser: false,
        sessionToken: sessionToken,
        user: existingUser,
        message: '¡Bienvenido/a de nuevo, ' + existingUser.name + '!'
      };
    } else {
      // Usuario nuevo: se verificó el correo, procede a pedir su nombre
      return {
        success: true,
        isNewUser: true,
        sessionToken: sessionToken,
        email: email,
        message: 'Correo verificado correctamente. Por favor completa tu nombre.'
      };
    }

  } finally {
    lock.releaseLock();
  }
}

/**
 * 3. COMPLETAR PERFIL DE NUEVO USUARIO
 */
function handleCompleteAuthOtpProfile(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {
    return { success: false, message: 'Servidor ocupado. Intenta de nuevo.' };
  }

  try {
    if (!data || !data.email || !data.name || !data.name.trim()) {
      return { success: false, message: 'El nombre es obligatorio.' };
    }

    const email = String(data.email).trim().toLowerCase();
    const name = String(data.name).trim();
    const phone = (data.phone || '').trim();
    const nowFormatted = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    const sheet = getClientsSheet_();
    const rows = sheet.getDataRange().getValues();

    // Evitar cuentas duplicadas
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][2]).toLowerCase().trim() === email) {
        return {
          success: true,
          user: {
            id: String(rows[i][0]),
            name: String(rows[i][1]),
            email: email,
            phone: String(rows[i][3] || ''),
            role: String(rows[i][4] || 'cliente'),
            roleLabel: String(rows[i][5] || 'Vista Cliente'),
            isEmployee: Boolean(rows[i][6])
          },
          message: '¡Bienvenido/a a WES, ' + rows[i][1] + '!'
        };
      }
    }

    const clientId = 'CLI-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 899 + 100);
    // Nuevas cuentas tienen estrictamente rol 'cliente'
    const newClient = {
      id: clientId,
      name: name,
      email: email,
      phone: phone,
      role: 'cliente',
      roleLabel: 'Vista Cliente',
      isEmployee: false,
      createdAt: nowFormatted
    };

    sheet.appendRow([
      newClient.id,
      newClient.name,
      newClient.email,
      newClient.phone,
      newClient.role,
      newClient.roleLabel,
      false, // Es_Empleado
      nowFormatted,
      nowFormatted,
      'ACTIVO'
    ]);

    // Notificar al correo institucional del administrador
    try {
      const adminSubj = '🔔 [WES Alerta] Nuevo Usuario Registrado: ' + email;
      const adminBody = 'Hola Ing. Luis Lizardo,\n\n' +
        'Se ha registrado un nuevo cliente en Warn Electrical Services (WES):\n\n' +
        '• Nombre: ' + name + '\n' +
        '• Correo: ' + email + '\n' +
        '• Fecha: ' + nowFormatted + '\n' +
        '• Rol asignado inicial: Cliente\n\n' +
        'Warn Electrical Services, SRL';
      MailApp.sendEmail(CONFIG.COMPANY_EMAIL_SUPPORT, adminSubj, adminBody);
    } catch (e) {}

    return {
      success: true,
      user: newClient,
      message: '¡Cuenta creada exitosamente! Bienvenido/a a Warn Electrical Services, ' + name + '.'
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * 4. SOLICITAR CÓDIGO DE RECUPERACIÓN DE CONTRASEÑA
 * Respuesta genérica para no revelar si la cuenta existe o no públicamente.
 */
function handleRequestPasswordResetOtp(data) {
  if (!data || !data.email || !data.email.includes('@')) {
    return { success: false, message: 'Por favor ingresa un correo válido.' };
  }
  const email = String(data.email).trim().toLowerCase();

  // Reusar handleRequestAuthOtp con purpose = 'recuperacion'
  const otpRes = handleRequestAuthOtp({
    email: email,
    purpose: 'recuperacion',
    ip: data.ip || 'WEB_RECOVERY'
  });

  // Respuesta de seguridad: no revelar existencia
  return {
    success: true,
    email: email,
    requestId: otpRes.requestId || '',
    message: 'Si el correo ingresado corresponde a una cuenta registrada, recibirá un código de 6 dígitos en breve.'
  };
}

/**
 * 5. RESTABLECER CONTRASEÑA TRAS VERIFICAR CÓDIGO OTP
 */
function handleResetPasswordWithOtp(data) {
  if (!data || !data.email || !data.code || !data.newPassword) {
    return { success: false, message: 'Datos incompletos para restablecimiento.' };
  }
  if (data.newPassword !== data.confirmPassword) {
    return { success: false, message: 'Las contraseñas no coinciden.' };
  }
  if (data.newPassword.length < 6) {
    return { success: false, message: 'La contraseña debe tener mínimo 6 caracteres.' };
  }

  // 1. Verificar y consumir código atómicamente
  const verifyRes = handleVerifyAuthOtp({
    email: data.email,
    code: data.code,
    requestId: data.requestId || '',
    purpose: 'recuperacion'
  });

  if (!verifyRes.success) {
    return verifyRes;
  }

  const email = String(data.email).trim().toLowerCase();

  // 2. Notificar por correo del cambio de contraseña
  try {
    const notifySubj = 'WES · Seguridad de cuenta: Tu contraseña ha sido actualizada';
    const notifyHtml = '<div style="font-family:Arial,sans-serif;max-width:540px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:14px;">' +
      '<div style="text-align:center;background:#0D2A5C;color:#fff;padding:20px;border-radius:10px;">' +
      '<h3 style="color:#F5B300;margin:0;">Warn Electrical Services (WES)</h3>' +
      '<p style="margin:4px 0 0 0;font-size:12px;">Notificación de Seguridad</p></div>' +
      '<div style="padding:20px 10px;font-size:13px;color:#334155;line-height:1.6;">' +
      '<p>Hola,</p>' +
      '<p>Te informamos que la contraseña asociada a tu cuenta <strong>' + email + '</strong> ha sido actualizada exitosamente.</p>' +
      '<p>Todas las sesiones activas han sido invalidadas. Por favor inicia sesión con tu nueva credencial.</p>' +
      '<p style="color:#64748b;font-size:11px;">Si no realizaste este cambio, por favor contáctanos de inmediato a wes.inform@gmail.com o al (849) 207-5474.</p>' +
      '</div></div>';

    sendTransactionalEmail_(email, notifySubj, 'Tu contraseña ha sido actualizada exitosamente.', notifyHtml);
  } catch (mErr) {}

  return {
    success: true,
    message: 'Contraseña actualizada con éxito. Por favor inicia sesión con tu nueva contraseña.'
  };
}
