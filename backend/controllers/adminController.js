const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
    try {
        const studentCount = await prisma.student.count();
        const teacherCount = await prisma.teacher.count();
        const courseCount = await prisma.course.count();
        const deptCount = await prisma.department.count();
        res.json({ success: true, data: { students: studentCount, teachers: teacherCount, courses: courseCount, departments: deptCount } });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({ include: { department: true } });
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, role, departmentId, password } = req.body;
        const passwordHash = await bcrypt.hash(password || '12052024', 10);
        const user = await prisma.user.create({
            data: { name, email, role, departmentId, passwordHash }
        });

        // Auto create profile based on role
        if (role === 'student') await prisma.student.create({ data: { userId: user.id, enrollmentYear: new Date().getFullYear() } });
        if (role === 'teacher') await prisma.teacher.create({ data: { userId: user.id, designation: 'Faculty', subjects: '' } });

        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, role, departmentId } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { name, email, role, departmentId }
        });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getDepartments = async (req, res) => {
    try {
        const depts = await prisma.department.findMany({ include: { head: { include: { user: true } }, _count: { select: { users: true, courses: true } } } });
        res.json({ success: true, data: depts });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({ include: { department: true, teacher: { include: { user: true } }, _count: { select: { enrollments: true } } } });
        res.json({ success: true, data: courses });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getAuditLogs = async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({ include: { user: true }, orderBy: { timestamp: 'desc' }, take: 200 });
        res.json({ success: true, data: logs });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: announcements });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const createAnnouncement = async (req, res) => {
    try {
        const { title, body, targetRole } = req.body;
        const announcement = await prisma.announcement.create({
            data: { title, body, targetRole, authorId: req.user.id }
        });
        res.json({ success: true, data: announcement });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = {
    getStats, getUsers, createUser, updateUser, deleteUser,
    getDepartments, getCourses, getAuditLogs, getAnnouncements, createAnnouncement
};
