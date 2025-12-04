import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FiPackage, FiMapPin, FiTag, FiTrendingUp } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [assetsRes, categoriesRes, locationsRes] = await Promise.all([
                api.get('/assets'),
                api.get('/categories'),
                api.get('/locations')
            ]);

            const assets = assetsRes.data.data;
            const statusCounts = {
                available: assets.filter(a => a.status === 'available').length,
                in_use: assets.filter(a => a.status === 'in_use').length,
                maintenance: assets.filter(a => a.status === 'maintenance').length,
                retired: assets.filter(a => a.status === 'retired').length,
            };

            setStats({
                totalAssets: assets.length,
                totalCategories: categoriesRes.data.count,
                totalLocations: locationsRes.data.count,
                statusCounts
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
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
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p>Overview of your asset management system</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card stat-primary">
                        <div className="stat-icon">
                            <FiPackage size={32} />
                        </div>
                        <div className="stat-content">
                            <h3>Total Assets</h3>
                            <p className="stat-number">{stats?.totalAssets || 0}</p>
                        </div>
                    </div>

                    <div className="stat-card stat-success">
                        <div className="stat-icon">
                            <FiTag size={32} />
                        </div>
                        <div className="stat-content">
                            <h3>Categories</h3>
                            <p className="stat-number">{stats?.totalCategories || 0}</p>
                        </div>
                    </div>

                    <div className="stat-card stat-info">
                        <div className="stat-icon">
                            <FiMapPin size={32} />
                        </div>
                        <div className="stat-content">
                            <h3>Locations</h3>
                            <p className="stat-number">{stats?.totalLocations || 0}</p>
                        </div>
                    </div>

                    <div className="stat-card stat-warning">
                        <div className="stat-icon">
                            <FiTrendingUp size={32} />
                        </div>
                        <div className="stat-content">
                            <h3>In Use</h3>
                            <p className="stat-number">{stats?.statusCounts?.in_use || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="card">
                        <h2>Asset Status</h2>
                        <div className="status-list">
                            <div className="status-item">
                                <span className="badge badge-success">Available</span>
                                <span className="status-count">{stats?.statusCounts?.available || 0}</span>
                            </div>
                            <div className="status-item">
                                <span className="badge badge-info">In Use</span>
                                <span className="status-count">{stats?.statusCounts?.in_use || 0}</span>
                            </div>
                            <div className="status-item">
                                <span className="badge badge-warning">Maintenance</span>
                                <span className="status-count">{stats?.statusCounts?.maintenance || 0}</span>
                            </div>
                            <div className="status-item">
                                <span className="badge badge-danger">Retired</span>
                                <span className="status-count">{stats?.statusCounts?.retired || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2>Quick Actions</h2>
                        <div className="quick-actions">
                            <Link to="/assets/new" className="btn btn-primary">
                                <FiPackage />
                                Add New Asset
                            </Link>
                            <Link to="/categories" className="btn btn-secondary">
                                <FiTag />
                                Manage Categories
                            </Link>
                            <Link to="/locations" className="btn btn-outline">
                                <FiMapPin />
                                Manage Locations
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
