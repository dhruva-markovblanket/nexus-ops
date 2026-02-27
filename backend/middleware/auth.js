const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, error: 'Authentication token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexus_ops_super_secret_jwt_key_2026_demo_only');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
