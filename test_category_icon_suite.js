/**
 * Suite de Verificación para el Ícono de Categorías en Barra Inferior Móvil (Estilo Alibaba)
 * test_category_icon_suite.js
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\ed0acbda-4949-4816-a6fc-3e44a8cbbf24';
const HTML_FILE = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

async function runCategoryIconSuite() {
  console.log('=== INICIANDO SUITE DE COMPROBACIÓN DEL ÍCONO DE CATEGORÍAS ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Viewport móvil (390 x 844 px)
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(HTML_FILE, { waitUntil: 'networkidle0' });
  console.log('✓ Plataforma WES cargada en viewport móvil (390x844)');

  // 1. Verificar existencia y estructura del botón de Categorías
  const iconData = await page.evaluate(() => {
    const btn = document.querySelector('.mobile-bottom-nav-btn[data-nav="categorias"]');
    if (!btn) return null;

    const svg = btn.querySelector('svg');
    const label = btn.querySelector('span');
    const rects = svg ? svg.querySelectorAll('rect') : [];
    const circles = svg ? svg.querySelectorAll('circle') : [];

    const circle = circles[0];
    const circleCx = circle ? parseFloat(circle.getAttribute('cx')) : 0;
    const circleCy = circle ? parseFloat(circle.getAttribute('cy')) : 0;

    return {
      hasBtn: true,
      hasSvg: Boolean(svg),
      labelText: label ? label.innerText.trim() : '',
      rectCount: rects.length,
      circleCount: circles.length,
      circlePosition: { cx: circleCx, cy: circleCy },
      fill: svg ? svg.getAttribute('fill') : '',
      stroke: svg ? svg.getAttribute('stroke') : '',
      classes: btn.className
    };
  });

  console.log('Datos del ícono:', iconData);

  if (!iconData || !iconData.hasBtn) {
    throw new Error('FAIL: No se encontró el botón de Categorías en la barra inferior móvil');
  }
  if (!iconData.hasSvg) {
    throw new Error('FAIL: No contiene elemento SVG');
  }
  if (iconData.labelText !== 'Categorías') {
    throw new Error('FAIL: El texto inferior no es "Categorías": ' + iconData.labelText);
  }
  if (iconData.rectCount !== 3) {
    throw new Error('FAIL: Se esperaban 3 rectángulos redondeados y se encontraron ' + iconData.rectCount);
  }
  if (iconData.circleCount !== 1) {
    throw new Error('FAIL: Se esperaba 1 círculo y se encontraron ' + iconData.circleCount);
  }
  // Verificar posición superior derecha del círculo (cx > 12, cy < 10 en viewBox 24x24)
  if (iconData.circlePosition.cx < 12 || iconData.circlePosition.cy > 10) {
    throw new Error('FAIL: El círculo no está en la posición superior derecha: cx=' + iconData.circlePosition.cx + ' cy=' + iconData.circlePosition.cy);
  }
  if (iconData.fill !== 'none' || iconData.stroke !== 'currentColor') {
    throw new Error('FAIL: El SVG debe ser de contorno limpio (fill="none" stroke="currentColor")');
  }
  console.log('✓ Forma geométrica 2x2 verificada: 3 rectángulos redondeados y 1 círculo superior derecho');

  // 2. Tomar captura del estado inactivo
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'bottom_nav_category_icon_inactive.png') });

  // 3. Probar activación visual y funcional
  await page.evaluate(() => {
    handleMobileNavAction('categorias');
  });
  await new Promise(r => setTimeout(r, 400));

  const activeState = await page.evaluate(() => {
    const btn = document.querySelector('.mobile-bottom-nav-btn[data-nav="categorias"]');
    const modal = document.getElementById('wes-categories-modal');
    return {
      btnHasActiveColor: btn ? btn.classList.contains('text-wes-blue') : false,
      btnHasInactiveColor: btn ? btn.classList.contains('text-slate-500') : true,
      modalOpened: modal ? !modal.classList.contains('hidden') : false
    };
  });

  console.log('Estado activo tras pulsar:', activeState);

  if (!activeState.btnHasActiveColor) {
    throw new Error('FAIL: El botón de Categorías no adoptó el color corporativo WES (text-wes-blue) al activarse');
  }
  if (activeState.btnHasInactiveColor) {
    throw new Error('FAIL: El botón de Categorías conserva la clase inactiva text-slate-500');
  }
  if (!activeState.modalOpened) {
    throw new Error('FAIL: El modal/drawer de Categorías no se abrió');
  }
  console.log('✓ Conmutación de color a corporativo WES al seleccionarse y apertura correcta del selector');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'bottom_nav_category_icon_active.png') });

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DEL ÍCONO DE CATEGORÍAS FUERON SUPERADAS CON ÉXITO!');
  await browser.close();
}

runCategoryIconSuite().catch(err => {
  console.error('\n❌ ERROR EN LA SUITE DE PRUEBAS:', err);
  process.exit(1);
});
