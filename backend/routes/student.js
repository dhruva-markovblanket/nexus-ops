const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

// Apply auth and role-check middleware to all student routes
router.use(authMiddleware);
router.use(roleGuard('student'));

router.get('/profile', studentController.getProfile);
router.get('/courses', studentController.getCourses);
router.get('/grades', studentController.getGrades);
router.get('/timetable', studentController.getTimetable);
router.get('/exams', studentController.getExams);
router.get('/assignments', studentController.getAssignments);
router.post('/assignments/:id/submit', studentController.submitAssignment);
router.get('/announcements', studentController.getAnnouncements);
router.get('/attendance', studentController.getAttendance);

module.exports = router;
