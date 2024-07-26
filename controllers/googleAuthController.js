import passport from "passport";

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/",
});

export const googleAuthRedirect = (req, res) => {
  res.redirect("/notes");
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Maneja el error usando el middleware 'next'
    }
    console.log('Clearing cookies for session');
    res.clearCookie('cookie_sid_google_auth'); // Elimina la cookie de sesión 'sid'
    res.redirect('/'); // Redirige a la página principal o a la de login
  });
};