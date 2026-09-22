// Controlador del Formulario de Registro QR - Plaza Megatón
let catalogCubiculos = [];
let selectedCubiculos = new Set();

async function loadCubiculosCatalog() {
  const container = document.getElementById('cubiculos-selector');
  if (!container) return;

  try {
    container.innerHTML = '<div style="padding:14px; text-align:center; color:#64748B; font-size:13px;">Cargando catálogo de cubículos...</div>';

    if (App.isStaticHost()) {
      // Entorno estático (GitHub Pages)
      catalogCubiculos = JSON.parse(localStorage.getItem('pm_cubiculos') || '[]');
      renderCubiculosGrid();
      return;
    }

    const res = await fetch('/api/catalog/cubiculos');
    const data = await res.json();

    if (data.success && data.cubiculos) {
      catalogCubiculos = data.cubiculos;
      renderCubiculosGrid();
    } else {
      catalogCubiculos = JSON.parse(localStorage.getItem('pm_cubiculos') || '[]');
      renderCubiculosGrid();
    }
  } catch (err) {
    console.warn('Fallback a catálogo local:', err);
    catalogCubiculos = JSON.parse(localStorage.getItem('pm_cubiculos') || '[]');
    renderCubiculosGrid();
  }
}

function renderCubiculosGrid() {
  const container = document.getElementById('cubiculos-selector');
  if (!container) return;

  container.innerHTML = '';

  catalogCubiculos.forEach(cub => {
    const chip = document.createElement('div');
    const isOccupied = cub.estado === 'Ocupado';
    const isSelected = selectedCubiculos.has(cub.codigo);

    chip.className = `cub-chip ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`;
    chip.innerHTML = `
      <div>${cub.codigo}</div>
      <div style="font-size:10px; font-weight:normal; opacity:0.8;">${cub.estado}</div>
    `;

    chip.onclick = () => {
      if (selectedCubiculos.has(cub.codigo)) {
        selectedCubiculos.delete(cub.codigo);
        chip.classList.remove('selected');
      } else {
        selectedCubiculos.add(cub.codigo);
        chip.classList.add('selected');
      }
      updateSelectedSummary();
    };

    container.appendChild(chip);
  });

  updateSelectedSummary();
}

function updateSelectedSummary() {
  const summaryEl = document.getElementById('selected-cubiculos-summary');
  if (!summaryEl) return;

  if (selectedCubiculos.size === 0) {
    summaryEl.innerHTML = '<span style="color:#64748B; font-size:13px;">Ningún cubículo seleccionado (toca uno o varios)</span>';
  } else {
    const list = Array.from(selectedCubiculos).join(', ');
    summaryEl.innerHTML = `
      <div style="font-size:13px; font-weight:700; color:#B71C1C;">
        Cubículo(s) seleccionado(s): <span style="background:#FEE2E2; padding:3px 8px; border-radius:6px;">${list}</span>
      </div>
    `;
  }
}

async function handleRegistroSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('btn-submit-registro');

  const nombre = document.getElementById('reg-nombre').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const telefono = document.getElementById('reg-telefono').value.trim();

  if (!nombre) {
    App.showToast('Por favor escribe tu nombre completo.', 'error');
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    App.showToast('Por favor ingresa un correo electrónico válido.', 'error');
    return;
  }
  if (selectedCubiculos.size === 0) {
    App.showToast('Debes seleccionar al menos un cubículo/local.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '⏳ Procesando registro...';

  const cubiculosArr = Array.from(selectedCubiculos);

  // Si corre en GitHub Pages
  if (App.isStaticHost()) {
    setTimeout(() => {
      const userId = App.getNextSequence('US');
      const users = JSON.parse(localStorage.getItem('pm_usuarios') || '[]');
      const newUser = {
        user_id: userId,
        nombre,
        email,
        telefono,
        cubiculos: cubiculosArr,
        fecha_registro: new Date().toLocaleDateString('es-DO'),
        estado: 'Activo'
      };
      users.push(newUser);
      localStorage.setItem('pm_usuarios', JSON.stringify(users));

      // Actualizar cubículos a Ocupado
      catalogCubiculos.forEach(c => {
        if (cubiculosArr.includes(c.codigo)) c.estado = 'Ocupado';
      });
      localStorage.setItem('pm_cubiculos', JSON.stringify(catalogCubiculos));

      // Guardar sesión
      App.setSession(newUser, 'token_static_' + Date.now());

      showSuccessScreen({
        nombre,
        email,
        cubiculos: cubiculosArr,
        previewUrl: null
      });
    }, 600);
    return;
  }

  try {
    const payload = {
      nombre,
      email,
      telefono,
      cubiculos: cubiculosArr
    };

    const res = await fetch('/api/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      if (data.user && data.sessionToken) {
        App.setSession(data.user, data.sessionToken);
      }
      showSuccessScreen({
        nombre,
        email,
        cubiculos: data.cubiculosAsignados,
        previewUrl: data.emailPreviewUrl
      });
    } else {
      App.showToast(data.error || 'Ocurrió un error al registrar tus datos.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '✅ Confirmar mi Registro';
    }
  } catch (err) {
    console.warn('Error conectando a backend, guardando en store local:', err);
    // Fallback elegante
    const userId = App.getNextSequence('US');
    const newUser = { user_id: userId, nombre, email, telefono, cubiculos: cubiculosArr, estado: 'Activo' };
    App.setSession(newUser, 'offline_' + Date.now());
    showSuccessScreen({ nombre, email, cubiculos: cubiculosArr, previewUrl: null });
  }
}

function showSuccessScreen({ nombre, email, cubiculos, previewUrl }) {
  const formBox = document.getElementById('form-registro-box');
  const successBox = document.getElementById('success-registro-box');

  formBox.style.display = 'none';
  successBox.style.display = 'block';

  document.getElementById('success-cubiculos').innerText = Array.isArray(cubiculos) ? cubiculos.join(', ') : cubiculos;
  document.getElementById('success-email-dest').innerText = email;

  if (previewUrl) {
    const previewContainer = document.getElementById('preview-mail-container');
    if (previewContainer) {
      previewContainer.innerHTML = `
        <div style="margin-top:16px; background:#F8FAFC; border:1px dashed #CBD5E1; padding:10px; border-radius:8px; font-size:12px;">
          🔗 <strong>Buzón de prueba Ethereal:</strong><br>
          <a href="${previewUrl}" target="_blank" style="color:#D32F2F; font-weight:700;">Abrir correo de bienvenida recibido</a>
        </div>
      `;
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  loadCubiculosCatalog();

  const form = document.getElementById('form-registro');
  if (form) {
    form.addEventListener('submit', handleRegistroSubmit);
  }

  const session = App.getSession();
  if (session && session.user) {
    const nameInput = document.getElementById('reg-nombre');
    const emailInput = document.getElementById('reg-email');
    const telInput = document.getElementById('reg-telefono');
    if (nameInput) nameInput.value = session.user.nombre || '';
    if (emailInput) emailInput.value = session.user.email || '';
    if (telInput) telInput.value = session.user.telefono || '';
  }
});
