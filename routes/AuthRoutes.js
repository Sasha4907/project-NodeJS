const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../winston');
const Auth = require('../middleware/AuthMiddleware');
const { checkErrorCode } = require('../error/response');
const { errorID } = require('../config/errorID');
const { errorType } = require('../config/errorType');

const router = Router();

router.post('/update', Auth, async (req, res) => {
  try {
    const { oldpassword } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const candidate = await User.findById(decoded.userId);
    if (oldpassword !== candidate.password) {
      logger.error('Невірнй старий пароль');
      return res.status(checkErrorCode('UPDATING')).send({
            'HTTP/1.1': `${checkErrorCode(errorType.UPDATING)} ${errorType.UPDATING}`,
          'Content-Type': req.headers.accept,

            errors: { 
        id: `AR${errorID.UPDATING}`, 
        code: errorType.UPDATING, 
        title: 'Невірний пароль',
        detail: 'Невірно введений старий пароль',
        source: `${req.originalUrl}`,
      },
      });
    }
    await User.updateOne({ _id: candidate._id }, { $set: { password: req.body.newpassword } });
    logger.info('Пароль успішно змінено');
    return res.status(checkErrorCode('SUCCESS')).send({
            'HTTP/1.1': `${checkErrorCode(errorType.SUCCESS)} ${errorType.SUCCESS}`,
          'Content-Type': req.headers.accept,

            errors: { 
      id: `AR${errorID.SUCCESS}`, 
      code: errorType.SUCCESS, 
      title: 'Пароль змінено',
    },
    });
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(checkErrorCode('SERVER')).send({
            'HTTP/1.1': `${checkErrorCode(errorType.SERVER)} ${errorType.SERVER}`,
          'Content-Type': req.headers.accept,

            errors: { 
      id: `AR${errorID.SERVER}`, 
      code: errorType.SERVER, 
      title: 'Помилка зміни пароля',
      detail: 'Відбулась помилка на стороні сервера',
      source: `${req.originalUrl}`,
    },
    });
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
      const errorsVal = validationResult(req);
      if (!errorsVal.isEmpty()) {
        logger.error('Некоректні дані при регістрації');
        return res.status(checkErrorCode('CREATING')).send({
            'HTTP/1.1': `${checkErrorCode(errorType.CREATING)} ${errorType.CREATING}`,
          'Content-Type': req.headers.accept,

            errors: { 
          id: `AR${errorID.CREATING}`, 
          code: errorType.CREATING, 
          title: 'Некоректні дані при регістрації',
          detail: 'Некоректний email чи довжина пароля',
          source: `${req.originalUrl}`,
        },
        });
      }

      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        logger.error('Користувач вже існує');
        return res.status(checkErrorCode('CREATING')).send({
          'HTTP/1.1': `${checkErrorCode(errorType.CREATING)} ${errorType.CREATING}`,
          'Content-Type': req.headers.accept,

            errors: {
              id: `AR${errorID.CREATING}`, 
              code: errorType.CREATING, 
              title: 'Користувач вже існує',
              detail: 'Користувач вже існує в базі даних',
              source: `${req.originalUrl}`,
            },
          });
      }
      const user = new User({ email, password });
      await user.save();
      logger.info('Користувач зареєстрований');
      return res.status(checkErrorCode('SUCCESS')).send({
            'HTTP/1.1': `${checkErrorCode(errorType.SUCCESS)} ${errorType.SUCCESS}`,
          'Content-Type': req.headers.accept,

            errors: { 
        id: `AR${errorID.SUCCESS}`, 
        code: errorType.SUCCESS, 
        title: 'Користувач зареєстрований',
      },
      });
    } catch (e) {
      logger.error(`${res.status(500)} - ${req.originalUrl} - ${req.method}`);
      return res.status(checkErrorCode('SERVER')).send({
            'HTTP/1.1': `${checkErrorCode(errorType.SERVER)} ${errorType.SERVER}`,
          'Content-Type': req.headers.accept,

            errors: { 
        id: `AR${errorID.SERVER}`, 
        code: errorType.SERVER, 
        title: 'Щось не то',
        detail: 'Відбулась помилка на стороні сервера',
        source: `${req.originalUrl}`,
      },
      });
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
      const errorsVal = validationResult(req);
      if (!errorsVal.isEmpty()) {
        logger.error('Некоректні дані при вході');
        return res.status(checkErrorCode('VALIDATING')).send({
            'HTTP/1.1': `${checkErrorCode(errorType.VALIDATING)} ${errorType.VALIDATING}`,
          'Content-Type': req.headers.accept,

            errors: { 
          id: `AR${errorID.VALIDATING}`, 
          code: errorType.VALIDATING, 
          title: 'Некоректні дані при вході',
          detail: 'Некоректний email чи пусте поле пароля',
          source: `${req.originalUrl}`,
        },
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        logger.error(`Користувач ${email} не існує`);
        res.status(checkErrorCode('NOT_FOUND')).send({
            'HTTP/1.1': `${checkErrorCode(errorType.NOT_FOUND)} ${errorType.NOT_FOUND}`,
          'Content-Type': req.headers.accept,

            errors: { 
          id: `AR${errorID.NOT_FOUND}`, 
          code: errorType.NOT_FOUND, 
          title: 'Користувач не існує',
          detail: 'Спочатку треба зареєструватись',
          source: `${req.originalUrl}`,
        },
        });
      } else {
          if (password !== user.password) {
            logger.error(`Неправильний пароль користувача ${email}`);
            return res.status(checkErrorCode('VALIDATING')).send({
            'HTTP/1.1': `${checkErrorCode(errorType.VALIDATING)} ${errorType.VALIDATING}`,
          'Content-Type': req.headers.accept,

            errors: { 
              id: `AR${errorID.VALIDATING}`, 
              code: errorType.VALIDATING, 
              title: 'Некоректні дані при вході',
              detail: `Неправильний пароль користувача ${email}`,
              source: `${req.originalUrl}`,
            },
            });
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
      return res.status(checkErrorCode('SERVER')).send({
            'HTTP/1.1': `${checkErrorCode(errorType.SERVER)} ${errorType.SERVER}`,
          'Content-Type': req.headers.accept,

            errors: { 
        id: `AR${errorID.SERVER}`, 
        code: errorType.SERVER, 
        title: 'Щось не то',
        detail: 'Відбулась помилка на стороні сервера',
        source: `${req.originalUrl}`,
      },
      });
    }
  },
);

module.exports = router;
