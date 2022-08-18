const jwt = require('jsonwebtoken');
const logger = require('../winston');
const { checkErrorCode } = require('../error/response');
const { errorID } = require('../config/errorID');
const { errorType } = require('../config/errorType');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      logger.error(`Відсутня авторизація - ${req.originalUrl}`)
      return res.status(checkErrorCode('AUTHORIZATION')).json({ 
        id: `AM${errorID.AUTHORIZATION}`, 
        code: errorType.AUTHORIZATION, 
        title: 'Відсутня авторизація',
        detail: 'Відсутній токен чи минув час існування',
        source: `${req.originalUrl}`,
      });
    }

    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded;

    next();
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`)
    return res.status(checkErrorCode('SERVER')).json({ 
      id: `AM${errorID.SERVER}`, 
      code: errorType.SERVER, 
      title: 'Щось не то',
      detail: 'Відбулась помилка на стороні сервера',
      source: `${req.originalUrl}`,
    });
  }
};
