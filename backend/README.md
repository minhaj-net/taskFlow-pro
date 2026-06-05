# TaskFlow Pro — Backend API

Production-ready REST API built with **Node.js**, **Express.js**, and **MongoDB**.

---

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Runtime      | Node.js                           |
| Framework    | Express.js v4                     |
| Database     | MongoDB + Mongoose v8             |
| Auth         | JWT (jsonwebtoken) + bcryptjs     |
| Security     | Helmet, CORS, express-rate-limit  |
| Logging      | Morgan                            |
| Dev Server   | Nodemon                           |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── auth.controller.js   # Register, login, profile
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT guard + role-based access
│   │   ├── error.middleware.js   # Global error handler
│   │   └── notFound.middleware.js
│   ├── models/
│   │   └── User.js               # Mongoose user schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── index.js              # Central route registry
│   ├── utils/
│   │   └── generateToken.js      # JWT signer
│   └── app.js                    # Express app setup
├── .env.example
├── .gitignore
├── server.js                     # Entry point
├── package.json
└── README.md
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB URI:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskflow
JWT_SECRET=your_super_secret_key
PORT=5000
```

### 3. Start the dev server
```bash
npm run dev
```

The API will be available at **http://localhost:5000**

---

## API Reference

### Health Check

| Method | Endpoint | Description       |
|--------|----------|-------------------|
| GET    | `/`      | API health check  |

**Response**
```json
{ "success": true, "message": "API Running Successfully" }
```

---

### Authentication

#### Register
```
POST /api/auth/register
```
**Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```
**Response** `201`
```json
{ "success": true, "message": "User registered successfully" }
```

---

#### Login
```
POST /api/auth/login
```
**Body**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
**Response** `200`
```json
{
  "success": true,
  "token": "<jwt_token>",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### Get Profile *(Protected)*
```
GET /api/auth/profile
Authorization: Bearer <token>
```
**Response** `200`
```json
{
  "success": true,
  "user": { ... }
}
```

---

## Security Features

- **Helmet** — sets secure HTTP response headers
- **CORS** — restricts cross-origin requests (configurable via `CLIENT_URL`)
- **Rate Limiting** — 100 requests / 15 min per IP
- **bcryptjs** — passwords hashed with salt rounds = 12 before storage
- **JWT** — tokens signed with `JWT_SECRET`, expire in 7 days
- **Password field** — excluded from all DB queries by default (`select: false`)

---

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start with nodemon       |
| `npm start`   | Start with node          |
