import express from "express";
import { configDotenv } from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import passportConfig from "./config/passport-config.js";
import { googleAuthMiddleware } from "./middlewares/googleAuthMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./config/database.js";
import noteRoutes from "./routes/noteRoutes.js";
import cors from "cors";

// Configuración de variables de entorno
configDotenv();

// Configuración de __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Puerto de la aplicación
const PORT = process.env.PORT || 5000;

const app = express();

// const corsOptions = {
//   origin: process.env.CLIENT_URL ?? "http://localhost:3000",
//   credentials: true,
//   optionsSuccessStatus: 200,
//   allowedHeaders: ["Content-Type", "Authorization"],
//   allowedMethods: ["GET", "POST", "PUT", "DELETE"],

// };

// app.use(cors( corsOptions ));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public"))); // Para servir archivos estáticos

// Conexion a la base de datos
connectToDatabase();

// Configuración de la sesión con express-session
app.use(
  session({
    name: "cookie_sid_google_auth",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Solo crea la sesión si algo cambia
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
      httpOnly: true, // La cookie solo se puede acceder desde el servidor
      sameSite: "lax", // Protección contra ataques CSRF
    },
  })
);

// Configuración de Passport
app.use(passportConfig.initialize());
app.use(passportConfig.session());

// Ruta de autenticación con Google
app.use("/auth", authRoutes);

// Ruta principal de la aplicación (login)
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/notes");
  }
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.use("/api/notes", noteRoutes);

// Ruta principal de la aplicación
app.get("/notes", googleAuthMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "notes.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
