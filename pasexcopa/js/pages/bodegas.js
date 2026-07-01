/* ==========================================================
   BODEGAS.JS — Lógica exclusiva de bodegas.html (Página 2)
   Dependencias (cargar antes):
     - config.js | data.js | components.js
========================================================== */

/* ----------------------------------------------------------
   GRILLA DE BODEGAS
---------------------------------------------------------- */
const BodegasGrid = (() => {

  function _buildCard(bodega) {
    return `
      <article class="bodega-card reveal">
        <div class="bodega-card__image-wrap"
             onclick="window.open('${bodega.url}','_blank')"
             role="link"
             aria-label="Visitar sitio de ${bodega.name}"
             tabindex="0">
          <img
            class="bodega-card__image"
            src="${bodega.image}"
            alt="${bodega.name}"
            loading="lazy"
          />
        </div>
        <div class="bodega-card__body">
          <h2 class="bodega-card__name">${bodega.name}</h2>
          <p class="bodega-card__location">${bodega.location}</p>
          <a href="reservas.html" class="btn btn--wine btn--sm btn--full">
            Reservar
          </a>
        </div>
      </article>`;
  }

  function init() {
    const grid = document.getElementById('bodegas-grid');
    if (!grid) return;

    grid.innerHTML = BODEGAS.map(_buildCard).join('');

    Reveal.init();
  }

  return { init };

})();



/* ----------------------------------------------------------
   INICIALIZACIÓN DE LA PÁGINA
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  BodegasGrid.init();
  Reveal.init();
});
