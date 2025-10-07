//routes/users.js
// само за /users

import { Router } from "express";
//импортираме middleware за валидация на токена
import { getAllUsers, changeRole, getCurrentUser, updateCurrentUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authJWT.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

// GET /users - само за админ
router.get("/", verifyToken, requireAdmin, getAllUsers);

// PATCH /users/:id/role - промяна на роля от админ
router.patch("/:id/role", verifyToken, requireAdmin, changeRole);

//GET /users/me - връща данни за текущия логнат потребител
router.get("/users/me", verifyToken, getCurrentUser);

// PATCH /users/me - обновява профила на текущия логнат потребител
router.patch("/users/me", verifyToken, updateCurrentUser)

export default router;