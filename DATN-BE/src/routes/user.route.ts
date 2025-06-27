import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  changePassword,
  getMe,
  updateProfile,
} from "../controllers/user.controller";

const router = Router();

router.get("/me", authenticateToken, getMe);

router.patch("/change-password", authenticateToken, changePassword);

router.patch("/update-profile", authenticateToken, updateProfile);

export default router;
