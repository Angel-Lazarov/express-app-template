//routes/auth.js
// само за /auth

import { Router } from "express";
import { validateAuth } from "../../middleware/validateAuth.js"; //импортираме middleware за валидация на входните данни
import { loginUser, registerUser } from "../../controllers/authController.js"; // импортираме контролера за регистрация
const router = Router();

// POST /auth/login
router.post("/login", validateAuth, loginUser);

// POST /auth/register
router.post("/register", validateAuth, registerUser);

export default router;