import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
        // Redirect to their respective dashboard if they try to access another role's route
        return <Navigate to={`/${user.role}`} replace />;
    }

    return children;
};

export default ProtectedRoute;
