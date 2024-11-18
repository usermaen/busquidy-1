const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Clave secreta JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.error('No authorization header');
      return res.status(401).json({ error: 'Acceso denegado' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token recibido:', token);

    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // El token decodificado contiene la información del usuario
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err.message);
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Configuración de multer para guardar archivos en una carpeta local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/cvs');  // La carpeta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);  // Renombrar archivo con timestamp
  }
});

const upload = multer({ storage });

module.exports = { verifyToken, upload };
