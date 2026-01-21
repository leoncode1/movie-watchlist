import express from "express";
import { register, login, refresh, logout } from "../../controllers/authController.js";  
import { validate } from "../../middleware/validate.js";
import { loginSchema, registerSchema } from "../../validation/authSchemas.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", requireAuth, logout);

export default router;