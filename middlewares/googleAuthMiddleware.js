// Importa passport para verificar si el usuario está autenticado
import passport from 'passport';

// Middleware para verificar si el usuario está autenticado
export const googleAuthMiddleware = (req, res, next) => {
  // Passport agrega el método isAuthenticated() a la solicitud (req)
  // Si el usuario está autenticado, continúa con la siguiente función de middleware
  if (req.isAuthenticated()) {
    return next();
  }

  // Si el usuario no está autenticado, redirige a la página de inicio de sesión o muestra un mensaje de error
  res.redirect('/'); // Puedes cambiar esto según tu lógica de redirección
};
