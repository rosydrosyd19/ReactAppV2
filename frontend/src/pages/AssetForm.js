import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FiSave, FiX } from 'react-icons/fi';
import './AssetForm.css';

const AssetForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        asset_tag: '',
        name: '',
        category_id: '',
        location_id: '',
        serial_number: '',
        model: '',
        manufacturer: '',
        purchase_date: '',
        purchase_cost: '',
        warranty_expiry: '',
        status: 'available',
        notes: ''
    });

    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDropdownData();
        if (isEdit) {
            fetchAsset();
        }
    }, [id]);

    const fetchDropdownData = async () => {
        try {
            const [categoriesRes, locationsRes] = await Promise.all([
                api.get('/categories'),
                api.get('/locations')
            ]);
            setCategories(categoriesRes.data.data);
            setLocations(locationsRes.data.data);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    const fetchAsset = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/assets/${id}`);
            const asset = response.data.data;

            // Format dates for input fields
            setFormData({
                asset_tag: asset.asset_tag || '',
                name: asset.name || '',
                category_id: asset.category_id || '',
                location_id: asset.location_id || '',
                serial_number: asset.serial_number || '',
                model: asset.model || '',
                manufacturer: asset.manufacturer || '',
                purchase_date: asset.purchase_date ? asset.purchase_date.split('T')[0] : '',
                purchase_cost: asset.purchase_cost || '',
                warranty_expiry: asset.warranty_expiry ? asset.warranty_expiry.split('T')[0] : '',
                status: asset.status || 'available',
                notes: asset.notes || ''
            });
        } catch (error) {
            console.error('Error fetching asset:', error);
            alert('Failed to load asset data');
            navigate('/assets');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.asset_tag.trim()) {
            newErrors.asset_tag = 'Asset tag is required';
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Prepare data - convert empty strings to null for optional fields
            const submitData = {
                ...formData,
                category_id: formData.category_id || null,
                location_id: formData.location_id || null,
                purchase_cost: formData.purchase_cost || null,
                purchase_date: formData.purchase_date || null,
                warranty_expiry: formData.warranty_expiry || null
            };

            if (isEdit) {
                await api.put(`/assets/${id}`, submitData);
                alert('Asset updated successfully!');
            } else {
                await api.post('/assets', submitData);
                alert('Asset created successfully!');
            }

            navigate('/assets');
        } catch (error) {
            console.error('Error saving asset:', error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to save asset. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>{isEdit ? 'Edit Asset' : 'Add New Asset'}</h1>
                        <p>{isEdit ? 'Update asset information' : 'Create a new asset record'}</p>
                    </div>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="asset-form">
                        <div className="form-section">
                            <h3>Basic Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="asset_tag">
                                        Asset Tag <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="asset_tag"
                                        name="asset_tag"
                                        value={formData.asset_tag}
                                        onChange={handleChange}
                                        className={errors.asset_tag ? 'error' : ''}
                                        placeholder="e.g., AST-001"
                                    />
                                    {errors.asset_tag && (
                                        <span className="error-message">{errors.asset_tag}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">
                                        Asset Name <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={errors.name ? 'error' : ''}
                                        placeholder="e.g., Dell Laptop XPS 15"
                                    />
                                    {errors.name && (
                                        <span className="error-message">{errors.name}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_id">Category</label>
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="location_id">Location</label>
                                    <select
                                        id="location_id"
                                        name="location_id"
                                        value={formData.location_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Location</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="available">Available</option>
                                        <option value="in_use">In Use</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="retired">Retired</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Product Details</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="manufacturer">Manufacturer</label>
                                    <input
                                        type="text"
                                        id="manufacturer"
                                        name="manufacturer"
                                        value={formData.manufacturer}
                                        onChange={handleChange}
                                        placeholder="e.g., Dell"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="model">Model</label>
                                    <input
                                        type="text"
                                        id="model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        placeholder="e.g., XPS 15 9520"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="serial_number">Serial Number</label>
                                    <input
                                        type="text"
                                        id="serial_number"
                                        name="serial_number"
                                        value={formData.serial_number}
                                        onChange={handleChange}
                                        placeholder="e.g., SN123456789"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Purchase Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="purchase_date">Purchase Date</label>
                                    <input
                                        type="date"
                                        id="purchase_date"
                                        name="purchase_date"
                                        value={formData.purchase_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="purchase_cost">Purchase Cost</label>
                                    <input
                                        type="number"
                                        id="purchase_cost"
                                        name="purchase_cost"
                                        value={formData.purchase_cost}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="warranty_expiry">Warranty Expiry</label>
                                    <input
                                        type="date"
                                        id="warranty_expiry"
                                        name="warranty_expiry"
                                        value={formData.warranty_expiry}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Additional Notes</h3>
                            <div className="form-group">
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Any additional information about this asset..."
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/assets')}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                <FiX /> Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                <FiSave /> {loading ? 'Saving...' : (isEdit ? 'Update Asset' : 'Create Asset')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AssetForm;
