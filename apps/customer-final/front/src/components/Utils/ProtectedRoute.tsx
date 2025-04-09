import React, { useContext, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    const { authState } = useContext(AuthContext);

    if (authState.isLogged) {
        return <>{children}</>;
    } else {
        return <Navigate to="/" replace state={{ from: location }} />;
    }
};

export default ProtectedRoute;
