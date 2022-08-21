const jwt = require('jsonwebtoken');
const logger = require('../winston');
const { checkErrorCode } = require('../error/response');
const { errorID } = require('../config/errorID');
const { errorType } = require('../config/errorType');

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                logger.error('Відсутня авторизація')
                return res.status(checkErrorCode('AUTHORIZATION')).json({
            errors: { 
                    id: `RM${errorID.AUTHORIZATION}`, 
                    code: errorType.AUTHORIZATION, 
                    title: 'Відсутня авторизація',
                    detail: 'Відсутній токен чи минув час існування',
                    source: `${req.originalUrl}`,
            },
                  });
            }
            const decoded = jwt.verify(token, process.env.jwtSecret);
            if (decoded.role !== role) {
                logger.error('Немає доступу')
                return res.status(checkErrorCode('ACCESS')).json({
            errors: { 
                    id: `RM${errorID.ACCESS}`, 
                    code: errorType.ACCESS, 
                    title: 'Немає доступу',
                    detail: 'До цього блоку доступ має лише адміністратор',
                    source: `${req.originalUrl}`,
                },
                  });
            }
            req.user = decoded;
            next()
        } catch (e) {
            logger.error(`Щось не то - ${req.originalUrl}`)
            return res.status(checkErrorCode('SERVER')).json({
            errors: { 
                id: `RM${errorID.SERVER}`, 
                code: errorType.SERVER, 
                title: 'Щось не то',
                detail: 'Відбулась помилка на стороні сервера',
                source: `${req.originalUrl}`,
            },
              });
        }
    };
}
