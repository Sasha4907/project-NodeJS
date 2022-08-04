const jwt = require('jsonwebtoken');
const logger = require('../winston');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      logger.error(`Відсутня авторизація - ${req.originalUrl}`)
      return res.status(401).json({ message: 'Відсутня авторизація' });
    }

    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded;

    next();
  } catch (e) {
    logger.error(`Відсутня авторизація - ${req.originalUrl}`)
    return res.status(401).json({ message: 'Відсутня авторизація' });
  }
};
