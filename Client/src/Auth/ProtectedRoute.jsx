import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import PropTypes from 'prop-types'; // Import PropTypes

const ProtectedRoute = ({ children, requiredPermissions }) => {
    const { isLoggedIn, user } = useContext(AuthContext);

    const hasRequiredPermissions = (userPermissions, requiredPermissions) => {
        if (!requiredPermissions) return true;
        return requiredPermissions.every((permission) =>
            userPermissions?.includes(permission)
        );
    };

    if (!isLoggedIn) {
        // Redirect to the login page if not logged in
        return <Navigate to="/login" />;
    }

    // Make sure that the permission array is defined in the user object
    if (!user || !hasRequiredPermissions(user.permissions, requiredPermissions)) {
        return <div>You dont have access to view this content</div>;
    }

    return children;
};

// PropTypes validation
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, // children must be a valid React node
    requiredPermissions: PropTypes.arrayOf(PropTypes.string), // requiredPermissions should be an array of strings
};

export default ProtectedRoute;
