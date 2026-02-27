const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Route Imports
const authRouter = require('./routes/auth');
const studentRouter = require('./routes/student');
const teacherRouter = require('./routes/teacher');
const adminRouter = require('./routes/admin');

const app = express();

// Middleware: Security headers
app.use(helmet());

// Middleware: CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Middleware: Body Parsing
app.use(express.json());

// Middleware: Request Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rate limiting for auth
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window`
  message: { success: false, error: 'Too many login attempts, please try again later.' }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'nexus-ops-api', version: '1.2.0' });
});

// Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/student', studentRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[GlobalErrorHandler]', err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Nexus Ops API running on port ${PORT}`);
});