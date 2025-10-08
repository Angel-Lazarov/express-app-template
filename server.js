// server.js
// кратък начин
import 'dotenv/config';

// dotenv е външна библиотека (инсталира се с npm i dotenv).
import dotenv from "dotenv";
// Този ред казва на Node.js: "Прочети файла .env и зареди всички 
// ключ=стойност двойки като environment variables."
dotenv.config();

import express from "express";
import https from "https";
import fs from "fs";
import path from "path";
import routes from './routes/index.js'; //импортиране на router в app.js


// create express application
const app = express();

// add Middleware за работа с JSON
// за да може да чете JSON от POST заявките
// За да имаш req.body, трябва да имаш middleware
app.use(express.json());

app.use("/", routes);
/* вече имаме пътища до: https://localhost:3443/api/users
GET /api/users
GET /api/users/:id
GET /api/recipes
GET /api/recipes/:id
POST /api/auth/login
POST /api/auth/register
*/

// задаване порт на сървъра
const PORT = 3443;

// Път до файловете на сертификата
const sslOptions = {
    key: fs.readFileSync(path.join('certs', 'server.key')),
    cert: fs.readFileSync(path.join('certs', 'server.cert')),
};

// Mount with prefix
// app.use('/recipes', recipesRouter);
// app.get("/", (req, res) => {
//     console.log("Hello from HTTPS!");
//     res.send("https")
// })

// Стартиране на HTTP сървър
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// Стартиране на HTTPS сървър
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS server is running on https://localhost:${PORT}`);
});

