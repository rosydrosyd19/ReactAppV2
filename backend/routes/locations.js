const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// @route   GET /api/locations
// @desc    Get all locations
// @access  Private
router.get('/', async (req, res) => {
    try {
        const [locations] = await pool.query(`
      SELECT l.*, COUNT(a.id) as asset_count
      FROM locations l
      LEFT JOIN assets a ON l.id = a.location_id
      GROUP BY l.id
      ORDER BY l.name
    `);

        res.json({
            success: true,
            count: locations.length,
            data: locations
        });
    } catch (error) {
        console.error('Get locations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/locations
// @desc    Create location
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { name, address, city, country } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide location name'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO locations (name, address, city, country) VALUES (?, ?, ?, ?)',
            [name, address, city, country]
        );

        res.status(201).json({
            success: true,
            message: 'Location created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create location error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/locations/:id
// @desc    Update location
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { name, address, city, country } = req.body;

        const [existing] = await pool.query(
            'SELECT id FROM locations WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        await pool.query(
            'UPDATE locations SET name = ?, address = ?, city = ?, country = ? WHERE id = ?',
            [name, address, city, country, req.params.id]
        );

        res.json({
            success: true,
            message: 'Location updated successfully'
        });
    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/locations/:id
// @desc    Delete location
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await pool.query(
            'SELECT id FROM locations WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        await pool.query('DELETE FROM locations WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Location deleted successfully'
        });
    } catch (error) {
        console.error('Delete location error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
