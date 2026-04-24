# API List

Base URL: `http://localhost:5000`

Notes:
- All API routes currently return the standard shape: `success`, `message`, `data`, `meta`
- `auth` and `rbac` middleware are wired on some routes, but their implementations are still placeholders
- Course create/update uses `multipart/form-data` because image upload is handled there
- There is no standalone `/api/v1/upload` endpoint

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
Create a module.

Content-Type: `application/json`

Example payload:
```json
{
  "title": "Node.js Fundamentals",
  "shortDescription": "Master Node.js runtime basics",
  "description": "Learn the event loop, streams, buffers, modules, and how to build backend services with Node.js.",
  "category": "backend",
  "price": 29.99,
  "image": "https://example.com/nodejs-fundamentals.jpg"
}
```

Example response:
```json
{
  "success": true,
  "message": "Module created successfully",
  "data": {
    "_id": "680a10000000000000000002",
    "title": "Node.js Fundamentals",
    "shortDescription": "Master Node.js runtime basics",
    "description": "Learn the event loop, streams, buffers, modules, and how to build backend services with Node.js.",
    "category": "backend",
    "price": 29.99,
    "image": "https://example.com/nodejs-fundamentals.jpg",
    "createdBy": "system"
  },
  "meta": null
}
```

### `PATCH /api/v1/modules/:id`
Update a module.

Content-Type: `application/json`

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
Create a course.

Content-Type: `multipart/form-data`

Required fields:
- `title`
- `shortDescription`
- `description`
- `category`
- `difficulty` = `beginner | intermediate | advanced`
- `price`
- `createdBy`

Optional:
- `image` as text URL
- `image` as uploaded file

Example multipart fields:
```text
title=React Masterclass
shortDescription=Complete React learning path
description=A complete course covering React fundamentals, hooks, routing, and project structure.
category=frontend
difficulty=beginner
price=49.99
createdBy=admin_uid
image=@./react-masterclass.png
```

Equivalent text-body example if using an image URL instead of a file:
```json
{
  "title": "React Masterclass",
  "shortDescription": "Complete React learning path",
  "description": "A complete course covering React fundamentals, hooks, routing, and project structure.",
  "category": "frontend",
  "difficulty": "beginner",
  "price": 49.99,
  "image": "https://example.com/react-masterclass.jpg",
  "createdBy": "admin_uid"
}
```

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
  "category": "string",
  "difficulty": "beginner | intermediate | advanced",
  "price": 0,
  "image": "valid URL, optional",
  "createdBy": "string"
}
```

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
