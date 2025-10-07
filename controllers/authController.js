//controllers/authController.js

// Връзката към Firestore
import db from "../db/firestore.js";
// За хеширане на пароли
import bcrypt from "bcryptjs";
// За токена
import jwt from "jsonwebtoken";
import { Timestamp } from "firebase-admin/firestore";

// Register user controller

export async function registerUser(req, res) {
    try {
        const { username, password, email } = req.body;

        //1.1 Проверка дали вече съществува потребител с този email

        // Взимаме референция към колекция "users" в базата.
        const usersRef = db.collection("users");

        const emailSnapshot = await usersRef.where("email", "==", email).get();
        if (!emailSnapshot.empty) {
            return res.status(400).json({ error: "Потребител с такъв email вече съществува!" });
        }

        // 1.2 Проверка дали съществува потребител с такъв username
        const usernameSnapshot = await usersRef.where("username", "==", username).get();
        if (!usernameSnapshot.empty) {
            return res.status(400).json({ error: "Потребител с такова име съществува!" })
        }

        //2. Хеширане на паролата с vcryptjs
        const passwordHash = await bcrypt.hash(password, 10);
        // "10" е броя на salt rounds -> колко пъти да се обработи паролата

        //3/ Създаване на нов потребител
        const newUser = {
            username,
            email,
            passwordHash,
            role: "user",
            createdAt: Timestamp.now(),
        }

        const docRef = await usersRef.add(newUser);

        //Логване за Debug в конзолата
        console.log("New user created with ID:", docRef.id);


        //4. Връщане на отговор към клиента
        res.status(201).json({
            message: "Регистрацията е успешна!",
            id: docRef.id,
            username: newUser.username,
            email: newUser.email,
        });
    } catch (err) {
        console.error("Грешка при регистрация:", err);
        res.status(500).json({ error: "Вътрешна грешка на сървъра" });
    }
};

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // 1. Проверка дали имаме email и password (валидирано вече с middleware)
        if (!email || !password) {
            return res.status(400).json({ error: "Email и Password са задължителни!" });
        }

        // 2 Вземаме потребителя от Firestore
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where("email", "==", email).get();

        if (snapshot.empty) {
            return res.status(400).json({ error: "Грешен email или парола" });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // 3. Проверка на паролата
        const passwordValid = await bcrypt.compare(password, userData.passwordHash);
        if (!passwordValid) {
            return res.status(400).json({ error: "Грешен email или парола" });
        }

        // 4. Създаване на JWT
        const token = jwt.sign(
            { userId: userDoc.id, role: userData.role }, // payload
            process.env.JWT_SECRET,
            { expiresIn: "48h" }
        );

        // 5. Връщаме отговор
        res.json({
            message: "Успешен login",
            token,
            user: {
                id: userDoc.id,
                username: userData.username,
                email: userData.email,
                role: userData.role,
            }
        });
    } catch (err) {
        console.log("Login error:", err);
        res.status(500).json({ error: "Вътрешна грешка на сървъра" });
    }
}