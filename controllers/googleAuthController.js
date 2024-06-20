import passport from 'passport';

export const login = (req, res) => {
  res.send('Login with Google');
};

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = passport.authenticate('google', { failureRedirect: '/' });

export const googleAuthRedirect = (req, res) => {
  res.redirect('/notes');
};

export const logout = (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
