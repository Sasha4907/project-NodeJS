const winston = require("winston");

const logger = winston.createLogger({
    transports:
        new winston.transports.Console({
        format: winston.format.json(
            winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
            winston.format.align(),
            winston.format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        ), 
}),
});

module.exports = logger;
