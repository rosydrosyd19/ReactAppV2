const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

// @route   GET /api/assets
// @desc    Get all assets
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { status, category_id, location_id, search } = req.query;

        let query = `
      SELECT 
        a.*,
        c.name as category_name,
        l.name as location_name,
        u.full_name as assigned_to_name
      FROM assets a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN locations l ON a.location_id = l.id
      LEFT JOIN users u ON a.assigned_to = u.id
      WHERE 1=1
    `;

        const params = [];

        if (status) {
            query += ' AND a.status = ?';
            params.push(status);
        }

        if (category_id) {
            query += ' AND a.category_id = ?';
            params.push(category_id);
        }

        if (location_id) {
            query += ' AND a.location_id = ?';
            params.push(location_id);
        }

        if (search) {
            query += ' AND (a.name LIKE ? OR a.asset_tag LIKE ? OR a.serial_number LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        query += ' ORDER BY a.created_at DESC';

        const [assets] = await pool.query(query, params);

        res.json({
            success: true,
            count: assets.length,
            data: assets
        });

    } catch (error) {
        console.error('Get assets error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/assets/:id
// @desc    Get single asset
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const [assets] = await pool.query(`
      SELECT 
        a.*,
        c.name as category_name,
        l.name as location_name,
        u.full_name as assigned_to_name,
        u.email as assigned_to_email
      FROM assets a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN locations l ON a.location_id = l.id
      LEFT JOIN users u ON a.assigned_to = u.id
      WHERE a.id = ?
    `, [req.params.id]);

        if (assets.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Asset not found'
            });
        }

        // Get asset history
        const [history] = await pool.query(`
      SELECT 
        ah.*,
        u.full_name as changed_by_name
      FROM asset_history ah
      LEFT JOIN users u ON ah.changed_by = u.id
      WHERE ah.asset_id = ?
      ORDER BY ah.changed_at DESC
    `, [req.params.id]);

        res.json({
            success: true,
            data: {
                ...assets[0],
                history
            }
        });

    } catch (error) {
        console.error('Get asset error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/assets
// @desc    Create new asset
// @access  Private
router.post('/', async (req, res) => {
    try {
        const {
            asset_tag,
            name,
            category_id,
            location_id,
            serial_number,
            model,
            manufacturer,
            purchase_date,
            purchase_cost,
            warranty_expiry,
            status,
            assigned_to,
            notes,
            image_url
        } = req.body;

        // Validate required fields
        if (!asset_tag || !name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide asset_tag and name'
            });
        }

        // Check if asset_tag already exists
        const [existing] = await pool.query(
            'SELECT id FROM assets WHERE asset_tag = ?',
            [asset_tag]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Asset tag already exists'
            });
        }

        const [result] = await pool.query(
            `INSERT INTO assets (
        asset_tag, name, category_id, location_id, serial_number,
        model, manufacturer, purchase_date, purchase_cost,
        warranty_expiry, status, assigned_to, notes, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                asset_tag, name, category_id, location_id, serial_number,
                model, manufacturer, purchase_date, purchase_cost,
                warranty_expiry, status || 'available', assigned_to, notes, image_url
            ]
        );

        // Log the creation in history
        await pool.query(
            `INSERT INTO asset_history (asset_id, action, new_value, changed_by, notes)
       VALUES (?, 'created', ?, ?, ?)`,
            [result.insertId, JSON.stringify(req.body), req.user.id, 'Asset created']
        );

        res.status(201).json({
            success: true,
            message: 'Asset created successfully',
            data: { id: result.insertId }
        });

    } catch (error) {
        console.error('Create asset error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/assets/:id
// @desc    Update asset
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const {
            asset_tag,
            name,
            category_id,
            location_id,
            serial_number,
            model,
            manufacturer,
            purchase_date,
            purchase_cost,
            warranty_expiry,
            status,
            assigned_to,
            notes,
            image_url
        } = req.body;

        // Check if asset exists
        const [existing] = await pool.query(
            'SELECT * FROM assets WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Asset not found'
            });
        }

        await pool.query(
            `UPDATE assets SET
        asset_tag = ?, name = ?, category_id = ?, location_id = ?,
        serial_number = ?, model = ?, manufacturer = ?, purchase_date = ?,
        purchase_cost = ?, warranty_expiry = ?, status = ?, assigned_to = ?,
        notes = ?, image_url = ?
       WHERE id = ?`,
            [
                asset_tag, name, category_id, location_id, serial_number,
                model, manufacturer, purchase_date, purchase_cost,
                warranty_expiry, status, assigned_to, notes, image_url,
                req.params.id
            ]
        );

        // Log the update in history
        await pool.query(
            `INSERT INTO asset_history (asset_id, action, old_value, new_value, changed_by, notes)
       VALUES (?, 'updated', ?, ?, ?, ?)`,
            [
                req.params.id,
                JSON.stringify(existing[0]),
                JSON.stringify(req.body),
                req.user.id,
                'Asset updated'
            ]
        );

        res.json({
            success: true,
            message: 'Asset updated successfully'
        });

    } catch (error) {
        console.error('Update asset error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/assets/:id
// @desc    Delete asset
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await pool.query(
            'SELECT * FROM assets WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Asset not found'
            });
        }

        await pool.query('DELETE FROM assets WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Asset deleted successfully'
        });

    } catch (error) {
        console.error('Delete asset error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/assets/stats/summary
// @desc    Get asset statistics
// @access  Private
router.get('/stats/summary', async (req, res) => {
    try {
        const [totalAssets] = await pool.query('SELECT COUNT(*) as count FROM assets');
        const [byStatus] = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM assets 
      GROUP BY status
    `);
        const [byCategory] = await pool.query(`
      SELECT c.name, COUNT(a.id) as count
      FROM categories c
      LEFT JOIN assets a ON c.id = a.category_id
      GROUP BY c.id, c.name
    `);

        res.json({
            success: true,
            data: {
                total: totalAssets[0].count,
                byStatus,
                byCategory
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
