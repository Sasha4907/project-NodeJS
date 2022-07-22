const { Router } = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Auth = require('../middleware/AuthMiddleware');

const router = Router();

router.post('/admin', Auth, async (req, res) => {
  try {
    const { email, newpassword } = req.body;

    const candidate = await User.findOne({ email });
    await User.updateOne({ email: candidate.email }, { $set: { password: req.body.newpassword } })(res.status(201).json({ message: 'Пароль змінено' }));
  } catch (e) {
    res.status(500).json({ message: 'Щось не то' });
  }
});

module.exports = router;
