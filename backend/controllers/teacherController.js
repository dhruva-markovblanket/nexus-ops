const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfile = async (req, res) => {
    try {
        const teacher = await prisma.teacher.findUnique({
            where: { userId: req.user.id },
            include: { user: { include: { department: true } } }
        });
        res.json({ success: true, data: teacher });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getCourses = async (req, res) => {
    try {
        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        const courses = await prisma.course.findMany({
            where: { teacherId: teacher.id },
            include: { department: true }
        });
        res.json({ success: true, data: courses });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getCourseStudents = async (req, res) => {
    try {
        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        // Ensure teacher owns course
        const course = await prisma.course.findFirst({ where: { id: req.params.id, teacherId: teacher.id } });
        if (!course) return res.status(403).json({ success: false, error: 'Forbidden' });

        const enrollments = await prisma.enrollment.findMany({
            where: { courseId: req.params.id },
            include: { student: { include: { user: true } } }
        });
        res.json({ success: true, data: enrollments });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const updateGrades = async (req, res) => {
    try {
        // expect { studentId, courseId, grade }
        const { studentId, courseId, grade } = req.body;
        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        const course = await prisma.course.findFirst({ where: { id: courseId, teacherId: teacher.id } });
        if (!course) return res.status(403).json({ success: false, error: 'Forbidden' });

        const enrollment = await prisma.enrollment.update({
            where: { studentId_courseId: { studentId, courseId } },
            data: { grade }
        });
        res.json({ success: true, data: enrollment });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getAssignments = async (req, res) => {
    try {
        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        const courses = await prisma.course.findMany({ where: { teacherId: teacher.id }, select: { id: true } });
        const courseIds = courses.map(c => c.id);

        const assignments = await prisma.assignment.findMany({
            where: { courseId: { in: courseIds } },
            include: { course: true, submissions: true },
            orderBy: { dueDate: 'asc' }
        });
        res.json({ success: true, data: assignments });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const createAssignment = async (req, res) => {
    try {
        const { courseId, title, description, dueDate, maxMarks } = req.body;
        const assignment = await prisma.assignment.create({
            data: { courseId, title, description, maxMarks: parseInt(maxMarks), dueDate: new Date(dueDate) }
        });
        res.json({ success: true, data: assignment });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const updateAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, maxMarks } = req.body;
        const assignment = await prisma.assignment.update({
            where: { id: req.params.id },
            data: { title, description, maxMarks: parseInt(maxMarks), dueDate: new Date(dueDate) }
        });
        res.json({ success: true, data: assignment });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getSubmissions = async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            where: { assignmentId: req.params.id },
            include: { student: { include: { user: true } } }
        });
        res.json({ success: true, data: submissions });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const gradeSubmission = async (req, res) => {
    try {
        const { marks, feedback } = req.body;
        const submission = await prisma.submission.update({
            where: { id: req.params.id },
            data: { marks: parseInt(marks), feedback }
        });
        res.json({ success: true, data: submission });
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

const getAttendance = async (req, res) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { courseId: req.params.courseId },
            include: { student: { include: { user: true } } }
        });
        res.json({ success: true, data: enrollments });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const markAttendance = async (req, res) => {
    try {
        const { studentId, courseId, attendancePercent } = req.body;
        const enrollment = await prisma.enrollment.update({
            where: { studentId_courseId: { studentId, courseId } },
            data: { attendance: parseFloat(attendancePercent) }
        });
        res.json({ success: true, data: enrollment });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = {
    getProfile, getCourses, getCourseStudents, updateGrades,
    getAssignments, createAssignment, updateAssignment,
    getSubmissions, gradeSubmission, createAnnouncement,
    getAttendance, markAttendance
};
