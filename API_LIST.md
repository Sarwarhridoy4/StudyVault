# API List

Base URL: `http://localhost:5000`

Notes:
- All API routes return the standard shape: `success`, `message`, `data`, `meta`
- Authentication is implemented via:
  - **Firebase/Google OAuth** (Bearer token in Authorization header)
  - **Local Email/Password** with HTTP-only session cookies
- Protected routes accept either a valid Firebase ID token **or** a valid session cookie
- Course create/update can use `multipart/form-data` with image upload **or** JSON with image URL

---

## Authentication Endpoints

All authentication endpoints are rate-limited to 5 requests per hour per IP.

### `POST /api/v1/auth/firebase`

Authenticate with Firebase/Google OAuth.

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "idToken": "Firebase_ID_token_obtained_from_client_SDK"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully", // or "User registered successfully" for first-time users
  "data": {
    "uid": "firebase_uid",
    "email": "user@example.com",
    "displayName": "User Name",
    "photoURL": "https://...",
    "role": "USER",
    "emailVerified": true,
    "authProvider": "firebase"
  },
  "meta": {
    "isNewUser": true | false
  }
}
```

**Notes:**
- If the Firebase UID is new, a user record is created and `isNewUser: true`.
- A session cookie is set for browser clients.
- For subsequent requests, clients can use the session cookie **or** continue sending the Firebase ID token in `Authorization: Bearer <token>`.

---

### `POST /api/v1/auth/register`

Create a local account with email and password.

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "displayName": "User Name" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "uid": "local_1234567890_abcdef",
    "email": "user@example.com",
    "displayName": "User Name",
    "role": "USER",
    "emailVerified": false,
    "authProvider": "local"
  },
  "meta": null
}
```

**Errors:**
- `409` if email already registered.

---

### `POST /api/v1/auth/login`

Log in with email and password.

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):** same shape as register (user object).

**Errors:**
- `401` if credentials invalid or account uses Firebase auth.

---

### `POST /api/v1/auth/logout`

Destroy the current session.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null,
  "meta": null
}
```

---

### `POST /api/v1/auth/forgot-password`

Request a password reset link via email.

**Public endpoint – no authentication required**

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an account exists with that email, you will receive a password reset link.",
  "data": null,
  "meta": null
}
```

**Dev mode note:** In development (`NODE_ENV=development`), the response includes a `token` field in `meta` for testing purposes. This is omitted in production.

**Behavior:**
- If the email exists and belongs to a local account, a password reset email is sent with a link containing a secure token.
- If the email belongs to a Firebase-authenticated user, or if the email doesn't exist, the same generic success message is returned to prevent email enumeration attacks.
- Reset tokens expire after 1 hour and are stored with a TTL index in MongoDB.

---

### `POST /api/v1/auth/reset-password`

Reset password using token from email.

**Public endpoint – no authentication required**

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "email": "user@example.com",
  "token": "reset_token_from_email_link",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now log in with your new password.",
  "data": null,
  "meta": null
}
```

**Errors:**
- `400` if token is invalid or expired.
- `400` if passwords don't match.
- `400` if account uses Firebase authentication (must use Google sign-in).

**Flow:**
1. User clicks reset link from email (URL format: `FRONTEND_URL/reset-password?token=ABC123`)
2. Frontend collects `email`, `token`, `newPassword`, `confirmPassword`
3. Frontend calls this endpoint
4. On success, user can log in with new password.

---

### `GET /api/v1/auth/me`

Get the currently authenticated user's profile.

**Authentication:** Required (session cookie or Firebase Bearer token)

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "uid": "...",
    "email": "...",
    "displayName": "...",
    "role": "USER",
    "emailVerified": false,
    "authProvider": "local"
  },
  "meta": null
}
```

---

### `PATCH /api/v1/auth/me`

Update the current user's profile (display name, photo URL).

**Authentication:** Required

**Body:**
```json
{
  "displayName": "New Name",
  "photoURL": "https://example.com/avatar.jpg"
}
```

---

### `DELETE /api/v1/auth/me`

Delete the current user account and destroy the session.

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully",
  "data": null,
  "meta": null
}
```

---

## Public Endpoints

### `GET /`
Landing page metadata.

Example response:
```json
{
  "success": true,
  "message": "Welcome to StudyVault",
  "data": {
    "name": "StudyVault API",
    "version": "1.0.0",
    "description": "A learning platform marketplace",
    "endpoints": {
      "health": "/health",
      "courses": "/api/v1/courses",
      "modules": "/api/v1/modules",
      "courseModules": "/api/v1/coursemodule",
      "about": "/about"
    }
  },
  "meta": null
}
```

### `GET /about`
About page metadata.

Example response:
```json
{
  "success": true,
  "message": "About StudyVault",
  "data": {
    "name": "StudyVault",
    "tagline": "Your gateway to learning",
    "description": "StudyVault is a marketplace for learning modules where users can browse, create, and manage course materials.",
    "features": [
      "Browse courses and modules by category",
      "Search and filter content",
      "Add and manage your own modules",
      "Admin tools for course and module management"
    ],
    "apiVersion": "1.0.0"
  },
  "meta": null
}
```

### `GET /health`
Health check.

Example response:
```json
{
  "status": "OK",
  "timestamp": "2026-04-24T12:00:00.000Z",
  "uptime": 123.45,
  "environment": "development",
  "system": {
    "platform": "linux",
    "arch": "x64",
    "nodeVersion": "v22.x.x",
    "memory": {
      "used": "10.50 MB",
      "total": "20.00 MB"
    },
    "pid": 12345
  }
}
```

## Module Endpoints

### `GET /api/v1/modules`
List all modules. Supports query parameters such as `search`, `category`, `page`, and `limit`.

Example request:
```http
GET /api/v1/modules?search=react&category=frontend&page=1&limit=10
```

Example response:
```json
{
  "success": true,
  "message": "Modules retrieved successfully",
  "data": [
    {
      "_id": "680a10000000000000000001",
      "title": "React Basics",
      "shortDescription": "Learn React from scratch",
      "description": "A beginner-friendly module covering components, props, state, and hooks.",
      "category": "frontend",
      "price": 19.99,
      "image": "https://example.com/react-basics.jpg",
      "createdBy": "system"
    }
  ],
  "meta": null
}
```

### `GET /api/v1/modules/manage`
Get modules for the current placeholder user (`system` in the current implementation).

Example response:
```json
{
  "success": true,
  "message": "User modules retrieved successfully",
  "data": [
    {
      "_id": "680a10000000000000000001",
      "title": "React Basics",
      "shortDescription": "Learn React from scratch",
      "description": "A beginner-friendly module covering components, props, state, and hooks.",
      "category": "frontend",
      "price": 19.99,
      "image": "https://example.com/react-basics.jpg",
      "createdBy": "system"
    }
  ],
  "meta": null
}
```

### `GET /api/v1/modules/:id`
Get a single module by id.

Example response:
```json
{
  "success": true,
  "message": "Module retrieved successfully",
  "data": {
    "_id": "680a10000000000000000001",
    "title": "React Basics",
    "shortDescription": "Learn React from scratch",
    "description": "A beginner-friendly module covering components, props, state, and hooks.",
    "category": "frontend",
    "price": 19.99,
    "image": "https://example.com/react-basics.jpg",
    "createdBy": "system"
  },
  "meta": null
}
```

### `POST /api/v1/modules/add`
Create a module. **Requires authentication.**

**Headers:** `Content-Type: application/json` (or use session cookie)

Example payload:
```json
{
  "title": "Advanced Node.js Fundamentals",
  "price": 39.99
}
```

### `DELETE /api/v1/modules/:id`
Delete a module.

Example response:
```json
{
  "success": true,
  "message": "Module deleted successfully",
  "data": null,
  "meta": null
}
```

## Course Endpoints

### `GET /api/v1/courses`
List all courses.

Example response:
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [
    {
      "_id": "680a10000000000000000011",
      "title": "React Masterclass",
      "shortDescription": "Complete React learning path",
      "description": "A complete course covering React fundamentals, hooks, routing, and project structure.",
      "category": "frontend",
      "difficulty": "beginner",
      "price": 49.99,
      "image": "https://res.cloudinary.com/demo/image/upload/react-masterclass.jpg",
      "imagePublicId": "studyvault/courses/react-masterclass",
      "createdBy": "admin_uid"
    }
  ],
  "meta": null
}
```

### `GET /api/v1/courses/:id`
Get a single course by id.

Example response:
```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": {
    "_id": "680a10000000000000000011",
    "title": "React Masterclass",
    "shortDescription": "Complete React learning path",
    "description": "A complete course covering React fundamentals, hooks, routing, and project structure.",
    "category": "frontend",
    "difficulty": "beginner",
    "price": 49.99,
    "image": "https://res.cloudinary.com/demo/image/upload/react-masterclass.jpg",
    "imagePublicId": "studyvault/courses/react-masterclass",
    "createdBy": "admin_uid"
  },
  "meta": null
}
```

### `POST /api/v1/courses`
Create a course. **Requires authentication.**

**Authentication:** Session cookie or Bearer token

**Content-Type:** `multipart/form-data` (when uploading image file) or `application/json` (when providing image URL)

**Required fields:**
- `title`
- `shortDescription`
- `description`
- `category`
- `difficulty` = `beginner | intermediate | advanced`
- `price`
- **`image`** – required. Either:
  - Upload as file (`multipart/form-data` with `-F "image=@file.jpg"`), OR
  - Provide as text URL (`-F "image=https://..."`)

**Important:** The `createdBy` field is set automatically from the authenticated user and must **not** be provided by the client.

**Example multipart fields:**
```text
title=React Masterclass
shortDescription=Complete React learning path
description=A complete course covering React fundamentals, hooks, routing, and project structure.
category=frontend
difficulty=beginner
price=49.99
image=@./react-masterclass.png
```

**Example JSON-body (when using image URL):**
```json
{
  "title": "React Masterclass",
  "shortDescription": "Complete React learning path",
  "description": "A complete course covering React fundamentals, hooks, routing, and project structure.",
  "category": "frontend",
  "difficulty": "beginner",
  "price": 49.99,
  "image": "https://example.com/react-masterclass.jpg"
}
```

**Error responses:**
- `400` if neither file nor URL is provided
- `400` if validation fails (invalid URL format, missing other fields, etc.)
- `401` if not authenticated
- `403` if insufficient permissions (admin-only later)

### `PATCH /api/v1/courses/:id`
Update a course.

Content-Type: `multipart/form-data`

Example multipart fields:
```text
title=Updated React Masterclass
price=59.99
difficulty=intermediate
image=@./updated-react-masterclass.png
```

Example JSON-style partial body when no file is uploaded:
```json
{
  "title": "Updated React Masterclass",
  "price": 59.99,
  "difficulty": "intermediate"
}
```

### `DELETE /api/v1/courses/:id`
Delete a course.

Example response:
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": {
    "_id": "680a10000000000000000011",
    "title": "React Masterclass"
  },
  "meta": null
}
```

## Admin Endpoints

These routes are mounted under `/api/v1/admin`.

### `GET /api/v1/admin/modules`
List all modules for admin management.

Example request:
```http
GET /api/v1/admin/modules?search=node&page=1&limit=20
```

### `PATCH /api/v1/admin/modules/:id`
Update any module as admin.

Content-Type: `application/json`

Example payload:
```json
{
  "title": "Admin Updated Module Title",
  "price": 24.99
}
```

### `DELETE /api/v1/admin/modules/:id`
Delete any module as admin.

### `GET /api/v1/admin/courses`
List all courses for admin management.

### `GET /api/v1/admin/users`
List all users.

Example response:
```json
{
  "success": true,
  "message": "All users retrieved",
  "data": {
    "users": [
      {
        "_id": "680a10000000000000000021",
        "uid": "firebase_uid_1",
        "email": "admin@example.com",
        "displayName": "Admin User",
        "role": "ADMIN",
        "emailVerified": true
      }
    ]
  },
  "meta": null
}
```

## Course-Module Endpoints

These routes are mounted under `/api/v1/coursemodule`.

### Simplified Endpoints

### `GET /api/v1/coursemodule/courses/:courseId/modules`
Get all linked modules for a course.

Example response:
```json
{
  "success": true,
  "message": "Course modules retrieved successfully",
  "data": [
    {
      "module": {
        "_id": "680a10000000000000000001",
        "title": "React Basics"
      },
      "order": 0
    }
  ],
  "meta": null
}
```

### `GET /api/v1/coursemodule/modules/:moduleId/courses`
Get all linked courses for a module.

Example response:
```json
{
  "success": true,
  "message": "Module courses retrieved successfully",
  "data": [
    {
      "course": "680a10000000000000000011",
      "order": 0
    }
  ],
  "meta": null
}
```

### `POST /api/v1/coursemodule/courses/:courseId/modules`
Link one module or many modules to a course.

Single-link payload:
```json
{
  "moduleId": "680a10000000000000000001",
  "order": 0
}
```

Batch-link payload:
```json
{
  "modules": [
    {
      "moduleId": "680a10000000000000000001",
      "order": 0
    },
    {
      "moduleId": "680a10000000000000000002",
      "order": 1
    }
  ]
}
```

### `DELETE /api/v1/coursemodule/courses/:courseId/modules/:moduleId`
Unlink one module from a course.

Example response:
```json
{
  "success": true,
  "message": "Module unlinked from course successfully",
  "data": null,
  "meta": null
}
```

### `DELETE /api/v1/coursemodule/courses/:courseId/modules`
Batch unlink modules from a course.

Example payload:
```json
{
  "moduleIds": [
    "680a10000000000000000001",
    "680a10000000000000000002"
  ]
}
```

### Legacy Compatibility Endpoints

### `POST /api/v1/coursemodule/link`
Legacy single-link endpoint.

Example payload:
```json
{
  "courseId": "680a10000000000000000011",
  "moduleId": "680a10000000000000000001",
  "order": 0
}
```

### `POST /api/v1/coursemodule/batch/link`
Legacy batch-link endpoint.
**Returns:** 201 Created

Example payload:
```json
{
  "courseId": "680a10000000000000000011",
  "modules": [
    {
      "moduleId": "680a10000000000000000001",
      "order": 0
    },
    {
      "moduleId": "680a10000000000000000002",
      "order": 1
    }
  ]
}
```

### `POST /api/v1/coursemodule/batch/unlink/:courseId`
Legacy batch-unlink endpoint.

Example payload:
```json
{
  "moduleIds": [
    "680a10000000000000000001",
    "680a10000000000000000002"
  ]
}
```

## Validation Summary

### Module create body
```json
{
  "title": "string, min 3",
  "shortDescription": "string, min 10",
  "description": "string, min 20",
  "category": "string, min 2",
  "price": 0,
  "image": "valid URL"
}
```

### Course create body
```json
{
  "title": "string, min 3",
  "shortDescription": "string, min 10",
  "description": "string, min 20",
  "category": "string, required",
  "difficulty": "beginner | intermediate | advanced, required",
  "price": "number, >= 0, required",
  "image": "string (valid URL) or multipart file upload"
}
```
**Note:** `createdBy` is set automatically from the authenticated user and should NOT be provided by the client.

### Course-module single link body
```json
{
  "moduleId": "string",
  "order": 0
}
```

### Course-module batch link body
```json
{
  "modules": [
    {
      "moduleId": "string",
      "order": 0
    }
  ]
}
```

### Course-module batch unlink body
```json
{
  "moduleIds": [
    "string"
  ]
}
```
