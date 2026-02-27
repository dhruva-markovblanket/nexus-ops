const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.use(authMiddleware);
router.use(roleGuard('admin'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/departments', adminController.getDepartments);
router.get('/courses', adminController.getCourses);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/announcements', adminController.getAnnouncements);
router.post('/announcements', adminController.createAnnouncement);

module.exports = router;
