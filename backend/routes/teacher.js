const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.use(authMiddleware);
router.use(roleGuard('teacher'));

router.get('/profile', teacherController.getProfile);
router.get('/courses', teacherController.getCourses);
router.get('/courses/:id/students', teacherController.getCourseStudents);
router.post('/grades', teacherController.updateGrades);
router.get('/assignments', teacherController.getAssignments);
router.post('/assignments', teacherController.createAssignment);
router.put('/assignments/:id', teacherController.updateAssignment);
router.get('/assignments/:id/submissions', teacherController.getSubmissions);
router.put('/submissions/:id/grade', teacherController.gradeSubmission);
router.post('/announcements', teacherController.createAnnouncement);
router.get('/attendance/:courseId', teacherController.getAttendance);
router.post('/attendance', teacherController.markAttendance);

module.exports = router;
