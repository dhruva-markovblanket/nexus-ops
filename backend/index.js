const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

// Auth routes
app.use('/api/auth', authRouter);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});