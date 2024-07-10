export const logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err); // Maneja el error usando el middleware 'next'
      }
      console.log('Clearing cookies for session');
      res.clearCookie('cookie_sid'); // Elimina la cookie de sesión 'sid'
      res.redirect('/'); // Redirige a la página principal o a la de login
    });
};