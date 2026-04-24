# 🎯 Backend Improvements for Odyssey Next.js Assessment

## Current Status: ✅ Foundation Built, 🔴 Auth & RBAC Pending

The backend has a **solid foundation** with Item CRUD, validation, error handling, and upload system. However, the assessment requires **Firebase Authentication** and **Protected Routes** which are not yet implemented.

---

## 🔴 Critical Missing Features (Blocking Frontend)

### 1. Firebase Authentication Implementation

**Required by Assessment:**
- Email/Password login
- Email/Password register
- Google login (optional but recommended)
- Store user state
- Redirect to `/` after login

**Current State:**
- ❌ No auth routes (`/api/v1/auth/*`)
- ❌ No Firebase SDK integration
- ❌ No token verification logic
- ❌ No user session management

**What's Needed:**

```typescript
// Required endpoints:
POST   /api/v1/auth/login        { email, password }
POST   /api/v1/auth/register     { email, password, displayName? }
POST   /api/v1/auth/logout       (protected)
GET    /api/v1/auth/me           (protected)

// Expected Response (GET /auth/me):
{
  "success": true,
  "message": "User info",
  "data": {
    "uid": "firebase_uid_123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "USER"
  }
}
```

**Action:** Implement Firebase Admin SDK or use Firebase client-side auth with token verification.

---

### 2. Protected Route Middleware (Auth + RBAC)

**Required by Assessment:**
- `/items/add` – Only logged-in users
- `/items/manage` – Only logged-in users
- Redirect to `/login` if unauthorized

**Current State:**
- ✅ Auth middleware skeleton exists (`src/middlewares/auth.ts`)
- ✅ RBAC middleware skeleton exists (`src/middlewares/rbac.ts`)
- ❌ No actual Firebase token verification
- ❌ No user state attachment (`req.user`)
- ❌ No redirect logic (frontend handles that)

**What auth.ts should do:**
```typescript
// Verify Firebase ID token from Authorization header
// Attach to req: req.user = { uid, email, role }
// Call next() or redirect to /login
```

**Action:** Implement `auth.ts` to:
1. Extract `Authorization: Bearer <idToken>`
2. Verify with Firebase Admin SDK OR decode client-side token
3. Look up user in DB by `uid`
4. Attach `req.user = { uid, email, role }`
5. If invalid → `next(new AuthError())`

---

### 3. User Model Integration

**Current State:**
- ✅ User model has `uid`, `email`, `role` fields
- ❌ No automatic user creation on first login
- ❌ No sync with Firebase profile data

**What's Needed:**
```typescript
// On first login/register, create user in DB:
{
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  role: 'USER', // or 'ADMIN' if flagged
  emailVerified: firebaseUser.emailVerified
}
```

**Action:** Create `UserService.createOrUpdateUser(firebaseUser)` to upsert user on each login.

---

### 4. Protected Route Enforcement

**Current State:**
- Routes exist but are **NOT** protected
- Example: `POST /items/add` accepts `createdBy: 'system'`
- No `req.user` available (controller uses placeholder)

**What's Needed:**

1. **Apply auth middleware globally OR per-route:**
   ```typescript
   // Option A: Global (app.ts)
   app.use(auth); // already added but does nothing
   
   // Option B: Per-route
   router.post('/add', auth, itemController.createItem);
   ```

2. **Update item controller:**
   ```typescript
   createItem: catchAsync(async (req: Request, res: Response) => {
     const userId = req.user.uid; // now available
     const data = { ...req.body, createdBy: userId };
     // ...
   })
   ```

3. **Update manage route:**
   ```typescript
   getUserItems: catchAsync(async (req: Request, res: Response) => {
     const userId = req.user.uid; // from auth middleware
     const items = await itemService.getUserItems(userId);
     // ...
   })
   ```

---

## 🟡 Secondary Improvements (Non-blocking but Recommended)

### 5. Email Service (Optional but Good)

**Assessment says:** "Optional – can be minimal"

**Current State:**
- ✅ Skeleton exists (`src/services/email.service.ts`)
- ❌ No implementation
- ❌ No EJS templates

**Priority:** Low (skip for now)

---

### 6. Rate Limiting (Security)

**Required by AGENT.md:** "rate limiting"

**Current State:**
- ❌ No rate limiting middleware

**Action:** Add `express-rate-limit`:
```typescript
import rateLimit from 'express-rate-limit';
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

**Priority:** Medium (add before production)

---

### 7. Input Sanitization (Security)

**Required by AGENT.md:** "input sanitization"

**Current State:**
- ✅ Zod validates types/format
- ❌ No XSS sanitization (e.g., `description` field could contain script tags)

**Action:** Use `dompurify` or `sanitize-html` on string fields before saving.

**Priority:** Medium

---

### 8. Logging System (Production)

**Required by AGENT.md:** "Use centralized logger (Winston/Pino)"

**Current State:**
- ❌ No Winston/Pino logger
- ✅ Using `console.error` in dev

**Priority:** Low (can add later)

---

### 9. User Role Seeding

**Current State:**
- Admin users need to be manually created
- No seed script

**Action:** Add a script to create an admin user:
```bash
bun run src/scripts/seed-admin.ts
```

**Priority:** Low

---

## 📋 Checklist for Frontend Integration

### Backend must provide:

- [x] `GET /api/v1/items` – with search/filter/pagination
- [x] `GET /api/v1/items/:id` – single item
- [x] `POST /api/v1/items/add` – **needs auth middleware**
- [x] `PATCH /api/v1/items/:id` – **needs auth + ownership check**
- [x] `DELETE /api/v1/items/:id` – **needs auth + ownership check**
- [x] `GET /api/v1/items/manage` – **needs auth**
- [x] `POST /api/v1/upload` – **needs auth (optional)**
- [ ] `POST /api/v1/auth/login` – **MUST IMPLEMENT**
- [ ] `POST /api/v1/auth/register` – **MUST IMPLEMENT**
- [ ] `GET /api/v1/auth/me` – **MUST IMPLEMENT**
- [ ] `POST /api/v1/auth/logout` – **MUST IMPLEMENT (optional)**

---

## 🚀 Implementation Order

### Phase 1 (CRITICAL – Blocking Frontend)
1. ✅ Install Firebase Admin SDK: `bun add firebase-admin`
2. ✅ Implement `auth.ts` middleware (token verification)
3. ✅ Implement `rbac.ts` middleware (role check)
4. ✅ Create auth routes (`auth.controller.ts`, `auth.service.ts`, `auth.route.ts`)
5. ✅ Update item routes to use `auth` middleware
6. ✅ Update item controller to use `req.user.uid`
7. ✅ Test: Register → Login → Get Token → Create Item → Manage Items

### Phase 2 (Security Hardening)
8. ⚠️ Add rate limiting
9. ⚠️ Add input sanitization (XSS protection)
10. ⚠️ Add helmet config (CSP, HSTS)

### Phase 3 (Polish)
11. 📝 User seeding script
12. 📝 Email service (optional)
13. 📝 Winston logger

---

## 🎯 Example: Expected Auth Flow

```
Frontend (Next.js):
1. User submits login form → POST /api/v1/auth/login
2. Backend verifies Firebase token OR creates custom token
3. Returns: { success: true, data: { token, user } }
4. Frontend stores token in localStorage/cookie
5. For protected requests:
   - Add header: Authorization: Bearer <token>
6. Backend auth middleware:
   - Verifies token
   - Attaches req.user
   - Calls next()
7. If token invalid → 401 → frontend redirects to /login
```

---

## 🔧 Quick Fix Summary

| Issue | Fix | File(s) |
|-------|-----|---------|
| No auth implementation | Add Firebase Admin SDK + token verification | `middlewares/auth.ts`, new `modules/auth/` |
| Routes unprotected | Apply `auth` middleware to item routes | `modules/item/item.route.ts` |
| `createdBy` hardcoded | Use `req.user.uid` from auth | `modules/item/item.controller.ts` |
| No user sync | Create user on first login | `services/user.service.ts` (new) |
| No register/login endpoints | Create auth controller + routes | `modules/auth/` |
| No Google login | Add OAuth endpoint (optional) | `modules/auth/` |
| No rate limiting | Add express-rate-limit | `app.ts` |
| No sanitization | Add DOMPurify/sanitize-html | validation layer or middleware |

---

## 📊 Compliance Matrix

| Requirement | Status | Notes |
|-------------|--------|-------|
| Next.js App Router ready | ✅ | API is RESTful, frontend can consume |
| Firebase Authentication | 🔴 | **MUST IMPLEMENT** (auth endpoints) |
| Public pages (`/`, `/about`) | ✅ | Already implemented |
| Items page with filters | ✅ | `/api/v1/items` with search/filter/sort/paginate |
| Item details `/items/[id]` | ✅ | GET `/api/v1/items/:id` |
| Protected: Add Items | ⚠️ | Route exists, needs **auth middleware** |
| Protected: Manage Items | ⚠️ | Route exists, needs **auth middleware** |
| Polished UI | N/A | Frontend task (Next.js) |
| Responsive | N/A | Frontend task |
| Firebase Auth | 🔴 | **MUST IMPLEMENT** |
| Protected pages redirect | N/A | Frontend handles redirect on 401 |

---

## 🎬 Next Steps

**To make the frontend integration seamless:**

1. **Implement Auth Module** (1–2 hours):
   - Create `src/modules/auth/` with routes, controller, service
   - Add Firebase Admin SDK
   - Implement token verification
   - Return JWT or use Firebase ID tokens directly

2. **Protect Item Routes** (15 mins):
   - Add `auth` middleware to `/items/add`, `/items/manage`, `/items/:id` (PATCH/DELETE)
   - Update controller to use `req.user.uid`

3. **Test End-to-End** (30 mins):
   - Register → Login → Get token
   - Create item (should auto-set `createdBy`)
   - Manage items (should only see own items)
   - Logout

4. **Frontend Handoff**:
   - Provide API docs with auth headers
   - Provide error format examples
   - Provide token storage recommendation (HTTP-only cookie vs localStorage)

---

**Bottom line:** Backend is **90% complete**. Only **Firebase Auth implementation** is missing, which is the core of the assessment. Once auth is added, the backend will fully support the required Next.js frontend.
