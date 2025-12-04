# Asset Management System

Aplikasi manajemen asset sederhana yang dibangun dengan React.js dan MariaDB. Aplikasi ini dirancang dengan struktur modular untuk memudahkan penambahan modul baru di masa depan.

## 🚀 Fitur

- **Manajemen Asset**: CRUD lengkap untuk asset
- **Kategori**: Organisasi asset berdasarkan kategori
- **Lokasi**: Tracking lokasi asset
- **Dashboard**: Overview statistik asset
- **Authentication**: Login dengan JWT
- **Responsive Design**: Tampilan optimal di desktop dan mobile

## 📋 Prasyarat

- Node.js (v14 atau lebih tinggi)
- MariaDB/MySQL (v10.3 atau lebih tinggi)
- npm atau yarn

## 🛠️ Instalasi

### 1. Clone atau Download Project

```bash
cd ReactAppV2
```

### 2. Setup Database

#### Install MariaDB (jika belum terinstall)

**Debian/Ubuntu:**
```bash
sudo apt update
sudo apt install mariadb-server mariadb-client
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo mysql_secure_installation
```

#### Buat User Database

```bash
sudo mysql -u root -p
```

Jalankan query berikut:
```sql
CREATE USER 'rosyd'@'localhost' IDENTIFIED BY 'rosyd1298';
GRANT ALL PRIVILEGES ON *.* TO 'rosyd'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Setup Backend

```bash
cd backend
npm install
npm run init-db
npm start
```

Backend akan berjalan di `http://localhost:5000`

### 4. Setup Frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm start
```

Frontend akan berjalan di `http://localhost:3000`

## 🔐 Login Default

- **Username**: admin
- **Password**: admin123

## 📁 Struktur Project

```
ReactAppV2/
├── backend/                 # Backend API (Node.js + Express)
│   ├── config/             # Konfigurasi database
│   ├── middleware/         # Middleware (auth, dll)
│   ├── routes/             # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── assets.js      # Asset management routes
│   │   ├── categories.js  # Category routes
│   │   └── locations.js   # Location routes
│   ├── scripts/           # Database initialization
│   ├── .env               # Environment variables
│   ├── package.json
│   └── server.js          # Main server file
│
└── frontend/               # Frontend (React.js)
    ├── public/
    ├── src/
    │   ├── components/    # Reusable components
    │   │   ├── Navbar.js
    │   │   └── PrivateRoute.js
    │   ├── context/       # React Context (Auth)
    │   ├── pages/         # Page components
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   └── Assets.js
    │   ├── utils/         # Utilities (API client)
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔧 Konfigurasi

### Backend (.env)

```env
DB_HOST=localhost
DB_USER=rosyd
DB_PASSWORD=rosyd1298
DB_NAME=asset_management
DB_PORT=3306

PORT=5000
NODE_ENV=development

JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

### Frontend

Jika backend berjalan di server lain, buat file `.env` di folder `frontend`:

```env
REACT_APP_API_URL=http://your-backend-server:5000/api
```

## 📊 Database Schema

### Tables

1. **users** - User management
2. **categories** - Asset categories
3. **locations** - Asset locations
4. **assets** - Main asset table
5. **asset_history** - Asset change history

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/:id` - Get single asset
- `POST /api/assets` - Create asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Locations
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

## 🚀 Deployment di Linux Debian

Lihat file [INSTALL_LINUX.md](INSTALL_LINUX.md) untuk panduan lengkap deployment di Linux Debian.

## 🔮 Rencana Pengembangan

Struktur aplikasi ini dirancang modular untuk memudahkan penambahan modul baru seperti:

- Modul HR (Human Resources)
- Modul Inventory
- Modul Procurement
- Modul Maintenance
- Dan lainnya

Setiap modul dapat ditambahkan dengan:
1. Menambahkan routes baru di backend (`backend/routes/`)
2. Menambahkan pages baru di frontend (`frontend/src/pages/`)
3. Menambahkan menu di Navbar

## 📝 License

MIT License

## 👨‍💻 Developer

Developed for asset management needs with modular architecture.
