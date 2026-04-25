# StudyVault API — Quick Reference

## Base URL
```
http://localhost:5000
```

## Authentication

### Local Email/Password (Session-based)
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123","displayName":"User"}'

# Login (sets session cookie)
curl -c cookies.txt -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123"}'

# Access protected routes using cookies
curl -b cookies.txt http://localhost:5000/api/v1/auth/me

# Logout
curl -b cookies.txt -X POST http://localhost:5000/api/v1/auth/logout
```

### Firebase / Google OAuth (Bearer Token)
```bash
# Frontend obtains Firebase ID token after Google sign-in
# Send token to backend to create session or just use Bearer token
curl -X POST http://localhost:5000/api/v1/auth/firebase \
  -H "Content-Type: application/json" \
  -d '{"idToken":"<FIREBASE_ID_TOKEN>"}'
```

**Protected endpoints** accept either a session cookie **or** an `Authorization: Bearer <token>` header.

---

### Password Reset (Local accounts only)

```bash
# 1. Request reset link (sends email)
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# 2. Reset password using token from email
curl -X POST http://localhost:5000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","token":"<token_from_email>","newPassword":"NewPass123","confirmPassword":"NewPass123"}'
```

**Notes:**
- Only works for local email/password accounts (not Firebase).
- Reset token expires in 1 hour.
- In development, the `forgot-password` response includes `meta.token` for testing (omitted in production).

---

## Course Creation (Image Required!)

**Note:** `createdBy` is automatically set from the authenticated user; do NOT provide it in the request.

### With File Upload (Cloudinary)
```bash
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Authorization: Bearer <token_or_session>" \
  -F "title=My Course" \
  -F "shortDescription=At least 10 chars description" \
  -F "description=At least 20 chars full description here for validation." \
  -F "category=development" \
  -F "difficulty=beginner" \
  -F "price=19.99" \
  -F "image=@/path/to/image.png"
```

### With Image URL
```bash
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Authorization: Bearer <token>" \
  -F "title=My Course" \
  -F "shortDescription=..." \
  -F "description=..." \
  -F "category=development" \
  -F "difficulty=intermediate" \
  -F "price=29.99" \
  -F "image=https://example.com/image.jpg"
```

**Important:** `image` is **required**. Omitting it returns `400`.

---

## Module Creation (Image Required)

```bash
curl -X POST http://localhost:5000/api/v1/modules/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Module",
    "shortDescription": "At least 10 characters minimum for validation",
    "description": "At least 20 characters minimum for full description validation purposes.",
    "category": "backend",
    "price": 9.99,
    "image": "https://example.com/image.jpg"
  }'
```

---

## Course-Module Linking

### Simplified Endpoints (Admin Required)
```bash
# Link module to course (push module ID to course's modules array)
curl -X POST http://localhost:5000/api/v1/courses/:courseId/link/:moduleId \
   -H "Authorization: Bearer <token>"

# Unlink module from course (remove module ID from course's modules array)
curl -X DELETE http://localhost:5000/api/v1/courses/:courseId/unlink/:moduleId \
   -H "Authorization: Bearer <token>"

# Get all modules linked to a course
curl http://localhost:5000/api/v1/courses/:courseId/modules
   -H "Authorization: Bearer <token>"
```

---

## Admin Endpoints

**All admin routes require `Authorization: Bearer <ADMIN_TOKEN>` or admin session.**

```bash
# All modules
curl http://localhost:5000/api/v1/admin/modules

# All courses
curl http://localhost:5000/api/v1/admin/courses

# All users
curl http://localhost:5000/api/v1/admin/users

# Update any module
curl -X PATCH http://localhost:5000/api/v1/admin/modules/:id \
  -H "Content-Type: application/json" -d '{"price":19.99}'

# Delete any module
curl -X DELETE http://localhost:5000/api/v1/admin/modules/:id
```

---

## Validation Rules

| Field | Type | Constraint |
|-------|------|------------|
| `title` | string | min 3 chars |
| `shortDescription` | string | min 10 chars |
| `description` | string | min 20 chars |
| `category` | string | required |
| `difficulty` | enum | `beginner` \| `intermediate` \| `advanced` |
| `price` | number | ≥ 0 |
| `image` | string (URL) | **required**, valid URL format |
| `createdBy` | — | **Do NOT send** — set automatically from authenticated user |

---

## Response Format
```json
{
  "success": true|false,
  "message": "Human readable message",
  "data": { ... } | [ ... ] | null,
  "meta": null
}
```

---

## Status Code Summary

| Code | Meaning |
|------|---------|
| `200` | OK (GET/PATCH/DELETE success) |
| `201` | Created (POST success) |
| `400` | Bad Request (validation error, missing image) |
| `401` | Unauthorized (missing or invalid credentials) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found (invalid ID or resource doesn't exist) |
| `429` | Too Many Requests (rate limit exceeded) |

---

## Common Errors

### 401 — Authentication required
```json
{
  "success": false,
  "message": "No valid authentication provided",
  "data": null,
  "meta": null
}
```
**Fix:** Include a valid session cookie or Bearer token.

### 403 — Insufficient permissions
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "data": null,
  "meta": null
}
```
**Fix:** Ensure you have the required role (USER or ADMIN) for the endpoint.

### 400 — Image is required
```json
{
  "success": false,
  "message": "Image is required: provide an image URL in the \"image\" field or upload an image file",
  "data": null,
  "meta": null
}
```
**Fix:** Include `-F "image=@file.png"` OR `-F "image=https://..."`

### 400 — Zod validation errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Invalid input: expected string, received undefined"
  ]
}
```
**Fix:** Check all required fields meet min-length constraints.

### 400 — Invalid ObjectId
```json
{
  "success": false,
  "message": "Invalid _id: bad-id"
}
```
**Fix:** Use valid 24-char hex MongoDB ID.

---

## Rate Limits

| Scope | Window | Limit |
|-------|--------|-------|
| Global (all) | 15 min | 100 requests |
| Item ops (create/update/delete) | 1 hour | 30 requests |
| Auth endpoints | 1 hour | 5 requests |

---

## Tested & Verified

✅ All core endpoints working  
✅ Local email/password registration & login (session)  
✅ Firebase/Google OAuth (idempotent register/login)  
✅ Role-based access control (RBAC)  
✅ File upload → Cloudinary integration  
✅ Image URL direct storage  
✅ Validation & error handling  
✅ Course-Module linking (modern + legacy)  
✅ Admin operations protected  
✅ Password hashing with bcrypt  
✅ Session management with MongoDB  
✅ CreatedBy automatically set from authenticated user  

**Server logs:** `logs/combined.log`  
**Full docs:** `API_LIST.md`, `README.md`
