//controllers/userController.js

import db from "../db/firestore.js";

// GET /users - само за админ
export async function getAllUsers(req, res) {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => {
            const { passwordHash, ...userData } = doc.data(); //филтрирам чувствителни данни
            return { id: doc.id, ...userData };
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// PATCH /users/:id/role - промяна на роля от админ
export async function changeRole(req, res) {

    if (req.user.id === req.params.id) {
        return res.status(400).json({ error: "Не може да сменяш собствената си роля" });
    }

    try {
        const { role } = req.body;

        //Проверка дали подадената роля е валидна (например само "user" или "admin").
        const validRoles = ["user", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: "Невалидна роля" });
        }

        await db.collection('users').doc(req.params.id).update({ role });
        res.json({ msg: "Role updated!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /users/me - връща данни за текущия логнат потребител
export async function getCurrentUser(req, res) {
    try {
        const userId = req.user.userId; // идва от JWT payload-а

        //??? взима конкретен юзър по ID
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "Потребителят не е намерен." });
        }

        const userData = userDoc.data();

        const { passwordHash, ...safeData } = userData;

        res.json({ id: userDoc.id, ...safeData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// PATCH /users/me - обновява профила на текущия логнат потребител
export async function updateCurrentUser(req, res) {
    try {
        const userId = req.user.userId; // взимаме ID-то от токена
        const { username } = req.body; // данни, които потребителят може да променя

        if (!username) {
            return res.status(400).json({ error: "Няма подадени данни за обновление" });
        }

        const updatedData = {};
        if (username) {
            updatedData.username = username;
        }

        await db.collection('users').doc(userId).update(updatedData);
        res.json({ msg: "Профилът е обновен успешно!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}