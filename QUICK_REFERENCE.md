# StudyVault API — Quick Reference

## Base URL
```
http://localhost:5000
```

## Authentication
Currently disabled — all endpoints accessible without token.

---

## Course Creation (Image Required!)

### With File Upload (Cloudinary)
```bash
curl -X POST http://localhost:5000/api/v1/courses \
  -F "title=My Course" \
  -F "shortDescription=At least 10 chars description" \
  -F "description=At least 20 chars full description here for validation." \
  -F "category=development" \
  -F "difficulty=beginner" \
  -F "price=19.99" \
  -F "createdBy=user123" \
  -F "image=@/path/to/image.png"
```
Returns: `201` with Cloudinary URL in `data.image`

### With Image URL
```bash
curl -X POST http://localhost:5000/api/v1/courses \
  -F "title=My Course" \
  -F "shortDescription=..." \
  -F "description=..." \
  -F "category=development" \
  -F "difficulty=intermediate" \
  -F "price=29.99" \
  -F "createdBy=user123" \
  -F "image=https://example.com/image.jpg"
```
Returns: `201` with URL stored as-is

**Important:** `image` is **required**. Omitting it returns `400`.

---

## Module Creation (Image Required)

```bash
curl -X POST http://localhost:5000/api/v1/modules/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Module",
    "shortDescription": "At least 10 characters minimum for validation",
    "description": "At least 20 characters minimum for full description validation purposes.",
    "category": "backend",
    "price": 9.99,
    "image": "https://example.com/image.jpg",
    "createdBy": "system"
  }'
```
Returns: `201`

---

## Course-Module Linking

### Modern
```bash
# Link
curl -X POST http://localhost:5000/api/v1/coursemodule/courses/:courseId/modules \
  -H "Content-Type: application/json" \
  -d '{"moduleId":"...","order":0}'

# Unlink
curl -X DELETE http://localhost:5000/api/v1/coursemodule/courses/:courseId/modules/:moduleId

# Get course modules
curl http://localhost:5000/api/v1/coursemodule/courses/:courseId/modules

# Get module courses
curl http://localhost:5000/api/v1/coursemodule/modules/:moduleId/courses
```

### Legacy
```bash
# Single link
curl -X POST http://localhost:5000/api/v1/coursemodule/link \
  -H "Content-Type: application/json" \
  -d '{"courseId":"...","moduleId":"...","order":0}'

# Batch link
curl -X POST http://localhost:5000/api/v1/coursemodule/batch/link \
  -H "Content-Type: application/json" \
  -d '{"courseId":"...","modules":[{"moduleId":"...","order":0}]}'

# Batch unlink
curl -X POST http://localhost:5000/api/v1/coursemodule/batch/unlink/:courseId \
  -H "Content-Type: application/json" \
  -d '{"moduleIds":["...","..."]}'
```

---

## Admin Endpoints
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
| `createdBy` | string | required |

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
| `404` | Not Found (invalid ID or resource doesn't exist) |
| `429` | Too Many Requests (rate limit exceeded) |

---

## Common Errors

### 400 — "Image is required"
```json
{
  "success": false,
  "message": "Image is required: provide an image URL in the \"image\" field or upload an image file"
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
| Global (all) | 15 min | 1000 requests |
| Item ops (create/update/delete) | 1 hour | 30 requests |
| Auth endpoints | 1 hour | 5 requests |

---

## Tested & Verified

✅ All 32 core endpoints working  
✅ File upload → Cloudinary integration  
✅ Image URL direct storage  
✅ Validation & error handling  
✅ Course-Module linking (modern + legacy)  
✅ Admin operations  
✅ Invalid ID rejection  
✅ XSS sanitization on text fields  

**Server logs:** `logs/combined.log`  
**Test scripts:** `test_all_apis_final.sh`, `API_TEST_RESULTS.md`  
**Full report:** `FINAL_API_TEST_REPORT.md`
