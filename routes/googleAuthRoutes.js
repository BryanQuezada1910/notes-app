import { Router } from 'express';
import { googleAuth, googleAuthCallback, googleAuthRedirect, logout } from '../controllers/googleAuthController.js';
import { googleAuthMiddleware } from '../middlewares/googleAuthMiddleware.js';

const router = Router();

router.get('/login/google', googleAuth);

router.get('/google/callback', googleAuthCallback, googleAuthRedirect);

router.get('/logout/google', logout);

router.get('/', googleAuthMiddleware, (req, res) => {
    res.send('You are authenticated');
});

export default router;