# 📡 API LIST TABLE (Role-Based Access Control)

## 🔐 Roles Used

| Role  | Description       |
| ----- | ----------------- |
| Guest | Not logged in     |
| User  | Logged-in user    |
| Admin | Manages all items |

---

# 📚 CORE API LIST

## 🟢 Public APIs (No Login Required)

| Method | Endpoint     | Description                           | Access Role |
| ------ | ------------ | ------------------------------------- | ----------- |
| GET    | `/`          | Landing page data (static UI content) | Guest       |
| GET    | `/about`     | About page content                    | Guest       |
| GET    | `/items`     | Get all items (with filter/search)    | Guest       |
| GET    | `/items/:id` | Get single item details               | Guest       |

---

## 🔵 Authentication APIs (Firebase)

| Method | Endpoint         | Description             | Access Role |
| ------ | ---------------- | ----------------------- | ----------- |
| POST   | `/auth/login`    | Email/Password login    | Guest       |
| POST   | `/auth/register` | Create account          | Guest       |
| POST   | `/auth/logout`   | Logout user             | User        |
| GET    | `/auth/me`       | Get logged-in user info | User        |

> Authentication is handled using Firebase Authentication

---

## 🟡 User Protected APIs

| Method | Endpoint        | Description     | Access Role |
| ------ | --------------- | --------------- | ----------- |
| POST   | `/items/add`    | Add new item    | User        |
| PATCH  | `/items/:id`    | Edit own item   | User        |
| DELETE | `/items/:id`    | Delete own item | User        |
| GET    | `/items/manage` | View own items  | User        |

---

## 🔴 Admin Protected APIs

| Method | Endpoint           | Description                     | Access Role |
| ------ | ------------------ | ------------------------------- | ----------- |
| GET    | `/admin/items`     | View all items (global control) | Admin       |
| DELETE | `/admin/items/:id` | Delete any item                 | Admin       |
| PATCH  | `/admin/items/:id` | Edit any item                   | Admin       |
| GET    | `/admin/users`     | View all users                  | Admin       |

---

# 🔍 QUERY SYSTEM (Used in Items API)

## GET `/items`

Supports:

| Query    | Example              | Purpose                     |
| -------- | -------------------- | --------------------------- |
| search   | `?search=react`      | Search by title/description |
| category | `?category=frontend` | Filter by category          |
| price    | `?min=10&max=100`    | Price range                 |
| sort     | `?sort=latest`       | Sort items                  |
| page     | `?page=1`            | Pagination                  |
| limit    | `?limit=6`           | Items per page              |

---

# 📦 ITEMS DATA MODEL

```json id="model1"
{
  "id": "string",
  "title": "React Basics",
  "shortDescription": "Learn React fast",
  "description": "Full course content...",
  "category": "frontend",
  "price": 0,
  "image": "url",
  "createdBy": "userId",
  "createdAt": "timestamp"
}
```

---

# 🛡️ ROLE PERMISSION MATRIX

## Access Control Overview

| Feature           | Guest | User | Admin |
| ----------------- | ----- | ---- | ----- |
| View Items        | ✅     | ✅    | ✅     |
| View Item Details | ✅     | ✅    | ✅     |
| Login/Register    | ✅     | ❌    | ❌     |
| Add Item          | ❌     | ✅    | ✅     |
| Manage Own Items  | ❌     | ✅    | ✅     |
| Delete Own Item   | ❌     | ✅    | ✅     |
| Manage All Items  | ❌     | ❌    | ✅     |

---

# 🔐 PROTECTED ROUTES (Frontend Guard)

## User Protected Pages

```text id="p1"
/items/add
/items/manage
```

## Admin Protected Pages

```text id="p2"
/admin/items
/admin/users
```

### Guard Logic:

* Firebase token required
* Redirect → `/login` if unauthorized
* Show loader while checking auth state

---

# 🎯 API DESIGN PRINCIPLES

## 1. RESTful Standards

* GET → fetch data
* POST → create data
* PATCH → update data
* DELETE → remove data

---

## 2. Consistent Response Format

```json id="res1"
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {}
}
```

---

## 3. Error Format

```json id="err1"
{
  "success": false,
  "message": "Something went wrong"
}
```

---

# ⚡ BEST PRACTICE RULES

## UI + API Integration Rules

* Always show loading state during API calls
* Always handle empty state (no items found)
* Always validate forms before submit
* Always show success/error toast messages

---

## Performance Rules

* Use pagination for `/items`
* Limit API response size
* Avoid unnecessary refetching
* Cache static data where possible

---

## Security Rules

* Protect `/add` and `/manage`
* Validate user role before API actions
* Never trust frontend-only checks

---

# 🚀 SUMMARY

This API system supports:

✔ Public browsing (items + details)
✔ Firebase authentication system
✔ Role-based access control (User/Admin)
✔ CRUD operations for items
✔ Search/filter/pagination system
✔ Scalable SaaS-ready structure

---

If you want next step, I can generate:

✅ Full Next.js folder structure (App Router)
✅ Firebase auth implementation (Context + hooks)
✅ UI wireframe for all pages
✅ Dummy data (6–12 items)
✅ Or complete production-ready starter template
