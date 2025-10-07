//controllers/recipeController.js

import db from "../db/firestore.js";
import { Timestamp } from "firebase-admin/firestore";

// POST /recipes
export async function createRecipe(req, res) {
    try {
        const { title, image_url, category, ingredients, instructions } = req.body;

        // Проверка за задължителни полета
        if (!title || !category || !ingredients || !instructions) {
            return res.status(400).json({ error: " Всички полета са задължителни" });
        }

        const userId = req.user.userId; // от JWT middleware-а
        const default_img = 'https://placehold.co/300x200/cccccc/ffffff?text=Без+снимка';
        let ingredientsArr = ingredients.split(', ').map(i => i.trim()).filter(i => i.length > 0);


        const newRecipe = {
            title,
            image_url: image_url || default_img,
            category,
            ingredients: ingredientsArr,
            instructions,
            authorId: userId,
            createdAt: Timestamp.now(),
            updateedAt: Timestamp.now(),
        };

        const docRef = await db.collection("recipes").add(newRecipe);

        res.status(201).json({
            message: "Рецептата е създадена успешно",
            id: docRef.id,
            recipe: newRecipe
        });
    } catch (err) {
        console.error("Грешка при създаването на рецепта:", err);
        res.status(500).json({ error: "Вътрешна грешка на сървъра" });
    }
}

// GET /recipes
export async function getAllRecipes(req, res) {
    try {
        const snapshot = await db.collection("recipes").get();

        const recipes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(recipes);
    } catch (err) {
        console.error("Грешка при взимане на рецепти:", err);
        res.status(500).json({ error: "Вътрешна грешка ба сървъра" });
    }
}

// GET /recipes/:id
export async function getRecipeById(req, res) {
    try {
        const id = req.params.id;

        // → връща референция към документ с това ID 
        // (може и да не съществува, просто е "указател").
        const docRef = db.collection('recipes').doc(id);

        // → връща снимка на документа (DocumentSnapshot).
        const docSnap = await docRef.get();

        //→ булев индикатор дали документът реално съществува.
        if (!docSnap.exists) {
            return res.status(404).json({ error: "Рецептата не е намерена!" });
        }

        res.status(200).json({
            id: docSnap.id, //→ ID-то на документа (същото като id от URL-а).
            ...docSnap.data(), // → самите данни, които си записал в Firestore.
        });
    } catch (err) {
        console.error("Грешка при извличане на рецептата", err);

        res.status(500).json({ error: "Вътрешна грешка на сървъра." });
    }
}

// PUT /recipes/:id
export async function updateRecipe(req, res) {
    try {
        const id = req.params.id;
        const { title, category, ingredients, image_url, instructions } = req.body;

        // Проверка за задължителни полета
        if (!title || !category || !ingredients || !instructions) {
            return res.status(400).json({ error: "Всички полета са задължителни!" });
        }

        const docRef = db.collection('recipes').doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ error: "Рецептата не е намерена!" });
        }

        const recipe = docSnap.data();

        // Проверка за авторство
        if (recipe.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Нямате права да редактирате тази рецепта!" });
        }

        // ingredients -> масив от стрингове
        const ingredientsArr = ingredients.split(',')
            .map(i => i.trim())
            .filter(i => i.length > 0);

        // създаваме ъпдейтнатия обек
        const updatedRecipe = {
            title,
            category,
            image_url: image_url || recipe.image_url, // ако няма подадено ново, запазва старото
            instructions,
            ingredients: ingredientsArr,
            authorId: recipe.authorId, // авторът не се сменя
            createdAt: recipe.createdAt, // запазваме оригиналната дата
            updateedAt: Timestamp.now(),
        };

        // update в базата 
        await docRef.update(updatedRecipe);

        res.status(200).json({
            message: "Рецептата е обновена успешно",
            id: docRef.id,
            recipe: updatedRecipe,
        });

    } catch (err) {
        console.error('Грешка при обновяване на рецепта:', err);
        res.status(500).json({ error: "Вътрешна грешка в сървъра." });
    }
}

// DELETE /recipes/:id
export async function deleteRecipe(req, res) {
    try {
        const id = req.params.id;

        // 1. Взимаме документа
        const docRef = db.collection('recipes').doc(id);
        const docSnap = await docRef.get();

        // 2. Проверка дали съществува
        if (!docSnap.exists) {
            return res.status(404).json({ error: "Рецептата не е намерена." });
        }

        const recipe = docSnap.data();

        // 3. Проверка дали текущият потребител е автор
        if (recipe.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Нямате права за изтриване." });
        }

        // 4. Изтриваме рецептата
        await docRef.delete();

        // 5. Връщаме отговор
        res.status(200).json({ message: "Successfully deleted!" });
    } catch (err) {
        console.error("Грешка при изтриване на рецепта:", err);
        return res.status(500).json({ error: "Internal server error!" });
    }
}

// GET /recipes/mine
export async function getMyRecipes(req, res) {
    try {
        // взимаме userId от токена
        const userId = req.user.userId;

        // Търсим всички рецепти, създадени от този user
        const snapshot = await db.collection('recipes').where("authorId", "==", userId).get();

        if (snapshot.empty) {
            return res.status(200).json({ message: "Няма създадени рецепти", recipes: [] });
        }

        const recipes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(recipes);

    } catch (err) {
        console.error("Грешка при извличане на личните рецепти:", err);
        res.status(500).json({ error: "Вътрешна грешка на сървъра" });
    }
}