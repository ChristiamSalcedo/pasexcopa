/* ==========================================================
   CONFIG.JS — Configuración global y constantes
========================================================== */

const CONFIG = Object.freeze({

  /* ----------------------------------------------------------
     EMAILJS
  ---------------------------------------------------------- */
  EMAILJS: {
    PUBLIC_KEY:        'BK4TXJnFVQVvQwlc_',
    SERVICE_ID:        'service_a68vl7i',
    TEMPLATE_CONTACT:  'template_contacto', 
    TEMPLATE_NEWSLETTER: 'template_edvhxh4',
  },

  /* ----------------------------------------------------------
     CORREO ADMINISTRADOR
  ---------------------------------------------------------- */
  ADMIN_EMAIL: 'salcedochristian04@gmail.com',

  /* ----------------------------------------------------------
     WHATSAPP
  ---------------------------------------------------------- */
  WHATSAPP_NUMBER: '5491123975575',

  /* ----------------------------------------------------------
     MAPA — Centro y zoom inicial (Provincia de Buenos Aires)
  ---------------------------------------------------------- */
  MAP: {
  CENTER: {
    lat: -37.5,
    lng: -60.0
  },

  ZOOM: 7,
  API_KEY: window.ENV?.GOOGLE_MAPS_KEY || 'XyZaSyAneV1lyB3hS-09c9Exq0NJAVOcWHaWL2s'
   },

  /* ----------------------------------------------------------
     CARRUSEL HERO — Intervalo en milisegundos
  ---------------------------------------------------------- */
  HERO_INTERVAL_MS: 6500,

  /* ----------------------------------------------------------
     RESERVAS — Rango de fechas disponibles
  ---------------------------------------------------------- */
  RESERVAS: {
    DATE_MIN: '2026-06-01',
    DATE_MAX: '2028-06-30',
  },

  /* ----------------------------------------------------------
     BACKEND API (si se usa el servidor Node.js)
  ---------------------------------------------------------- */
  API_BASE_URL: 'https://pasexcopa.onrender.com/api',
});
