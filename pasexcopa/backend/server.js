/* ============================================================
   SERVER.JS — Punto de entrada del servidor Express
   Iniciar en desarrollo:  npm run dev
   Iniciar en producción:  npm start
============================================================ */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express        = require('express');
const cors           = require('cors');
const helmet         = require('helmet');
const morgan         = require('morgan');

const reservasRouter = require('./routes/reservas');
const contactoRouter = require('./routes/contacto');

/* ----------------------------------------------------------
   CONFIGURACIÓN
---------------------------------------------------------- */
const PORT        = process.env.PORT        || 3000;
const NODE_ENV    = process.env.NODE_ENV    || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5500';

/* ----------------------------------------------------------
   APP
---------------------------------------------------------- */
const app = express();

/* ----------------------------------------------------------
   MIDDLEWARES GLOBALES
---------------------------------------------------------- */

// Seguridad: cabeceras HTTP seguras
app.use(helmet());

// CORS: sólo acepta peticiones del frontend configurado
app.use(cors({
  origin:  CORS_ORIGIN,
  methods: ['GET', 'POST', 'PATCH'],
}));

// Parseo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logs HTTP (sólo en desarrollo)
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* ----------------------------------------------------------
   RUTAS
---------------------------------------------------------- */
app.use('/api/reservas',   reservasRouter);
app.use('/api/contacto',   contactoRouter);

/* ----------------------------------------------------------
   HEALTH CHECK
---------------------------------------------------------- */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: NODE_ENV, timestamp: new Date().toISOString() });
});

/* ----------------------------------------------------------
   MANEJADOR DE RUTAS NO ENCONTRADAS (404)
---------------------------------------------------------- */
app.use((_req, res) => {
  res.status(404).json({ ok: false, message: 'Ruta no encontrada.' });
});

/* ----------------------------------------------------------
   MANEJADOR GLOBAL DE ERRORES
---------------------------------------------------------- */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ ok: false, message: 'Error interno del servidor.' });
});

/* ----------------------------------------------------------
   INICIO DEL SERVIDOR
---------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`\n🍷 PaseXcopa API corriendo en http://localhost:${PORT}`);
  console.log(`   Entorno: ${NODE_ENV}\n`);
});
