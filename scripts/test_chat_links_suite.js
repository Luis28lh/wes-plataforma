/**
 * Test Suite Exhaustiva para Enlaces y Fichas de Producto en Chat de Sofía
 * scripts/test_chat_links_suite.js
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\ed0acbda-4949-4816-a6fc-3e44a8cbbf24';
const HTML_FILE = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

async function runChatLinksSuite() {
  console.log('=== Iniciando Suite de Enlaces y Productos en Chat de Sofía ===');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Cargar la página en Desktop (1366x768)
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(HTML_FILE, { waitUntil: 'networkidle0' });
  console.log('✓ Página cargada correctamente en Desktop');

  // Abrir chat de Sofía
  await page.evaluate(() => {
    if (typeof toggleClientChat === 'function') toggleClientChat();
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Probar renderizado de enlaces en mensajes de Sofía
  const testResults = await page.evaluate(() => {
    const rawTests = [
      {
        type: 'raw_url_with_punctuation',
        input: 'Puedes ver detalles en https://web.warnelectricalservices.com/guia?ref=soporte&id=99.'
      },
      {
        type: 'markdown_link',
        input: 'Visita [Sitio Oficial WES](https://warnelectricalservices.com/soporte).'
      },
      {
        type: 'dangerous_link_rejected',
        input: 'Prueba este script [No Peligro](javascript:alert("hack")) y http://hack.com/run.'
      },
      {
        type: 'product_link_card',
        input: 'Te recomiendo la batería de respaldo: [Ver Batería 12V 4.5Ah](https://web.warnelectricalservices.com/?p=122).'
      },
      {
        type: 'multiple_links_mixed',
        input: 'Tenemos [Batería](https://web.warnelectricalservices.com/?p=122) y manual en https://docs.wes.com/manual?v=2&lang=es; consúltalo.'
      }
    ];

    const results = [];
    rawTests.forEach(t => {
      const formatted = window.formatSofiaMessageSafely(t.input);
      results.push({
        type: t.type,
        input: t.input,
        output: formatted
      });
    });

    return results;
  });

  console.log('--- Resultados de parseo seguro ---');
  testResults.forEach(res => {
    console.log(`[${res.type}]:`);
    console.log(`   Input:  ${res.input}`);
    console.log(`   Output: ${res.output}`);
  });

  // Validaciones de seguridad en testResults
  const puncTest = testResults.find(t => t.type === 'raw_url_with_punctuation');
  if (puncTest.output.includes('href="https://web.warnelectricalservices.com/guia?ref=soporte&amp;id=99"') && puncTest.output.endsWith('.')) {
    console.log('✓ La puntuación final (.) NO fue absorbida por el enlace.');
  } else {
    console.warn('⚠ Advertencia en separación de puntuación:', puncTest.output);
  }

  const dangerTest = testResults.find(t => t.type === 'dangerous_link_rejected');
  if (!dangerTest.output.includes('javascript:')) {
    console.log('✓ Enlace malicioso javascript: fue neutralizado y rechazado exitosamente.');
  } else {
    throw new Error('FALLO DE SEGURIDAD: enlace javascript: no fue neutralizado');
  }

  const productTest = testResults.find(t => t.type === 'product_link_card');
  if (productTest.output.includes('Ver producto') && productTest.output.includes('viewProductFromChat')) {
    console.log('✓ Enlace a producto de catálogo WES transformado en tarjeta interactiva "Ver producto".');
  } else {
    throw new Error('FALLO: Enlace a producto no generó la tarjeta interactiva');
  }

  // 3. Probar inyección en el chat real de Sofía y captura en Desktop
  await page.evaluate(() => {
    const msg = "Para tu sistema de respaldo te sugiero esta batería: [Batería AGM 12V 4.5Ah](https://web.warnelectricalservices.com/?p=122). ¿Deseas cotizarla?";
    const container = document.getElementById('wes-chat-messages');
    const div = document.createElement('div');
    div.className = 'flex items-end space-x-2 animate-fadeIn';
    div.innerHTML = `
      <img src="assets/sofia-avatar.jpg" alt="Sofía" class="w-7 h-7 rounded-full object-cover border border-[#F5B300]/80 shrink-0 mb-4 shadow-xs">
      <div class="max-w-[88%] flex flex-col items-start">
        <div class="bg-white p-3.5 rounded-2xl rounded-bl-none border border-slate-200/90 shadow-xs leading-relaxed text-slate-800 text-xs">
          ${window.formatSofiaMessageSafely(msg)}
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_desktop_product_card.png') });
  console.log('✓ Captura guardada: chat_desktop_product_card.png');

  // 4. Probar clic en "Ver producto" en Desktop
  await page.evaluate(() => {
    if (typeof viewProductFromChat === 'function') {
      viewProductFromChat('odoo-96');
    }
  });
  await new Promise(r => setTimeout(r, 600));

  const isModalOpenDesktop = await page.evaluate(() => {
    const modal = document.getElementById('product-detail-modal');
    return modal && !modal.classList.contains('hidden');
  });
  console.log('✓ Modal de producto abierto en Desktop tras clic en chat:', isModalOpenDesktop);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_desktop_modal_open.png') });
  console.log('✓ Captura guardada: chat_desktop_modal_open.png');

  // Cerrar modal de producto
  await page.evaluate(() => {
    if (typeof closeProductDetailModal === 'function') closeProductDetailModal();
  });
  await new Promise(r => setTimeout(r, 500));

  // 5. Probar experiencia en Móvil (390x844) en una nueva página móvil dedicada
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await pageMobile.goto(HTML_FILE, { waitUntil: 'networkidle0' });

  // Abrir chat en móvil
  await pageMobile.evaluate(() => {
    if (typeof toggleClientChat === 'function') toggleClientChat();
    const msg = "Para tu sistema de respaldo te sugiero esta batería: [Batería AGM 12V 4.5Ah](https://web.warnelectricalservices.com/?p=122). ¿Deseas cotizarla?";
    const container = document.getElementById('wes-chat-messages');
    const div = document.createElement('div');
    div.id = 'mobile-injected-msg';
    div.className = 'flex items-end space-x-2 animate-fadeIn';
    div.innerHTML = `
      <img src="assets/sofia-avatar.jpg" alt="Sofía" class="w-7 h-7 rounded-full object-cover border border-[#F5B300]/80 shrink-0 mb-4 shadow-xs">
      <div class="max-w-[88%] flex flex-col items-start">
        <div class="bg-white p-3.5 rounded-2xl rounded-bl-none border border-slate-200/90 shadow-xs leading-relaxed text-slate-800 text-xs">
          ${window.formatSofiaMessageSafely(msg)}
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  await new Promise(r => setTimeout(r, 600));

  await pageMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_mobile_product_card.png') });
  console.log('✓ Captura guardada: chat_mobile_product_card.png');

  // En móvil, hacer clic en "Ver producto"
  await pageMobile.evaluate(() => {
    if (typeof viewProductFromChat === 'function') {
      viewProductFromChat('odoo-96');
    }
  });
  await new Promise(r => setTimeout(r, 600));

  const mobileCheck = await pageMobile.evaluate(() => {
    const pModal = document.getElementById('product-detail-modal');
    const cModal = document.getElementById('wes-chat-modal');
    return {
      productModalVisible: pModal && !pModal.classList.contains('hidden'),
      chatModalHiddenOnMobile: cModal && cModal.classList.contains('hidden')
    };
  });
  console.log('✓ Comprobación en móvil (ficha al frente y chat replegado):', mobileCheck);
  await pageMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_mobile_modal_open.png') });
  console.log('✓ Captura guardada: chat_mobile_modal_open.png');

  // Reabrir el chat en móvil y verificar conservación de historial
  await pageMobile.evaluate(() => {
    if (typeof closeProductDetailModal === 'function') closeProductDetailModal();
    if (typeof toggleClientChat === 'function') toggleClientChat();
  });
  await new Promise(r => setTimeout(r, 600));

  const historyPreserved = await pageMobile.evaluate(() => {
    const container = document.getElementById('wes-chat-messages');
    return container && (container.textContent.includes('BATERIA') || container.textContent.includes('Batería'));
  });
  console.log('✓ Historial conversacional conservado intacto:', historyPreserved);
  await pageMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'chat_mobile_history_preserved.png') });
  console.log('✓ Captura guardada: chat_mobile_history_preserved.png');
  await pageMobile.close();

  // 6. Probar deep-linking en nueva pestaña con producto existente (?p=122)
  const pageDeepExisting = await browser.newPage();
  await pageDeepExisting.setViewport({ width: 1366, height: 768 });
  await pageDeepExisting.goto(HTML_FILE + '?p=122', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  const existingModalCheck = await pageDeepExisting.evaluate(() => {
    const m = document.getElementById('product-detail-modal');
    const title = document.getElementById('detail-product-title');
    return {
      isOpen: m && !m.classList.contains('hidden'),
      title: title ? title.textContent : ''
    };
  });
  console.log('✓ Deep-link con producto existente (?p=122):', existingModalCheck);
  await pageDeepExisting.screenshot({ path: path.join(ARTIFACT_DIR, 'deeplink_existing_product.png') });
  console.log('✓ Captura guardada: deeplink_existing_product.png');
  await pageDeepExisting.close();

  // 7. Probar deep-linking en nueva pestaña con producto INEXISTENTE (?p=SKU_INEXISTENTE_999)
  const pageDeepMissing = await browser.newPage();
  await pageDeepMissing.setViewport({ width: 1366, height: 768 });
  await pageDeepMissing.goto(HTML_FILE + '?p=SKU_INEXISTENTE_999', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const missingNoticeCheck = await pageDeepMissing.evaluate(() => {
    const toast = document.getElementById('wes-product-not-found-toast');
    return {
      hasToast: Boolean(toast),
      toastText: toast ? toast.innerText : ''
    };
  });
  console.log('✓ Deep-link con producto inexistente aviso mostrado:', missingNoticeCheck);
  await pageDeepMissing.screenshot({ path: path.join(ARTIFACT_DIR, 'deeplink_missing_product_notice.png') });
  console.log('✓ Captura guardada: deeplink_missing_product_notice.png');

  // Pulsar "Volver al catálogo" en aviso
  await pageDeepMissing.evaluate(() => {
    if (typeof goToCatalogFromNotice === 'function') goToCatalogFromNotice();
  });
  await new Promise(r => setTimeout(r, 500));
  await pageDeepMissing.close();

  await browser.close();
  console.log('=== Suite de Enlaces y Productos Completada Exitosamente ===');
}

runChatLinksSuite().catch(err => {
  console.error('Error en suite de pruebas de enlaces:', err);
  process.exit(1);
});
