const { Router } = require('express');
const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const router = Router();
const Auth = require('../middleware/AuthMiddleware');

router.post('/update', Auth, async (req, res) => {
  try {
    const { userId, oldpassword, newpassword } = req.body;

    const candidate = await User.findOne({ userId });
    if (oldpassword !== candidate.password) {
      return res.status(400).json({ message: 'Невірний пароль' });
    }
    await User.updateOne({ _id: candidate._id }, { $set: { password: req.body.newpassword } });
    return res.status(201).json({ message: 'Пароль змінено' });
  } catch (e) {
    return res.status(500).json({ message: 'Щось не то' });
  }
});

router.get('/generate', async (req, res) => {
  try {
    const generate = await axios.get('https://www.passwordrandom.com/query?command=password');
    const password = await generate.data;
    res.json(password);
  } catch (e) {
    res.status(500).json({ message: 'Помилка генерації' });
  }
});

router.post(
  '/register',
  [
    check('email', 'Некоректний email').isEmail(),
    check('password', 'Мінімальна довжина 5 символів та максимальна 20 символів').isLength({ min: 5, max: 20 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array(), message: 'Некоректні дані при регістрації' });
      }

      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        res.status(400).json({ message: 'Користувач вже існує' });
      }
      const user = new User({ email, password });
      await user.save();
      res.status(201).json({ message: 'Користувач зареєстрований' });
    } catch (e) {
      res.status(500).json({ message: 'Щось не то' });
    }
  },
);

router.post(
  '/login',
  [
    check('email', 'Введіть коректний імейл').normalizeEmail().isEmail(),
    check('password', 'Введіть пароль').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array(), message: 'Некоректні дані при вході' });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'Користувач не існує' });
      }

      const isMatch = await User.findOne({ password });
      if (!isMatch) {
        res.status(400).json({ message: 'Неправильний пароль' });
      }

      const token = jwt.sign(
        { userId: user.id, roles: user.role },
        config.get('jwtSecret'),
        { expiresIn: '1h' },
      );

      res.json({ token, userId: user.id, roles: user.role });
    } catch (e) {
      res.status(500).json({ message: 'Щось не то' });
    }
  },
);

module.exports = router;
