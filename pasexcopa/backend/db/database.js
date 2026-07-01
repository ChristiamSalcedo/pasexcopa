/* ============================================================
   DATABASE.JS — Conexión e inicialización de MySQL
   Utiliza un Pool de conexiones para optimizar el rendimiento.
============================================================ */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mysql = require('mysql2');

/* ----------------------------------------------------------
   CONFIGURACIÓN DEL POOL
   Levanta las credenciales de forma segura desde el .env
---------------------------------------------------------- */
const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD,
  database:        process.env.DB_NAME     || 'pasexcopa',
  port:            Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const poolPromise = pool.promise();

/* ----------------------------------------------------------
   VERIFICACIÓN DE CONEXIÓN (Prueba de fuego)
---------------------------------------------------------- */
poolPromise.getConnection()
  .then(connection => {
    console.log('✓ Conexión exitosa a la base de datos MySQL [pasexcopa]');
    connection.release(); 
  })
  .catch(err => {
    console.error('❌ Error crítico al conectar a MySQL:', err.message);
  });

module.exports = poolPromise;
