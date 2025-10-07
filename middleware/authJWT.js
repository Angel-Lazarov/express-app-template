//middleware/authJWT.js
// middleware за валидиране на JWT

// За токена
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Липса или невалиден Bearer токен!" });
    }

    // Authorization: Bearer token
    const token = authHeader.split(" ")[1];

    try {
        // 2. Проверяваме токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Закачаме информацията за потребителя към req, за да я ползват другите route-ове
        req.user = decoded;
        next();
    } catch (err) {
        // 403 Forbidden 
        return res.status(403).json({ error: "Невалиден или изтекъл токен." });
        // return res.status(403).json({ error: "Токенът е невалиден!" });
    }
}