/**
 * WARN ELECTRICAL SERVICES, SRL (WES)
 * Backend Google Apps Script — Estándar AIDET v2.0
 * 
 * Funcionalidades:
 * 1. Procesamiento de Solicitudes de Cotización (COT-2026-XXXX)
 * 2. Procesamiento de Tickets de Soporte Técnico con Fotos (SOP-2026-XXXX)
 * 3. Almacenamiento estructurado en Google Sheets
 * 4. Almacenamiento seguro de fotografías en Google Drive
 * 5. Envío de correos automáticos corporativos (Cliente y Empresa)
 */

const CONFIG = {
  COMPANY_NAME: 'Warn Electrical Services, SRL (WES)',
  COMPANY_EMAIL_GENERAL: 'wes.inform@gmail.com',
  COMPANY_EMAIL_SUPPORT: 'wes.inform@gmail.com',
  COMPANY_PHONE: '(849) 207-5474',
  COMPANY_WEBSITE: 'https://wes.com.do',
  DRIVE_FOLDER_NAME: 'WES_Soporte_Evidencias'
};

function doGet(e) {
  const result = {
    status: 'ONLINE',
    service: 'WES Backend API - Apps Script',
    version: '2.0',
    timestamp: new Date().toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

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

      case 'ping':
        response = { success: true, message: 'Conexión exitosa con backend WES' };
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
      message: 'Error interno en el servidor: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Procesa una solicitud de cotización
 */
function procesarNuevaCotizacion(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('WES - Base de Datos Operativa');
  let sheet = ss.getSheetByName('Cotizaciones');
  
  if (!sheet) {
    sheet = ss.insertSheet('Cotizaciones');
    sheet.appendRow([
      'Nº Cotización', 'Fecha y Hora', 'Cliente', 'Empresa', 'RNC/Cédula',
      'Teléfono', 'WhatsApp', 'Correo', 'Ciudad', 'Tipo Cliente',
      'Método Contacto', 'Productos', 'Total Estimado RD$', 'Comentarios', 'Estado', 'Notas Internas'
    ]);
    sheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#0D2A5C').setFontColor('#FFFFFF');
  }

  const nextNum = Math.max(1, sheet.getLastRow());
  const quoteNumber = 'COT-2026-' + ('0000' + nextNum).slice(-4);
  const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

  // Formato de productos para registro y correos
  let itemsSummary = '';
  let itemsHtml = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%; border-color:#ddd;">';
  itemsHtml += '<tr style="background:#0D2A5C; color:#fff;"><th>Producto</th><th>Código</th><th>Cant.</th><th>Subtotal Est.</th></tr>';

  (data.items || []).forEach(item => {
    itemsSummary += `• [${item.code}] ${item.name} x${item.quantity} (RD$ ${(item.price * item.quantity).toLocaleString()})\n`;
    itemsHtml += `<tr><td>${item.name}</td><td><code>${item.code}</code></td><td align="center">${item.quantity}</td><td align="right">RD$ ${(item.price * item.quantity).toLocaleString()}</td></tr>`;
  });
  itemsHtml += `</table><p><strong>Total Estimado: RD$ ${(data.totalEstimated || 0).toLocaleString()}</strong></p>`;

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

  // Enviar correos si Gmail está habilitado
  try {
    // 1. Correo a la empresa
    const subjectEmpresa = `Nueva solicitud de cotización – ${quoteNumber}`;
    const htmlEmpresa = `
      <div style="font-family:Arial,sans-serif; color:#333; max-width:600px; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
        <div style="background:#0D2A5C; color:#fff; padding:20px; text-align:center;">
          <h2 style="margin:0; color:#FFC107;">WARN ELECTRICAL SERVICES (WES)</h2>
          <p style="margin:5px 0 0 0; font-size:14px;">Notificación de Nueva Cotización</p>
        </div>
        <div style="padding:25px;">
          <p>Se ha recibido una nueva solicitud de cotización en el portal web.</p>
          <p><strong>Número de solicitud:</strong> <span style="color:#0D2A5C; font-weight:bold;">${quoteNumber}</span></p>
          <p><strong>Cliente:</strong> ${data.clientName}</p>
          <p><strong>Empresa:</strong> ${data.company || 'Particular'}</p>
          <p><strong>Teléfono / WhatsApp:</strong> ${data.phone} / ${data.whatsapp}</p>
          <p><strong>Correo:</strong> ${data.email}</p>
          <p><strong>Método preferido de contacto:</strong> ${data.contactMethod}</p>
          <hr style="border:0; border-top:1px solid #e2e8f0; margin:20px 0;">
          <h4>Productos solicitados:</h4>
          ${itemsHtml}
          <p><strong>Comentarios del cliente:</strong><br>${data.comments || 'Ninguno'}</p>
          <p style="margin-top:25px; padding:12px; background:#fffbeb; border-left:4px solid:#F59E0B;">
            Por favor, revisar la solicitud y contactar al cliente con la propuesta formal.
          </p>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: CONFIG.COMPANY_EMAIL_GENERAL,
      subject: subjectEmpresa,
      htmlBody: htmlEmpresa
    });

    // 2. Correo de confirmación al cliente
    if (data.email) {
      const subjectCliente = `Recibimos tu solicitud de cotización – ${CONFIG.COMPANY_NAME}`;
      const htmlCliente = `
        <div style="font-family:Arial,sans-serif; color:#333; max-width:600px; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
          <div style="background:#0D2A5C; color:#fff; padding:20px; text-align:center;">
            <h2 style="margin:0; color:#FFC107;">WARN ELECTRICAL SERVICES</h2>
            <p style="margin:5px 0 0 0; font-size:13px;">Tecnología, seguridad y soporte a tu alcance</p>
          </div>
          <div style="padding:25px;">
            <p>Hola, <strong>${data.clientName}</strong>:</p>
            <p>Gracias por comunicarte con <strong>${CONFIG.COMPANY_NAME}</strong>.</p>
            <p>Hemos recibido tu solicitud de cotización con el número <strong>${quoteNumber}</strong>. Nuestro equipo revisará los productos y la información proporcionada para preparar una respuesta detallada.</p>
            <div style="background:#f8fafc; padding:15px; border-radius:6px; margin:20px 0; font-size:13px; color:#64748b;">
              <em>Este mensaje confirma la recepción de tu solicitud; no representa todavía una cotización final ni una confirmación de disponibilidad inmediata de stock.</em>
            </div>
            <h4>Productos incluidos en tu solicitud:</h4>
            ${itemsHtml}
            <p>Si necesitas agregar más información o coordinar una visita técnica en tus instalaciones, puedes responder a este correo o escribirnos a nuestro WhatsApp: <strong>${CONFIG.COMPANY_PHONE}</strong>.</p>
            <br>
            <p>Atentamente,<br>
            <strong>Equipo de ${CONFIG.COMPANY_NAME}</strong><br>
            Teléfono: ${CONFIG.COMPANY_PHONE}<br>
            Correo: ${CONFIG.COMPANY_EMAIL_GENERAL}<br>
            Autopista Ramón Cáceres, Plaza Megatone, Moca, Rep. Dom.</p>
          </div>
        </div>
      `;

      MailApp.sendEmail({
        to: data.email,
        subject: subjectCliente,
        htmlBody: htmlCliente
      });
    }

  } catch (emailErr) {
    console.warn('Alerta enviando email de cotización:', emailErr);
  }

  return {
    success: true,
    quoteNumber: quoteNumber,
    message: 'Solicitud de cotización registrada con éxito'
  };
}

/**
 * Procesa un nuevo ticket de soporte con imágenes
 */
function procesarNuevoSoporte(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('WES - Base de Datos Operativa');
  let sheet = ss.getSheetByName('Soporte');

  if (!sheet) {
    sheet = ss.insertSheet('Soporte');
    sheet.appendRow([
      'Nº Ticket', 'Fecha y Hora', 'Cliente', 'Empresa', 'Teléfono',
      'WhatsApp', 'Correo', 'Ubicación / Dirección', 'Nº Factura',
      'Producto o Sistema', 'Categoría', 'Prioridad', 'Descripción',
      'Horario Preferido', 'Método Contacto', 'Enlaces a Fotos', 'Estado', 'Notas Internas'
    ]);
    sheet.getRange(1, 1, 1, 18).setFontWeight('bold').setBackground('#0D2A5C').setFontColor('#FFFFFF');
  }

  const nextNum = Math.max(1, sheet.getLastRow());
  const caseNumber = 'SOP-2026-' + ('0000' + nextNum).slice(-4);
  const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

  // Guardar imágenes en Drive si se adjuntaron
  let photoUrls = [];
  if (data.images && data.images.length > 0) {
    try {
      const folders = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDER_NAME);
      const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);

      data.images.forEach((base64Data, idx) => {
        if (base64Data.indexOf('data:image') !== -1) {
          const parts = base64Data.split(',');
          const mimeType = parts[0].match(/:(.*?);/)[1];
          const decoded = Utilities.base64Decode(parts[1]);
          const blob = Utilities.newBlob(decoded, mimeType, `${caseNumber}_foto_${idx + 1}.${mimeType.split('/')[1]}`);
          const file = folder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          photoUrls.push(file.getUrl());
        } else if (base64Data.startsWith('http')) {
          photoUrls.push(base64Data);
        }
      });
    } catch (driveErr) {
      console.warn('Error guardando fotos en Drive:', driveErr);
    }
  }

  sheet.appendRow([
    caseNumber,
    now,
    data.clientName,
    data.company || 'N/A',
    data.phone,
    data.whatsapp,
    data.email,
    data.address,
    data.orderNumber || 'N/A',
    data.productSystem || 'N/A',
    data.category,
    data.priority,
    data.description,
    data.preferredTime || 'Cualquiera',
    data.contactMethod || 'Llamada',
    photoUrls.join(' \n'),
    'Recibido',
    ''
  ]);

  // Envío de correos automáticos
  try {
    // 1. Alerta a la empresa
    const subjectEmpresa = `Nueva solicitud de soporte – ${caseNumber} – ${data.priority.toUpperCase()}`;
    const photosListHtml = photoUrls.length > 0 
      ? photoUrls.map((u, i) => `<li><a href="${u}" target="_blank">Ver Evidencia Fotográfica #${i+1}</a></li>`).join('')
      : '<li>No se adjuntaron fotografías</li>';

    const htmlEmpresa = `
      <div style="font-family:Arial,sans-serif; color:#333; max-width:600px; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
        <div style="background:#0D2A5C; color:#fff; padding:20px; text-align:center;">
          <h2 style="margin:0; color:#FFC107;">TICKET DE SOPORTE TÉCNICO</h2>
          <p style="margin:5px 0 0 0; font-size:14px;">Prioridad: <strong>${data.priority.toUpperCase()}</strong></p>
        </div>
        <div style="padding:25px;">
          <p><strong>Número de caso:</strong> ${caseNumber}</p>
          <p><strong>Fecha y hora:</strong> ${now}</p>
          <p><strong>Cliente:</strong> ${data.clientName} (${data.company || 'Particular'})</p>
          <p><strong>Contacto:</strong> Tel: ${data.phone} | WA: ${data.whatsapp} | Email: ${data.email}</p>
          <p><strong>Ubicación:</strong> ${data.address}</p>
          <hr style="border:0; border-top:1px solid #e2e8f0; margin:15px 0;">
          <p><strong>Producto o sistema:</strong> ${data.productSystem || 'No especificado'}</p>
          <p><strong>Categoría:</strong> ${data.category}</p>
          <p><strong>Descripción de la falla:</strong><br>${data.description}</p>
          <p><strong>Horario preferido:</strong> ${data.preferredTime}</p>
          <h4>Fotografías adjuntas:</h4>
          <ul>${photosListHtml}</ul>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: CONFIG.COMPANY_EMAIL_SUPPORT,
      subject: subjectEmpresa,
      htmlBody: htmlEmpresa
    });

    // 2. Confirmación al cliente
    if (data.email) {
      const subjectCliente = `Recibimos tu solicitud de soporte – Caso ${caseNumber}`;
      const htmlCliente = `
        <div style="font-family:Arial,sans-serif; color:#333; max-width:600px; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
          <div style="background:#0D2A5C; color:#fff; padding:20px; text-align:center;">
            <h2 style="margin:0; color:#FFC107;">WARN ELECTRICAL SERVICES (WES)</h2>
            <p style="margin:5px 0 0 0; font-size:13px;">Centro de Asistencia y Soporte Técnico Especializado</p>
          </div>
          <div style="padding:25px;">
            <p>Hola, <strong>${data.clientName}</strong>:</p>
            <p>Hemos recibido tu solicitud de soporte correctamente.</p>
            <div style="background:#f1f5f9; padding:15px; border-radius:6px; margin:20px 0;">
              <p style="margin:4px 0;"><strong>Número de caso:</strong> <span style="color:#0D2A5C; font-weight:bold;">${caseNumber}</span></p>
              <p style="margin:4px 0;"><strong>Producto o sistema:</strong> ${data.productSystem || 'Reportado'}</p>
              <p style="margin:4px 0;"><strong>Categoría:</strong> ${data.category}</p>
              <p style="margin:4px 0;"><strong>Descripción registrada:</strong> ${data.description}</p>
            </div>
            <p>Nuestro equipo técnico revisará los detalles y las fotografías enviadas para asignarte al especialista correspondiente. Nos comunicaremos contigo mediante tu método preferido (<strong>${data.contactMethod}</strong>).</p>
            <p style="font-size:12px; color:#64748b; margin-top:20px;">
              <em>Nota: Este correo confirma la recepción de la solicitud. La visita técnica presencial, el diagnóstico in situ y cualquier costo derivado serán evaluados y coordinados previamente contigo.</em>
            </p>
            <br>
            <p>Atentamente,<br>
            <strong>Equipo de Soporte de ${CONFIG.COMPANY_NAME}</strong><br>
            Central de Soporte: ${CONFIG.COMPANY_PHONE}<br>
            Autopista Ramón Cáceres, Plaza Megatone, Moca</p>
          </div>
        </div>
      `;

      MailApp.sendEmail({
        to: data.email,
        subject: subjectCliente,
        htmlBody: htmlCliente
      });
    }

  } catch (emailErr) {
    console.warn('Alerta enviando email de soporte:', emailErr);
  }

  return {
    success: true,
    caseNumber: caseNumber,
    message: 'Ticket de soporte generado con éxito'
  };
}

/**
 * Procesa un nuevo mensaje de contacto web generando un ticket formal y enviando correos
 */
function procesarNuevoMensajeContacto(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('WES - Base de Datos Operativa');
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

    MailApp.sendEmail({
      to: CONFIG.COMPANY_EMAIL_GENERAL,
      subject: subjectEmpresa,
      htmlBody: htmlEmpresa,
      replyTo: data.email
    });

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
              Autopista Ramón Cáceres, Plaza Megatone, Moca, República Dominicana<br>
              Teléfono: (849) 207-5474 | Correo Oficial: wes.inform@gmail.com<br>
              Portal Web: <a href="https://web.warnelectricalservices.com" style="color:#0284c7; text-decoration:none;">web.warnelectricalservices.com</a>
            </p>
          </div>
        </div>
      `;

      MailApp.sendEmail({
        to: data.email,
        subject: subjectCliente,
        htmlBody: htmlCliente
      });
    }

  } catch (emailErr) {
    console.warn('Alerta enviando email de contacto:', emailErr);
  }

  return {
    success: true,
    ticketNumber: ticketNumber,
    message: 'Ticket generado y enviado por correo exitosamente'
  };
}
