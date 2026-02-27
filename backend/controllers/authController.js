const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { department: true }
        });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'nexus_ops_super_secret_jwt_key_2026_demo_only',
            { expiresIn: '24h' }
        );

        let profileData = null;
        if (user.role === 'student') {
            profileData = await prisma.student.findUnique({ where: { userId: user.id } });
        } else if (user.role === 'teacher') {
            profileData = await prisma.teacher.findUnique({ where: { userId: user.id } });
        }

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department?.name,
                profileData
            }
        });
    } catch (err) {
        console.error('[authController] Login error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const logout = (req, res) => {
    // JWT is stateless; client drops token. We just return success.
    res.json({ success: true, message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { department: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        let profileData = null;
        if (user.role === 'student') {
            profileData = await prisma.student.findUnique({ where: { userId: user.id } });
        } else if (user.role === 'teacher') {
            profileData = await prisma.teacher.findUnique({ where: { userId: user.id } });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department?.name,
                profileData
            }
        });
    } catch (err) {
        console.error('[authController] Current user fetch error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = { login, logout, getMe };
