# 📚 StudyVault Backend API

A production-ready REST API built with **TypeScript + Express.js + Bun** for the *StudyVault* learning platform.

This backend provides secure, scalable, and modular APIs for managing **courses and learning modules** with filtering, file uploads, and comprehensive security hardening.

**Tech Stack:** TypeScript • Bun • Express.js • Mongoose • Zod • Helmet • CORS • Winston • Rate Limiting • Cloudinary

---

## 🚀 Features

### Core Features
- ✅ Courses & Modules CRUD (Create, Read, Update, Delete)
- ✅ Advanced Search, Filter, Sort, Pagination
- ⚠️ Role-Based Access Control (RBAC middleware ready, auth not implemented)
- ⚠️ Firebase Auth-ready middleware (auth not implemented)
- ✅ Cloud image upload & deletion (Cloudinary)
- ✅ Centralized error handling (Zod, Mongoose, Multer)
- ✅ Input sanitization (XSS protection)
- ✅ Rate limiting (brute-force protection)
- ✅ Centralized logging (Winston)
- ✅ Production security hardening
- ✅ Scalable modular architecture
- ✅ Course-Module linking (many-to-many)

---

## 🧠 Architecture Highlights

- **Clean layered architecture**: Route → Controller → Service → Repository → Database
- **Single Responsibility**: Each layer has exactly one job
- **Centralized utilities**: `catchAsync`, `sendResponse`, `ApiFeatures`, `errorFormatter`
- **Security middleware**: Helmet, CORS, rate limiting, sanitization
- **Cloudinary integration**: Upload, transform, delete images
- **Validation layer**: Zod schemas with simplified error messages
- **Centralized logging**: Winston logger with file + console transports
- **Production-grade**: Error handling, security, monitoring ready

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
   # Server
   PORT=5000
   NODE_ENV=development
   
   # MongoDB
   MONGO_URI=mongodb://localhost:27017/studyvault
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # CORS (optional, default: * for dev)
   CORS_ORIGIN=*
   
   # Firebase (optional - auth not yet implemented)
   # FIREBASE_PROJECT_ID=your_firebase_project_id
   # FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   # FIREBASE_PRIVATE_KEY=your_firebase_private_key
   ```

---

## 🚀 Usage Instructions

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

### Seed Admin User (Optional)
```bash
bun run seed
```
Creates an admin user in the database (useful for testing admin endpoints).

## Verifying the Installation

Once the server is running, test the endpoints:

### Root Endpoint (Welcome Message)
```bash
curl http://localhost:5000/
```
Expected response:
```json
{
  "success": true,
  "message": "Welcome to StudyVault Backend API",
  "name": "StudyVault API",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-04-24T11:32:30.000Z",
  "endpoints": {
    "health": "/health",
    "api": "/api/v1",
    "studies": "/api/v1/studies"
  }
}
```

### Health Endpoint
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-04-24T11:30:15.123Z",
  "uptime": 123.45,
  "environment": "development",
  "system": {
    "platform": "linux",
    "arch": "x64",
    "nodeVersion": "v22.x.x",
    "memory": { "used": "10.50 MB", "total": "20.00 MB" },
    "pid": 12345
  }
}
```

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
| **Helmet** | Security headers (CSP, HSTS) |
| **CORS** | Cross-origin resource sharing |
| **Morgan** | HTTP request logging (piped to Winston) |
| **Winston** | Centralized structured logging |
| **express-rate-limit** | Rate limiting (brute-force protection) |
| **dompurify** | XSS sanitization |
| **Cloudinary** | Image upload & CDN |
| **Multer** | Multipart form data parsing |
| **Nodemon** | Development auto-reload |

---

# 📁 Project Structure

```text
src/
 ├── app.ts                          # Express app setup & middleware
 ├── server.ts                       # Server entry point (Bun runtime)
 ├── config/
 │    ├── db.ts                      # MongoDB connection
 │    ├── env.ts                     # Environment variables
 │    └── cloudinary.ts              # Cloudinary config (image CDN)
 ├── middlewares/
 │    ├── auth.ts                    # Firebase auth middleware
 │    ├── rbac.ts                    # Role-based access control
 │    ├── upload.ts                  # Multer file upload middleware
 │    ├── validation.ts              # Zod validation middleware
 │    └── errorHandler.ts            # Centralized error handler
 ├── utils/
 │    ├── ApiFeatures.ts             # Query engine (search, filter, sort, paginate)
 │    ├── AppError.ts                # Custom error class
 │    ├── catchAsync.ts              # Async error wrapper HOF
 │    ├── errorFormatter.ts          # Zod & error formatting utilities
 │    └── sendResponse.ts            # Standardized response utility
 ├── errors/                         # Custom error classes
 │    ├── index.ts                   # Error exports barrel file
 │    ├── AppError.ts                # Base operational error
 │    ├── MongooseError.ts           # MongoDB error helpers
 │    ├── AuthError.ts               # Authentication errors
 │    └── CloudinaryError.ts         # Cloudinary upload errors
 ├── services/
 │    ├── cloudinary.service.ts      # Cloudinary upload/delete logic
 │    └── email.service.ts           # Email service (future)
  ├── modules/
  │    ├── course/                     # Course module (CLEAN ARCHITECTURE)
  │    │    ├── course.route.ts        # Routes: GET /courses, POST /, PATCH /:id, DELETE /:id
  │    │    ├── course.controller.ts   # HTTP layer: validate input, call service, send response
  │    │    ├── course.service.ts      # Business logic layer
  │    │    ├── course.repository.ts   # Database operations (Mongoose)
  │    │    ├── course.model.ts        # Mongoose schema & model
  │    │    ├── course.types.ts        # TypeScript interfaces & utility types
  │    │    └── course.validation.ts   # Zod schemas
  │    │
  │    ├── module/                     # Module module (CLEAN ARCHITECTURE) - formerly "item"
  │    │    ├── module.route.ts        # Routes: GET /modules, POST /add, PATCH /:id, DELETE /:id
  │    │    ├── module.controller.ts   # HTTP layer
  │    │    ├── module.service.ts      # Business logic layer
  │    │    ├── module.repository.ts   # Database operations
  │    │    ├── module.model.ts        # Mongoose schema & model
  │    │    ├── module.types.ts        # TypeScript interfaces
  │    │    └── module.validation.ts   # Zod schemas
  │    │
  │    ├── coursemodule/               # Course-Module relationship (NEW)
  │    │    ├── coursemodule.route.ts  # Admin routes for linking/unlinking
  │    │    ├── coursemodule.controller.ts
  │    │    ├── coursemodule.service.ts
  │    │    ├── coursemodule.repository.ts
  │    │    ├── coursemodule.model.ts  # Join table schema
  │    │    ├── coursemodule.types.ts
  │    │    └── coursemodule.validation.ts
  │    │
  │    ├── admin/                      # Admin module (RBAC protected)
  │    │    └── admin.route.ts         # Admin routes: /admin/modules, /admin/courses, /admin/coursemodule
  │    │
  │    ├── public/                     # Public pages (no auth)
  │    │    └── public.route.ts        # Routes: / (landing), /about
  │    │
  │    └── upload/                     # File upload module
  │         └── upload.route.ts        # Routes: POST /upload, DELETE /upload/:publicId
 ├── emails/                        # Email templates (future)
 │    └── templates/                # EJS templates
 └── queue/                         # Background job queues (future)
```

---

## 🏗️ System Architecture Flow

```mermaid
graph TB
    subgraph "Client Layer"
        C1[Next.js Frontend]
        C2[Postman / curl]
    end

    subgraph "Server Layer"
        subgraph "Request Pipeline"
            R1[Helmet<br/>Security Headers]
            R2[CORS<br/>Cross-Origin]
            R3[Morgan<br/>HTTP Logging]
            R4[Auth Middleware<br/>Firebase Token Verify]
            R5[RBAC Middleware<br/>Role/Permission Check]
        end

         subgraph "Route → Controller → Service → Repository"
             H1[module.route.ts<br/>GET /api/v1/modules]
             H2[module.controller.ts<br/>HTTP Layer Only]
             H3[module.service.ts<br/>Business Logic]
             H4[module.repository.ts<br/>DB Operations]
             H5[Mongoose / MongoDB]
         end

        subgraph "Response Pipeline"
            E1[catchAsync<br/>Error Capture]
            E2[errorHandler<br/>Centralized Handler]
            E3[Zod Errors<br/>Validation]
            E4[Mongoose Errors<br/>DB Issues]
        end

        subgraph "External Services"
            S1[Cloudinary<br/>Image Upload]
            S2[Email Service<br/>Future: EJS + Queue]
        end
    end

    C1 --> R1
    R1 --> R2
    R2 --> R3
    R3 --> R4
    R4 --> R5
    R5 --> H1
    H1 --> H2
    H2 --> H3
    H3 --> H4
    H4 --> H5
    H2 -.-> E1
    E1 --> E2
    E2 --> E3
    E2 --> E4
    H2 -.-> S1
    H2 -.-> S2

    H5 --> H3
    H3 --> H2
    H2 --> C1

    S1 -.->|Upload| Cloudinary[Cloudinary CDN]
    Cloudinary -.->|Return URL| H3

    style R1 fill:#e1f5fe
    style R4 fill:#fff3e0
    style R5 fill:#fce4ec
    style H1 fill:#f1f8e9
    style H2 fill:#f3e5f8
    style H3 fill:#e8f5e8
    style H4 fill:#fff9c4
    style E2 fill:#ffebee
    style C1 fill:#e0f7fa
    style Cloudinary fill:#f9fbe7
```

---

## 🔄 Request Flow Diagrams

### 1. GET /api/v1/modules (List with Filters)

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Router
    participant Ctrl as Controller
    participant S as Service
    participant Rep as Repository
    participant M as MongoDB
    participant AF as ApiFeatures

    C->>R: GET /api/v1/modules?search=react&category=frontend&page=1
    R->>Ctrl: getAllModules(req.query)
    Ctrl->>S: getAllModules(query)
    S->>Rep: findAll(query)
    Rep->>AF: new ApiFeatures(Module.find(), query)
    AF->>AF: .search(['title','description'])
    AF->>AF: .filter()
    AF->>AF: .sort()
    AF->>AF: .paginate()
    AF->>M: buildQuery()
    M-->>AF: modules[]
    AF-->>Rep: results
    Rep-->>S: modules[]
    S-->>Ctrl: modules[]
    Ctrl->>C: 200 OK { success, data: modules, meta }
```

---

### 2. POST /api/v1/modules/add (Create with Validation)

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Router
    participant V as Validation Middleware
    participant Ctrl as Controller
    participant S as Service
    participant Rep as Repository
    participant M as MongoDB

    C->>R: POST /api/v1/modules/add<br/>{title, description, ...}
    R->>V: validate(moduleClientSchema)
    V->>V: Zod.parse(req.body)
    alt Invalid
        V-->>C: 400 { errors: ['Title must be...','...'] }
    else Valid
        V->>Ctrl: req.body (validated)
        Ctrl->>S: createModule({ ...body, createdBy: 'system' })
        S->>Rep: create(data)
        Rep->>M: insertOne()
        M-->>Rep: newModule
        Rep-->>S: IModule
        S-->>Ctrl: IModule
        Ctrl->>C: 201 { data: module }
    end
```

---

### 3. Upload Image Flow (POST /api/v1/upload)

```mermaid
graph TB
    A[Client POST /api/v1/upload<br/>multipart/form-data] --> B[Multer Middleware<br/>memoryStorage]
    B --> C{Validate?}
    C -->|Size > 5MB| D[400: File too large]
    C -->|Invalid MIME| E[400: Invalid file type]
    C -->|Valid| X[req.file.buffer]
    X --> Y[Cloudinary Service<br/>uploadImage(buffer)]
    Y --> H{Cloudinary?}
    H -->|Success| I[200 { url: secure_url }]
    H -->|Failed| J[500 CloudinaryError]
    I --> K[Client receives URL]
```

---

## 📦 Payload Examples

### Full Item Schema

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "React Masterclass",
  "shortDescription": "Learn React from zero to hero in 30 days",
  "description": "Complete React.js course covering Hooks, Context, Redux, Next.js, and best practices",
  "category": "frontend",
  "price": 49.99,
  "image": "https://res.cloudinary.com/dvlxx0b0q/image/upload/v1234567890/react-masterclass.jpg",
  "createdBy": "firebase_uid_abc123",
  "createdAt": "2026-04-24T10:00:00.000Z",
  "updatedAt": "2026-04-24T12:00:00.000Z"
}
```

---

### GET /api/v1/modules (List Response)

```json
{
  "success": true,
  "message": "Modules retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "React Masterclass",
      "shortDescription": "Learn React from zero to hero",
      "description": "Complete React.js course",
      "category": "frontend",
      "price": 49.99,
      "image": "https://...",
      "createdBy": "user_123",
      "createdAt": "2026-04-24T10:00:00Z",
      "updatedAt": "2026-04-24T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### POST /api/v1/modules/add Request

```json
{
  "title": "Node.js Fundamentals",
  "shortDescription": "Master Node.js runtime",
  "description": "Learn event loop, streams, buffers, and build REST APIs",
  "category": "backend",
  "price": 29.99,
  "image": "https://example.com/nodejs.jpg"
}
```

**Note:** `createdBy` is injected by backend from authenticated user (not provided by client).

---

### Validation Error Response (Zod)

**Input:** `{ "title": "ab", "price": -5 }`

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title must be at least 3 characters",
    "Short description must be at least 10 characters",
    "Description must be at least 20 characters",
    "Price cannot be negative"
  ],
  "data": null,
  "meta": null
}
```

---

### 404 Error Response

```json
{
  "success": false,
  "message": "Module not found",
  "data": null,
  "meta": null
}
```

---

### 409 Duplicate Key Error

```json
{
  "success": false,
  "message": "Duplicate field value: email. Please use a different value.",
  "data": null,
  "meta": null
}
```

---

### POST /api/v1/modules/add (Request Payload)

```json
{
  "title": "Node.js Fundamentals",
  "shortDescription": "Master Node.js runtime, event loop, and streams",
  "description": "Comprehensive guide to Node.js covering buffers, streams, events, and building REST APIs with Express",
  "category": "backend",
  "price": 29.99,
  "image": "https://example.com/nodejs-fundamentals.jpg"
}
```

> **Note:** `createdBy` is injected automatically from authenticated user, not provided by client.

---

### Validation Error Response (Zod Simplified)

**Failed request:** `{ "title": "ab", "price": -5 }`

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title must be at least 3 characters",
    "Short description must be at least 10 characters",
    "Description must be at least 20 characters",
    "Price cannot be negative"
  ],
  "data": null,
  "meta": null
}
```

---

### 404 Item Not Found

```json
{
  "success": false,
  "message": "Item not found",
  "data": null,
  "meta": null
}
```

---

### 409 Duplicate Key Error

```json
{
  "success": false,
  "message": "Duplicate field value: email. Please use a different value.",
  "data": null,
  "meta": null
}
```

---

## 🔐 RBAC Protection Flow

```mermaid
graph LR
    A[Incoming Request] --> B{Firebase Token<br/>Valid?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D[Attach req.user<br/>(uid, email, role)]
    D --> E{Role Check<br/>Required: USER?}
    E -->|Has Role| M[✅ Controller → Service]
    E -->|Missing Role| N[403 Forbidden]
    C --> H[errorHandler<br/>JSON Response]
    N --> H
```

---

## 📊 Data Model (ER Diagram)

```mermaid
erDiagram
    USER ||--o{ MODULE : "creates"
    USER ||--o{ COURSE : "creates"
    COURSE ||--o{ COURSE_MODULE : "contains"
    MODULE ||--o{ COURSE_MODULE : "belongs_to"
    
    USER {
        string uid PK "Firebase UID"
        string email UK
        string displayName
        string photoURL
        enum role "USER | ADMIN"
        boolean emailVerified
        datetime createdAt
        datetime updatedAt
    }
    
    MODULE {
        string _id PK
        string title
        string shortDescription
        string description
        string category
        number price
        string image
        string createdBy FK
        datetime createdAt
        datetime updatedAt
    }
    
    COURSE {
        string _id PK
        string title
        string shortDescription
        string description
        string category
        enum difficulty "beginner|intermediate|advanced"
        number price
        string image
        string createdBy FK
        datetime createdAt
        datetime updatedAt
    }
    
    COURSE_MODULE {
        string _id PK
        string courseId FK
        string moduleId FK
        number order
        datetime createdAt
        datetime updatedAt
    }
```

---

## 🔍 Query System Flow

```mermaid
graph TD
    A[Client:<br/>GET /api/v1/modules?search=react<br/>&category=frontend&page=1&limit=10] --> B[Router]
    B --> C[Controller]
    C --> D[Service]
    D --> E[Repository]
    E --> Q[ApiFeatures Builder]
     
    Q --> Q1[.search(['title','shortDescription','description'])]
    Q1 --> Q2[.filter()<br/>category, priceMin/priceMax]
    Q2 --> Q3[.sort()<br/>default: -createdAt]
    Q3 --> Q4[.paginate()<br/>page, limit]
    Q4 --> Z[MongoDB Query]
    Z --> H[Execute]
    H --> I[Response:<br/>{success, data: modules, meta}]
```

---

## 🗂️ Module Structure Pattern (Per Module)

```mermaid
graph LR
    ROUTE[Route Layer<br/>HTTP methods & URL patterns<br/>⬅️ Validation middleware] --> CTRL
    CTRL[Controller Layer<br/>✓ Receive request<br/>✓ Call service<br/>✓ Send sendResponse<br/>✗ No business logic] --> SERV
    SERV[Service Layer<br/>✓ Business logic<br/>✓ Data transformations<br/>✓ Call repository<br/>✗ No DB queries] --> REPO
    REPO[Repository Layer<br/>✓ DB operations<br/>✓ Query building<br/>✓ Mongoose interaction<br/>✗ No HTTP] --> DB[(MongoDB)]
    
    SUB --> ROUTE
    style ROUTE fill:#fff3e0
    style CTRL fill:#f3e5f5
    style SERV fill:#e8f5e8
    style REPO fill:#fff9c4
```

---

## 📊 API Quick Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Landing page |
| GET | `/about` | Public | About page |
| GET | `/health` | Public | Health check |
| GET | `/api/v1/modules` | Public | List all modules (with filters) |
| GET | `/api/v1/modules/:id` | Public | Get single module |
| POST | `/api/v1/modules/add` | User | Create new module |
| PATCH | `/api/v1/modules/:id` | User | Update own module |
| DELETE | `/api/v1/modules/:id` | User | Delete own module |
| GET | `/api/v1/modules/manage` | User | List user's modules |
| GET | `/api/v1/courses` | Public | List all courses |
| GET | `/api/v1/courses/:id` | Public | Get single course |
| POST | `/api/v1/courses` | Admin | Create new course |
| PATCH | `/api/v1/courses/:id` | Admin | Update course |
| DELETE | `/api/v1/courses/:id` | Admin | Delete course |
| GET | `/api/v1/admin/modules` | Admin | View all modules |
| PATCH | `/api/v1/admin/modules/:id` | Admin | Edit any module |
| DELETE | `/api/v1/admin/modules/:id` | Admin | Delete any module |
| POST | `/api/v1/admin/courses/:courseId/modules/:moduleId/link` | Admin | Link module to course |
| DELETE | `/api/v1/admin/courses/:courseId/modules/:moduleId/unlink` | Admin | Unlink module from course |
| GET | `/api/v1/admin/courses/:courseId/modules` | Admin | Get course modules |
| POST | `/api/v1/admin/courses/:courseId/modules/batch/link` | Admin | Batch link modules to course |
| DELETE | `/api/v1/admin/courses/:courseId/modules/batch/unlink` | Admin | Batch unlink modules from course |
| GET | `/api/v1/admin/courses` | Admin | View all courses |
| GET | `/api/v1/admin/users` | Admin | View all users |
| POST | `/api/v1/upload` | User | Upload image |
| DELETE | `/api/v1/upload/:publicId` | User | Delete image |

---

## 🎯 Key Design Decisions

1. **Separate `types.ts` per module:** Keeps interfaces reusable across model, service, controller
2. **Validation middleware:** Zod errors auto-caught & formatted by centralized errorHandler
3. **Repository pattern:** All DB queries isolated, ApiFeatures reused across modules
4. **Cloudinary centralized:** Single service file, reusable across modules
5. **Error hierarchy:** AppError → AuthError, CloudinaryError, MongooseError helpers
6. **No business logic in controllers:** Controllers only orchestrate, services handle logic
7. **Consistent response format:** Every endpoint returns `{ success, message, data, meta }`
8. **RBAC-ready:** Auth + RBAC middlewares registered globally, ready for route protection

---

This backend is **production-grade**, following strict clean architecture principles from AGENT.md.

## 🏗️ System Architecture Flow

```mermaid
graph TB
    subgraph "Client Layer"
        C1[Next.js Frontend]
        C2[Postman / curl]
    end

    subgraph "Server Layer"
        subgraph "Request Pipeline"
            R1[Helmet<br/>Security Headers]
            R2[CORS<br/>Cross-Origin]
            R3[Morgan<br/>HTTP Logging]
            R4[Auth Middleware<br/>Firebase Token Verify]
            R5[RBAC Middleware<br/>Role/Permission Check]
        end

         subgraph "route → controller → service → repository"
             H1[module.route.ts<br/>GET /api/v1/modules]
             H2[module.controller.ts<br/>HTTP Layer Only]
             H3[module.service.ts<br/>Business Logic]
             H4[module.repository.ts<br/>DB Operations]
             H5[Mongoose / MongoDB]
         end

        subgraph "Response Pipeline"
            E1[catchAsync<br/>Error Capture]
            E2[errorHandler<br/>Centralized Handler]
            E3[Zod Errors<br/>Validation]
            E4[Mongoose Errors<br/>DB Issues]
        end

        subgraph "External Services"
            S1[Cloudinary<br/>Image Upload]
            S2[Email Service<br/>Future: EJS + Queue]
        end
    end

    C1 --> R1
    R1 --> R2
    R2 --> R3
    R3 --> R4
    R4 --> R5
    R5 --> H1
    H1 --> H2
    H2 --> H3
    H3 --> H4
    H4 --> H5
    H2 -.-> E1
    E1 --> E2
    E2 --> E3
    E2 --> E4
    H2 -.-> S1
    H2 -.-> S2

    H5 --> H3
    H3 --> H2
    H2 --> C1

    S1 -.->|Upload| Cloudinary[Cloudinary CDN]
    Cloudinary -.->|Return URL| H3

    style R1 fill:#e1f5fe
    style R4 fill:#fff3e0
    style R5 fill:#fce4ec
    style H1 fill:#f1f8e9
    style H2 fill:#f3e5f5
    style H3 fill:#e8f5e8
    style H4 fill:#fff9c4
    style E2 fill:#ffebee
    style C1 fill:#e0f7fa
    style Cloudinary fill:#f9fbe7
```

---

## 🔄 Request Flow Diagrams

### 1. GET /api/v1/modules (List with Filters)

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Router
    participant Ctrl as Controller
    participant S as Service
    participant Rep as Repository
    participant M as MongoDB
    participant AF as ApiFeatures

    C->>R: GET /api/v1/modules?search=react&category=frontend&page=1
    R->>Ctrl: getAllModules(req.query)
    Ctrl->>S: getAllModules(query)
    S->>Rep: findAll(query)
    Rep->>AF: new ApiFeatures(Module.find(), query)
    AF->>AF: .search(['title','description'])
    AF->>AF: .filter()
    AF->>AF: .sort()
    AF->>AF: .paginate()
    AF->>M: buildQuery()
    M-->>AF: modules[]
    AF-->>Rep: results
    Rep-->>S: modules[]
    S-->>Ctrl: modules[]
    Ctrl->>C: 200 OK { success, data: modules, meta }
```

---

### 2. POST /api/v1/modules/add (Create)

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Router
    participant V as Validation<br/>Middleware
    participant Ctrl as Controller
    participant S as Service
    participant Rep as Repository
    participant M as MongoDB

    C->>R: POST /api/v1/modules/add<br/>{title, description,...}
    R->>V: validate(moduleClientSchema)
    V->>V: Zod.parse(req.body)
    alt Invalid
        V-->>C: 400 { errors: [...] }
    else Valid
        V->>Ctrl: validated body
        Ctrl->>S: createModule(data + createdBy)
        S->>Rep: create(data)
        Rep->>M: insertOne()
        M-->>Rep: newModule
        Rep-->>S: IModule
        S-->>Ctrl: IModule
        Ctrl->>C: 201 Created { data: module }
    end
```

---

### 3. Upload Image Flow (POST /api/v1/upload)

```mermaid
graph TB
    A[Client POST /api/v1/upload<br/>multipart/form-data] --> B[Upload Middleware<br/>Multer.memoryStorage]
    B --> C{Validate File?}
    C -->|Size > 5MB| D[400: File too large]
    C -->|Invalid MIME| E[400: Invalid file type]
    C -->|Valid| X[Buffer in req.file]
    X --> Y[Cloudinary Service<br/>uploader.upload(buffer)]
    Y --> H{Cloudinary Success?}
    H -->|Success| I[200 { url: secure_url }]
    H -->|Failed| J[500 CloudinaryError]
    I --> K[Client receives image URL]
```

---

## 📦 Payload Examples

### Module Model (Complete)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "React Masterclass",
  "shortDescription": "Learn React from zero to hero in 30 days",
  "description": "Complete React.js course covering Hooks, Context, Redux, Next.js...",
  "category": "frontend",
  "price": 49.99,
  "image": "https://res.cloudinary.com/.../react-module.jpg",
  "createdBy": "firebase_uid_12345",
  "createdAt": "2026-04-24T10:00:00.000Z",
  "updatedAt": "2026-04-24T12:00:00.000Z"
}
```

---

### GET /api/v1/modules Response

```json
{
  "success": true,
  "message": "Modules retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "React Basics",
      "shortDescription": "Learn React fast",
      "description": "Full module content...",
      "category": "frontend",
      "price": 0,
      "image": "https://example.com/image.jpg",
      "createdBy": "user123",
      "createdAt": "2026-04-24T10:00:00Z",
      "updatedAt": "2026-04-24T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### POST /api/v1/modules/add Request

```json
{
  "title": "Node.js Fundamentals",
  "shortDescription": "Master Node.js runtime",
  "description": "Learn event loop, streams, buffers, and build REST APIs",
  "category": "backend",
  "price": 29.99,
  "image": "https://example.com/nodejs.jpg"
}
```

**Note:** `createdBy` is injected by backend from authenticated user (not provided by client).

---

### Course Model (Complete)

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Full-Stack Development",
  "shortDescription": "Master frontend and backend technologies",
  "description": "Complete full-stack course covering React, Node.js, and MongoDB",
  "category": "fullstack",
  "difficulty": "advanced",
  "price": 99.99,
  "image": "https://res.cloudinary.com/.../fullstack-course.jpg",
  "createdBy": "firebase_uid_12345",
  "createdAt": "2026-04-24T10:00:00.000Z",
  "updatedAt": "2026-04-24T12:00:00.000Z"
}
```

---

### GET /api/v1/courses Response (with modules)

```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Full-Stack Development",
      "shortDescription": "Master frontend and backend technologies",
      "description": "Complete full-stack course covering React, Node.js, and MongoDB",
      "category": "fullstack",
      "difficulty": "advanced",
      "price": 99.99,
      "image": "https://res.cloudinary.com/.../fullstack-course.jpg",
      "createdBy": "user123",
      "modules": [
        {
          "module": { "_id": "...", "title": "React Basics", ... },
          "order": 0
        },
        {
          "module": { "_id": "...", "title": "Node.js Fundamentals", ... },
          "order": 1
        }
      ],
      "createdAt": "2026-04-24T10:00:00Z",
      "updatedAt": "2026-04-24T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

## 🛡️ RBAC Protection Flow

```mermaid
graph LR
    A[Request Arrives] --> B{Auth Middleware<br/>Verify Firebase Token}
    B -->|Invalid| C[401 Unauthorized]
    B -->|Valid| D[Attach req.user<br/>(uid, email, role)]
    D --> E{RBAC Middleware<br/>Check Role}
    E -->|User has role| P[✅ Allow]
    E -->|Missing role| Q[403 Forbidden]
    P --> H[Controller → Service]
```

---

## 📊 Data Model Relationships

```mermaid
erDiagram
    USER ||--o{ MODULE : creates
    USER ||--o{ COURSE : creates
    COURSE ||--o{ COURSE_MODULE : contains
    MODULE ||--o{ COURSE_MODULE : belongs_to
    
    USER {
        string uid PK
        string email UK
        string displayName
        string photoURL
        enum role "USER|ADMIN"
        boolean emailVerified
        datetime createdAt
        datetime updatedAt
    }
    
    MODULE {
        string _id PK
        string title
        string shortDescription
        string description
        string category
        number price
        string image
        string createdBy FK
        datetime createdAt
        datetime updatedAt
    }
    
    COURSE {
        string _id PK
        string title
        string shortDescription
        string description
        string category
        enum difficulty "beginner|intermediate|advanced"
        number price
        string image
        string createdBy FK
        datetime createdAt
        datetime updatedAt
    }
    
    COURSE_MODULE {
        string _id PK
        string courseId FK
        string moduleId FK
        number order
        datetime createdAt
        datetime updatedAt
    }
```

---

## 🔍 Query System Flow

```mermaid
graph TD
    A[Client Request<br/>GET /api/v1/modules?search=react&category=frontend&page=1&limit=10] --> B[Router]
    B --> C[Controller]
    C --> D[Service]
    D --> E[Repository]
    E --> Q[ApiFeatures Builder]
     
    Q --> Q1[search(['title','description'])]
    Q1 --> Q2[filter(category, priceMin/priceMax)]
    Q2 --> Q3[sort(createdAt, price)]
    Q3 --> Q4[paginate(limit, skip)]
    Q4 --> Z[MongoDB Query Built]
    Z --> H[Execute & Return]
    
    H --> I[Response with meta:<br/>{page, limit, total, totalPages}]
```

---

## 🗂️ Module Structure Pattern (Per Module)

```mermaid
graph LR
    ROUTE[Route Layer<br/>HTTP methods + URL patterns<br/>+ Validation middleware] --> CTRL
    CTRL[Controller Layer<br/>✓ Receive request<br/>✓ Call service<br/>✓ Send response<br/>✗ No business logic] --> SERV
    SERV[Service Layer<br/>✓ Business logic<br/>✓ Data transformations<br/>✓ Call repository<br/>✗ No DB queries] --> REPO
    REPO[Repository Layer<br/>✓ DB operations<br/>✓ Query building<br/>✓ Schema interaction<br/>✗ No HTTP] --> DB[(MongoDB)]
```

---

This system provides a **production-grade, scalable, and maintainable** backend architecture following clean design principles.


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
authorizePermission("course.delete")
```

---

# 📦 Course API (Main Resource)

## Base URL

```
/api/v1/courses
```

---

## 📌 Endpoints

### 1. Get All Courses

```
GET /api/v1/courses
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

### 2. Get Single Course

```
GET /api/v1/courses/:id
```

---

### 3. Create Course (Protected - Admin only)

```
POST /api/v1/courses
```

### Body:

```json
{
  "title": "React Basics",
  "shortDescription": "Learn React fast",
  "description": "Full course content...",
  "category": "frontend",
  "difficulty": "beginner",
  "price": 0,
  "image": "url",
  "createdBy": "userId"
}
```

---

### 4. Update Course (Protected - Admin only)

```
PATCH /api/v1/courses/:id
```

---

### 5. Delete Course (Protected - Admin only)

```
DELETE /api/v1/courses/:id
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

## Public (No Auth)

```
GET  /                    Landing page
GET  /about               About page
GET  /health              Health check
GET  /api/v1/modules      List all modules (with filters)
GET  /api/v1/modules/:id  Get single module
GET  /api/v1/courses      List all courses
GET  /api/v1/courses/:id  Get single course
```

---

## User Protected (Auth Recommended - Not Enforced)

**Routes exist but authentication is NOT currently enforced.** These endpoints are open to anyone.

```
POST /api/v1/modules/add     Create module (no auth check - placeholder createdBy used)
PATCH /api/v1/modules/:id    Update own module (no auth check)
DELETE /api/v1/modules/:id   Delete own module (no auth check)
GET  /api/v1/modules/manage  Get user's modules (returns 'system' user modules)
POST /api/v1/courses         Create course (admin only - no auth check)
PATCH /api/v1/courses/:id    Update course (admin only - no auth check)
DELETE /api/v1/courses/:id   Delete course (admin only - no auth check)
```

**To enable protection:**
- Add `auth` middleware to these routes
- Update controller to use `req.user.uid` (currently uses `'system'` placeholder)
- See `src/middlewares/auth.ts` (skeleton exists, needs Firebase implementation)

---

## Admin Protected (Admin Role - Not Enforced)

**Routes exist but RBAC is NOT currently enforced.** Anyone can access these endpoints.

```
GET  /api/v1/admin/modules                 View all modules
PATCH /api/v1/admin/modules/:id            Edit any module
DELETE /api/v1/admin/modules/:id           Delete any module
GET  /api/v1/admin/courses                 View all courses
POST /api/v1/admin/courses/:courseId/modules/:moduleId/link   Link module to course
DELETE /api/v1/admin/courses/:courseId/modules/:moduleId/unlink  Unlink module from course
GET  /api/v1/admin/courses/:courseId/modules  Get course modules
POST /api/v1/admin/courses/:courseId/modules/batch/link   Batch link modules
DELETE /api/v1/admin/courses/:courseId/modules/batch/unlink  Batch unlink modules
GET  /api/v1/admin/users                  View all users
```

**To enable protection:**
- Add `auth` middleware + `authorize('ADMIN')` to these routes
- See `src/middlewares/rbac.ts` (skeleton exists)

---

## File Upload (Public - Auth Recommended)

```
POST /api/v1/upload      Upload image to Cloudinary (no auth)
DELETE /api/v1/upload/:publicId  Delete Cloudinary image (no auth)
```

---

## Auth (Firebase - NOT IMPLEMENTED)

The following endpoints are **not yet built**. They are required for the Odyssey assessment.

```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

**Status:** Auth middleware skeleton exists (`src/middlewares/auth.ts`) but is non-functional. Routes are commented out in `app.ts`.

**Implementation needed:** See `IMPROVEMENTS.md` for full plan.

---

# 🚫 FORBIDDEN PRACTICES

❌ No business logic in controllers
❌ No duplicate filtering logic
❌ No raw res.json inconsistencies
❌ No direct Cloudinary calls in controllers
❌ No missing rollback handling
❌ No unvalidated inputs
❌ No insecure routes
❌ No `console.log` in production (use Winston)
❌ No fat controllers

---

## 🔐 Security Implementation

### Rate Limiting (AGENT.md Requirement ✅)
- Global: 100 requests per 15 minutes per IP
- Auth endpoints (when added): 5 requests per hour per IP
- Item operations: 30 requests per hour per IP
- Implemented via `express-rate-limit` in `src/middlewares/rateLimiter.ts`

### Input Sanitization (AGENT.md Requirement ✅)
- XSS protection using sanitization middleware
- Removes HTML tags, scripts, event handlers, `javascript:` URLs
- Applied to text fields (title, description, category, image URL)
- Implemented in `src/middlewares/sanitize.ts`

### Security Headers (AGENT.md Requirement ✅)
- Helmet.js with Content Security Policy (CSP)
- CORS configurable via environment variable
- HSTS, XSS Protection, and other headers enabled
- Configured in `src/app.ts`

### Protected Routes (Partially Implemented ⚠️)
- Auth middleware skeleton exists (`src/middlewares/auth.ts`)
- RBAC middleware skeleton exists (`src/middlewares/rbac.ts`)
- **NOT enforced** on any routes (auth module not built)
- Item create/update/delete routes currently open
- Admin routes currently open

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
