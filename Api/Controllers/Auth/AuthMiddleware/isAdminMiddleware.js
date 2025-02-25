const isAdmin = (req, res, next) => {
    console.log('isAdmin middleware - req.user:', req.user); // Add logging
    if (req.user && req.user.role_name === 'Admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
};

module.exports = isAdmin;