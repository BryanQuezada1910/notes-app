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

export const logout = (req, res) => {
  try {
    req.logout(); // Logout del usuario
    res.clearCookie("sid"); // Elimina la cookie de sesión 'sid'
    res.redirect("/"); // Redirige a la página principal o a la de login
  } catch (err) {
    console.error("Error durante el logout:", err);
    res.redirect("/"); // Redirige a la página principal o a la de login en caso de error
  }
};
