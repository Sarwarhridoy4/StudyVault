 
# AGENT.md — StudyVault Backend (Enterprise Express.js System)

## 📌 Project Overview

StudyVault Backend is a production-ready REST API built using **Node.js + Express.js + TypeScript**. It powers a learning-item marketplace where users can create, browse, filter, and manage "study items" (learning modules, courses, notes).

The system is designed to be:

- Scalable (SaaS-ready)
- Modular (feature-based architecture)
- Secure (RBAC + auth middleware)
- Maintainable (clean separation of concerns)
- Frontend-ready (Next.js App Router compatible)
- Cloud-integrated (Cloudinary + optional queue/email systems)

Built with TypeScript, Bun runtime, Express.js, Mongoose, and Zod validation.

---

# 🧠 Core Engineering Philosophy

## 1. Production-First Thinking

Every feature must be designed as if it is part of a real SaaS product.

Prioritize:

- scalability
- maintainability
- reusability
- security
- performance
- clean architecture

---

## 2. Clean Architecture (STRICT RULE)

Follow layered architecture:

```text
Route → Controller → Service → Repository → Database
                     ↓
              Shared Utilities
                     ↓
         External Services (Cloudinary, Email, Queue)
```

### Rule:

* Controllers = HTTP layer only
* Services = business logic
* Repositories = DB operations
* Utils = shared logic

---

## 3. Single Responsibility Principle (SRP)

Each function MUST do ONE job only.

### ❌ Bad

```js
createUserUploadImageSendEmailLog()
```

### ✅ Good

```js
createUser()
uploadImage()
sendEmail()
logActivity()
```

---

## 4. Controller Discipline (STRICT)

Controllers MUST NOT contain:

* business logic
* database queries
* file upload logic
* email logic
* authorization logic

### Controllers ONLY:

* receive request
* call service
* send response using `sendResponse`
* forward errors via `next()`

---

# 📁 Project Structure (MANDATORY)

```text
src/
 ├── app.ts
 ├── server.ts
 ├── config/
 │    ├── env.ts
 │    ├── db.ts
 │    ├── cloudinary.ts
 ├── modules/
 │    ├── study/
 │    │    ├── study.route.ts
 │    │    ├── study.controller.ts
 │    │    ├── study.service.ts
 │    │    ├── study.repository.ts
 │    │    ├── study.model.ts
 │    │    ├── study.validation.ts
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
 ├── queue/
 ├── emails/
 │    ├── templates/
 ├── routes/
```

---

# ⚙️ CORE UTILITIES (MANDATORY)

## 1. catchAsync (HOF)

Eliminates repetitive try/catch.

```ts
import type { RequestHandler } from 'express';

export const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### Rule:

✔ All async controllers MUST use catchAsync

---

## 2. sendResponse (STANDARD FORMAT)

All API responses MUST follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "meta": {},
  "data": {}
}
```

### Rule:

❌ Never use raw `res.json()` in controllers
✔ Always use `sendResponse()`

---

## 3. AppError (ERROR STANDARDIZATION)

```ts
export default class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

Used for operational errors only.

---

# 🔐 AUTHENTICATION SYSTEM

## Firebase-Based Auth Layer

Frontend handles authentication using Firebase, backend verifies token optionally.

Uses Firebase Authentication

---

## Auth Middleware Responsibilities:

* verify token (Firebase or JWT)
* attach user to request
* reject invalid access

---

## Minimal User Object:

```ts
req.user = {
  uid,
  email,
  role,
  permissions
}
```

---

# 🛡️ RBAC (ROLE BASED ACCESS CONTROL)

## Middleware:

```ts
authorize("ADMIN", "USER")
```

OR permission-based:

```ts
authorizePermission("study.delete")
```

---

## Rule:

❌ No inline role checks inside controllers
✔ Always use middleware

---

# 📦 STUDY ITEM MODULE (CORE FEATURE)

Base route:

```text
/api/v1/studies
```

---

## CRUD APIs

```text
GET    /api/v1/studies
GET    /api/v1/studies/:id
POST   /api/v1/studies
PATCH  /api/v1/studies/:id
DELETE /api/v1/studies/:id
```

---

## Study Item Schema

```ts
{
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  image: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

# 🔍 QUERY SYSTEM (CRITICAL FEATURE)

All list endpoints MUST use centralized query system:

## Features:

* search
* filter
* sort
* pagination
* field limiting

---

## Query Parameters:

```text
?search=react
?category=frontend
?difficulty=beginner
?priceMin=0&priceMax=100
?sort=-createdAt
?page=1&limit=10
```

---

## Rule:

❌ No duplicated query logic
✔ Must use `ApiFeatures.ts`

---

# 📤 FILE UPLOAD SYSTEM

Uses:

* Multer
* Cloudinary

---

## Upload Rules:

Validate:

* file size limit
* MIME type whitelist
* optional dimensions
* max file count

---

## Upload Flow:

```text
Validate → Multer → Cloudinary → Save DB
```

---

## Delete Flow:

```text
Delete DB → Delete Cloudinary file
```

---

## Critical Rule:

If DB fails after upload:

✔ MUST delete Cloudinary file (rollback external side effect)

---

# 🔄 TRANSACTIONS & ROLLBACK (MANDATORY)

Used when multiple dependent operations exist:

Example flow:

```text
Create Study
Upload Image
Save DB
Send Email
```

---

## Failure Rule:

If any step fails:

* rollback DB transaction
* delete uploaded Cloudinary file
* abort operation safely

---

## MongoDB:

Use session transactions via Mongoose

---

# 📧 EMAIL SYSTEM (CENTRALIZED)

## Rules:

❌ No email logic inside controllers
✔ Email handled via service layer

---

## Email Stack:

* EJS templates
* Email service
* optional queue system

---

## Template Structure:

```text
emails/templates/
  welcome.ejs
  reset-password.ejs
```

---

## Optional Queue:

* BullMQ
* Redis

---

# 📊 API DESIGN RULES

## Versioning:

```text
/api/v1/
```

---

## REST Standard:

| Method | Purpose |
| ------ | ------- |
| GET    | Read    |
| POST   | Create  |
| PATCH  | Update  |
| DELETE | Remove  |

---

# 🧪 VALIDATION RULES

All inputs MUST be validated using:

* Joi OR Zod

Validate:

* title
* description
* category
* difficulty
* price
* image

---

# 🧼 CODE QUALITY RULES

## Required:

* ESLint
* Prettier
* modular structure
* small functions
* reusable utilities

---

## File Size Limit:

* max 200–300 lines per file

---

## DRY Principle:

❌ No duplicated logic
✔ Always extract utils/services

---

# 🔐 SECURITY RULES

Mandatory:

* helmet middleware
* cors configuration
* rate limiting
* input sanitization
* environment variables protection

---

# ⚡ PERFORMANCE RULES

* pagination required for all lists
* avoid blocking synchronous code
* use async I/O operations
* use queues for heavy operations

---

# 🪵 LOGGING SYSTEM

Use centralized logger (Winston/Pino).

Log:

* errors
* auth attempts
* admin actions
* critical system events

❌ No console.log in production

---

# 📡 ROUTE STRUCTURE

```text
GET    /api/v1/studies
GET    /api/v1/studies/:id
POST   /api/v1/studies
PATCH  /api/v1/studies/:id
DELETE /api/v1/studies/:id
```

Protected:

```text
POST   /api/v1/studies
PATCH  /api/v1/studies/:id
DELETE /api/v1/studies/:id
```

Admin-only:

```text
DELETE /api/v1/admin/studies/:id
```

---

# 🚫 FORBIDDEN PATTERNS

❌ Fat controllers
❌ Inline DB queries everywhere
❌ Missing rollback logic
❌ No validation layer
❌ Direct Cloudinary calls in controllers
❌ Email logic inside controllers
❌ Duplicate filtering logic
❌ Missing authentication guards
❌ Inconsistent API responses

---

# 🧠 AGENT EXECUTION STRATEGY

When implementing features:

1. Define schema first
2. Create module structure
3. Add validation layer
4. Add repository layer
5. Add service layer
6. Add controller layer
7. Add routes
8. Add middleware (auth/RBAC)
9. Add upload/email if needed
10. Add transaction safety
11. Add ApiFeatures integration
12. Add error handling
13. Refactor for reuse

---

# 🏁 GOLD STANDARD

The backend must be:

✔ scalable
✔ secure
✔ modular
✔ reusable
✔ production-grade
✔ frontend-ready
✔ SaaS-architecture aligned

---

# 🎯 FINAL GOAL

This backend should be immediately compatible with:

* Next.js StudyVault frontend
* Firebase authentication system
* SaaS-level expansion (payments, subscriptions, analytics)

---

# 🔧 TECH STACK

* **Runtime**: Bun
* **Language**: TypeScript
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose
* **Validation**: Zod
* **Authentication**: Firebase (planned)
* **File Upload**: Multer + Cloudinary (planned)
* **Process Manager**: Nodemon (dev)

---

# 📜 SCRIPTS

```json
{
  "dev": "nodemon src/server.ts",
  "start": "bun run src/server.ts",
  "build": "bun build src/server.ts --outdir dist"
}
```

---
