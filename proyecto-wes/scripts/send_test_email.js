const nodemailer = require("nodemailer");

async function sendTestEmail(appPassword, recipientEmail = "ing.lmlh@gmail.com") {
  if (!appPassword) {
    console.error("❌ Error: Debes ingresar la contraseña de aplicación de 16 caracteres de venta.wes@gmail.com");
    console.log("Uso: node send_test_email.js <contraseña_16_letras> [correo_destino]");
    process.exit(1);
  }

  const cleanPass = appPassword.replace(/\s+/g, "");
  const senderUser = "venta.wes@gmail.com";

  console.log("1. Conectando con Gmail Oficial (" + senderUser + ")...");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: senderUser, pass: cleanPass }
  });

  const caseNumber = "TK-2026-0001";
  const clientName = "Luis Miguel Lizardo";
  const subject = "Confirmación de Soporte Técnico – Ticket #" + caseNumber + " – Warn Electrical Services (Atención en 1 hora)";

  const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; color: #1E293B; }
    .container { max-width: 600px; margin: 24px auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 18px rgba(13,42,92,0.07); border: 1px solid #E2E8F0; }
    .header { background: linear-gradient(135deg, #0D2A5C 0%, #071836 100%); padding: 26px 22px; text-align: center; color: #FFFFFF; border-bottom: 4px solid #F5B300; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px; }
    .header p { margin: 4px 0 0; font-size: 12px; color: #F5B300; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .content { padding: 30px 24px; font-size: 14px; line-height: 1.6; color: #334155; }
    .pill { display: inline-block; background-color: #ECFDF5; color: #047857; font-weight: 800; font-size: 11px; padding: 4px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #A7F3D0; }
    .info-box { background-color: #F8FAFC; border-left: 4px solid #0D2A5C; border-radius: 0 10px 10px 0; padding: 16px 18px; margin: 20px 0; }
    .info-box .title { font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
    .info-box .code { font-size: 26px; font-weight: 900; color: #0D2A5C; font-family: monospace; letter-spacing: 1px; margin-bottom: 10px; }
    .sla-card { background-color: #FEF3C7; border: 1px solid #FDE68A; border-left: 4px solid #F59E0B; border-radius: 8px; padding: 12px 16px; margin: 18px 0; font-size: 12.5px; color: #92400E; }
    .btn-action { display: inline-block; background-color: #0D2A5C; color: #FFFFFF !important; text-decoration: none; padding: 13px 26px; border-radius: 9px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(13,42,92,0.25); }
    .footer { background-color: #F1F5F9; padding: 20px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>WARN ELECTRICAL SERVICES (WES)</h1>
      <p>Centro de Asistencia Técnica y Garantías</p>
    </div>

    <div class="content">
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="pill">Validación Oficial de Soporte</span>
        <h2 style="font-size: 22px; font-weight: 800; color: #0F172A; margin: 12px 0 4px;">¡Hola, ${clientName}!</h2>
        <p style="font-size: 14px; color: #475569; margin: 0;">Hemos recibido y registrado tu reporte de soporte técnico con éxito.</p>
      </div>

      <div class="info-box">
        <div class="title">Número Oficial de Ticket Asignado:</div>
        <div class="code">${caseNumber}</div>
        <div style="font-size: 13px; color: #334155; line-height: 1.5;">
          <strong>Equipo / Asunto:</strong> Calibración y Mantenimiento Técnico de Motor CAME 2000kg<br>
          <strong>Fecha de Registro:</strong> ${new Date().toLocaleString('es-DO')}<br>
          <strong>Estado Actual:</strong> <span style="color:#047857; font-weight:bold;">Recibido / En Asignación</span>
        </div>
      </div>

      <div class="sla-card">
        ⏱️ <strong>Compromiso WES en 1 Hora:</strong> Un especialista técnico revisará tus detalles y te contactará en la <strong>próxima 1 hora</strong> vía telefónica o WhatsApp para coordinar la solución.
      </div>

      <p style="font-size: 13.5px; color: #334155;">¿Qué sigue a continuación?</p>
      <ul style="font-size: 13px; color: #475569; line-height: 1.7; padding-left: 20px; margin-bottom: 22px;">
        <li>Nuestro centro de operaciones verifica los repuestos y componentes necesarios.</li>
        <li>Coordinamos contigo antes de cualquier visita técnica o intervención presencial.</li>
        <li>Puedes consultar el avance de tu caso en cualquier momento con tu número de ticket.</li>
      </ul>

      <div style="text-align: center; margin: 26px 0 10px;">
        <a href="https://web.warnelectricalservices.com/soporte?ticket=${caseNumber}" class="btn-action" target="_blank">
          👉 Consultar Estado en la Web
        </a>
      </div>

      <p style="margin-top: 26px; font-size: 13px; color: #475569;">Atentamente,<br><strong>Departamento de Soporte Técnico — Warn Electrical Services, SRL</strong></p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 4px; font-weight: bold; color: #334155;">Warn Electrical Services, SRL (WES)</p>
      <p style="margin: 0 0 4px;">📍 Autopista Ramón Cáceres, Moca, Rep. Dominicana · 📞 (849) 207-5474</p>
      <p style="margin: 0;">Correo Oficial: venta.wes@gmail.com · Web: web.warnelectricalservices.com</p>
    </div>
  </div>
</body>
</html>
`;

  const textBody = `¡Hola, ${clientName}!\n\nHemos recibido tu reporte de soporte técnico en WES.\nTicket: ${caseNumber}\nEstado: Recibido / En Asignación\n\nCompromiso: Atención en 1 hora.\n\nWarn Electrical Services, SRL`;

  console.log("2. Despachando correo de prueba a:", recipientEmail);

  try {
    const info = await transporter.sendMail({
      from: `"Warn Electrical Services (WES)" <${senderUser}>`,
      to: recipientEmail,
      replyTo: senderUser,
      subject: subject,
      text: textBody,
      html: htmlBody
    });

    console.log("✅ ¡CORREO ENVIADO CON ÉXITO!");
    console.log("ID del mensaje:", info.messageId);
    console.log("Destinatario:", recipientEmail);
    console.log("Remitente:", senderUser);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error al enviar:", error.message);
    if (error.message.includes("Username and Password not accepted") || error.message.includes("BadCredentials")) {
      console.log("\n👉 Ayuda: Recuerda que Gmail requiere una Contraseña de Aplicación de 16 caracteres generada en https://myaccount.google.com/apppasswords");
    }
    return { success: false, error: error.message };
  }
}

const pass = process.argv[2] || process.env.WES_EMAIL_PASS;
const to = process.argv[3] || "ing.lmlh@gmail.com";

if (pass) {
  sendTestEmail(pass, to);
} else {
  console.log("Uso: node send_test_email.js <contraseña_16_letras> [correo_destino]");
}

module.exports = { sendTestEmail };
