const roleGuard = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ success: false, error: 'Forbidden: Insufficient role permissions' });
        }
        next();
    };
};

module.exports = roleGuard;
