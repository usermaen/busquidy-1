require('dotenv').config(); // Carga variables de entorno

console.log("DB_HOST:", process.env.DB_HOST); // Debería mostrar 'localhost'
console.log("DB_USER:", process.env.DB_USER); // Debería mostrar 'root'
console.log("DB_PASSWORD:", process.env.DB_PASSWORD); // Debería mostrar 'admin'
console.log("DB_NAME:", process.env.DB_NAME); // Debería mostrar 'plataforma'

const express = require('express'); // Framework Express
const cors = require('cors'); // Permitir solicitudes de diferentes orígenes
const bodyParser = require('body-parser'); // Procesar solicitudes HTTP
const db = require('./db'); // Importar el pool de conexiones
const fs = require('fs');
const path = require('path');
const routes = require('./routes');

const app = express();
const port = 3001;
const uploadsDir = path.join(__dirname, 'uploads/cvs/');

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.static('public')); // Archivos estáticos
app.use(bodyParser.urlencoded({ extended: true })); // Formularios
app.use(bodyParser.json()); // JSON
// Usar las rutas en la aplicación
app.use('/api', routes);

// Verificar la conexión con la base de datos
async function testDbConnection() {
  try {
    // Usamos pool.query() para verificar la conexión
    const [rows] = await db.pool.query('SELECT 1 + 1 AS resultado');
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
}
testDbConnection();

// Ruta de ejemplo: prueba de base de datos
app.get('/test', async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT 1 + 1 AS resultado');
    res.json({ resultado: rows[0].resultado });
  } catch (error) {
    console.error('Error en /test:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express iniciado en el puerto ${port}`);
});

// Verificar si el directorio existe, si no, crearlo
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // `recursive: true` crea directorios intermedios si no existen
  console.log(`Directorio creado: ${uploadsDir}`);
} else {
  console.log(`El directorio ya existe: ${uploadsDir}`);
}