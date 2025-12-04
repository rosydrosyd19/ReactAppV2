# 📁 Project Structure

```
ReactAppV2/
│
├── 📄 Documentation Files
│   ├── README.md                    # 📖 Main documentation - Start here!
│   ├── QUICKSTART.md                # ⚡ Quick start guide
│   ├── INSTALL_LINUX.md             # 🐧 Linux deployment guide
│   ├── MODULE_GUIDE.md              # 🔧 Guide to add new modules
│   ├── PROJECT_SUMMARY.md           # 📊 Project overview
│   ├── ARCHITECTURE.md              # 🏗️ Architecture documentation
│   ├── CHANGELOG.md                 # 📝 Version history
│   ├── STRUCTURE.md                 # 📁 This file
│   └── .gitignore                   # 🚫 Git ignore rules
│
├── 📂 backend/                      # Backend Application (Node.js + Express)
│   │
│   ├── 📂 config/
│   │   └── database.js              # Database connection pool
│   │
│   ├── 📂 middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   │
│   ├── 📂 routes/                   # API Routes
│   │   ├── auth.js                  # POST /api/auth/login, GET /api/auth/me
│   │   ├── assets.js                # CRUD /api/assets
│   │   ├── categories.js            # CRUD /api/categories
│   │   └── locations.js             # CRUD /api/locations
│   │
│   ├── 📂 scripts/
│   │   └── init-database.js         # Database initialization script
│   │
│   ├── .env                         # Environment variables (DO NOT COMMIT)
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Dependencies
│   └── server.js                    # Main server entry point
│
└── 📂 frontend/                     # Frontend Application (React.js)
    │
    ├── 📂 public/
    │   └── index.html               # HTML template
    │
    ├── 📂 src/
    │   │
    │   ├── 📂 components/           # Reusable Components
    │   │   ├── Navbar.js            # Navigation bar
    │   │   ├── Navbar.css
    │   │   └── PrivateRoute.js      # Route protection HOC
    │   │
    │   ├── 📂 context/              # React Context
    │   │   └── AuthContext.js       # Authentication state management
    │   │
    │   ├── 📂 pages/                # Page Components
    │   │   ├── Login.js             # Login page
    │   │   ├── Login.css
    │   │   ├── Dashboard.js         # Dashboard with statistics
    │   │   ├── Dashboard.css
    │   │   ├── Assets.js            # Assets list with CRUD
    │   │   └── Assets.css
    │   │
    │   ├── 📂 utils/                # Utilities
    │   │   └── api.js               # Axios instance with interceptors
    │   │
    │   ├── App.js                   # Main app component with routing
    │   ├── index.js                 # React entry point
    │   └── index.css                # Global styles & design system
    │
    ├── .env.example                 # Environment template
    └── package.json                 # Dependencies
```

## 📚 File Descriptions

### Root Level Documentation

| File | Purpose | When to Read |
|------|---------|--------------|
| **README.md** | Main documentation with overview, features, and basic installation | First time setup |
| **QUICKSTART.md** | Fast setup guide for development | Want to start quickly |
| **INSTALL_LINUX.md** | Production deployment on Linux Debian | Deploying to server |
| **MODULE_GUIDE.md** | How to add new modules to the app | Adding new features |
| **PROJECT_SUMMARY.md** | Complete project overview and capabilities | Understanding the project |
| **ARCHITECTURE.md** | System architecture and data flow | Understanding how it works |
| **CHANGELOG.md** | Version history and planned features | Tracking changes |
| **STRUCTURE.md** | This file - project structure guide | Navigating the codebase |

### Backend Files

| File/Folder | Purpose | Key Functions |
|-------------|---------|---------------|
| **server.js** | Main entry point | App initialization, route mounting |
| **config/database.js** | Database setup | Connection pool, test connection |
| **middleware/auth.js** | Authentication | JWT verification |
| **routes/auth.js** | Auth endpoints | Login, get current user |
| **routes/assets.js** | Asset endpoints | CRUD operations, search, stats |
| **routes/categories.js** | Category endpoints | CRUD operations |
| **routes/locations.js** | Location endpoints | CRUD operations |
| **scripts/init-database.js** | DB initialization | Create tables, sample data |

### Frontend Files

| File/Folder | Purpose | Key Components |
|-------------|---------|----------------|
| **index.js** | React entry | ReactDOM.render |
| **App.js** | Main component | Router, routes |
| **index.css** | Global styles | Design system, utilities |
| **components/Navbar.js** | Navigation | Menu, user info, logout |
| **components/PrivateRoute.js** | Route guard | Authentication check |
| **context/AuthContext.js** | Auth state | User, login, logout |
| **utils/api.js** | API client | Axios with interceptors |
| **pages/Login.js** | Login page | Login form |
| **pages/Dashboard.js** | Dashboard | Statistics, overview |
| **pages/Assets.js** | Assets page | List, search, filter |

## 🎯 Quick Navigation Guide

### I want to...

**Start the application**
→ Read `QUICKSTART.md`

**Deploy to Linux server**
→ Read `INSTALL_LINUX.md`

**Add a new module (e.g., Maintenance)**
→ Read `MODULE_GUIDE.md`

**Understand the architecture**
→ Read `ARCHITECTURE.md`

**See what's included**
→ Read `PROJECT_SUMMARY.md`

**Modify the login page**
→ Edit `frontend/src/pages/Login.js`

**Add a new API endpoint**
→ Create/edit file in `backend/routes/`

**Change the navbar**
→ Edit `frontend/src/components/Navbar.js`

**Modify database schema**
→ Edit `backend/scripts/init-database.js`

**Change API URL**
→ Edit `frontend/.env` (REACT_APP_API_URL)

**Change database credentials**
→ Edit `backend/.env` (DB_* variables)

## 📊 Code Statistics

### Backend
- **Routes**: 4 files (auth, assets, categories, locations)
- **Middleware**: 1 file (auth)
- **Config**: 1 file (database)
- **Scripts**: 1 file (init-database)
- **Total Lines**: ~1,000 lines

### Frontend
- **Components**: 2 files (Navbar, PrivateRoute)
- **Pages**: 3 files (Login, Dashboard, Assets)
- **Context**: 1 file (AuthContext)
- **Utils**: 1 file (api)
- **Total Lines**: ~1,200 lines

### Documentation
- **Files**: 8 markdown files
- **Total Lines**: ~1,500 lines

## 🔍 Important Paths

### Development URLs
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

### Database
- Host: `localhost`
- Port: `3306`
- Database: `asset_management`
- User: `rosyd`
- Password: `rosyd1298`

### Default Login
- Username: `admin`
- Password: `admin123`

## 🎨 Design System Location

All design tokens and reusable styles are in:
- `frontend/src/index.css`

Includes:
- CSS Variables (colors, shadows, etc.)
- Button styles
- Form styles
- Table styles
- Badge styles
- Alert styles
- Responsive breakpoints

## 🔐 Security Files

- `backend/middleware/auth.js` - JWT verification
- `frontend/src/components/PrivateRoute.js` - Route protection
- `frontend/src/context/AuthContext.js` - Auth state
- `backend/.env` - Secrets (NOT in git)

## 📦 Dependencies Location

- Backend: `backend/package.json`
- Frontend: `frontend/package.json`

## 🚀 Entry Points

### Development
- Backend: `npm start` in `backend/`
- Frontend: `npm start` in `frontend/`

### Production
- Backend: `node server.js` or PM2
- Frontend: Build with `npm run build`, serve with Nginx

## 📝 Notes

- All API routes are prefixed with `/api`
- All protected routes require JWT token
- Frontend uses React Router v6
- Backend uses Express.js
- Database uses mysql2 driver
- Styling uses vanilla CSS (no framework)

---

**Quick Tip**: Start with `README.md` for overview, then `QUICKSTART.md` to get running!
