const mysql = require('mysql2/promise');
require('dotenv').config();

const initDatabase = async () => {
    let connection;

    try {
        // Connect without database first
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        console.log('Connected to MariaDB server');

        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`✅ Database '${process.env.DB_NAME}' created or already exists`);

        // Use the database
        await connection.query(`USE ${process.env.DB_NAME}`);

        // Create users table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Table "users" created');

        // Create categories table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Table "categories" created');

        // Create locations table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Table "locations" created');

        // Create assets table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        asset_tag VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        category_id INT,
        location_id INT,
        serial_number VARCHAR(100),
        model VARCHAR(100),
        manufacturer VARCHAR(100),
        purchase_date DATE,
        purchase_cost DECIMAL(15, 2),
        warranty_expiry DATE,
        status ENUM('available', 'in_use', 'maintenance', 'retired') DEFAULT 'available',
        assigned_to INT,
        notes TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
        console.log('✅ Table "assets" created');

        // Create asset_history table for tracking changes
        await connection.query(`
      CREATE TABLE IF NOT EXISTS asset_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        asset_id INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        old_value TEXT,
        new_value TEXT,
        changed_by INT,
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
        FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
        console.log('✅ Table "asset_history" created');

        // Insert default admin user (password: admin123)
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await connection.query(`
      INSERT IGNORE INTO users (username, email, password, full_name, role) 
      VALUES ('admin', 'admin@example.com', ?, 'System Administrator', 'admin')
    `, [hashedPassword]);
        console.log('✅ Default admin user created (username: admin, password: admin123)');

        // Insert sample categories
        await connection.query(`
      INSERT IGNORE INTO categories (id, name, description) VALUES
      (1, 'Computer', 'Desktop computers, laptops, and workstations'),
      (2, 'Network Equipment', 'Routers, switches, and network devices'),
      (3, 'Furniture', 'Office furniture and fixtures'),
      (4, 'Mobile Devices', 'Smartphones and tablets'),
      (5, 'Peripherals', 'Monitors, keyboards, mice, and other accessories')
    `);
        console.log('✅ Sample categories inserted');

        // Insert sample locations
        await connection.query(`
      INSERT IGNORE INTO locations (id, name, address, city, country) VALUES
      (1, 'Head Office', 'Jl. Sudirman No. 123', 'Jakarta', 'Indonesia'),
      (2, 'Branch Office - Surabaya', 'Jl. Pemuda No. 45', 'Surabaya', 'Indonesia'),
      (3, 'Warehouse', 'Jl. Industri No. 78', 'Tangerang', 'Indonesia')
    `);
        console.log('✅ Sample locations inserted');

        console.log('\n🎉 Database initialization completed successfully!');
        console.log('\n📝 Login credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123\n');

    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run the initialization
initDatabase();
