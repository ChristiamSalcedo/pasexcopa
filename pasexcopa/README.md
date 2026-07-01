# 🍷 PaseXcopa — Sitio Web

> **Un pase, una copa, muchas bodegas por recorrer.**
> Plataforma para promocionar y gestionar el acceso económico a experiencias de degustación en bodegas de la Provincia de Buenos Aires.

---

## 📁 Arquitectura de carpetas

```
pasexcopa/
│
├── index.html               ← Página 1: Inicio
├── bodegas.html             ← Página 2: Bodegas adheridas
├── reservas.html            ← Página 3: Formulario de reserva
│
├── assets/
│   └── images/
│       └── logo.png         ← Logo oficial (reemplazar)
│
├── css/
│   ├── base/
│   │   ├── variables.css    ← Design tokens (colores, tipografía, espaciado)
│   │   ├── reset.css        ← Reset + clases utilitarias globales
│   │   └── typography.css   ← Estilos de texto compartidos
│   │
│   ├── components/
│   │   ├── navbar.css       ← Barra de navegación + menú móvil
│   │   ├── buttons.css      ← Sistema de botones
│   │   ├── forms.css        ← Campos de formulario (variante oscura/clara)
│   │   ├── cards.css        ← Tarjetas de bodegas (carrusel y grilla)
│   │   └── ui.css           ← Footer, Newsletter, Modal, Toast, WhatsApp
│   │
│   ├── pages/
│   │   └── pages.css        ← Estilos específicos de cada página
│   │                          (home, bodegas, reservas)
│   │
│   └── utils/
│       └── animations.css   ← Keyframes, scroll reveal, carrusel infinito
│
├── js/
│   ├── core/
│   │   ├── config.js        ← Constantes y configuración (EmailJS, mapa, fechas)
│   │   └── data.js          ← Datos de bodegas (fuente única de verdad)
│   │
│   ├── services/
│   │   └── emailService.js  ← Abstracción del servicio de email (EmailJS)
│   │
│   ├── components/
│   │   └── components.js    ← Navbar, Toast, Modal, Reveal (reutilizables)
│   │
│   └── pages/
│       ├── home.js          ← Hero, mapa, carrusel, contacto (Página 1)
│       ├── bodegas.js       ← Grilla de bodegas (Página 2)
│       └── reservas.js      ← Formulario de reserva (Página 3)
│
└── backend/
    ├── server.js            ← Servidor Express (punto de entrada)
    ├── package.json
    ├── .env.example         ← Plantilla de variables de entorno
    │
    ├── routes/
    │   ├── reservas.js      ← POST/GET/PATCH /api/reservas
    │   └── contacto.js      ← POST /api/contacto, POST /api/newsletter
    │
    └── db/
        ├── database.js      ← Conexión SQLite + inicialización
        └── schema.sql       ← Definición de tablas e índices
```

---

## 🚀 Cómo iniciar el proyecto

### Frontend (sin servidor)

Simplemente abrí `index.html` en el navegador o usá un servidor local:

```bash
# Con VS Code — extensión Live Server
# Click derecho en index.html → "Open with Live Server"

# Con Node.js (npx)
npx serve .
```

### Backend (API REST)

```bash
# 1. Ir a la carpeta backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de entorno
cp .env.example .env
# Editar .env con tus credenciales reales

# 4. Inicializar la base de datos
npm run db:init

# 5. Iniciar el servidor
npm run dev       # desarrollo (con nodemon)
npm start         # producción
```

El servidor quedará disponible en `http://localhost:3000`.

---

## ⚙️ Configuración de EmailJS (frontend)

El envío de emails del frontend (sin backend) usa **EmailJS**.

1. Crear cuenta en [emailjs.com](https://www.emailjs.com)
2. Conectar tu Gmail como *Email Service*
3. Crear 2 plantillas:
   - `template_contacto` — Variables: `{{to_email}}`, `{{from_name}}`, `{{mensaje}}`, `{{case_number}}`
   - `template_newsletter` — Variables: `{{to_email}}`, `{{message}}`
4. Editar `js/core/config.js` y reemplazar:

```js
EMAILJS: {
  PUBLIC_KEY:          'TU_PUBLIC_KEY',
  SERVICE_ID:          'TU_SERVICE_ID',
  TEMPLATE_CONTACT:    'template_contacto',
  TEMPLATE_NEWSLETTER: 'template_newsletter',
},
```

---

## 📌 Agregar o quitar bodegas

Editá el array en `js/core/data.js`. El cambio se refleja automáticamente en:
- El mapa interactivo (Página 1)
- El carrusel horizontal (Página 1)
- La grilla de bodegas (Página 2)
- El selector del formulario de reserva (Página 3)

```js
// Estructura de cada bodega
{
  id:       'id-unico-sin-espacios',
  name:     'Nombre de la Bodega',
  location: 'Ciudad, Bs. As.',
  url:      'https://sitio-oficial.com',
  coords:   { lat: -38.00, lng: -62.00 },
  image:    'https://url-de-la-imagen.com/foto.jpg',
}
```

---

## 📡 Endpoints de la API

| Método  | Ruta               | Descripción                          |
|---------|--------------------|--------------------------------------|
| `POST`  | `/api/reservas`    | Crear una nueva reserva              |
| `GET`   | `/api/reservas`    | Listar todas las reservas (admin)    |
| `PATCH` | `/api/reservas/:id`| Actualizar estado de una reserva     |
| `POST`  | `/api/contacto`    | Guardar mensaje + enviar emails      |
| `GET`   | `/api/contacto`    | Listar todos los mensajes (admin)    |
| `POST`  | `/api/newsletter`  | Suscribir email al newsletter        |
| `GET`   | `/api/health`      | Health check del servidor            |

---

## 🛠️ Stack tecnológico

| Capa        | Tecnología                      |
|-------------|----------------------------------|
| HTML        | HTML5 semántico con ARIA         |
| CSS         | CSS3 nativo (variables, grid)    |
| JavaScript  | Vanilla JS ES6+ (módulos IIFE)   |
| Mapa        | Leaflet.js + OpenStreetMap       |
| Emails FE   | EmailJS                          |
| Backend     | Node.js + Express                |
| Base de datos | SQLite (better-sqlite3)        |
| Emails BE   | Nodemailer + Gmail SMTP          |

---

## ✅ Buenas prácticas aplicadas

- **Design Tokens**: todos los valores de diseño centralizados en `variables.css`
- **Separación de responsabilidades**: CSS por componente, JS por módulo y página
- **Single Source of Truth**: datos de bodegas en `data.js`, configuración en `config.js`
- **Accesibilidad**: roles ARIA, labels, navegación por teclado
- **Clean Code**: funciones pequeñas, nombres descriptivos, comentarios JSDoc
- **Módulos IIFE**: cada componente JS encapsula su estado interno
- **Validación doble**: en frontend (HTML5) y en backend (`express-validator`)
- **Patrón fallback**: si EmailJS falla, abre el cliente de correo local

---

## 📞 Contacto

**Email:** salcedochristian04@gmail.com  
**WhatsApp:** Configurar número en `js/core/config.js`
