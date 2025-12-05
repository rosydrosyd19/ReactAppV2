# 🌐 Panduan Akses dari Jaringan Lokal (LAN)

Panduan singkat untuk mengakses aplikasi Asset Management dari PC lain dalam jaringan yang sama.

## 📋 Prasyarat

- Server Debian sudah terinstall dan aplikasi berjalan
- PC client dan server dalam jaringan yang sama (LAN)
- Firewall sudah dikonfigurasi

## 🚀 Langkah-langkah

### 1. Cek IP Address Server

Di server Debian, jalankan:

```bash
hostname -I
```

Atau:

```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

Contoh output: `192.168.1.100`

**Catat IP address ini!** Anda akan menggunakannya untuk akses dari PC lain.

---

### 2. Pastikan Backend Listen di Semua Network Interface

File `backend/server.js` sudah dikonfigurasi untuk listen di `0.0.0.0`, yang artinya bisa diakses dari network.

Verifikasi dengan melihat baris ini di `backend/server.js`:

```javascript
app.listen(PORT, '0.0.0.0', () => {
    // ...
});
```

✅ Jika sudah ada `'0.0.0.0'`, tidak perlu diubah.

---

### 3. Update Frontend Environment

Di server, update file `.env` frontend dengan IP server:

```bash
cd ~/ReactAppV2/frontend

# Ganti 192.168.1.100 dengan IP server Anda
cat > .env << EOF
REACT_APP_API_URL=http://192.168.1.100:5000/api
EOF

# Rebuild frontend
npm run build
```

**⚠️ Penting:** Ganti `192.168.1.100` dengan IP address server Anda yang sebenarnya!

---

### 4. Konfigurasi Firewall

Buka port yang diperlukan:

```bash
# Install UFW jika belum
sudo apt install -y ufw

# Allow SSH (agar tidak terkunci)
sudo ufw allow 22/tcp

# Allow backend port
sudo ufw allow 5000/tcp

# Allow HTTP (untuk Nginx)
sudo ufw allow 80/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

### 5. Restart Aplikasi

#### Jika menggunakan PM2:

```bash
# Restart backend
pm2 restart asset-backend

# Restart Nginx
sudo systemctl restart nginx
```

#### Jika menggunakan systemd:

```bash
# Restart backend
sudo systemctl restart asset-backend

# Restart Nginx
sudo systemctl restart nginx
```

#### Jika manual (development):

```bash
# Stop backend (Ctrl+C)
# Lalu start ulang
cd ~/ReactAppV2/backend
npm start
```

---

### 6. Test Koneksi

#### Dari Server (localhost):

```bash
# Test backend
curl http://localhost:5000/api/health

# Test dari network IP
curl http://192.168.1.100:5000/api/health
```

Kedua command harus mengembalikan response JSON.

#### Dari PC Lain:

Buka browser dan akses:

**Tanpa Nginx (Development/Testing):**
- Backend API: `http://192.168.1.100:5000/api/health`
- Frontend: Lihat section "Frontend Development Mode" di bawah

**Dengan Nginx (Production):**
- Aplikasi lengkap: `http://192.168.1.100`

---

## 💻 Frontend Development Mode (Akses dari Network)

Jika Anda ingin menjalankan **frontend dalam mode development** dan bisa diakses dari PC lain:

### Opsi A: Menggunakan Script Network (Recommended)

Frontend sudah dilengkapi dengan script khusus untuk network access.

**1. Update Frontend .env:**

```bash
cd ~/ReactAppV2/frontend

# Ganti dengan IP server Anda
cat > .env << EOF
REACT_APP_API_URL=http://192.168.1.100:5000/api
EOF
```

**2. Buka Port Frontend (3000):**

```bash
sudo ufw allow 3000/tcp
sudo ufw reload
```

**3. Jalankan Frontend dengan Network Mode:**

```bash
cd ~/ReactAppV2/frontend
npm run start:network
```

**4. Akses dari PC Lain:**

Buka browser di PC lain dan akses:
- `http://192.168.1.100:3000`

> ✅ **Keuntungan:** Hot reload tetap berfungsi, cocok untuk development dan testing.

### Opsi B: Manual dengan Environment Variable

Jika script di atas tidak bekerja, gunakan cara manual:

```bash
cd ~/ReactAppV2/frontend

# Linux/Mac
HOST=0.0.0.0 npm start

# Atau export dulu
export HOST=0.0.0.0
npm start
```

### Opsi C: Menggunakan File .env.local

Buat file `.env.local` di folder frontend:

```bash
cd ~/ReactAppV2/frontend

cat > .env.local << EOF
HOST=0.0.0.0
REACT_APP_API_URL=http://192.168.1.100:5000/api
EOF

npm start
```

### ⚠️ Catatan Penting untuk Development Mode

1. **Port 3000 harus dibuka** di firewall
2. **Backend juga harus berjalan** di port 5000
3. **CORS harus dikonfigurasi** dengan benar di backend
4. **Untuk production**, gunakan `npm run build` + Nginx (lebih aman dan cepat)

### Test Akses Development Mode

**Dari Server:**
```bash
# Test frontend
curl http://localhost:3000

# Test dari network IP
curl http://192.168.1.100:3000
```

**Dari PC Lain:**
- Buka browser: `http://192.168.1.100:3000`
- Anda akan melihat aplikasi React dengan hot reload aktif

---

## 🔍 Troubleshooting

### ❌ Tidak bisa akses dari PC lain

**1. Check firewall:**
```bash
sudo ufw status
```

Pastikan port 5000 dan 80 ALLOW.

**2. Check backend berjalan:**
```bash
# Jika pakai PM2
pm2 status

# Jika pakai systemd
sudo systemctl status asset-backend

# Check port listening
sudo netstat -tlnp | grep 5000
```

Pastikan backend listening di `0.0.0.0:5000`, bukan `127.0.0.1:5000`.

**3. Check Nginx:**
```bash
sudo systemctl status nginx
sudo nginx -t
```

**4. Test dari server:**
```bash
# Ganti dengan IP server Anda
curl http://192.168.1.100:5000/api/health
```

Jika dari server bisa, tapi dari PC lain tidak bisa, masalahnya di firewall atau network.

**5. Check network connectivity:**

Dari PC lain, ping server:
```bash
ping 192.168.1.100
```

Jika ping tidak bisa, masalahnya di network/router.

---

### ❌ CORS Error

Jika muncul CORS error di browser, pastikan backend CORS sudah dikonfigurasi dengan benar.

Edit `backend/server.js`:

```javascript
// Middleware
app.use(cors({
    origin: '*', // Untuk development
    // Untuk production, ganti dengan domain spesifik:
    // origin: 'http://192.168.1.100'
}));
```

Restart backend setelah perubahan.

---

### ❌ Frontend tidak load

**1. Check .env frontend:**
```bash
cat ~/ReactAppV2/frontend/.env
```

Pastikan `REACT_APP_API_URL` menggunakan IP server, bukan localhost.

**2. Rebuild frontend:**
```bash
cd ~/ReactAppV2/frontend
npm run build
sudo systemctl restart nginx
```

---

## 📱 Akses dari Smartphone

Jika smartphone terhubung ke WiFi yang sama dengan server:

1. Buka browser di smartphone
2. Akses: `http://192.168.1.100`
3. Login dengan kredensial admin

---

## 🔒 Keamanan

### ⚠️ Peringatan Keamanan

Membuka akses ke network berarti aplikasi bisa diakses oleh siapa saja dalam jaringan yang sama.

**Rekomendasi:**

1. **Gunakan firewall** untuk membatasi akses
2. **Ganti password default** segera setelah instalasi
3. **Gunakan HTTPS** untuk production (dengan SSL certificate)
4. **Batasi akses** hanya ke IP tertentu jika memungkinkan

### Membatasi Akses ke IP Tertentu

Edit konfigurasi Nginx:

```bash
sudo nano /etc/nginx/sites-available/asset-management
```

Tambahkan di dalam block `server`:

```nginx
# Allow hanya dari subnet tertentu
allow 192.168.1.0/24;
deny all;
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

---

## ✅ Checklist

**Untuk Production Mode (Nginx):**
- [ ] IP address server sudah dicatat
- [ ] Backend dikonfigurasi listen di `0.0.0.0`
- [ ] Frontend `.env` sudah diupdate dengan IP server
- [ ] Frontend sudah di-rebuild (`npm run build`)
- [ ] Firewall sudah dikonfigurasi (port 5000 dan 80)
- [ ] Backend sudah direstart
- [ ] Nginx sudah direstart
- [ ] Test akses dari server berhasil
- [ ] Test akses dari PC lain berhasil

**Untuk Development Mode (Frontend + Backend):**
- [ ] IP address server sudah dicatat
- [ ] Backend dikonfigurasi listen di `0.0.0.0`
- [ ] Frontend `.env` sudah diupdate dengan IP server
- [ ] Firewall sudah dikonfigurasi (port 3000, 5000)
- [ ] Backend berjalan (`npm start`)
- [ ] Frontend berjalan (`npm run start:network`)
- [ ] Test akses dari PC lain ke port 3000 berhasil

---

## 🎉 Selesai!

Sekarang aplikasi bisa diakses dari PC lain dalam jaringan yang sama!

**URL Akses:**
- Dari server: `http://localhost` atau `http://192.168.1.100`
- Dari PC lain: `http://192.168.1.100`

**Login:**
- Username: `admin`
- Password: `admin123`

**Jangan lupa ganti password default!**
