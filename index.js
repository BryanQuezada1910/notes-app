import express from 'express';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import googleAuthRoutes from './routes/googleAuthRoutes.js';
import session from 'express-session';
import passportConfig from './config/passport-config.js';
import { googleAuthMiddleware } from './middlewares/googleAuthMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase } from './config/database.js';

// Configuración de variables de entorno
configDotenv();

// Configuración de __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Puerto de la aplicación
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

// Conexion a la base de datos
connectToDatabase();

// Configuración de la sesión con express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Solo crea la sesión si algo cambia
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 semana
  }
}));

// Configuración de Passport
app.use(passportConfig.initialize());
app.use(passportConfig.session());

// Ruta de autenticación con Google
app.use('/auth', googleAuthRoutes);

// Ruta principal de la aplicación
app.get('/', (req, res) => {
  // Si el usuario está autenticado, redirige a la página de notas
  if (req.isAuthenticated()) {
    return res.sendFile(path.join(__dirname, 'views', 'notes.html'));
  }
  // Si el usuario no está autenticado, redirige a la página de inicio
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// app.get('/notes', googleAuthMiddleware, (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'notes.html'));  
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});