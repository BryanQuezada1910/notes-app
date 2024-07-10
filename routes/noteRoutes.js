import { Router } from 'express';
import { logout } from '../controllers/noteController.js';

const router = Router();

router.get('/logout', logout);

export default router;