-- ============================================================
-- SCHEMA.SQL — Esquema de base de datos PaseXcopa
-- Motor: SQLite (via better-sqlite3)
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------
-- TABLA: reservas
-- Almacena cada solicitud de reserva enviada desde el formulario
-- de la Página 3 (reservas.html)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservas (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre     TEXT    NOT NULL,
  apellido   TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  bodega     TEXT    NOT NULL,
  fecha      TEXT    NOT NULL,              -- formato YYYY-MM-DD
  estado     TEXT    NOT NULL DEFAULT 'pendiente'
                     CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- ------------------------------------------------------------
-- TABLA: contactos
-- Almacena cada mensaje enviado desde el formulario
-- de contacto de la Página 1 (index.html)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contactos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre       TEXT    NOT NULL,
  apellido     TEXT    NOT NULL,
  email        TEXT    NOT NULL,
  telefono     TEXT,
  pais         TEXT,
  mensaje      TEXT    NOT NULL,
  case_number  TEXT    NOT NULL UNIQUE,
  created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- ------------------------------------------------------------
-- TABLA: suscriptores
-- Almacena los emails registrados en el newsletter
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suscriptores (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL UNIQUE,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- ------------------------------------------------------------
-- ÍNDICES para consultas frecuentes
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_reservas_email  ON reservas  (email);
CREATE INDEX IF NOT EXISTS idx_reservas_bodega ON reservas  (bodega);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha  ON reservas  (fecha);
CREATE INDEX IF NOT EXISTS idx_contactos_email ON contactos (email);
