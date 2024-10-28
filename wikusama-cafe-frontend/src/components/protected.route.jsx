import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return <Navigate to="/" />;
    }

    let userRole;
    try {
        const decoded = jwtDecode(token);
        userRole = decoded.role;
    } catch (error) {
        return <Navigate to="/unauthorized" replace/>;
    };

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace/>;
    }

    return element;
}

export default ProtectedRoute;