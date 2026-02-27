const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfile = async (req, res) => {
    try {
        const student = await prisma.student.findUnique({
            where: { userId: req.user.id },
            include: { user: { include: { department: true } } }
        });
        if (!student) return res.status(404).json({ success: false, error: 'Student profile not found' });
        res.json({ success: true, data: student });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getCourses = async (req, res) => {
    try {
        const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
        const enrollments = await prisma.enrollment.findMany({
            where: { studentId: student.id },
            include: { course: { include: { teacher: { include: { user: true } } } } }
        });
        res.json({ success: true, data: enrollments });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getGrades = async (req, res) => {
    try {
        const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
        const enrollments = await prisma.enrollment.findMany({
            where: { studentId: student.id },
            include: { course: true }
        });
        res.json({ success: true, data: enrollments });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getTimetable = async (req, res) => {
    try {
        const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
        const enrollments = await prisma.enrollment.findMany({ where: { studentId: student.id } });
        const courseIds = enrollments.map(e => e.courseId);

        const timetables = await prisma.timetable.findMany({
            where: { courseId: { in: courseIds } },
            include: { course: true }
        });
        res.json({ success: true, data: timetables });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getExams = async (req, res) => {
    try {
        const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
        const enrollments = await prisma.enrollment.findMany({ where: { studentId: student.id } });
        const courseIds = enrollments.map(e => e.courseId);

        const exams = await prisma.exam.findMany({
            where: { courseId: { in: courseIds } },
            include: { course: true },
            orderBy: { date: 'asc' }
        });
        res.json({ success: true, data: exams });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getAssignments = async (req, res) => {
    try {
        const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
        const enrollments = await prisma.enrollment.findMany({ where: { studentId: student.id } });
        const courseIds = enrollments.map(e => e.courseId);

        const assignments = await prisma.assignment.findMany({
            where: { courseId: { in: courseIds } },
            include: { course: true, submissions: { where: { studentId: student.id } } },
            orderBy: { dueDate: 'asc' }
        });
        res.json({ success: true, data: assignments });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const submitAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        const student = await prisma.student.findUnique({ where: { userId: req.user.id } });

        const submission = await prisma.submission.upsert({
            where: { assignmentId_studentId: { assignmentId, studentId: student.id } },
            update: { submittedAt: new Date() },
            create: { assignmentId, studentId: student.id }
        });

        res.json({ success: true, data: submission });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            where: { targetRole: { in: ['all', 'student'] } },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: announcements });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getAttendance = async (req, res) => {
    try {
        const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
        const enrollments = await prisma.enrollment.findMany({
            where: { studentId: student.id },
            select: { course: { select: { name: true, code: true } }, attendance: true }
        });
        res.json({ success: true, data: enrollments });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = {
    getProfile, getCourses, getGrades, getTimetable,
    getExams, getAssignments, submitAssignment, getAnnouncements, getAttendance
};
