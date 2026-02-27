import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Student Routes */}
        <Route path="/student" element={<Navigate to="/student/overview" replace />} />
        <Route path="/student/:tab" element={<StudentDashboard />} />

        {/* Teacher Routes */}
        <Route path="/teacher" element={<Navigate to="/teacher/overview" replace />} />
        <Route path="/teacher/:tab" element={<TeacherDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/admin/:tab" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
