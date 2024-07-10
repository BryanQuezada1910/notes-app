import { Router } from 'express';
import { googleAuth, googleAuthCallback, googleAuthRedirect, logout } from '../controllers/googleAuthController.js';

const router = Router();

router.get('/login/google', googleAuth);

router.get('/google/callback', googleAuthCallback, googleAuthRedirect);

router.get('/logout/google', logout);

export default router;