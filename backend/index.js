const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
