/* ============================================================
   DATABASE.JS — Conexión e inicialización de PostgreSQL (Supabase)
   Utiliza un Pool de conexiones optimizado para producción.
============================================================ */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Cambiamos el driver de mysql2 al de postgres (pg)
const { Pool } = require('pg');

/* ----------------------------------------------------------
   CONFIGURACIÓN DEL POOL
   Levanta la URI de forma segura desde el .env
---------------------------------------------------------- */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras en la nube
  }
});

/* ----------------------------------------------------------
   VERIFICACIÓN DE CONEXIÓN (Prueba de fuego)
---------------------------------------------------------- */
pool.connect()
  .then(client => {
    console.log('✓ Conexión exitosa a la base de datos PostgreSQL [Supabase - pasexcopa]');
    client.release(); // Liberamos el cliente de vuelta al pool
  })
  .catch(err => {
    console.error('❌ Error crítico al conectar a PostgreSQL:', err.message);
  });

// Exportamos una interfaz basada en promesas compatible con lo que ya tenías
module.exports = {
  query: (text, params) => pool.query(text, params)
};
