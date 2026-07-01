/* ==========================================================
   DATA.JS — Datos de bodegas adheridas
   Fuente única de verdad. Usado en las 3 páginas.
   Para agregar/quitar bodegas, sólo modificar este archivo.
========================================================== */

const BODEGAS = Object.freeze([
  {
    id:       'bodega-al-este',
    name:     'Bodega Al Este',
    location: 'Coronel Suárez, Bs. As.',
    url:      'https://www.bodegaaleste.com',
    coords:   { lat: -38.814116037000396, lng: -62.694262317117754 },
    image:    'images/bodegas/al-este.jpg',  
  },
  {
    id:       'bodega-saldungaray',
    name:     'Bodega Saldungaray',
    location: 'Saldungaray, Bs. As.',
    url:      'https://www.instagram.com/bodegasaldungaray/?hl=es',
    coords:   { lat: -38.21495872097749, lng: -61.77635978831185 },
    image:    'images/bodegas/saldungaray.jpg', 
  }, 
  {
    id:       'trapiche-costa-y-pampa',
    name:     'Trapiche Costa y Pampa',
    location: 'Mar del Plata, Bs. As.',
    url:      'https://www.trapiche.com.ar',
    coords:   { lat: -38.1301842839341, lng: -57.72644610365968 },
    image:    'images/bodegas/trapiche.webp',
  },
  {
    id:       'bodega-cordon-blanco',
    name:     'Bodega Cordon Blanco',
    location: 'Bahía Blanca, Bs. As.',
    url:      'https://cordonblanco.com',
    coords:   { lat: -37.32779320796541, lng: -59.18212110369922 },
    image:    'images/bodegas/cordon-blanco.jpg',
  },
  {
    id:       'bodega-gamboa',
    name:     'Bodega Gamboa',
    location: 'Campana, Bs. As.',
    url:      'https://bodegagamboa.com.ar',
    coords:   { lat: -34.22795863775041, lng: -58.90950449332526 },
    image:    'images/bodegas/gamboa.jpg',
  },
  {
    id:       'finca-la-anfitriona',
    name:     'Finca La Anfitriona',
    location: 'San Antonio de Areco, Bs. As.',
    url:      'https://www.instagram.com/fincalaanfitriona/',
    coords:   { lat: -34.26662180743869, lng: -59.48795061733566 },
    image:    'images/bodegas/la-anfitriona.webp',
  },
  {
    id:       'finca-las-antipodas',
    name:     'Finca Las Antípodas',
    location: 'Junín, Bs. As.',
    url:      'https://www.instagram.com/lasantipodasok/',
    coords:   { lat: -34.61438414808791, lng: -60.9154392173197 },
    image:    'images/bodegas/las-antipodas.jpg',
  },
  {
    id:       'vinedo-myl-colores',
    name:     'Viñedo Myl Colores',
    location: 'Coronel Pringles, Bs. As.',
    url:      'https://www.instagram.com/mylcolores/',
    coords:   { lat: -38.13173825810268, lng: -61.47637213064414 },
    image:    'images/bodegas/myl-colores.jpg',
  },
  {
    id:       'puerta-del-abra',
    name:     'Puerta del Abra',
    location: 'Sierra de la Ventana, Bs. As.',
    url:      'https://puertadelabra.com.ar/',
    coords:   { lat: -37.8582147139773, lng: -58.08210726702196 },
    image:    'images/bodegas/puerta-del-abra.jpg',
  },
  {
    id:       'bodega-la-blanqueada',
    name:     'Bodega La Blanqueada',
    location: 'Las Flores, Bs. As.',
    url:      'https://www.instagram.com/lablanqueadalf/?hl=es',
    coords:   { lat: -35.98795793668289, lng: -59.06949391910738 },
    image:    'images/bodegas/la-blanqueada.jpg',
  },
]);
