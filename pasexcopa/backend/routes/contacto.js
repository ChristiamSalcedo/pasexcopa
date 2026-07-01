/* ============================================================
   ROUTES/CONTACTO.JS — Rutas de /api/contacto (Migrado a MySQL)
============================================================ */

'use strict';

const express                    = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer                 = require('nodemailer');
const db                         = require('../db/database'); 

const router = express.Router();

/* ----------------------------------------------------------
   TRANSPORTER DE NODEMAILER (Configuración Directa Express)
---------------------------------------------------------- */
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'salcedochristian04@gmail.com', 
    pass: 'yqilfoqixlxjstns',             
  },
});

/* ----------------------------------------------------------
   HELPERS PRIVADOS
---------------------------------------------------------- */
function generateCaseNumber() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function sendMail(options) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    ...options,
  });
}

/* ----------------------------------------------------------
   VALIDACIONES — POST /api/contacto
---------------------------------------------------------- */
const contactoValidations = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio.'),
  body('email').trim().isEmail().withMessage('El email no es válido.').normalizeEmail(),
  body('mensaje').trim().notEmpty().withMessage('El mensaje es obligatorio.').isLength({ max: 2000 }),
];

/* ----------------------------------------------------------
   POST /api/contacto — Guardar mensaje y enviar emails
---------------------------------------------------------- */
router.post('/', contactoValidations, async (req, res) => {
  console.log("¡SÍ! Está entrando al archivo de contacto correcto.");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ ok: false, errors: errors.array() });
  }

  const { nombre, apellido, email, telefono, pais, mensaje } = req.body;
  const caseNumber = generateCaseNumber();
  const fullName   = `${nombre} ${apellido}`;

  try {
    const sql = `
      INSERT INTO contactos (nombre, apellido, email, telefono, pais, mensaje, case_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.execute(sql, [
      nombre, 
      apellido, 
      email, 
      telefono || null, 
      pais || null, 
      mensaje, 
      caseNumber
    ]);

    await sendMail({
      to:      process.env.ADMIN_EMAIL,
      subject: `[PaseXcopa] Nuevo contacto de ${fullName} — Caso #${caseNumber}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Caso:</strong> #${caseNumber}</p>
        <p><strong>Nombre:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono || '—'}</p>
        <p><strong>País:</strong> ${pais || '—'}</p>
        <hr/>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje.replace(/\n/g, '<br/>')}</p>
      `,
    });

    await sendMail({
      to:      email,
      subject: 'Tu correo fue enviado exitosamente a pase por copa.',
      html: `
        <p>Hemos recibido de forma exitosa tu mensaje.</p>
        <p>Te asignaremos el siguiente número de caso para atender tu solicitud lo antes posible: <strong>${caseNumber}</strong>.</p>
        <p>Te contactaremos dentro de las próximas 24 hs. hábiles.</p>
        <br/>
        <p>Gracias por comunicarte con paseXcopa.</p>
      `,
    });

    return res.status(201).json({
      ok:          true,
      message:     'Mensaje recibido correctamente.',
      case_number: caseNumber,
    });
  } catch (err) {
    console.error('[POST /api/contacto]', err.message);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor.' });
  }
});

/* ----------------------------------------------------------
   VALIDACIONES — POST /api/newsletter
---------------------------------------------------------- */
const newsletterValidations = [
  body('email').trim().isEmail().withMessage('El email no es válido.').normalizeEmail(),
];

/* ----------------------------------------------------------
   POST /api/newsletter — Suscribir un email al newsletter
---------------------------------------------------------- */
router.post('/newsletter', newsletterValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ ok: false, errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const sql = 'INSERT IGNORE INTO suscriptores (email) VALUES (?)';
    await db.execute(sql, [email]);

    await sendMail({
      to:      email,
      subject: 'Gracias por suscribirte a nuestra newsletter.',
      html: `
        <p>Hemos recibido tu suscripción exitosamente.</p>
        <p>Muy pronto recibirás las últimas novedades, promociones y beneficios de PaseXcopa.</p>
        <br/>
        <p>Gracias por formar parte de nuestra comunidad.</p>
      `,
    });

    return res.status(201).json({ ok: true, message: 'Suscripción registrada.' });
  } catch (err) {
    console.error('[POST /api/newsletter]', err.message);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor.' });
  }
});

/* ----------------------------------------------------------
   GET /api/contacto — Listar todos los mensajes (admin)
---------------------------------------------------------- */
router.get('/', async (req, res) => {
  try {
    const [mensajes] = await db.query('SELECT * FROM contactos ORDER BY created_at DESC');

    return res.json({ ok: true, data: mensajes });
  } catch (err) {
    console.error('[GET /api/contacto]', err.message);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor.' });
  }
});

module.exports = router;