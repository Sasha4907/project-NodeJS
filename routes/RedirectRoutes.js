const { Router } = require('express');
const Link = require('../models/Link');
const logger = require('../winston');
const { checkErrorCode } = require('../error/response');
const { errorID } = require('../config/errorID');
const { errorType } = require('../config/errorType');

const router = Router();

router.get('/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });

    if (link) {
      link.clicks++;
      await link.save();
      return res.redirect(link.from);
    }
    logger.info('Посилання на книжку не знайдено');
    return res.status(checkErrorCode('NOT_FOUND')).json({
            'HTTP/1.1': `${checkErrorCode(errorType.NOT_FOUND)} ${errorType.NOT_FOUND}`,
          'Content-Type': req.headers.accept,

            errors: [{ 
      id: `RR${errorID.NOT_FOUND}`, 
      code: errorType.NOT_FOUND, 
      title: 'Посилання не знайдено',
      detail: 'Посилання не існує чи змінена адреса',
      source: `${req.originalUrl}`,
    }],
    });
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(checkErrorCode('SERVER')).json({
            'HTTP/1.1': `${checkErrorCode(errorType.SERVER)} ${errorType.SERVER}`,
          'Content-Type': req.headers.accept,

            errors: [{ 
        id: `RR${errorID.SERVER}`, 
        code: errorType.SERVER, 
        title: 'Щось не то',
        detail: 'Відбулась помилка на стороні сервера',
        source: `${req.originalUrl}`,
      }],
      });
  }
});

module.exports = router;
