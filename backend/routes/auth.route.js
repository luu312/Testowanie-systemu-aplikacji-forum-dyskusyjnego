import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);
router.post("/verify-email", verifyEmail); 
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;
