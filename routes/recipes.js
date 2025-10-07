//routes/recipes.js
// само за /recipes

import { Router } from "express";
//импортираме middleware за валидация на токена
import { verifyToken } from "../../middleware/authJWT.js";
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe, getMyRecipes } from "../../controllers/recipeController.js";

const router = Router();

// POST /recipes
router.post("/", verifyToken, createRecipe);

// GET /recipes
router.get("/", getAllRecipes);

// GET /recipes/mine
router.get("/mine", verifyToken, getMyRecipes);

// GET /recipes/:id
router.get("/:id", getRecipeById);

// PUT /recipes/:id
router.put("/:id", verifyToken, updateRecipe);

// DELETE /recipes/:id
router.delete("/:id", verifyToken, deleteRecipe);

export default router;