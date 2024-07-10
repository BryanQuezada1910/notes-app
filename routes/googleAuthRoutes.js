import { Router } from "express";
import {
  googleAuth,
  googleAuthCallback,
  googleAuthRedirect,
} from "../controllers/googleAuthController.js";

const router = Router();

router.get("/login/google", googleAuth);

router.get("/google/callback", googleAuthCallback, googleAuthRedirect);

export default router;
