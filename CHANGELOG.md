# Changelog

All notable changes to the Asset Management System will be documented in this file.

## [1.0.0] - 2025-12-04

### 🎉 Initial Release

#### Added

**Backend**
- ✅ Express.js server setup with CORS and middleware
- ✅ MariaDB database connection with connection pooling
- ✅ JWT authentication system
- ✅ User authentication routes (login, get current user)
- ✅ Asset management routes (CRUD operations)
- ✅ Category management routes (CRUD operations)
- ✅ Location management routes (CRUD operations)
- ✅ Database initialization script with sample data
- ✅ Auth middleware for route protection
- ✅ Environment configuration support
- ✅ Error handling and validation

**Frontend**
- ✅ React 18 application setup
- ✅ React Router v6 for navigation
- ✅ Authentication context for state management
- ✅ Login page with form validation
- ✅ Dashboard with statistics and overview
- ✅ Assets list page with search and filters
- ✅ Navbar component with user info
- ✅ PrivateRoute component for route protection
- ✅ Axios API client with interceptors
- ✅ Responsive design system
- ✅ Custom CSS with design tokens
- ✅ Loading states and error handling

**Database**
- ✅ Users table with authentication
- ✅ Categories table for asset organization
- ✅ Locations table for asset tracking
- ✅ Assets table with relationships
- ✅ Asset history table for audit trail
- ✅ Sample data (admin user, categories, locations)

**Documentation**
- ✅ README.md - Main documentation
- ✅ QUICKSTART.md - Quick start guide
- ✅ INSTALL_LINUX.md - Linux deployment guide
- ✅ MODULE_GUIDE.md - Guide for adding modules
- ✅ PROJECT_SUMMARY.md - Project overview
- ✅ ARCHITECTURE.md - Architecture documentation
- ✅ CHANGELOG.md - This file
- ✅ .env.example files for configuration templates

**Features**
- ✅ User authentication with JWT
- ✅ Dashboard with real-time statistics
- ✅ Asset CRUD operations
- ✅ Category management
- ✅ Location management
- ✅ Search and filter functionality
- ✅ Asset status tracking (Available, In Use, Maintenance, Retired)
- ✅ Asset assignment to users
- ✅ Change history tracking
- ✅ Responsive mobile-friendly design

**Security**
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Protected API routes
- ✅ Protected frontend routes
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration

**Developer Experience**
- ✅ Modular architecture
- ✅ Clear folder structure
- ✅ Comprehensive documentation
- ✅ Environment templates
- ✅ Sample data included
- ✅ Git ignore configuration

### Database Schema

```sql
users (id, username, email, password, full_name, role, created_at, updated_at)
categories (id, name, description, created_at, updated_at)
locations (id, name, address, city, country, created_at, updated_at)
assets (id, asset_tag, name, category_id, location_id, serial_number, model, 
        manufacturer, purchase_date, purchase_cost, warranty_expiry, status, 
        assigned_to, notes, image_url, created_at, updated_at)
asset_history (id, asset_id, action, old_value, new_value, changed_by, 
               changed_at, notes)
```

### API Endpoints

**Authentication**
- POST /api/auth/login
- GET /api/auth/me

**Assets**
- GET /api/assets
- GET /api/assets/:id
- POST /api/assets
- PUT /api/assets/:id
- DELETE /api/assets/:id
- GET /api/assets/stats/summary

**Categories**
- GET /api/categories
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

**Locations**
- GET /api/locations
- POST /api/locations
- PUT /api/locations/:id
- DELETE /api/locations/:id

### Default Credentials

- Username: `admin`
- Password: `admin123`

### Technology Stack

**Backend**
- Node.js
- Express.js 4.18
- MariaDB/MySQL
- mysql2 3.6
- bcryptjs 2.4
- jsonwebtoken 9.0
- cors 2.8
- dotenv 16.3

**Frontend**
- React 18.2
- React Router 6.20
- Axios 1.6
- React Icons 4.12

### Known Limitations

- Asset form (create/edit) not yet implemented - planned for v1.1
- Category form page not yet implemented - planned for v1.1
- Location form page not yet implemented - planned for v1.1
- No file upload for asset images yet - planned for v1.2
- No user management UI - planned for v1.2
- No role-based permissions - planned for v1.3
- No export functionality - planned for v1.3

---

## [Unreleased]

### Planned for v1.1.0

- [ ] Asset form (create/edit page)
- [ ] Category form page
- [ ] Location form page
- [ ] Form validation improvements
- [ ] Better error messages

### Planned for v1.2.0

- [ ] File upload for asset images
- [ ] User management UI
- [ ] Profile page
- [ ] Change password functionality
- [ ] Asset detail page

### Planned for v1.3.0

- [ ] Role-based permissions
- [ ] Permission management UI
- [ ] Export to Excel
- [ ] Export to PDF
- [ ] Advanced filtering

### Planned for v2.0.0

- [ ] Maintenance module
- [ ] HR module
- [ ] Inventory module
- [ ] Reporting module
- [ ] Dashboard customization
- [ ] Email notifications
- [ ] Barcode/QR code generation
- [ ] Mobile app (React Native)

---

## Version History

- **v1.0.0** (2025-12-04) - Initial release with core features

---

## How to Update

### For Developers

```bash
# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install
# Run migrations if any

# Update frontend
cd ../frontend
npm install
npm run build
```

### For Production

```bash
# Stop services
pm2 stop asset-backend

# Update code
git pull origin main

# Update dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# Restart services
pm2 restart asset-backend
sudo systemctl restart nginx
```

---

## Contributing

When adding new features:
1. Update this CHANGELOG.md
2. Update relevant documentation
3. Add tests if applicable
4. Update API documentation
5. Follow the MODULE_GUIDE.md

---

**Note**: This project follows [Semantic Versioning](https://semver.org/).

Format: [MAJOR.MINOR.PATCH]
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)
