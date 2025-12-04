# Panduan Instalasi di Linux Debian

Panduan lengkap untuk menginstall dan menjalankan Asset Management System di Linux Debian.

## 📋 Prasyarat

- Debian 10/11/12 atau Ubuntu 20.04/22.04
- Akses root atau sudo
- Koneksi internet

## 🔧 Instalasi

### 1. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Node.js dan npm

```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi instalasi
node --version
npm --version
```

### 3. Install MariaDB

```bash
# Install MariaDB
sudo apt install -y mariadb-server mariadb-client

# Start dan enable service
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Secure installation
sudo mysql_secure_installation
```

Saat menjalankan `mysql_secure_installation`, jawab:
- Set root password? **Y** (masukkan password yang aman)
- Remove anonymous users? **Y**
- Disallow root login remotely? **Y**
- Remove test database? **Y**
- Reload privilege tables? **Y**

### 4. Konfigurasi Database

```bash
# Login ke MariaDB
sudo mysql -u root -p
```

Jalankan query berikut:

```sql
-- Buat user untuk aplikasi
CREATE USER 'rosyd'@'localhost' IDENTIFIED BY 'rosyd1298';

-- Berikan privileges
GRANT ALL PRIVILEGES ON *.* TO 'rosyd'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Keluar
EXIT;
```

### 5. Clone atau Copy Project

```bash
# Jika menggunakan git
cd ~
git clone <repository-url> ReactAppV2

# Atau copy project yang sudah ada
# scp -r ReactAppV2 user@server:~/
```

### 6. Setup Backend

```bash
cd ~/ReactAppV2/backend

# Install dependencies
npm install

# Buat file .env jika belum ada
cat > .env << EOF
DB_HOST=localhost
DB_USER=rosyd
DB_PASSWORD=rosyd1298
DB_NAME=asset_management
DB_PORT=3306

PORT=5000
NODE_ENV=production

JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
EOF

# Initialize database
npm run init-db

# Test backend
npm start
```

Backend sekarang berjalan di `http://localhost:5000`

Tekan `Ctrl+C` untuk stop, lalu lanjutkan ke langkah berikutnya.

### 7. Setup Frontend

Buka terminal baru:

```bash
cd ~/ReactAppV2/frontend

# Install dependencies
npm install

# Buat file .env untuk production
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Build untuk production
npm run build
```

## 🚀 Menjalankan Aplikasi

### Opsi 1: Development Mode (untuk testing)

**Terminal 1 - Backend:**
```bash
cd ~/ReactAppV2/backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd ~/ReactAppV2/frontend
npm start
```

Akses aplikasi di: `http://localhost:3000`

### Opsi 2: Production Mode dengan PM2

#### Install PM2

```bash
sudo npm install -g pm2
```

#### Jalankan Backend dengan PM2

```bash
cd ~/ReactAppV2/backend
pm2 start server.js --name asset-backend
pm2 save
pm2 startup
```

#### Install dan Konfigurasi Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Buat konfigurasi Nginx
sudo nano /etc/nginx/sites-available/asset-management
```

Paste konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Ganti dengan domain Anda atau IP

    # Frontend (React build)
    location / {
        root /home/rosyd/ReactAppV2/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Simpan file (`Ctrl+X`, `Y`, `Enter`).

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/asset-management /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

#### Update Frontend .env untuk Production

```bash
cd ~/ReactAppV2/frontend

# Update .env
cat > .env << EOF
REACT_APP_API_URL=http://your-domain.com/api
EOF

# Rebuild
npm run build
```

### Opsi 3: Menggunakan Systemd Service

#### Backend Service

```bash
sudo nano /etc/systemd/system/asset-backend.service
```

Paste:

```ini
[Unit]
Description=Asset Management Backend
After=network.target mariadb.service

[Service]
Type=simple
User=rosyd
WorkingDirectory=/home/rosyd/ReactAppV2/backend
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable dan start service
sudo systemctl daemon-reload
sudo systemctl enable asset-backend
sudo systemctl start asset-backend

# Check status
sudo systemctl status asset-backend
```

## 🔒 Keamanan

### 1. Konfigurasi Firewall

```bash
# Install UFW
sudo apt install -y ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP dan HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

### 2. Ganti Password Default

Login ke aplikasi dan segera ganti password default admin.

### 3. Update JWT Secret

```bash
cd ~/ReactAppV2/backend
# Generate secret baru
openssl rand -base64 32
```

Update `JWT_SECRET` di file `.env` dengan hasil generate di atas.

## 📊 Monitoring

### Check Backend Status

```bash
# Jika menggunakan PM2
pm2 status
pm2 logs asset-backend

# Jika menggunakan systemd
sudo systemctl status asset-backend
sudo journalctl -u asset-backend -f
```

### Check Database

```bash
mysql -u rosyd -p
```

```sql
USE asset_management;
SHOW TABLES;
SELECT COUNT(*) FROM assets;
EXIT;
```

### Check Nginx

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Update Aplikasi

```bash
# Stop services
pm2 stop asset-backend
# atau
sudo systemctl stop asset-backend

# Update code
cd ~/ReactAppV2
git pull  # jika menggunakan git

# Update backend
cd backend
npm install

# Update frontend
cd ../frontend
npm install
npm run build

# Restart services
pm2 restart asset-backend
# atau
sudo systemctl start asset-backend

# Restart Nginx
sudo systemctl restart nginx
```

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database

```bash
# Check MariaDB status
sudo systemctl status mariadb

# Check user dan password
mysql -u rosyd -p

# Check .env file
cat ~/ReactAppV2/backend/.env
```

### Port sudah digunakan

```bash
# Check port 5000
sudo lsof -i :5000

# Kill process jika perlu
sudo kill -9 <PID>
```

### Nginx error

```bash
# Test konfigurasi
sudo nginx -t

# Check error log
sudo tail -f /var/log/nginx/error.log
```

## 📞 Support

Jika mengalami masalah, check:
1. Log backend: `pm2 logs asset-backend` atau `sudo journalctl -u asset-backend`
2. Log Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Database connection: Test login ke MariaDB dengan user `rosyd`

## ✅ Checklist Instalasi

- [ ] Node.js terinstall
- [ ] MariaDB terinstall dan running
- [ ] Database user dibuat
- [ ] Backend dependencies terinstall
- [ ] Database initialized
- [ ] Frontend dependencies terinstall
- [ ] Frontend di-build
- [ ] PM2 atau systemd service berjalan
- [ ] Nginx terinstall dan terkonfigurasi
- [ ] Firewall dikonfigurasi
- [ ] Aplikasi dapat diakses via browser

## 🎉 Selesai!

Aplikasi Asset Management sekarang berjalan di server Debian Anda!

Akses via: `http://your-server-ip` atau `http://your-domain.com`

Login dengan:
- Username: `admin`
- Password: `admin123`

**Jangan lupa ganti password default setelah login pertama kali!**
