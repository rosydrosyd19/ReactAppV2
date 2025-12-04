# 🏗️ Arsitektur Aplikasi Asset Management System

## 📊 Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React.js)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components Layer                                         │  │
│  │  - Navbar (Navigation)                                    │  │
│  │  - PrivateRoute (Route Protection)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages Layer                                              │  │
│  │  - Login Page                                             │  │
│  │  - Dashboard (Statistics & Overview)                      │  │
│  │  - Assets List (CRUD Interface)                           │  │
│  │  - Categories (Coming Soon)                               │  │
│  │  - Locations (Coming Soon)                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Context Layer                                            │  │
│  │  - AuthContext (User State Management)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Utils Layer                                              │  │
│  │  - API Client (Axios with Interceptors)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ API Calls (JWT Token)
                             │ http://localhost:5000/api
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                         │  │
│  │  - CORS                                                   │  │
│  │  - Body Parser                                            │  │
│  │  - Auth Middleware (JWT Verification)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes Layer                                             │  │
│  │  - /api/auth (Login, Get User)                            │  │
│  │  - /api/assets (CRUD Assets)                              │  │
│  │  - /api/categories (CRUD Categories)                      │  │
│  │  - /api/locations (CRUD Locations)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Config Layer                                             │  │
│  │  - Database Connection Pool                               │  │
│  │  - Environment Variables                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ SQL Queries
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MariaDB)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tables                                                   │  │
│  │  - users (Authentication & User Management)               │  │
│  │  - categories (Asset Categories)                          │  │
│  │  - locations (Physical Locations)                         │  │
│  │  - assets (Main Asset Data)                               │  │
│  │  - asset_history (Change Tracking)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Authentication Flow

```
User Login
    │
    ├─► Frontend: Login.js
    │       │
    │       ├─► POST /api/auth/login
    │       │       │
    │       │       ├─► Backend: routes/auth.js
    │       │       │       │
    │       │       │       ├─► Check credentials in DB
    │       │       │       │
    │       │       │       └─► Generate JWT Token
    │       │       │
    │       │       └─► Return token + user data
    │       │
    │       ├─► Store token in localStorage
    │       │
    │       └─► Update AuthContext
    │
    └─► Redirect to Dashboard
```

### 2. Asset CRUD Flow

```
User Action (Create/Read/Update/Delete)
    │
    ├─► Frontend: Assets.js
    │       │
    │       ├─► API Call with JWT Token
    │       │       │
    │       │       ├─► Backend: routes/assets.js
    │       │       │       │
    │       │       │       ├─► Middleware: Verify JWT
    │       │       │       │
    │       │       │       ├─► Execute SQL Query
    │       │       │       │
    │       │       │       ├─► Log to asset_history
    │       │       │       │
    │       │       │       └─► Return response
    │       │       │
    │       │       └─► Update UI State
    │       │
    │       └─► Show feedback to user
    │
    └─► Refresh data
```

## 🗂️ Folder Structure Detail

```
ReactAppV2/
│
├── backend/                          # Backend Application
│   ├── config/
│   │   └── database.js              # DB connection pool
│   │
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   │
│   ├── routes/                      # API Endpoints
│   │   ├── auth.js                  # Authentication
│   │   ├── assets.js                # Asset management
│   │   ├── categories.js            # Category management
│   │   └── locations.js             # Location management
│   │
│   ├── scripts/
│   │   └── init-database.js         # DB initialization
│   │
│   ├── .env                         # Environment config
│   ├── .env.example                 # Config template
│   ├── package.json                 # Dependencies
│   └── server.js                    # Main entry point
│
├── frontend/                         # Frontend Application
│   ├── public/
│   │   └── index.html               # HTML template
│   │
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Navbar.css
│   │   │   └── PrivateRoute.js
│   │   │
│   │   ├── context/                 # State management
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.js
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.js
│   │   │   ├── Dashboard.css
│   │   │   ├── Assets.js
│   │   │   └── Assets.css
│   │   │
│   │   ├── utils/                   # Utilities
│   │   │   └── api.js               # Axios instance
│   │   │
│   │   ├── App.js                   # Main component
│   │   ├── index.js                 # Entry point
│   │   └── index.css                # Global styles
│   │
│   ├── .env.example                 # Config template
│   └── package.json                 # Dependencies
│
├── Documentation Files
│   ├── README.md                    # Main documentation
│   ├── QUICKSTART.md                # Quick start guide
│   ├── INSTALL_LINUX.md             # Linux deployment
│   ├── MODULE_GUIDE.md              # Adding modules
│   ├── PROJECT_SUMMARY.md           # Project overview
│   └── ARCHITECTURE.md              # This file
│
└── .gitignore                       # Git ignore rules
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Layers                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Frontend Layer                                               │
│     ├─► PrivateRoute Component (Route Protection)               │
│     ├─► AuthContext (State Management)                          │
│     └─► Token Storage (localStorage)                            │
│                                                                  │
│  2. Network Layer                                                │
│     ├─► CORS Configuration                                      │
│     ├─► HTTPS (Production)                                      │
│     └─► JWT Token in Headers                                    │
│                                                                  │
│  3. Backend Layer                                                │
│     ├─► Auth Middleware (JWT Verification)                      │
│     ├─► Input Validation                                        │
│     └─► Error Handling                                          │
│                                                                  │
│  4. Database Layer                                               │
│     ├─► Parameterized Queries (SQL Injection Prevention)        │
│     ├─► Password Hashing (bcrypt)                               │
│     └─► User Permissions                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📡 API Architecture

### REST API Endpoints

```
Authentication
├── POST   /api/auth/login          # Login user
└── GET    /api/auth/me             # Get current user

Assets
├── GET    /api/assets              # List all assets
├── GET    /api/assets/:id          # Get single asset
├── POST   /api/assets              # Create asset
├── PUT    /api/assets/:id          # Update asset
├── DELETE /api/assets/:id          # Delete asset
└── GET    /api/assets/stats/summary # Get statistics

Categories
├── GET    /api/categories          # List categories
├── POST   /api/categories          # Create category
├── PUT    /api/categories/:id      # Update category
└── DELETE /api/categories/:id      # Delete category

Locations
├── GET    /api/locations           # List locations
├── POST   /api/locations           # Create location
├── PUT    /api/locations/:id       # Update location
└── DELETE /api/locations/:id       # Delete location
```

## 🎨 Frontend Architecture

### Component Hierarchy

```
App
├── Router
    ├── Login (Public)
    │
    └── PrivateRoute (Protected)
        ├── Dashboard
        │   ├── Navbar
        │   ├── Stats Cards
        │   ├── Status List
        │   └── Quick Actions
        │
        ├── Assets
        │   ├── Navbar
        │   ├── Page Header
        │   ├── Filters Section
        │   │   ├── Search Box
        │   │   └── Filter Dropdowns
        │   └── Assets Table
        │       └── Action Buttons
        │
        ├── Categories (Coming Soon)
        │   └── Navbar
        │
        └── Locations (Coming Soon)
            └── Navbar
```

### State Management

```
AuthContext (Global State)
├── user (User object)
├── loading (Boolean)
├── isAuthenticated (Boolean)
├── login() (Function)
└── logout() (Function)

Component State (Local State)
├── data (Array/Object)
├── loading (Boolean)
├── error (String)
└── filters (Object)
```

## 💾 Database Schema

### Entity Relationship

```
users
├── id (PK)
├── username
├── email
├── password (hashed)
├── full_name
└── role

categories                    locations
├── id (PK)                  ├── id (PK)
├── name                     ├── name
└── description              ├── address
                             ├── city
                             └── country

assets
├── id (PK)
├── asset_tag (UNIQUE)
├── name
├── category_id (FK) ──────► categories.id
├── location_id (FK) ──────► locations.id
├── assigned_to (FK) ──────► users.id
├── serial_number
├── model
├── manufacturer
├── purchase_date
├── purchase_cost
├── warranty_expiry
├── status
├── notes
└── image_url

asset_history
├── id (PK)
├── asset_id (FK) ──────────► assets.id
├── action
├── old_value
├── new_value
├── changed_by (FK) ────────► users.id
├── changed_at
└── notes
```

## 🚀 Deployment Architecture

### Development

```
Developer Machine
├── Backend (localhost:5000)
│   └── Node.js + Express
│
├── Frontend (localhost:3000)
│   └── React Dev Server
│
└── Database (localhost:3306)
    └── MariaDB
```

### Production (Linux)

```
Linux Server
├── Nginx (Port 80/443)
│   ├── Serve Static Files (React Build)
│   └── Reverse Proxy to Backend
│
├── Backend (Port 5000)
│   ├── PM2 Process Manager
│   └── Node.js + Express
│
└── Database (Port 3306)
    └── MariaDB
```

## 🔄 Scalability Considerations

### Horizontal Scaling

```
Load Balancer
├── Backend Instance 1
├── Backend Instance 2
└── Backend Instance 3
    │
    └── Shared Database
```

### Vertical Scaling

```
Single Server
├── Increase CPU/RAM
├── Database Optimization
│   ├── Indexes
│   ├── Query Optimization
│   └── Connection Pooling
└── Caching Layer (Redis)
```

## 📦 Module Extension Architecture

### Adding New Module

```
1. Backend
   ├── Create routes/[module].js
   ├── Register in server.js
   └── Add to database (if needed)

2. Frontend
   ├── Create pages/[Module].js
   ├── Add route in App.js
   └── Add link in Navbar.js

3. Database
   └── Add tables (if needed)
```

## 🎯 Best Practices Implemented

1. **Separation of Concerns**
   - Routes, Controllers, Models separated
   - Components, Pages, Utils separated

2. **DRY (Don't Repeat Yourself)**
   - Reusable components
   - Shared utilities
   - Common styles

3. **Security First**
   - JWT authentication
   - Input validation
   - SQL injection prevention

4. **Error Handling**
   - Try-catch blocks
   - User-friendly messages
   - Logging

5. **Code Organization**
   - Clear folder structure
   - Consistent naming
   - Modular design

---

Arsitektur ini dirancang untuk:
- ✅ Mudah dipahami
- ✅ Mudah dikembangkan
- ✅ Mudah di-maintain
- ✅ Scalable
- ✅ Secure

**Ready for production and future expansion!** 🚀
