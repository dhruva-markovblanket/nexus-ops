import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded pages
const Login = lazy(() => import('./pages/Login'));

// Lazy loaded Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminDepartments = lazy(() => import('./pages/admin/AdminDepartments'));
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'));

// Lazy loaded Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const StudentCourses = lazy(() => import('./pages/student/StudentCourses'));
const StudentGrades = lazy(() => import('./pages/student/StudentGrades'));
const StudentTimetable = lazy(() => import('./pages/student/StudentTimetable'));
const StudentExams = lazy(() => import('./pages/student/StudentExams'));
const StudentAssignments = lazy(() => import('./pages/student/StudentAssignments'));

// Lazy loaded Teacher Pages
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const TeacherCourses = lazy(() => import('./pages/teacher/TeacherCourses'));
const TeacherGradebook = lazy(() => import('./pages/teacher/TeacherGradebook'));
const TeacherAssignments = lazy(() => import('./pages/teacher/TeacherAssignments'));
const TeacherAttendance = lazy(() => import('./pages/teacher/TeacherAttendance'));
const TeacherAnnouncements = lazy(() => import('./pages/teacher/TeacherAnnouncements'));

import Toast from './components/Toast';

function App() {
  return (
    <ErrorBoundary>
      <Toast />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route path="/" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
            <Route path="/admin/overview" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/departments" element={<ProtectedRoute allowedRole="admin"><AdminDepartments /></ProtectedRoute>} />
            <Route path="/admin/courses" element={<ProtectedRoute allowedRole="admin"><AdminCourses /></ProtectedRoute>} />
            <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRole="admin"><AdminAuditLogs /></ProtectedRoute>} />
            <Route path="/admin/announcements" element={<ProtectedRoute allowedRole="admin"><AdminAnnouncements /></ProtectedRoute>} />

            {/* Student Routes */}
            <Route path="/student" element={<Navigate to="/student/overview" replace />} />
            <Route path="/student/overview" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/courses" element={<ProtectedRoute allowedRole="student"><StudentCourses /></ProtectedRoute>} />
            <Route path="/student/grades" element={<ProtectedRoute allowedRole="student"><StudentGrades /></ProtectedRoute>} />
            <Route path="/student/timetable" element={<ProtectedRoute allowedRole="student"><StudentTimetable /></ProtectedRoute>} />
            <Route path="/student/exams" element={<ProtectedRoute allowedRole="student"><StudentExams /></ProtectedRoute>} />
            <Route path="/student/assignments" element={<ProtectedRoute allowedRole="student"><StudentAssignments /></ProtectedRoute>} />

            {/* Teacher Routes */}
            <Route path="/teacher" element={<Navigate to="/teacher/overview" replace />} />
            <Route path="/teacher/overview" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/courses" element={<ProtectedRoute allowedRole="teacher"><TeacherCourses /></ProtectedRoute>} />
            <Route path="/teacher/gradebook" element={<ProtectedRoute allowedRole="teacher"><TeacherGradebook /></ProtectedRoute>} />
            <Route path="/teacher/assignments" element={<ProtectedRoute allowedRole="teacher"><TeacherAssignments /></ProtectedRoute>} />
            <Route path="/teacher/attendance" element={<ProtectedRoute allowedRole="teacher"><TeacherAttendance /></ProtectedRoute>} />
            <Route path="/teacher/announcements" element={<ProtectedRoute allowedRole="teacher"><TeacherAnnouncements /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
