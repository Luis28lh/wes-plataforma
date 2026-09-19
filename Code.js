/**
 * =========================================================================
 * WARN ELECTRICAL SERVICES, SRL (WES)
 * Plataforma Web Empresarial, Catálogo Digital y Módulo de Soporte
 * Backend en Google Apps Script — Estándar AIDET v2.0
 * =========================================================================
 */

const CONFIG = {
  COMPANY_NAME: 'Warn Electrical Services, SRL (WES)',
  COMPANY_EMAIL_GENERAL: 'info@wes.com.do',
  COMPANY_EMAIL_SUPPORT: 'soporte@wes.com.do',
  COMPANY_PHONE: '(809) 578-4320',
  COMPANY_ADDRESS: 'Autopista Ramón Cáceres, Plaza Megatone, Moca, República Dominicana',
  SHEET_NAME: 'WES - Base de Datos Operativa',
  DRIVE_FOLDER_NAME: 'WES_Soporte_Evidencias'
};

/**
 * Sirve la interfaz web al acceder vía navegador
 */
function doGet(e) {
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
    .setFaviconUrl('https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg')
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
    const caseNumber = data.id || ('SOP-2026-' + ('0000' + nextNum).slice(-4));
    const now = Utilities.formatDate(new Date(), 'GMT-4', 'yyyy-MM-dd HH:mm:ss');

    // Almacenar imágenes en Google Drive
    let photoLinks = [];
    if (data.images && data.images.length > 0) {
      try {
        const folders = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDER_NAME);
        const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);

        data.images.forEach((imgData, idx) => {
          if (imgData.indexOf('data:image') !== -1) {
            const parts = imgData.split(',');
            const mimeType = parts[0].match(/:(.*?);/)[1];
            const decoded = Utilities.base64Decode(parts[1]);
            const blob = Utilities.newBlob(decoded, mimeType, `${caseNumber}_evidencia_${idx + 1}.${mimeType.split('/')[1]}`);
            const file = folder.createFile(blob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            photoLinks.push(file.getUrl());
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
      photoLinks.join('\n'),
      'Recibido',
      ''
    ]);

    // Enviar correos
    try {
      // Alerta a la empresa
      const subjectEmpresa = `Nueva solicitud de soporte – ${caseNumber} – ${data.priority.toUpperCase()}`;
      const photosHtml = photoLinks.length > 0
        ? photoLinks.map((url, i) => `<li><a href="${url}" target="_blank">Ver Fotografía de Evidencia #${i + 1}</a></li>`).join('')
        : '<li>No se adjuntaron fotografías</li>';

      const bodyEmpresa = `
        <div style="font-family:Arial,sans-serif; color:#333; max-width:650px; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
          <div style="background:#0D2A5C; color:#FFFFFF; padding:24px; text-align:center;">
            <h2 style="margin:0; color:#F5B300;">WES — TICKET DE SOPORTE TÉCNICO</h2>
            <p style="margin:6px 0 0 0; font-size:14px;">Prioridad: <strong>${data.priority.toUpperCase()}</strong></p>
          </div>
          <div style="padding:28px;">
            <p><strong>Número de caso:</strong> <span style="font-size:16px; color:#0D2A5C; font-weight:bold;">${caseNumber}</span></p>
            <p><strong>Fecha y hora:</strong> ${now}</p>
            <p><strong>Cliente:</strong> ${data.clientName} (${data.company || 'Particular'})</p>
            <p><strong>Contacto:</strong> Tel: ${data.phone} | WA: ${data.whatsapp} | Email: ${data.email}</p>
            <p><strong>Ubicación del servicio:</strong> ${data.address}</p>
            <hr style="border:0; border-top:1px solid #e2e8f0; margin:16px 0;">
            <p><strong>Producto o sistema:</strong> ${data.productSystem || 'No indicado'}</p>
            <p><strong>Categoría de la falla:</strong> ${data.category}</p>
            <p><strong>Descripción:</strong><br>${data.description}</p>
            <p><strong>Horario preferido:</strong> ${data.preferredTime}</p>
            <h4 style="color:#0D2A5C; margin-bottom:6px;">Evidencias Fotográficas:</h4>
            <ul>${photosHtml}</ul>
          </div>
        </div>
      `;

      MailApp.sendEmail({
        to: Session.getActiveUser().getEmail() || CONFIG.COMPANY_EMAIL_SUPPORT,
        subject: subjectEmpresa,
        htmlBody: bodyEmpresa
      });

      // Confirmación al cliente
      if (data.email) {
        const subjectCliente = `Recibimos tu solicitud de soporte – Caso ${caseNumber}`;
        const bodyCliente = `
          <div style="font-family:Arial,sans-serif; color:#333; max-width:650px; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
            <div style="background:#0D2A5C; color:#FFFFFF; padding:24px; text-align:center;">
              <h2 style="margin:0; color:#F5B300;">WARN ELECTRICAL SERVICES (WES)</h2>
              <p style="margin:6px 0 0 0; font-size:13px;">Centro de Soporte Técnico Especializado</p>
            </div>
            <div style="padding:28px;">
              <p>Hola, <strong>${data.clientName}</strong>:</p>
              <p>Hemos recibido tu solicitud de soporte correctamente.</p>
              <div style="background:#f8fafc; padding:16px; border-radius:8px; margin:16px 0;">
                <p style="margin:4px 0;"><strong>Número de caso:</strong> <span style="color:#0D2A5C; font-weight:bold;">${caseNumber}</span></p>
                <p style="margin:4px 0;"><strong>Producto o sistema:</strong> ${data.productSystem || 'Reportado'}</p>
                <p style="margin:4px 0;"><strong>Categoría:</strong> ${data.category}</p>
                <p style="margin:4px 0;"><strong>Descripción registrada:</strong> ${data.description}</p>
              </div>
              <p>Nuestro equipo técnico evaluará la información y las fotografías enviadas para asignarte el técnico especialista. Nos comunicaremos contigo mediante tu método preferido (<strong>${data.contactMethod}</strong>).</p>
              <div style="background:#fffbeb; padding:12px; border-radius:6px; font-size:12px; color:#78350f; margin-top:16px;">
                <em>Nota: Este correo confirma la recepción de la solicitud. La visita técnica presencial, el diagnóstico y cualquier costo relacionado serán coordinados previamente por nuestro equipo.</em>
              </div>
              <br>
              <p>Atentamente,<br>
              <strong>Equipo de Soporte de ${CONFIG.COMPANY_NAME}</strong><br>
              Teléfono: ${CONFIG.COMPANY_PHONE}</p>
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
