const { Router } = require('express');
const User = require('../models/User');
const logger = require('../winston');
const checkRole = require('../middleware/checkRoleMiddleware')
const { checkErrorCode } = require('../error/response');
const { errorID } = require('../config/errorID');
const { errorType } = require('../config/errorType');

const router = Router();

router.post('/adminpanel', checkRole('Admin'), async (req, res) => {
  try {
    const { email, role } = req.body;
    const candidate = await User.findOne({ email });
    if (!candidate) {
        logger.error(`Користувач ${email} не існує`);
        res.status(checkErrorCode('NOT_FOUND')).send({
            errors: [{ 
          id: `AdR${errorID.NOT_FOUND}`, 
          code: errorType.NOT_FOUND, 
          title: 'Користувач не існує',
          detail: 'Користувач не існує в базі даних',
          source: `${req.originalUrl}`,
        }],
        });
      } else {
    await User.updateOne({ email: candidate.email }, { $set: { password: req.body.password } });
    if (role === 'true') {
        await User.updateOne({ email: candidate.email }, { $set: { role: 'Admin' } });
    }
    logger.info(`Пароль користувача ${email} успішно змінено`);
    return res.status(checkErrorCode('SUCCESS')).send({
            errors: [{ 
      id: `AdR${errorID.SUCCESS}`, 
      code: errorType.SUCCESS, 
      title: 'Пароль користувача змінено',
    }],
    });
    }
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(checkErrorCode('SERVER')).send({
            errors: [{ 
      id: `AdR${errorID.SERVER}`, 
      code: errorType.SERVER, 
      title: 'Щось не то',
      detail: 'Відбулась помилка на стороні сервера',
      source: `${req.originalUrl}`,
    }],
    });
  }
});

module.exports = router;
