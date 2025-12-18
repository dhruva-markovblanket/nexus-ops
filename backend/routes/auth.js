const express = require('express');
const router = express.Router();

// ID must be 11 chars: YY(2 digits) + ROLE(3 chars SUU|TCH|ADM) + DEPT(3 uppercase letters) + 3 digits
const ID_REGEX = /^\d{2}(SUU|TCH|ADM)[A-Z]{3}\d{3}$/;
// Password is DDMMYYYY (8 digits)
const PASSWORD_REGEX = /^\d{8}$/;

function determineRole(id) {
  if (id.includes('SUU')) return 'student';
  if (id.includes('TCH')) return 'teacher';
  if (id.includes('ADM')) return 'admin';
  return null;
}

router.post('/login', (req, res) => {
  try {
    const { id, password } = req.body || {};

    // Log attempt (mask password)
    const masked = password ? '[REDACTED]' : 'none'
    console.log(`[auth] login attempt ${new Date().toISOString()} - id=${id || 'missing'} password=${masked}`)

    if (!id || typeof id !== 'string') {
      console.log('[auth] result: invalid id')
      return res.status(400).json({ success: false, error: 'Missing or invalid "id"' });
    }

    if (!password || typeof password !== 'string') {
      console.log('[auth] result: invalid password')
      return res.status(400).json({ success: false, error: 'Missing or invalid "password"' });
    }

    if (id.length !== 11) {
      console.log('[auth] result: id length invalid')
      return res.status(400).json({ success: false, error: 'ID must be exactly 11 characters' });
    }

    if (!ID_REGEX.test(id)) {
      console.log('[auth] result: id format invalid')
      return res.status(400).json({ success: false, error: 'ID format invalid. Expected YY(ROLE)DEPT### with ROLE one of SUU, TCH, ADM and DEPT 3 uppercase letters' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      console.log('[auth] result: password format invalid')
      return res.status(400).json({ success: false, error: 'Password must be DOB in DDMMYYYY format (exactly 8 digits)' });
    }

    const role = determineRole(id);
    if (!role) {
      console.log('[auth] result: role detection failed')
      return res.status(400).json({ success: false, error: 'Unable to determine role from ID' });
    }

    console.log(`[auth] result: success role=${role}`)
    return res.json({ success: true, role, id });
  } catch (err) {
    console.error('[auth] unexpected error', err)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
});

module.exports = router;
