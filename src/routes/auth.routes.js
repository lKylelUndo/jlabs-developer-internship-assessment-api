import { Router } from "express";
import Auth from "../controllers/AuthController.js";
import {
  changePasswordValidationRules,
  loginValidationRules,
  registerValidationRules,
} from "../validations/auth.validations.js";

const router = Router();

router.post("/auth/login", loginValidationRules, Auth.handleLogin);
router.post("/auth/register", registerValidationRules, Auth.handleRegister);
router.post("/auth/logout", Auth.handleLogout);

router.put(
  "/auth/change-password/:userId",
  changePasswordValidationRules,
  Auth.handleChangePassword
);

export default router;
