const { Router } = require('express');
const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../winston');
const Auth = require('../middleware/AuthMiddleware');

const router = Router();

router.post('/update', Auth, async (req, res) => {
  try {
    const { userId, oldpassword, newpassword } = req.body;

    const candidate = await User.findOne({ userId });
    if (oldpassword !== candidate.password) {
      logger.error('Невірнй старий пароль');
      return res.status(400).json({ message: 'Невірний пароль' });
    }
    await User.updateOne({ _id: candidate._id }, { $set: { password: req.body.newpassword } });
    logger.info('Пароль успішно змінено');
    return res.status(201).json({ message: 'Пароль змінено' });
  } catch (e) {
    logger.error(`Щось не то - ${res.statusMessage} - ${req.originalUrl}`);
    return res.status(500).json({ message: 'Щось не то' });
  }
});

router.get('/generate', async (req, res) => {
  try {
    const generate = await axios.get('https://www.passwordrandom.com/query?command=password');
    const password = await generate.data;
    res.json(password);
  } catch (e) {
    logger.error('Помилка генерації пароля');
    return res.status(500).json({ message: 'Помилка генерації' });
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
        logger.error('Некоректні дані при регістрації');
        return res.status(400).json({ errors: errors.array(), message: 'Некоректні дані при регістрації' });
      }

      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        logger.error('Користувач вже існує');
        return res.status(400).json({ message: 'Користувач вже існує' });
      }
      const user = new User({ email, password });
      await user.save();
      logger.info('Користувач зареєстрований');
      return res.status(201).json({ message: 'Користувач зареєстрований' });
    } catch (e) {
      logger.error(`${res.status(500)} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      return res.status(500).json({ message: 'Щось не то' });
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
        logger.error(`Некоректні дані при вході користувача ${email}`);
        return res.status(400).json({ errors: errors.array(), message: 'Некоректні дані при вході' });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        logger.error(`Користувач ${email} не існує`);
        return res.status(400).json({ message: 'Користувач не існує' });
      }

      const isMatch = await User.findOne({ password });
      if (!isMatch) {
        logger.error(`Неправильний пароль користувача ${email}`);
        return res.status(400).json({ message: 'Неправильний пароль' });
      }

      const token = jwt.sign(
        { userId: user.id, roles: user.role },
        config.get('jwtSecret'),
        { expiresIn: '1h' },
      );
      logger.info(`Вхід користувача ${email}`);
      res.json({ token, userId: user.id, roles: user.role });
    } catch (e) {
      logger.error(`${res.status(500)} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      return res.status(500).json({ message: 'Щось не то' });
    }
  },
);

module.exports = router;
