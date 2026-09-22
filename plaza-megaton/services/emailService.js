// Servicio de notificaciones por correo electrónico con identidad corporativa de Plaza Megatón
const nodemailer = require('nodemailer');

class EmailService {
  constructor(dataService) {
    this.dataService = dataService;
    this.transporter = null;
    this.isTestAccount = false;
  }

  async getTransporter() {
    if (this.transporter) return this.transporter;

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT || 587);

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
      this.isTestAccount = false;
      console.log(`[EmailService] Conectado a SMTP oficial: ${host} (${user})`);
    } else {
      // Entorno de desarrollo / pruebas: Buzón Ethereal con URL pública de previsualización
      console.log('[EmailService] SMTP no configurado en .env. Generando buzón seguro de pruebas Ethereal...');
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      this.isTestAccount = true;
      console.log(`[EmailService] Buzón de pruebas listo: ${testAccount.user}`);
    }

    return this.transporter;
  }

  /**
   * Genera el encabezado y pie corporativo HTML en rojo Plaza Megatón
   */
  wrapTemplate(title, bodyContent) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; color: #1E293B; }
        .container { max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #E2E8F0; }
        .header { background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%); padding: 28px 24px; text-align: center; color: #FFFFFF; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; letter-spacing: 0.5px; }
        .content { padding: 32px 24px; font-size: 15px; line-height: 1.6; color: #334155; }
        .badge-code { display: inline-block; background-color: #FEE2E2; color: #991B1B; font-weight: 700; font-size: 18px; padding: 8px 16px; border-radius: 8px; border: 1px solid #FECACA; margin: 12px 0; }
        .info-box { background-color: #F8FAFC; border-left: 4px solid #D32F2F; border-radius: 0 8px 8px 0; padding: 14px 18px; margin: 16px 0; }
        .info-box p { margin: 4px 0; font-size: 14px; }
        .btn-action { display: inline-block; background-color: #D32F2F; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-top: 16px; }
        .footer { background-color: #F1F5F9; padding: 20px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PLAZA MEGATÓN</h1>
          <p>SISTEMA DE GESTIÓN INMOBILIARIA</p>
        </div>
        <div class="content">
          ${bodyContent}
        </div>
        <div class="footer">
          <p><strong>Administración Plaza Megatón</strong></p>
          <p>Av. Principal esq. Central, Santo Domingo, Rep. Dominicana · Tel: 809-555-0199</p>
          <p>Este es un correo automático generado por el Sistema de Gestión.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  async sendMail({ to, subject, html, text }) {
    try {
      const transporter = await this.getTransporter();
      const adminEmail = await this.dataService.getConfigValue('correo_administracion', 'administracion@plazamegaton.com');
      const senderUser = process.env.SMTP_USER || adminEmail;

      const mailOptions = {
        from: `"Plaza Megatón — Administración" <${senderUser}>`,
        to,
        subject,
        text,
        html
      };

      const info = await transporter.sendMail(mailOptions);
      let previewUrl = null;

      if (this.isTestAccount) {
        previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`\n======================================================`);
        console.log(`📧 [EMAIL DESPACHADO (Prueba Ethereal)]: ${subject}`);
        console.log(`Para: ${to}`);
        console.log(`🔗 Ver correo en el navegador: ${previewUrl}`);
        console.log(`======================================================\n`);
      } else {
        console.log(`📧 [EMAIL DESPACHADO]: "${subject}" a ${to} (ID: ${info.messageId})`);
      }

      return { success: true, messageId: info.messageId, previewUrl };
    } catch (err) {
      console.error('[EmailService ERROR]', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 1. Correo automático de Bienvenida post-registro
   */
  async sendWelcomeEmail({ nombre, email, cubiculoCodigos }) {
    const cubiculosStr = Array.isArray(cubiculoCodigos) ? cubiculoCodigos.join(', ') : cubiculoCodigos;
    const subject = 'Bienvenido a Plaza Megatón';

    const htmlBody = `
      <p>Hola, <strong>${nombre}</strong>:</p>
      <p>Gracias por confirmar tus datos en nuestro <strong>Sistema de Gestión de Plaza Megatón</strong>.</p>
      
      <div class="info-box">
        <p><strong>Cubículo(s) asociado(s):</strong></p>
        <p style="font-size: 16px; font-weight: 700; color: #B71C1C;">${cubiculosStr}</p>
      </div>

      <p>A través de esta plataforma digital podrás:</p>
      <ul>
        <li>Realizar solicitudes y reclamaciones de mantenimiento con fotos de evidencia.</li>
        <li>Registrar y consultar tus pagos subiendo tus comprobantes bancarios.</li>
        <li>Hacer seguimiento en tiempo real al estado de cada trámite.</li>
      </ul>

      <p>Gracias por formar parte de Plaza Megatón.</p>
      <p style="margin-top: 24px;">Atentamente,<br><strong>Administración Plaza Megatón</strong></p>
    `;

    const text = `Hola, ${nombre}:\n\nGracias por confirmar tus datos en nuestro Sistema de Gestión de Plaza Megatón.\nHemos registrado correctamente tu información y los siguientes cubículos asociados:\n${cubiculosStr}\n\nA través de esta plataforma podrás realizar solicitudes, reclamaciones y registrar tus pagos.\n\nGracias por formar parte de Plaza Megatón.\n\nAdministración\nPlaza Megatón`;

    return this.sendMail({
      to: email,
      subject,
      html: this.wrapTemplate(subject, htmlBody),
      text
    });
  }

  /**
   * 2. Correo automático de confirmación de Reclamación / Solicitud
   */
  async sendReclamacionReceivedEmail({ nombre, email, codigo, cubiculo, asunto }) {
    const subject = `Plaza Megatón – Solicitud ${codigo} recibida`;

    const htmlBody = `
      <p>Hola, <strong>${nombre}</strong>:</p>
      <p>Hemos recibido correctamente tu solicitud en el sistema.</p>
      
      <div style="text-align: center; margin: 16px 0;">
        <span style="font-size: 13px; color: #64748B; text-transform: uppercase;">Número de seguimiento:</span><br>
        <div class="badge-code">${codigo}</div>
      </div>

      <div class="info-box">
        <p><strong>Cubículo:</strong> ${cubiculo}</p>
        <p><strong>Asunto:</strong> ${asunto}</p>
        <p><strong>Estado actual:</strong> <span style="color: #2563EB; font-weight: 600;">Recibida</span></p>
      </div>

      <p>Conserva este número para futuras consultas. La administración estará dando seguimiento oportuno a tu solicitud.</p>
      
      <p style="margin-top: 24px;">Atentamente,<br><strong>Administración Plaza Megatón</strong></p>
    `;

    const text = `Hola, ${nombre}:\n\nHemos recibido correctamente tu solicitud.\n\nNúmero de seguimiento: ${codigo}\nCubículo: ${cubiculo}\nAsunto: ${asunto}\nEstado actual: Recibida\n\nLa administración estará dando seguimiento a tu solicitud.\n\nAdministración\nPlaza Megatón`;

    return this.sendMail({
      to: email,
      subject,
      html: this.wrapTemplate(subject, htmlBody),
      text
    });
  }

  /**
   * 3. Correo de actualización de estado de Reclamación
   */
  async sendReclamacionStatusUpdatedEmail({ nombre, email, codigo, estado, observacion, responsable }) {
    const subject = `Plaza Megatón – Actualización de Solicitud ${codigo}: ${estado}`;

    const htmlBody = `
      <p>Hola, <strong>${nombre}</strong>:</p>
      <p>Te informamos que tu solicitud <strong>${codigo}</strong> ha cambiado de estado.</p>
      
      <div class="info-box">
        <p><strong>Nuevo Estado:</strong> <span style="color: #D32F2F; font-weight: 700; font-size: 16px;">${estado}</span></p>
        ${responsable ? `<p><strong>Responsable asignado:</strong> ${responsable}</p>` : ''}
        ${observacion ? `<p><strong>Observación:</strong> ${observacion}</p>` : ''}
      </div>

      <p>Puedes consultar el historial completo desde la sección "Mis Solicitudes" en nuestra plataforma.</p>
      <p style="margin-top: 24px;">Atentamente,<br><strong>Administración Plaza Megatón</strong></p>
    `;

    const text = `Hola, ${nombre}:\n\nTu solicitud ${codigo} ha sido actualizada a estado: ${estado}.\n${observacion ? `Observación: ${observacion}\n` : ''}\nAdministración Plaza Megatón`;

    return this.sendMail({
      to: email,
      subject,
      html: this.wrapTemplate(subject, htmlBody),
      text
    });
  }

  /**
   * 4. Correo automático de confirmación de reporte de Pago
   */
  async sendPagoReceivedEmail({ nombre, email, codigo, cubiculo, concepto, periodo, monto }) {
    const subject = `Plaza Megatón – Pago ${codigo} reportado correctamente`;

    const htmlBody = `
      <p>Hola, <strong>${nombre}</strong>:</p>
      <p>Hemos recibido el reporte de tu pago en la plataforma.</p>
      
      <div style="text-align: center; margin: 16px 0;">
        <span style="font-size: 13px; color: #64748B; text-transform: uppercase;">Código de pago:</span><br>
        <div class="badge-code">${codigo}</div>
      </div>

      <div class="info-box">
        <p><strong>Cubículo:</strong> ${cubiculo}</p>
        <p><strong>Concepto:</strong> ${concepto}</p>
        <p><strong>Período:</strong> ${periodo}</p>
        <p><strong>Monto:</strong> <span style="font-weight: 700; color: #15803D;">${monto}</span></p>
        <p><strong>Estado actual:</strong> Reportado</p>
      </div>

      <p>El comprobante adjunto será revisado y validado por la administración de Plaza Megatón a la brevedad posible.</p>
      <p style="margin-top: 24px;">Atentamente,<br><strong>Administración Plaza Megatón</strong></p>
    `;

    const text = `Hola, ${nombre}:\n\nHemos recibido el reporte de tu pago.\n\nCódigo: ${codigo}\nCubículo: ${cubiculo}\nConcepto: ${concepto}\nPeríodo: ${periodo}\nMonto: ${monto}\nEstado: Reportado\n\nEl comprobante será revisado por la administración de Plaza Megatón.\n\nAdministración\nPlaza Megatón`;

    return this.sendMail({
      to: email,
      subject,
      html: this.wrapTemplate(subject, htmlBody),
      text
    });
  }

  /**
   * 5. Correo de actualización de estado de Pago (Confirmado / Rechazado)
   */
  async sendPagoStatusUpdatedEmail({ nombre, email, codigo, estado, observacion, monto }) {
    const isApproved = estado === 'Confirmado';
    const subject = `Plaza Megatón – Pago ${codigo} ${estado}`;

    const htmlBody = `
      <p>Hola, <strong>${nombre}</strong>:</p>
      <p>Te notificamos que el pago con código <strong>${codigo}</strong> ha sido evaluado por la administración:</p>
      
      <div class="info-box" style="border-left-color: ${isApproved ? '#16A34A' : '#DC2626'};">
        <p><strong>Estado:</strong> <span style="color: ${isApproved ? '#16A34A' : '#DC2626'}; font-weight: 700; font-size: 16px;">${estado}</span></p>
        ${monto ? `<p><strong>Monto:</strong> ${monto}</p>` : ''}
        ${observacion ? `<p><strong>Detalle / Observaciones:</strong> ${observacion}</p>` : ''}
      </div>

      <p style="margin-top: 24px;">Atentamente,<br><strong>Administración Plaza Megatón</strong></p>
    `;

    const text = `Hola, ${nombre}:\n\nEl pago ${codigo} ha sido actualizado a: ${estado}.\n${observacion ? `Observación: ${observacion}\n` : ''}\nAdministración Plaza Megatón`;

    return this.sendMail({
      to: email,
      subject,
      html: this.wrapTemplate(subject, htmlBody),
      text
    });
  }

  /**
   * 6. Correo con Magic Link de acceso seguro
   */
  async sendMagicLinkEmail({ nombre, email, token, loginUrl }) {
    const subject = 'Plaza Megatón – Enlace seguro de acceso';

    const htmlBody = `
      <p>Hola, <strong>${nombre || 'Ocupante'}</strong>:</p>
      <p>Has solicitado ingresar al <strong>Sistema de Gestión de Plaza Megatón</strong>.</p>
      <p>Haz clic en el siguiente botón para acceder directamente a tu cuenta sin necesidad de contraseña:</p>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${loginUrl}" class="btn-action">Ingresar a mi cuenta</a>
      </div>

      <p style="font-size: 13px; color: #64748B;">Este enlace es personal y expira en 60 minutos. Si no solicitaste este acceso, puedes ignorar este mensaje.</p>
      <p style="margin-top: 24px;">Atentamente,<br><strong>Administración Plaza Megatón</strong></p>
    `;

    const text = `Hola, ${nombre}:\n\nPara acceder al Sistema de Gestión de Plaza Megatón, haz clic en el siguiente enlace:\n${loginUrl}\n\nEste enlace expira en 60 minutos.\n\nAdministración Plaza Megatón`;

    return this.sendMail({
      to: email,
      subject,
      html: this.wrapTemplate(subject, htmlBody),
      text
    });
  }
}

module.exports = EmailService;
