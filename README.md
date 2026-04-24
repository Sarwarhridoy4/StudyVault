# 📚 StudyVault Backend API

A production-ready REST API built with **Node.js + Express.js** for the *StudyVault* learning platform.

This backend provides secure, scalable, and modular APIs for managing **study items (courses / learning modules)** with authentication, filtering, file uploads, and role-based access control.

Built with :contentReference[oaicite:0]{index=0}

---

# 🚀 Features

## Core Features
- Study Items CRUD (Create, Read, Update, Delete)
- Advanced Search, Filter, Sort, Pagination
- Role-Based Access Control (RBAC)
- Firebase Auth-ready middleware
- Cloud image upload & deletion
- Centralized error handling
- Transaction-safe operations
- Scalable modular architecture

---

## 🧠 Architecture Highlights

- Clean layered architecture (Controller → Service → Repository)
- Centralized utilities (`catchAsync`, `sendResponse`, `ApiFeatures`)
- Secure middleware system
- Cloudinary integration for file storage
- Validation layer (Joi/Zod ready)
- Production-grade folder structure

---

# 🚀 Usage Instructions

## Prerequisites

- **Bun** (v1.0 or higher) - [Install Bun](https://bun.sh/docs/installation)
- **MongoDB** (local instance or MongoDB Atlas)
- **Node.js** (optional, if not using Bun)

## Installation

```bash
# Clone the repository
git clone git@github.com:Sarwarhridoy4/StudyVault.git
cd StudyVault/server

# Install dependencies
bun install
```

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/studyvault
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

## Running the Server

### Development Mode (with hot reload)
```bash
bun run dev
```
Uses nodemon to watch for changes and auto-restart.

### Production Mode
```bash
bun run start
```

### Build for Production
```bash
bun run build
```

## Verifying the Installation

Once the server is running, test the health endpoint:
```bash
curl http://localhost:5000/health
```
Expected response: `OK`

## API Testing

### Get All Studies
```bash
curl http://localhost:5000/api/v1/studies
```

### Create a Study (Protected - requires auth)
```bash
curl -X POST http://localhost:5000/api/v1/studies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Basics",
    "shortDescription": "Learn React fast",
    "description": "Complete React course for beginners",
    "category": "frontend",
    "difficulty": "beginner",
    "price": 0,
    "image": "https://example.com/image.jpg",
    "createdBy": "userId"
  }'
```

### Search with Filters
```bash
curl "http://localhost:5000/api/v1/studies?search=react&category=frontend&page=1&limit=10"
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Bun** | Runtime environment |
| **TypeScript** | Programming language |
| **Express.js** | Web framework |
| **Mongoose** | MongoDB ODM |
| **Zod** | Schema validation |
| **Helmet** | Security headers |
| **CORS** | Cross-origin resource sharing |
| **Morgan** | HTTP request logger |
| **Nodemon** | Development auto-reload |

---

# 📁 Project Structure

```text
src/
 ├── app.ts
 ├── server.ts
 ├── config/
 │    ├── env.ts
 │    ├── db.ts
 │    ├── cloudinary.ts
 ├── modules/
 │    └── study/
 │         ├── study.route.ts
 │         ├── study.controller.ts
 │         ├── study.service.ts
 │         ├── study.repository.ts
 │         ├── study.model.ts
 │         ├── study.validation.ts
 ├── middlewares/
 │    ├── auth.ts
 │    ├── rbac.ts
 │    ├── upload.ts
 │    ├── errorHandler.ts
 ├── utils/
 │    ├── catchAsync.ts
 │    ├── sendResponse.ts
 │    ├── AppError.ts
 │    ├── ApiFeatures.ts
 ├── services/
 │    ├── cloudinary.service.ts
 │    ├── email.service.ts
 ├── emails/
 │    ├── templates/
 ├── queue/
````

---

# 🔐 Authentication

Authentication is handled using Firebase (frontend) and verified via middleware.

Uses Firebase Authentication

### Auth Flow:

* Frontend logs in via Firebase
* Sends ID token to backend
* Backend verifies token and attaches `req.user`

---

# 🛡️ Authorization (RBAC)

Roles supported:

* `USER`
* `ADMIN`
* `SUPER_ADMIN`

Permission-based access also supported.

---

## Middleware Usage:

```js
authorize("ADMIN", "SUPER_ADMIN")
authorizePermission("study.delete")
```

---

# 📦 Study API (Main Resource)

## Base URL

```
/api/v1/studies
```

---

## 📌 Endpoints

### 1. Get All Studies

```
GET /api/v1/studies
```

### Query Parameters:

```
?search=react
?category=frontend
?difficulty=beginner
?priceMin=0&priceMax=100
?sort=-createdAt
?page=1&limit=10
```

---

### 2. Get Single Study

```
GET /api/v1/studies/:id
```

---

### 3. Create Study (Protected)

```
POST /api/v1/studies
```

### Body:

```json
{
  "title": "React Basics",
  "shortDescription": "Learn React fast",
  "description": "Full module content...",
  "category": "frontend",
  "difficulty": "beginner",
  "price": 0,
  "image": "url",
  "createdBy": "userId"
}
```

---

### 4. Update Study (Protected)

```
PATCH /api/v1/studies/:id
```

---

### 5. Delete Study (Protected)

```
DELETE /api/v1/studies/:id
```

---

# 🔍 Search / Filter / Sort System

All listing APIs support:

## Search Fields:

* title
* description
* shortDescription

## Filters:

* category
* difficulty
* price range

## Sorting:

* newest
* oldest
* price
* popularity (future-ready)

## Pagination:

```
?page=1&limit=10
```

---

# 📤 File Upload System

Uses:

* Multer
* Cloudinary

---

## Upload Rules:

* Validate file type (images only)
* Limit file size (e.g. 2MB)
* Store image URL + public_id in DB

---

## Upload Flow:

```
Validate → Multer → Cloudinary → Save DB
```

---

## Delete Flow:

```
Delete DB → Delete Cloudinary file
```

---

## Critical Rule:

If DB fails after upload → **Cloudinary file must be deleted (rollback required)**

---

# 🔄 Transactions & Rollback

Used when multiple dependent operations occur:

Example:

```
Create Study
Upload Image
Save DB
Send Email (optional)
```

If any step fails:

* rollback DB
* delete uploaded file
* abort request safely

Uses Mongoose sessions if MongoDB is used.

---

# 📧 Email System (Optional Extension)

* EJS templates
* centralized email service
* optional queue processing

Templates:

```
welcome.ejs
reset-password.ejs
```

Optional queue system:

* BullMQ
* Redis

---

# ⚙️ Utility System

## 1. catchAsync

Handles async errors globally.

## 2. sendResponse

Standard API response format:

```json
{
  "success": true,
  "message": "Success",
  "meta": {},
  "data": {}
}
```

## 3. AppError

Custom error handler for operational errors.

## 4. ApiFeatures

Centralized query engine for:

* search
* filter
* sort
* pagination

---

# 🔐 Security Standards

* Helmet enabled
* CORS configured
* Rate limiting enabled
* Input validation required
* Environment variables used for secrets

---

# 🧪 Validation Rules

All inputs must be validated using:

* Joi OR Zod

Required validation:

* title
* description
* category
* difficulty
* price
* image

---

# 📡 API ROUTES SUMMARY

## Auth

```
GET /api/v1/auth/me
```

---

## Studies

```
GET    /api/v1/studies
GET    /api/v1/studies/:id
POST   /api/v1/studies
PATCH  /api/v1/studies/:id
DELETE /api/v1/studies/:id
```

---

## Admin (Optional Extension)

```
DELETE /api/v1/admin/studies/:id
```

---

# 🚫 FORBIDDEN PRACTICES

❌ No business logic in controllers
❌ No duplicate filtering logic
❌ No raw res.json inconsistencies
❌ No direct Cloudinary calls in controllers
❌ No missing rollback handling
❌ No unvalidated inputs
❌ No insecure routes
❌ No console.log in production
❌ No fat controllers

---

# ⚡ PERFORMANCE RULES

* Always use pagination
* Avoid blocking synchronous operations
* Use async file handling
* Use queues for heavy tasks

---

# 🧱 DESIGN PRINCIPLES

* DRY (Don't Repeat Yourself)
* SRP (Single Responsibility Principle)
* Separation of Concerns
* Modular architecture
* Reusable utilities

---

# 🏁 DEPLOYMENT NOTES

* Use environment variables (.env)
* Use production DB credentials
* Enable logging system
* Ensure Cloudinary keys are secure

---

# 🎯 FINAL GOAL

This backend must be:

✔ scalable like SaaS
✔ secure by default
✔ frontend-ready (Next.js integration)
✔ modular and reusable
✔ production-grade architecture

---

# 📌 Summary

StudyVault Backend is a fully structured API system designed for:

* learning platform applications
* SaaS expansion
* frontend integration (Next.js + Firebase)
* scalable cloud deployment

---

```
