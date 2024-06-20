import { configDotenv } from "dotenv";

configDotenv();

// Verificar si las variables de entorno están cargadas
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);