import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiFilter } from 'react-icons/fi';
import './Assets.css';

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assetsRes, categoriesRes, locationsRes] = await Promise.all([
                api.get('/assets'),
                api.get('/categories'),
                api.get('/locations')
            ]);

            setAssets(assetsRes.data.data);
            setCategories(categoriesRes.data.data);
            setLocations(locationsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await api.delete(`/assets/${id}`);
                setAssets(assets.filter(asset => asset.id !== id));
            } catch (error) {
                console.error('Error deleting asset:', error);
                alert('Failed to delete asset');
            }
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            available: 'badge-success',
            in_use: 'badge-info',
            maintenance: 'badge-warning',
            retired: 'badge-danger'
        };
        return badges[status] || 'badge-info';
    };

    const filteredAssets = assets.filter(asset => {
        const matchesSearch =
            asset.name.toLowerCase().includes(search.toLowerCase()) ||
            asset.asset_tag.toLowerCase().includes(search.toLowerCase()) ||
            (asset.serial_number && asset.serial_number.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = !statusFilter || asset.status === statusFilter;
        const matchesCategory = !categoryFilter || asset.category_id === parseInt(categoryFilter);

        return matchesSearch && matchesStatus && matchesCategory;
    });

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
                        <h1>Assets</h1>
                        <p>Manage your organization's assets</p>
                    </div>
                    <Link to="/assets/new" className="btn btn-primary">
                        <FiPlus />
                        Add Asset
                    </Link>
                </div>

                <div className="card">
                    <div className="filters-section">
                        <div className="search-box">
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <div className="filter-group">
                            <FiFilter />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="in_use">In Use</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="retired">Retired</option>
                            </select>

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Asset Tag</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssets.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No assets found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAssets.map(asset => (
                                        <tr key={asset.id}>
                                            <td><strong>{asset.asset_tag}</strong></td>
                                            <td>{asset.name}</td>
                                            <td>{asset.category_name || '-'}</td>
                                            <td>{asset.location_name || '-'}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadge(asset.status)}`}>
                                                    {asset.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>{asset.assigned_to_name || '-'}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Link to={`/assets/edit/${asset.id}`} className="btn-icon btn-icon-primary">
                                                        <FiEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(asset.id)}
                                                        className="btn-icon btn-icon-danger"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-footer">
                        <p>Showing {filteredAssets.length} of {assets.length} assets</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Assets;
