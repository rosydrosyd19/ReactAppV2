import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import AssetForm from './pages/AssetForm';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/assets"
                        element={
                            <PrivateRoute>
                                <Assets />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/assets/new"
                        element={
                            <PrivateRoute>
                                <AssetForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/assets/edit/:id"
                        element={
                            <PrivateRoute>
                                <AssetForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/categories"
                        element={
                            <PrivateRoute>
                                <div>Categories Page (Coming Soon)</div>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/locations"
                        element={
                            <PrivateRoute>
                                <div>Locations Page (Coming Soon)</div>
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
