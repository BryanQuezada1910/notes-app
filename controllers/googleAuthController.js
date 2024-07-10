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
