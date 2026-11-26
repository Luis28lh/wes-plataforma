/**
 * Suite de Verificación Exhaustiva para Saludos y Seguimiento de Sofía en WES
 * test_sofia_greetings_suite.js
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\ed0acbda-4949-4816-a6fc-3e44a8cbbf24';
const HTML_FILE = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

async function runSofiaGreetingsSuite() {
  console.log('=== INICIANDO SUITE DE COMPROBACIÓN DE SALUDOS DE SOFÍA ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=412,915']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true });
  await page.goto(HTML_FILE, { waitUntil: 'networkidle0' });
  console.log('✓ Plataforma WES cargada en viewport móvil');

  // Helper para abrir el chat de Sofía
  async function ensureChatOpen() {
    await page.evaluate(() => {
      const modal = document.getElementById('wes-chat-modal');
      if (modal && modal.classList.contains('hidden')) {
        toggleClientChat();
      }
    });
    await new Promise(r => setTimeout(r, 400));
  }

  // Helper para enviar mensaje
  async function sendMessage(text) {
    await page.evaluate((msg) => {
      const input = document.getElementById('wes-chat-user-input');
      if (input) {
        input.value = msg;
        handleChatSubmit(new Event('submit'));
      }
    }, text);
  }

  // Helper para obtener los textos de los mensajes de Sofía
  async function getBotMessages() {
    return await page.evaluate(() => {
      const container = document.getElementById('wes-chat-messages');
      if (!container) return [];
      const botBubbles = container.querySelectorAll('.flex.items-end .max-w-\\[85\\%\\], .flex.items-end .max-w-\\[88\\%\\]');
      const texts = [];
      botBubbles.forEach(b => {
        texts.push(b.innerText.trim());
      });
      return texts;
    });
  }

  // -------------------------------------------------------------
  // TEST 1: Saludo simple sin actividad ("Hola Sofía")
  // Esperado: "¡Hola! Qué gusto saludarle." y tras 4s "¿En qué le puedo ayudar?"
  // -------------------------------------------------------------
  console.log('\n--- TEST 1: Saludo simple "Hola Sofía" sin actividad ---');
  await ensureChatOpen();

  await sendMessage('Hola Sofía');
  await new Promise(r => setTimeout(r, 600));

  let msgs = await getBotMessages();
  console.log('Mensajes bot tras saludo:', msgs);

  const hasDirectGreeting = msgs.some(m => m.includes('¡Hola! Qué gusto saludarle.'));
  const hasRepeatedIntro = msgs.some((m, idx) => idx > 0 && m.includes('Soy Sofía, asesora técnica'));

  if (!hasDirectGreeting) throw new Error('FAIL TEST 1: No respondió "¡Hola! Qué gusto saludarle."');
  if (hasRepeatedIntro) throw new Error('FAIL TEST 1: Repitió la presentación "Soy Sofía..."');
  console.log('✓ Saludo respondido con naturalidad sin repetir presentación');

  // Esperar 4.3 segundos para recibir la invitación
  console.log('Esperando 4.3s para la invitación...');
  await new Promise(r => setTimeout(r, 4300));

  msgs = await getBotMessages();
  console.log('Mensajes bot tras 4s:', msgs);
  const hasFollowUp = msgs.some(m => m.includes('¿En qué le puedo ayudar?'));
  if (!hasFollowUp) throw new Error('FAIL TEST 1: No envió "¿En qué le puedo ayudar?" tras 4 segundos');
  console.log('✓ TEST 1 SUPERADO: Invitación enviada tras 4 segundos');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sofia_greeting_followup.png') });

  // -------------------------------------------------------------
  // TEST 2: "¿Cómo estás?" y "Buenos días"
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: Variantes de saludo de cortesía ---');
  await sendMessage('¿Cómo estás?');
  await new Promise(r => setTimeout(r, 600));
  msgs = await getBotMessages();
  const hasHowAreYouReply = msgs.some(m => m.includes('¡Muy bien, gracias! Espero que usted también.'));
  if (!hasHowAreYouReply) throw new Error('FAIL TEST 2: No respondió "¿Cómo estás?" adecuadamente');
  console.log('✓ "¿Cómo estás?" respondido correctamente: "¡Muy bien, gracias! Espero que usted también."');

  // No debe enviar otra invitación a los 4s porque ya se envió en esta conversación
  await new Promise(r => setTimeout(r, 4300));
  msgs = await getBotMessages();
  const helpCount = msgs.filter(m => m.includes('¿En qué le puedo ayudar?')).length;
  if (helpCount > 1) throw new Error('FAIL TEST 2: Se duplicó la invitación "¿En qué le puedo ayudar?"');
  console.log('✓ Invitación no repetida durante la misma conversación');

  // -------------------------------------------------------------
  // TEST 3: Reinicio y Cancelación por escritura antes de los 4 segundos
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: Cancelación por escritura antes de los 4 segundos ---');
  // Simular confirmación en dialog
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  await page.evaluate(() => confirmResetClientChat());
  await new Promise(r => setTimeout(r, 500));

  await sendMessage('Buenos días');
  await new Promise(r => setTimeout(r, 600));
  msgs = await getBotMessages();
  const hasMorningReply = msgs.some(m => m.includes('¡Buenos días! Un gusto saludarle.'));
  if (!hasMorningReply) throw new Error('FAIL TEST 3: No respondió "¡Buenos días! Un gusto saludarle."');
  console.log('✓ "Buenos días" respondido correctamente');

  // A los 1.5s el cliente empieza a escribir en el input
  await new Promise(r => setTimeout(r, 1500));
  await page.type('#wes-chat-user-input', 'necesito una cotización de cables');
  console.log('✓ Usuario empezó a escribir en el input antes de los 4 segundos');

  // Esperar a superar los 4.5 segundos
  await new Promise(r => setTimeout(r, 3500));
  msgs = await getBotMessages();
  const hasFollowUpWhenTyping = msgs.some(m => m.includes('¿En qué le puedo ayudar?'));
  if (hasFollowUpWhenTyping) throw new Error('FAIL TEST 3: La invitación NO se canceló al estar escribiendo');
  console.log('✓ TEST 3 SUPERADO: Invitación cancelada exitosamente al escribir');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sofia_typing_cancelled.png') });

  // -------------------------------------------------------------
  // TEST 4: Saludo con consulta directa ("Hola, necesito una cámara")
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: Saludo con consulta directa ("Hola, necesito una cámara") ---');
  await page.evaluate(() => confirmResetClientChat());
  await new Promise(r => setTimeout(r, 500));

  await sendMessage('Hola, necesito una cámara');
  await new Promise(r => setTimeout(r, 1200));

  msgs = await getBotMessages();
  console.log('Mensajes bot para consulta:', msgs);
  const lastMsg = msgs[msgs.length - 1] || '';
  // No debe ser el saludo puro ni la invitación de 4s
  if (lastMsg.includes('¡Hola! Qué gusto saludarle.') || lastMsg.includes('¿En qué le puedo ayudar?')) {
    throw new Error('FAIL TEST 4: Saludo con consulta respondió como saludo genérico');
  }
  console.log('✓ Saludo con consulta tratado como consulta técnica/comercial');

  // Esperar 4.3s y verificar que NO se programó la invitación
  await new Promise(r => setTimeout(r, 4300));
  msgs = await getBotMessages();
  const hasFollowUpOnQuery = msgs.some(m => m.includes('¿En qué le puedo ayudar?'));
  if (hasFollowUpOnQuery) throw new Error('FAIL TEST 4: Se programó indebidamente la invitación tras una consulta');
  console.log('✓ TEST 4 SUPERADO: Sin segundo mensaje tras consulta directa');

  // -------------------------------------------------------------
  // TEST 5: Cancelación al cerrar el chat
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: Cancelación al cerrar el chat ---');
  await page.evaluate(() => confirmResetClientChat());
  await new Promise(r => setTimeout(r, 500));

  await sendMessage('Hola Sofía');
  await new Promise(r => setTimeout(r, 600));

  // Cerrar el chat inmediatamente (a 1s)
  await page.evaluate(() => toggleClientChat());
  console.log('✓ Chat cerrado a 1s tras el saludo');

  // Esperar 4.5 segundos
  await new Promise(r => setTimeout(r, 4500));

  // Reabrir el chat y verificar que NO hay mensaje atrasado
  await page.evaluate(() => toggleClientChat());
  await new Promise(r => setTimeout(r, 500));
  msgs = await getBotMessages();
  const hasFollowUpAfterReopen = msgs.some(m => m.includes('¿En qué le puedo ayudar?'));
  if (hasFollowUpAfterReopen) throw new Error('FAIL TEST 5: Apareció mensaje atrasado al reabrir el chat');
  console.log('✓ TEST 5 SUPERADO: Sin mensajes atrasados al reabrir el chat');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sofia_close_reopen_clean.png') });

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE LA SUITE DE SALUDOS DE SOFÍA FUERON SUPERADAS CON ÉXITO!');
  await browser.close();
}

runSofiaGreetingsSuite().catch(err => {
  console.error('\n❌ ERROR EN LA SUITE DE PRUEBAS:', err);
  process.exit(1);
});
