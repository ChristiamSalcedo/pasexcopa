/* ============================================================
   ROUTES/RESERVAS.JS — Rutas de /api/reservas (Migrado a PostgreSQL/Supabase)
============================================================ */

'use strict';

const express                    = require('express');
const { body, validationResult } = require('express-validator');
const db                         = require('../db/database'); 

const router = express.Router();

/* ----------------------------------------------------------
   VALIDACIONES — Reglas para POST /api/reservas
---------------------------------------------------------- */
const reservaValidations = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ max: 100 }),

  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio.')
    .isLength({ max: 100 }),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('El email no tiene un formato válido.')
    .normalizeEmail(),

  body('bodega')
    .trim()
    .notEmpty().withMessage('La bodega es obligatoria.'),

  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria.')
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('Formato de fecha inválido.')
    .custom((value) => {
      const selected = new Date(value);
      const min      = new Date('2026-06-01');
      const max      = new Date('2028-06-30');
      if (selected < min || selected > max) {
        throw new Error('La fecha debe estar entre junio 2026 y junio 2028.');
      }
      return true;
    }),
];

/* ----------------------------------------------------------
   POST /api/reservas — Crear una nueva reserva
---------------------------------------------------------- */
router.post('/', reservaValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ ok: false, errors: errors.array() });
  }

  const { nombre, apellido, email, bodega, fecha, pases } = req.body;

  try {
    const sql = `
      INSERT INTO reservas (nombre, apellido, email, bodega, fecha, cantidad_pases)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const cantidadPases = parseInt(pases) || 1;

    const { rows } = await db.query(sql, [nombre, apellido, email, bodega, fecha, cantidadPases]);

    return res.status(201).json({
      ok:      true,
      message: 'Reserva registrada exitosamente.',
      id:      rows[0].id,
    });
  } catch (err) {
    console.error('[POST /api/reservas]', err.message);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor.' });
  }
});

/* ----------------------------------------------------------
   GET /api/reservas — Listar todas las reservas (admin)
---------------------------------------------------------- */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM reservas ORDER BY created_at DESC');

    return res.json({ ok: true, data: rows });
  } catch (err) {
    console.error('[GET /api/reservas]', err.message);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor.' });
  }
});

/* ----------------------------------------------------------
   PATCH /api/reservas/:id — Actualizar estado de una reserva
---------------------------------------------------------- */
router.patch('/:id', async (req, res) => {
  const { id }     = req.params;
  const { estado } = req.body;
  const valid      = ['pendiente', 'confirmada', 'cancelada'];

  if (!valid.includes(estado)) {
    return res.status(422).json({ ok: false, message: `Estado inválido. Debe ser: ${valid.join(', ')}.` });
  }

  try {
    const sql = 'UPDATE reservas SET estado = $1 WHERE id = $2';
    const { rowCount } = await db.query(sql, [estado, id]);

    if (rowCount === 0) {
      return res.status(404).json({ ok: false, message: 'Reserva no encontrada.' });
    }

    return res.json({ ok: true, message: 'Estado actualizado.' });
  } catch (err) {
    console.error('[PATCH /api/reservas/:id]', err.message);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor.' });
  }
});

module.exports = router;