const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../winston');
const Auth = require('../middleware/AuthMiddleware');

const router = Router();

router.post('/update', Auth, async (req, res) => {
  try {
    const { oldpassword } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const candidate = await User.findById(decoded.userId);
    if (oldpassword !== candidate.password) {
      logger.error('Невірнй старий пароль');
      return res.status(400).json({ message: 'Невірний пароль' });
    }
    await User.updateOne({ _id: candidate._id }, { $set: { password: req.body.newpassword } });
    logger.info('Пароль успішно змінено');
    return res.status(201).json({ message: 'Пароль змінено' });
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(500).json({ message: 'Помилка зміни пароля' });
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
      logger.error(`${res.status(500)} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      return res.status(500).json({ message: 'Щось не то' });
    }
  },
);

router.post(
  '/login',
  [
    check('email', 'Некоректний email').isEmail(),
    check('password', 'Введіть пароль').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error('Некоректні дані при вході');
        return res.status(400).json({ errors: errors.array(), message: 'Некоректні дані при вході' });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        logger.error(`Користувач ${email} не існує`);
        res.status(400).json({ message: 'Користувач не існує' });
      } else {
          if (password !== user.password) {
            logger.error(`Неправильний пароль користувача ${email}`);
            return res.status(400).json({ message: 'Некоректні дані при вході' });
          }
          const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.jwtSecret,
            { expiresIn: '1h' },
          );
          logger.info(`Вхід користувача ${email}`);
          res.json({ token, userId: user.id, roles: user.role });
      }

    } catch (e) {
      logger.error(`${res.status(500)} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      return res.status(500).json({ message: 'Щось не то' });
    }
  },
);

module.exports = router;
