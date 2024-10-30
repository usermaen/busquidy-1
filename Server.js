require('dotenv').config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("PORT:", process.env.PORT);

const express = require('express'); // Framework para crear el servidor web
const path = require('path') // Módulo para manejar rutas de archivos y directorios
const app = express(); // Crea una instancia de la aplicación Express
const mysql = require('mysql'); // Módulo sql para conectarse y realizar consultas a una BD MySQL
const cors = require('cors'); // Módulo para permitir peticiones desde diferentes dominios (evita problemas con CORS)
const bodyParser = require('body-parser'); // Procesa el cuerpo de las peticiones HTTP
const bcrypt = require('bcryptjs'); // Maneja el cifrado de contraseñas
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configura donde guardarás los archivos

// Clave secreta para firmar los JWT (mejor almacenarla en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET;

// Puerto de la aplicación definido en el archivo .env | Puerto donde el servidor escuchará las solicitudes
const port = process.env.PORT || 3001;

app.use(cors()); // Habilita el middleware 'cors'
app.use(express.static('public')); // Sirve archivos estátivos desde el directorio 'public'
app.use(bodyParser.urlencoded({extended: true})); // Middleware para procesar datos enviados a través de formulario HTML
app.use(bodyParser.json()); // Middlware para procesar cuerpos de solicitudes que vienen en formato JSON

// Configuración de la conexión a la base de datos usando variables de entorno
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Intenta conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('¡Conexión exitosa a la base de datos!');
    }
});

// Inicia el servidor de la aplicación Express en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
});

// Ruta principal para servir archivos estáticos
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registro de usuarios
app.post('/register', async (req, res) => {
    const { correo, contraseña, tipo_usuario } = req.body;

    db.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (err, result) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (result.length > 0) return res.status(400).json({ error: 'Correo ya registrado' });

        const hashedPassword = await bcrypt.hash(contraseña, 10);

        db.query(
            'INSERT INTO usuario (correo, contraseña, tipo_usuario) VALUES (?, ?, ?)',
            [correo, hashedPassword, tipo_usuario],
            (err, result) => {
                if (err) return res.status(500).json({ error: 'Error al crear el usuario' });
                res.status(201).json({ message: 'Usuario registrado exitosamente' });
            }
        );
    });
});

// Inicio de sesión
app.post('/login', (req, res) => {
    const { correo, contraseña } = req.body;

    db.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (err, result) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (result.length === 0) return res.status(400).json({ error: 'Correo o contraseña incorrectos' });

        const usuario = result[0];

        const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!passwordMatch) return res.status(400).json({ error: 'Correo o contraseña incorrectos' });

        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, tipo_usuario: usuario.tipo_usuario },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Incluye tipo_usuario en la respuesta para redirección en frontend
        res.json({ message: 'Inicio de sesión exitoso', token, tipo_usuario: usuario.tipo_usuario });
        console.log({ message: 'Inicio de sesión exitoso', token, tipo_usuario: usuario.tipo_usuario })
    });
});

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) throw new Error('Acceso denegado');

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

// Ruta protegida
app.get('/api/protected-route', verifyToken, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
});

// Endpoint para simular el cierre de sesión
app.post('/logout', (req, res) => {
    res.json({ message: 'Sesión cerrada correctamente' });
});


// Crear un nuevo proyecto
app.post('/api/create-project', verifyToken, upload.single('attachment'), (req, res) => {
    const { tipo_usuario } = req.user;
    if (tipo_usuario !== 'empresa') {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    const {
        titulo,
        descripcion,
        categoria,
        habilidades_requeridas,
        presupuesto,
        duracion,
        fecha_limite,
        ubicacion,
        tipo_contratacion,
        metodologia_trabajo
    } = req.body;

    const attachment = req.file ? req.file.filename : null; // Archivo adjunto si existe

    // Inserta los datos en la base de datos
    const queryProyecto = `
        INSERT INTO proyecto (id_empresa, titulo, descripcion, categoria, habilidades_requeridas, presupuesto, duracion_estimada, fecha_limite, ubicacion, tipo_contratacion, metodologia_trabajo, archivo_adjunto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(queryProyecto, [id_empresa, titulo, descripcion, categoria, habilidades_requeridas, presupuesto, duracion, fecha_limite, ubicacion, tipo_contratacion, metodologia_trabajo, attachment], (err, result) => {
        if (err) {
            console.error('Error al crear proyecto:', err);
            return res.status(500).json({ error: 'Error al crear el proyecto' });
        }

        res.status(201).json({ message: 'Proyecto creado con éxito' });
    });
});