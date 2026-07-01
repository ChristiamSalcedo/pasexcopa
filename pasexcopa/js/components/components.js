/* ==========================================================
   NAVBAR.JS — Menú de navegación móvil
========================================================== */

const Navbar = (() => {

  /**
   * Alterna el menú móvil y el estado del hamburger.
   * @param {string} menuId - ID del overlay del menú
   * @param {string} hbgId  - ID del botón hamburger
   */
  function toggle(menuId, hbgId) {
    const menu = document.getElementById(menuId);
    const hbg  = document.getElementById(hbgId);
    if (!menu || !hbg) return;

    const isOpen = menu.classList.toggle('is-open');
    hbg.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  /**
   * Cierra el menú móvil explícitamente.
   * Útil cuando el usuario hace clic en un link del menú.
   * @param {string} menuId
   * @param {string} hbgId
   */
  function close(menuId, hbgId) {
    const menu = document.getElementById(menuId);
    const hbg  = document.getElementById(hbgId);
    if (!menu || !hbg) return;

    menu.classList.remove('is-open');
    hbg.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  return { toggle, close };

})();


/* ==========================================================
   TOAST.JS — Notificaciones flotantes de confirmación
========================================================== */

const Toast = (() => {

  const VISIBLE_CLASS = 'is-visible';
  let _timer = null;

  /**
   * Muestra un mensaje de toast por un tiempo determinado.
   * @param {string} message    - Texto a mostrar
   * @param {number} [ms=4000]  - Duración en milisegundos
   */
  function show(message, ms = 4000) {
    const el = document.getElementById('toast');
    if (!el) return;

    clearTimeout(_timer);

    el.textContent = message;
    el.classList.add(VISIBLE_CLASS);

    _timer = setTimeout(() => el.classList.remove(VISIBLE_CLASS), ms);
  }

  return { show };

})();


/* ==========================================================
   MODAL.JS — Ventana emergente de "Reserva exitosa"
========================================================== */

const Modal = (() => {

  const OPEN_CLASS = 'is-open';

  function open() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.add(OPEN_CLASS);
  }

  function close() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove(OPEN_CLASS);
  }

  function initClickOutside() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  return { open, close, initClickOutside };

})();


/* ==========================================================
   REVEAL.JS — Animación de aparición al hacer scroll
========================================================== */

const Reveal = (() => {

  const VISIBLE_CLASS = 'is-visible';

  function init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(VISIBLE_CLASS);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  return { init };

})();


/* ----------------------------------------------------------
   FORMULARIO DE NEWSLETTER GLOBAL — VINCULADO A MYSQL
---------------------------------------------------------- */
const GlobalNewsletter = (() => {

  async function _handleSubmit(e) {
    e.preventDefault();
    const form  = e.target;
    const email = form.querySelector('#nl-email').value.trim();
    const btn   = form.querySelector('button');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      if (typeof Toast !== 'undefined') Toast.show('⚠ Ingresá un correo electrónico válido');
      return;
    }

    btn.textContent = 'Enviando…';
    btn.disabled    = true;

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/contacto/newsletter`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.errors ? result.errors[0].msg : 'Error al procesar la suscripción';
        throw new Error(errorMsg);
      }

      if (typeof Toast !== 'undefined') Toast.show('✓ ¡Te suscribiste exitosamente!');
      form.reset();

    } catch (err) {
      console.warn('[Newsletter Global] Error al suscribir:', err.message);
      if (typeof Toast !== 'undefined') {
        Toast.show(`⚠ No se pudo procesar: ${err.message}`);
      }
    } finally {
      btn.textContent = 'Suscribirme';
      btn.disabled    = false;
    }
  }

  function init() {
    const form = document.getElementById('newsletter-form');
    if (form) form.addEventListener('submit', _handleSubmit);
  }

  return { init };

})();

// Inicialización automática al cargar el componente
document.addEventListener('DOMContentLoaded', () => {
  GlobalNewsletter.init();
});