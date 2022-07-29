const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('../winston');

module.exports = function(role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                logger.error(`Відсутня авторизація`)
                return res.status(401).json({message: "Відсутня авторизація"})
            }
            const decoded = jwt.verify(token, config.get('jwtSecret'));
            if (decoded.role !== role) {
                logger.error("Немає доступу")
                return res.status(403).json({message: "Немає доступу"})
            }
            req.user = decoded;
            next()
        } catch (e) {
            logger.error(`Щось не то - ${req.originalUrl}`)
            res.status(401).json({message: "Щось не то"})
        }
    };
}
