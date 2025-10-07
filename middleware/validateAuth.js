//middleware/validateAuth.js
// middleware за проверка на Login/register данни

export function validateAuth(req, res, next) {
    const { username, email, password, passwordConfirm } = req.body;

    // Валидация при Register
    if (req.path.includes("register")) {

        // За регистрация – проверяваме username, email и password
        if (!username || !password || !email) {
            return res.status(400).json({ error: "Username, email и password са задължителни" });
        }

        // Проверка за дължината на паролата при Register
        if (password.length < 6) {
            return res.status(400).json({ error: "Паролата трябва да е поне 6 символа!" });
        }

        // Проверка на повторна парола
        if (!passwordConfirm || password !== passwordConfirm) {
            return res.status(400).json({ error: "Паролите не съвпадат!" });
        }
    } else if (req.path.includes("login")) {
        // За login – проверяваме email и password
        if (!email || !password) {
            return res.status(400).json({ error: "Email и password са задължителни" });
        }
    }

    //ако всичко е наред -> продължи към самия route
    // спешно ли е, че имам доста неща да правя
    next();
}