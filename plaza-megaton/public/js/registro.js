// Controlador del Formulario de Registro QR - Plaza Megatón
// Casillas dinámicas vacías y opcionales para cubículos (C1, C2, C3...)

function initCubiculosDynamicFields() {
  const container = document.getElementById('cubiculos-inputs-container');
  const addBtn = document.getElementById('btn-add-cubiculo');
  if (!container) return;

  container.innerHTML = '';
  // Inicializar con 1 casilla vacía
  addCubiculoInputRow();

  if (addBtn) {
    addBtn.onclick = () => {
      addCubiculoInputRow();
    };
  }
}

function addCubiculoInputRow(initialValue = '') {
  const container = document.getElementById('cubiculos-inputs-container');
  if (!container) return;

  const currentCount = container.querySelectorAll('.cubiculo-input-row').length;
  const nextNum = currentCount + 1;
  const exampleText = nextNum === 1 ? 'Ej: C1 o C-001' : `Ej: C${nextNum}`;

  const row = document.createElement('div');
  row.className = 'cubiculo-input-row';
  row.innerHTML = `
    <span class="cubiculo-row-badge">${nextNum}</span>
    <input 
      type="text" 
      class="form-input cubiculo-item-input" 
      placeholder="${exampleText}" 
      value="${initialValue}" 
      style="text-transform: uppercase; font-weight: 700; font-size: 16px; letter-spacing: 0.5px;"
      autocomplete="off"
    >
    <button type="button" class="btn-remove-cubiculo" title="Eliminar este cubículo">✕</button>
  `;

  // Manejar eliminación de fila
  const removeBtn = row.querySelector('.btn-remove-cubiculo');
  removeBtn.onclick = () => {
    const totalRows = container.querySelectorAll('.cubiculo-input-row').length;
    if (totalRows > 1) {
      row.remove();
      renumberCubiculoRows();
    } else {
      // Si es la única casilla, solo limpiar el texto
      const input = row.querySelector('.cubiculo-item-input');
      if (input) input.value = '';
    }
  };

  container.appendChild(row);

  // Si no es la primera, enfocar el nuevo campo
  if (nextNum > 1) {
    const newInput = row.querySelector('.cubiculo-item-input');
    if (newInput) newInput.focus();
  }
}

function renumberCubiculoRows() {
  const container = document.getElementById('cubiculos-inputs-container');
  if (!container) return;

  const rows = container.querySelectorAll('.cubiculo-input-row');
  rows.forEach((row, index) => {
    const badge = row.querySelector('.cubiculo-row-badge');
    const input = row.querySelector('.cubiculo-item-input');
    const num = index + 1;
    if (badge) badge.innerText = num;
    if (input && !input.value) {
      input.placeholder = num === 1 ? 'Ej: C1 o C-001' : `Ej: C${num}`;
    }
  });
}

function getEnteredCubiculos() {
  const container = document.getElementById('cubiculos-inputs-container');
  if (!container) return [];

  const inputs = container.querySelectorAll('.cubiculo-item-input');
  const list = [];
  inputs.forEach(input => {
    const val = input.value.trim().toUpperCase();
    if (val && !list.includes(val)) {
      list.push(val);
    }
  });
  return list;
}

async function handleRegistroSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('btn-submit-registro');

  const nombre = document.getElementById('reg-nombre').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const telefono = document.getElementById('reg-telefono').value.trim();
  const cubiculosArr = getEnteredCubiculos();

  if (!nombre) {
    App.showToast('Por favor escribe tu nombre completo.', 'error');
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    App.showToast('Por favor ingresa un correo electrónico válido.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '⏳ Procesando registro...';

  // Entorno estático (GitHub Pages)
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

      // Actualizar cubículos en catálogo local
      const catalog = JSON.parse(localStorage.getItem('pm_cubiculos') || '[]');
      cubiculosArr.forEach(cod => {
        let existing = catalog.find(c => c.codigo.toUpperCase() === cod.toUpperCase());
        if (existing) {
          existing.estado = 'Ocupado';
        } else {
          catalog.push({
            cubiculo_id: 'CUB-' + cod,
            codigo: cod,
            estado: 'Ocupado',
            observaciones: 'Ingresado por inquilino'
          });
        }
      });
      localStorage.setItem('pm_cubiculos', JSON.stringify(catalog));

      App.setSession(newUser, 'token_static_' + Date.now());

      showSuccessScreen({
        nombre,
        email,
        cubiculos: cubiculosArr.length > 0 ? cubiculosArr : ['Pendiente de asignar'],
        previewUrl: null
      });
    }, 600);
    return;
  }

  // Backend Node.js
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
        cubiculos: (data.cubiculosAsignados && data.cubiculosAsignados.length > 0) ? data.cubiculosAsignados : (cubiculosArr.length > 0 ? cubiculosArr : ['Pendiente de asignar']),
        previewUrl: data.emailPreviewUrl
      });
    } else {
      App.showToast(data.error || 'Ocurrió un error al registrar tus datos.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '✅ Confirmar mi Registro';
    }
  } catch (err) {
    console.warn('Error conectando a backend, guardando en store local:', err);
    const userId = App.getNextSequence('US');
    const newUser = { user_id: userId, nombre, email, telefono, cubiculos: cubiculosArr, estado: 'Activo' };
    App.setSession(newUser, 'offline_' + Date.now());
    showSuccessScreen({
      nombre,
      email,
      cubiculos: cubiculosArr.length > 0 ? cubiculosArr : ['Pendiente de asignar'],
      previewUrl: null
    });
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
  initCubiculosDynamicFields();

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

    // Si ya tenía cubículos, poblar las casillas
    if (session.user.cubiculos && session.user.cubiculos.length > 0) {
      const container = document.getElementById('cubiculos-inputs-container');
      container.innerHTML = '';
      session.user.cubiculos.forEach(c => {
        const cod = typeof c === 'object' ? c.codigo : c;
        addCubiculoInputRow(cod);
      });
    }
  }
});
