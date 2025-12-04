import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiPackage } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <FiPackage size={24} />
                    <span>Asset Management</span>
                </Link>

                <div className="navbar-menu">
                    <Link to="/assets" className="navbar-link">Assets</Link>
                    <Link to="/categories" className="navbar-link">Categories</Link>
                    <Link to="/locations" className="navbar-link">Locations</Link>
                </div>

                <div className="navbar-user">
                    <div className="user-info">
                        <FiUser size={18} />
                        <span>{user?.full_name || user?.username}</span>
                    </div>
                    <button onClick={handleLogout} className="btn-logout">
                        <FiLogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
