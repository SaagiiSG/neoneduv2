const express = require('express');
const router = express.Router();
const { login } = require('../middleware/auth');

// Login route (no authentication required)
router.post('/login', login);

module.exports = router;


