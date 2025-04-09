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

export const getProfileInfo = (req, res) => {
  if (req.isAuthenticated()) {
    // Devolver información formateada del usuario
    const user = req.user;
    
    res.json({
      id: user._id || user.id,
      googleId: user.googleId,
      displayName: user.displayName,
      firstName: user.displayName ? user.displayName.split(' ')[0] : '',
      email: user.email,
      profileImage: user.profileImage || user.image || '', // Compatibilidad con ambos nombres de campo
      createdAt: user.createdAt
    });
  } else {
    res.status(401).json({
      message: "No autenticado",
      success: false
    });
  }
}