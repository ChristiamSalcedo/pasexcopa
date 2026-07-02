/* ==========================================================
   RESERVAS.JS — Lógica exclusiva de reservas.html (Página 3)
   Dependencias (cargar antes):
     - config.js | data.js | components.js
========================================================== */

/* ----------------------------------------------------------
   FORMULARIO DE RESERVA — CONECTADO A MYSQL
---------------------------------------------------------- */
const ReservasForm = (() => {

  function _populateBodegaSelect() {
    const select = document.getElementById('select-bodega');
    if (!select) return;

    const options = BODEGAS.map((b) =>
      `<option value="${b.name}">${b.name}</option>`
    ).join('');

    select.innerHTML = `<option value="">Seleccioná una bodega</option>${options}`;
  }

  /** Configura el rango de fechas permitidas */
  function _setDateRange() {
    const dateInput = document.getElementById('input-fecha');
    if (!dateInput) return;
    dateInput.min = CONFIG.RESERVAS.DATE_MIN;
    dateInput.max = CONFIG.RESERVAS.DATE_MAX;
  }

  async function _handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');
    
    // Captura explícita y limpia de los valores por ID
    const data = {
      nombre:   document.getElementById('r-nombre').value.trim(),
      apellido: document.getElementById('r-apellido').value.trim(),
      email:    document.getElementById('r-email').value.trim(),
      bodega:   document.getElementById('select-bodega').value,
      fecha:    document.getElementById('input-fecha').value
    };

    // 1. Validación de campos obligatorios en Frontend
    if (!data.nombre || !data.apellido || !data.email || !data.bodega || !data.fecha) {
      if (typeof Toast !== 'undefined') Toast.show('⚠ Por favor, completá todos los campos');
      return;
    }

    // 2. Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      if (typeof Toast !== 'undefined') Toast.show('⚠ Ingresá un correo electrónico válido');
      return;
    }

    btn.textContent = 'Procesando…';
    btn.disabled    = true;

    try {
      // Envío formal al Backend de Node/MySQL
      const response = await fetch(`${CONFIG.API_BASE_URL}/reservas`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
    throw new Error(result.message || 'Error al procesar la reserva en el servidor.');
    } 

      // 2. Si el servidor respondió OK, recién ahí limpiamos y mostramos el éxito real
      console.log('[ReservasForm] Éxito real:', result.id || result.caseNumber);
      
      form.reset();
      if (typeof Modal !== 'undefined') Modal.open();

    } catch (err) {
      console.error('[ReservasForm] Error al procesar reserva:', err.message);
      if (typeof Toast !== 'undefined') {
        Toast.show(`⚠ ${err.message}`);
      }
    } finally {
      btn.textContent = 'Reservar';
      btn.disabled    = false;
    }
  }

  function init() {
    _populateBodegaSelect();
    _setDateRange();

    const pasesSelect = document.getElementById('r-pases');
    const precioDisplay = document.getElementById('precio-final');
    const PRECIO_UNITARIO = 10000;

    if (pasesSelect && precioDisplay) {
      pasesSelect.addEventListener('change', (e) => {
        const cantidad = parseInt(e.target.value) || 1;
        const total = cantidad * PRECIO_UNITARIO;
        
        precioDisplay.textContent = `$${total.toLocaleString('es-AR')}`;
      });
    }

    const form = document.getElementById('reservas-form');
    if (form) form.addEventListener('submit', _handleSubmit);
  }

  return { init };

})();


/* ----------------------------------------------------------
   INICIALIZACIÓN DE LA PÁGINA
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  ReservasForm.init();
  if (typeof Modal !== 'undefined' && Modal.initClickOutside) Modal.initClickOutside();
  if (typeof Reveal !== 'undefined' && Reveal.init) Reveal.init();
});
