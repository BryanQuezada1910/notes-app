import { Router } from "express";
import {
  googleAuth,
  googleAuthCallback,
  googleAuthRedirect,
  logout,
  getProfileInfo,
} from "../controllers/googleAuthController.js";

const router = Router();

router.get("/login/google", googleAuth);

router.get("/google/callback", googleAuthCallback, googleAuthRedirect);

router.get("/logout", logout);

router.get("/user/profile", getProfileInfo);

export default router;
