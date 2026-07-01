/* ==========================================================
   HOME.JS — Lógica exclusiva de index.html (Página 1)
   Dependencias (cargar antes):
     - config.js | data.js | components.js
========================================================== */

/* ----------------------------------------------------------
   HERO CAROUSEL
---------------------------------------------------------- */
const HeroCarousel = (() => {

  let _currentIndex = 0;
  let _slides       = [];
  let _dots         = [];
  let _intervalId   = null;

  const ACTIVE_CLASS = 'is-active';

  function _activateSlide(index) {
    _slides[_currentIndex].classList.remove(ACTIVE_CLASS);
    _dots[_currentIndex].classList.remove(ACTIVE_CLASS);
    _currentIndex = index;
    _slides[_currentIndex].classList.add(ACTIVE_CLASS);
    _dots[_currentIndex].classList.add(ACTIVE_CLASS);
  }

  function goTo(index) {
    _activateSlide(index);
  }

  function _next() {
    _activateSlide((_currentIndex + 1) % _slides.length);
  }

  function init() {
    _slides = Array.from(document.querySelectorAll('.hero__slide'));
    _dots   = Array.from(document.querySelectorAll('.hero__dot'));
    if (!_slides.length) return;

    _intervalId = setInterval(_next, CONFIG.HERO_INTERVAL_MS);
  }

  return { init, goTo };

})();


/* ----------------------------------------------------------
   MAPA INTERACTIVO (GOOGLE MAPS)
---------------------------------------------------------- */
const mapsScript = document.getElementById('google-maps-script');
if (mapsScript && typeof CONFIG !== 'undefined') {
  mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.MAP.API_KEY}&callback=initMap`;
}

function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  const map = new google.maps.Map(mapElement, {
    center: CONFIG.MAP.CENTER,
    zoom: CONFIG.MAP.ZOOM,
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
      }
    ]
  });

  const infoWindow = new google.maps.InfoWindow();

  BODEGAS.forEach((bodega) => {
    const marker = new google.maps.Marker({
      position: {
        lat: bodega.coords.lat,
        lng: bodega.coords.lng
      },
      map,
      title: bodega.name,
      icon: {
        url: "images/logo-ppc.png",
        scaledSize: new google.maps.Size(28, 36)
      }
    });

    marker.addListener("mouseover", () => {
      infoWindow.setContent(`
        <div style="padding:8px 10px; font-family:Inter,sans-serif; max-width:150px; text-align:center; line-height:1.3;">
          <strong style="font-size:14px; color:#5C0D24; display:block; margin-bottom:3px;">${bodega.name}</strong>
          <span style="font-size:12px; color:#666;">${bodega.location}</span>
        </div>
      `);
      infoWindow.open({ anchor: marker, map });
    });

    marker.addListener("mouseout", () => {
      infoWindow.close();
    });
  });
}
window.initMap = initMap;

/* ----------------------------------------------------------
   CARRUSEL HORIZONTAL DE BODEGAS
---------------------------------------------------------- */
const WineryTrack = (() => {

  function _buildCard(bodega) {
    return `
      <div class="winery-card" onclick="window.open('${bodega.url}','_blank')" role="link" tabindex="0">
        <img class="winery-card__image" src="${bodega.image}" alt="${bodega.name}" loading="lazy"/>
        <div class="winery-card__body">
          <h3 class="winery-card__name">${bodega.name}</h3>
          <p class="winery-card__location">${bodega.location}</p>
        </div>
      </div>`;
  }

  function init() {
    const track = document.getElementById('winery-track');
    if (!track) return;

    const items = [...BODEGAS, ...BODEGAS];
    track.innerHTML = items.map(_buildCard).join('');
  }

  return { init };

})();


/* ----------------------------------------------------------
   FORMULARIO DE CONTACTO — CONECTADO A MYSQL / API
---------------------------------------------------------- */
const ContactForm = (() => {

  let _iti = null; 

  async function _handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');
    
    const data = {
      nombre:   form.querySelector('#c-nombre').value.trim(),
      apellido: form.querySelector('#c-apellido').value.trim(),
      email:    form.querySelector('#c-email').value.trim(),
      telefono: _iti ? _iti.getNumber() : form.querySelector('#c-telefono').value.trim(), 
      pais:     form.querySelector('#c-pais').value.trim(),
      mensaje:  form.querySelector('#c-mensaje').value.trim()
    };

    if (!data.nombre || !data.apellido || !data.email || !data.mensaje) {
      if (typeof Toast !== 'undefined') Toast.show('⚠ Completá los campos obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      if (typeof Toast !== 'undefined') Toast.show('⚠ Ingresá un correo electrónico válido');
      return;
    }

    btn.textContent = 'Enviando…';
    btn.disabled    = true;

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/contacto`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        const errorMsg = result.errors ? result.errors[0].msg : 'Error interno';
        throw new Error(errorMsg);
      }

      form.reset();
      if (typeof Toast !== 'undefined') {
        Toast.show(`✓ Enviado. Caso asignado: #${result.case_number}`);
      }

    } catch (err) {
      console.error('[ContactForm] Error al enviar:', err.message);
      if (typeof Toast !== 'undefined') Toast.show(`⚠ ${err.message}`);
    } finally {
      btn.textContent = 'Enviar mensaje';
      btn.disabled    = false;
    }
  }

  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', _handleSubmit);

    const phoneInput = form.querySelector('#c-telefono');
    const countryInput = form.querySelector('#c-pais');

    if (phoneInput && typeof window.intlTelInput !== 'undefined') {
      _iti = window.intlTelInput(phoneInput, {
        initialCountry: "auto",
        geoIpLookup: callback => {
          fetch("https://ipapi.co/json/")
            .then(res => res.json())
            .then(data => callback(data.country_code))
            .catch(() => callback("ar")); 
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
      });

      phoneInput.addEventListener('countrychange', () => {
        const countryData = _iti.getSelectedCountryData();
        if (countryInput && countryData.name) {
          const cleanName = countryData.name.split(' (')[0];
          countryInput.value = cleanName;
        }
      });
    }
  }

  return { init };

})();


/* ----------------------------------------------------------
   SCROLL SUAVE A SECCIÓN (links del navbar)
---------------------------------------------------------- */
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}


/* ----------------------------------------------------------
   INICIALIZACIÓN DE LA PÁGINA
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  HeroCarousel.init();
  WineryTrack.init();
  ContactForm.init();
  if (typeof Modal !== 'undefined' && Modal.initClickOutside) Modal.initClickOutside();
  if (typeof Reveal !== 'undefined' && Reveal.init) Reveal.init();
});