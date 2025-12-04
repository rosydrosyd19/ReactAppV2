# Quick Start Guide

Panduan cepat untuk menjalankan aplikasi Asset Management System.

## 🚀 Instalasi Cepat (Windows)

### 1. Install Dependencies

Pastikan sudah terinstall:
- Node.js (https://nodejs.org/)
- MariaDB/MySQL (https://mariadb.org/download/)

### 2. Setup Database

Buka MySQL/MariaDB Command Line:

```sql
CREATE USER 'rosyd'@'localhost' IDENTIFIED BY 'rosyd1298';
GRANT ALL PRIVILEGES ON *.* TO 'rosyd'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Install Backend

```bash
cd backend
npm install
npm run init-db
```

### 4. Install Frontend

Buka terminal baru:

```bash
cd frontend
npm install
```

### 5. Jalankan Aplikasi

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 6. Akses Aplikasi

Buka browser: `http://localhost:3000`

Login:
- Username: `admin`
- Password: `admin123`

## 🐧 Instalasi Cepat (Linux)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MariaDB
sudo apt install -y mariadb-server
sudo systemctl start mariadb

# Setup Database
sudo mysql -u root -p
```

```sql
CREATE USER 'rosyd'@'localhost' IDENTIFIED BY 'rosyd1298';
GRANT ALL PRIVILEGES ON *.* TO 'rosyd'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Install Backend
cd backend
npm install
npm run init-db

# Install Frontend (terminal baru)
cd frontend
npm install

# Jalankan Backend
cd backend
npm start

# Jalankan Frontend (terminal baru)
cd frontend
npm start
```

Akses: `http://localhost:3000`

## 📝 Default Login

- **Username**: admin
- **Password**: admin123

## 🔧 Troubleshooting

### Backend tidak bisa connect ke database

1. Pastikan MariaDB/MySQL running
2. Check username dan password di `backend/.env`
3. Test login manual: `mysql -u rosyd -p`

### Port sudah digunakan

Backend (port 5000):
```bash
# Windows
netstat -ano | findstr :5000

# Linux
lsof -i :5000
```

Frontend (port 3000):
```bash
# Windows
netstat -ano | findstr :3000

# Linux
lsof -i :3000
```

### Error saat npm install

```bash
# Clear cache
npm cache clean --force

# Install ulang
rm -rf node_modules package-lock.json
npm install
```

## 📚 Dokumentasi Lengkap

- **README.md** - Overview dan fitur lengkap
- **INSTALL_LINUX.md** - Panduan instalasi production di Linux
- **MODULE_GUIDE.md** - Panduan menambahkan modul baru

## 🎯 Next Steps

1. Ganti password default admin
2. Tambahkan kategori asset
3. Tambahkan lokasi
4. Mulai input asset
5. Explore fitur lainnya

## 💡 Tips

- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`
- Database name: `asset_management`

Selamat menggunakan! 🎉
