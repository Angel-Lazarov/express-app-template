# 🥘 RecipesBook API

//db - Folder with DB configurations
//db/firestore.js - connection with the firebase DB
//config = folder with Admin SDK (Позволява на Node.js / backend да говори с Firebase Admin SDK, т.е. да ползва get, put ... методите на базата)

Node.js + Express бекенд за управление на потребители и рецепти, използващ Firebase Firestore за база данни и JWT за удостоверяване.

## 🚀 Технологии
- Node.js / Express — REST API сървър
- Firebase Firestore (Admin SDK) — база данни
- bcryptjs — хеширане на пароли
- jsonwebtoken (JWT) — удостоверяване и защита на маршрути
- dotenv — управление на средата (.env)
- Postman — тестване на API заявките

## ⚙️ Инсталация и стартиране

```bash
git clone <your_repo_url>
cd recipesbook-api
npm install
```

Създай файл `.env` в root директорията:
```
FIREBASE_KEY=./config/recipesbook-db-firebase-adminsdk-fbsvc-31066ccb8c.json
JWT_SECRET=your_generated_secret_key
```

Стартирай HTTPS сървъра:
```bash
node server.js
# или
npm run dev
```

## 🔐 Удостоверяване (Authentication Flow)

- Регистрация: потребителят се създава в колекцията `users`, а паролата се хешира с bcrypt.
- Вход: при успешен логин се връща JWT токен с `userId` и `role`.
- Защитени пътища: изискват header `Authorization: Bearer <your_token>`.

## 🧭 API Endpoints

| Метод | Път | Защита | Описание |
|--------|-----|--------|-----------|
| POST | /api/auth/register | ❌ | Регистрация на нов потребител |
| POST | /api/auth/login | ❌ | Вход и получаване на JWT токен |
| GET | /api/recipes | ❌ | Връща всички рецепти |
| GET | /api/recipes/:id | ❌ | Връща рецепта по ID |
| POST | /api/recipes | ✅ | Създава нова рецепта |
| PUT | /api/recipes/:id | ✅ | Редактира рецепта (само авторът) |
| DELETE | /api/recipes/:id | ✅ | Изтрива рецепта (само авторът) |
| GET | /api/recipes/mine | ✅ | Връща рецептите на текущия потребител |

## 📤 Примери

### Регистрация
**POST** `/api/auth/register`
```json
{
  "username": "chefIvan",
  "email": "ivan@example.com",
  "password": "123456",
  "passwordConfirm": "123456"
}
```

### Вход
**POST** `/api/auth/login`
```json
{
  "email": "ivan@example.com",
  "password": "123456"
}
```

### Създаване на рецепта
**POST** `/api/recipes`
(изисква Authorization header)
```json
{
  "title": "Шопска салата",
  "category": "Салати",
  "image_url": "",
  "ingredients": "домати, краставици, сирене, лук, зехтин",
  "instructions": "Нарежи зеленчуците и ги смеси със зехтин и сирене."
}
```

## 🧩 Firestore структура

### Колекция `users`
```json
{
  "username": "chefIvan",
  "email": "ivan@example.com",
  "passwordHash": "<hashed_password>",
  "role": "user",
  "createdAt": "2025-10-08T20:40:00Z"
}
```

### Колекция `recipes`
```json
{
  "title": "Шопска салата",
  "category": "Салати",
  "ingredients": ["домати", "краставици", "сирене"],
  "instructions": "Нарежи зеленчуците...",
  "authorId": "<userId>",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

## 🧠 Бележки
- Всеки защитен endpoint трябва да има header: `Authorization: Bearer <token>`
- Токенът е валиден 1 час.
- Всички дати се съхраняват като Firestore Timestamp.
