import { createLogger, format, transports } from 'winston';

export default createLogger({
    transports:
        new transports.Console({
        format: format.json(
            format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
            format.align(),
            format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        ), 
}),
});
