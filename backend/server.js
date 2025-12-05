const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/locations', require('./routes/locations'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.error('❌ Failed to connect to database. Please check your configuration.');
            console.log('\n💡 Make sure MariaDB is running and credentials are correct.');
            console.log('💡 Run "npm run init-db" to initialize the database.\n');
            process.exit(1);
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`\n🚀 Server is running on port ${PORT}`);
            console.log(`📍 Local API URL: http://localhost:${PORT}/api`);
            console.log(`🌐 Network API URL: http://<your-server-ip>:${PORT}/api`);
            console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
