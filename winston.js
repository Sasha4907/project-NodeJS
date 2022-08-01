const winston = require('winston');

const logger = winston.createLogger({
    transports:
        new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
            winston.format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            winston.format.json(),
        ), 
}),
});

module.exports = logger;
