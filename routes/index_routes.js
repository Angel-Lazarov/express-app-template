//routes/index_routes.js

// създаване на router

// Класически вариант, освен Router, взима целия express , което не е нужно
// import express from "express";
// const router = express.Router();

// Взимане на Router с деструктуриране, взимаме само него от express
import { Router } from "express";
const router = Router();


// rout-level middleware (само за този router)
router.use((req, res, next) => {
    console.log('Recipes router:', req.method, req.path);
    next();
});

router.get('/', async (req, res, next) => {
    // GET /recipes
    // ..logic
});

router.get('/:id', async (req, res, next) => {
    // GET /recipes/123
    const id = req.params.id;
    res.json({ id });
})

// export the router
export default router;

