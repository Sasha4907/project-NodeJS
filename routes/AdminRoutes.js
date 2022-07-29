const { Router } = require('express');
const User = require('../models/User');
const logger = require('../winston');
const checkRole = require('../middleware/checkRoleMiddleware')

const router = Router();

router.post('/adminpanel', checkRole('Admin'), async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const candidate = await User.findOne({ email });
    if (!candidate) {
        logger.error(`Користувач ${email} не існує`);
        res.status(400).json({ message: 'Користувач не існує' });
      } else {
    await User.updateOne({ email: candidate.email }, { $set: { password: req.body.password } });
    if (role === 'true') {
        await User.updateOne({ email: candidate.email }, { $set: { role: 'Admin' } });
    }
    logger.info(`Пароль користувача ${email} успішно змінено`);
    return res.status(201).json({ message: 'Пароль користувача змінено' });
    }
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(500).json({ message: 'Щось не то' });
  }
});

module.exports = router;
