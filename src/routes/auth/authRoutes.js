import express from "express";
import { register } from "../../controllers/authController.js"; 
import { login } from "../../controllers/authController.js"; 
import { validate } from "../../middleware/validate.js";
import { loginSchema, registerSchema } from "../../validation/authSchemas.js";


const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;