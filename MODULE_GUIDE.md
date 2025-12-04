# Panduan Menambahkan Modul Baru

Dokumen ini menjelaskan cara menambahkan modul baru ke dalam aplikasi Asset Management System.

## 🏗️ Arsitektur Modular

Aplikasi ini dirancang dengan arsitektur modular yang memudahkan penambahan fitur baru. Setiap modul terdiri dari:

1. **Backend Routes** - API endpoints
2. **Frontend Pages** - UI components
3. **Database Tables** - Data storage

## 📝 Langkah-langkah Menambahkan Modul Baru

### Contoh: Menambahkan Modul "Maintenance"

#### 1. Backend - Database Schema

Buat migration atau update `scripts/init-database.js`:

```javascript
// Tambahkan di init-database.js
await connection.query(`
  CREATE TABLE IF NOT EXISTS maintenance_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    maintenance_type ENUM('preventive', 'corrective', 'inspection') NOT NULL,
    description TEXT,
    cost DECIMAL(15, 2),
    performed_by VARCHAR(100),
    performed_date DATE,
    next_maintenance_date DATE,
    status ENUM('scheduled', 'in_progress', 'completed') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
  )
`);
```

#### 2. Backend - Routes

Buat file `backend/routes/maintenance.js`:

```javascript
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET all maintenance records
router.get('/', async (req, res) => {
  try {
    const [records] = await pool.query(`
      SELECT m.*, a.name as asset_name, a.asset_tag
      FROM maintenance_records m
      LEFT JOIN assets a ON m.asset_id = a.id
      ORDER BY m.created_at DESC
    `);

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get maintenance records error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// POST create maintenance record
router.post('/', async (req, res) => {
  try {
    const {
      asset_id,
      maintenance_type,
      description,
      cost,
      performed_by,
      performed_date,
      next_maintenance_date,
      status,
      notes
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO maintenance_records (
        asset_id, maintenance_type, description, cost,
        performed_by, performed_date, next_maintenance_date,
        status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        asset_id, maintenance_type, description, cost,
        performed_by, performed_date, next_maintenance_date,
        status || 'scheduled', notes
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// PUT update maintenance record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      asset_id,
      maintenance_type,
      description,
      cost,
      performed_by,
      performed_date,
      next_maintenance_date,
      status,
      notes
    } = req.body;

    await pool.query(
      `UPDATE maintenance_records SET
        asset_id = ?, maintenance_type = ?, description = ?,
        cost = ?, performed_by = ?, performed_date = ?,
        next_maintenance_date = ?, status = ?, notes = ?
       WHERE id = ?`,
      [
        asset_id, maintenance_type, description, cost,
        performed_by, performed_date, next_maintenance_date,
        status, notes, id
      ]
    );

    res.json({
      success: true,
      message: 'Maintenance record updated successfully'
    });
  } catch (error) {
    console.error('Update maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// DELETE maintenance record
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM maintenance_records WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Maintenance record deleted successfully'
    });
  } catch (error) {
    console.error('Delete maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
```

#### 3. Backend - Register Route

Update `backend/server.js`:

```javascript
// Tambahkan import
app.use('/api/maintenance', require('./routes/maintenance'));
```

#### 4. Frontend - Page Component

Buat file `frontend/src/pages/Maintenance.js`:

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('/maintenance');
      setRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/maintenance/${id}`);
        setRecords(records.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Maintenance Records</h1>
            <p>Track asset maintenance activities</p>
          </div>
          <Link to="/maintenance/new" className="btn btn-primary">
            <FiPlus />
            Add Record
          </Link>
        </div>

        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id}>
                    <td>{record.asset_name}</td>
                    <td>{record.maintenance_type}</td>
                    <td>{record.performed_date}</td>
                    <td>${record.cost}</td>
                    <td>
                      <span className={`badge badge-${record.status === 'completed' ? 'success' : 'warning'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/maintenance/edit/${record.id}`} className="btn-icon btn-icon-primary">
                          <FiEdit />
                        </Link>
                        <button onClick={() => handleDelete(record.id)} className="btn-icon btn-icon-danger">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maintenance;
```

#### 5. Frontend - Register Route

Update `frontend/src/App.js`:

```javascript
// Import
import Maintenance from './pages/Maintenance';

// Tambahkan route
<Route
  path="/maintenance"
  element={
    <PrivateRoute>
      <Maintenance />
    </PrivateRoute>
  }
/>
```

#### 6. Frontend - Add to Navigation

Update `frontend/src/components/Navbar.js`:

```javascript
<Link to="/maintenance" className="navbar-link">Maintenance</Link>
```

## 📋 Checklist Modul Baru

Saat menambahkan modul baru, pastikan:

- [ ] Database table dibuat
- [ ] Backend routes dibuat (`backend/routes/[module].js`)
- [ ] Routes di-register di `server.js`
- [ ] Frontend page component dibuat (`frontend/src/pages/[Module].js`)
- [ ] Route ditambahkan di `App.js`
- [ ] Navigation link ditambahkan di `Navbar.js`
- [ ] API calls menggunakan `utils/api.js`
- [ ] Authentication middleware digunakan di backend
- [ ] PrivateRoute digunakan di frontend
- [ ] Error handling ditambahkan
- [ ] Loading states ditambahkan

## 🎨 Konsistensi UI

Gunakan komponen dan class yang sudah ada:

### Buttons
```javascript
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-danger">Danger</button>
<button className="btn btn-outline">Outline</button>
```

### Badges
```javascript
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-danger">Danger</span>
<span className="badge badge-info">Info</span>
```

### Forms
```javascript
<div className="form-group">
  <label className="form-label">Label</label>
  <input type="text" className="form-input" />
</div>
```

### Cards
```javascript
<div className="card">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

## 🔄 Best Practices

1. **Naming Convention**
   - Files: PascalCase untuk components (`Maintenance.js`)
   - Routes: lowercase dengan dash (`/maintenance-records`)
   - Database: snake_case (`maintenance_records`)

2. **Error Handling**
   - Selalu gunakan try-catch
   - Berikan feedback ke user
   - Log error untuk debugging

3. **Security**
   - Gunakan `authMiddleware` di semua protected routes
   - Validasi input di backend
   - Sanitize data sebelum query

4. **Performance**
   - Gunakan loading states
   - Implement pagination untuk data besar
   - Optimize database queries

5. **Code Organization**
   - Satu file per component/route
   - Reusable components di `components/`
   - Business logic di backend

## 📚 Contoh Modul Lain

Berikut contoh modul yang bisa ditambahkan:

1. **HR Module**
   - Employees
   - Departments
   - Attendance
   - Payroll

2. **Inventory Module**
   - Stock Items
   - Suppliers
   - Purchase Orders
   - Stock Movements

3. **Procurement Module**
   - Requisitions
   - Quotations
   - Purchase Orders
   - Vendors

4. **Reports Module**
   - Asset Reports
   - Maintenance Reports
   - Financial Reports
   - Custom Reports

## 🚀 Deploy Modul Baru

Setelah menambahkan modul:

```bash
# Backend
cd backend
npm install  # jika ada dependency baru
pm2 restart asset-backend

# Frontend
cd frontend
npm install  # jika ada dependency baru
npm run build
sudo systemctl restart nginx
```

## 📞 Tips

- Mulai dari yang sederhana, tambahkan fitur bertahap
- Test setiap endpoint sebelum membuat UI
- Gunakan Postman/Insomnia untuk test API
- Commit changes secara berkala
- Dokumentasikan setiap modul baru

---

Dengan mengikuti panduan ini, Anda dapat dengan mudah menambahkan modul baru ke dalam aplikasi Asset Management System! 🎉
