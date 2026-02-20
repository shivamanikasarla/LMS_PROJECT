import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ permission, children }) => {
    const { user, hasPermission } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (permission && !hasPermission(permission)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
