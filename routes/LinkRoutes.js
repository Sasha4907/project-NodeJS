const { Router } = require('express');
const shortid = require('shortid');
const logger = require('../winston');
const Link = require('../models/Link');
const Status = require('../models/Status');
const Auth = require('../middleware/AuthMiddleware');
const { checkErrorCode } = require('../error/response');
const { errorID } = require('../config/errorID');
const { errorType } = require('../config/errorType');

const router = Router();

router.post('/update/:id', Auth, async (req, res) => {
  try {
    const candidate = await Link.findById(req.params.id);
    await Link.updateOne({ _id: candidate._id }, { $set: { status: 'Прочитані' } });
    logger.info('Статус книжки змінено');
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(checkErrorCode('UPDATING')).json({
            'HTTP/1.1': `${checkErrorCode(errorType.UPDATING)} ${errorType.UPDATING}`,
          'Content-Type': req.headers.accept,

            errors: [{ 
      id: `LR${errorID.UPDATING}`, 
      code: errorType.UPDATING, 
      title: 'Помилка зміни статусу',
      detail: `Не вдалось змінити статус на ${'Прочитані'}`,
      source: `${req.originalUrl}`,
    }],
    });
  }
});

router.post('/create', Auth, async (req, res) => {
  try {
    const { baseURL } = process.env;
    const { from, name, status } = req.body;

    const code = shortid.generate();
    const existing = await Link.findOne({ from });
    if (existing) {
      return (res.json({ link: existing }));
    }
    
    const check = await Status.findOne({ name: status });
    if (!check) {
      logger.error('Помилка статусу');
      return res.status(checkErrorCode('CREATING')).json({
            'HTTP/1.1': `${checkErrorCode(errorType.CREATING)} ${errorType.CREATING}`,
          'Content-Type': req.headers.accept,

            errors: [{ 
        id: `LR${errorID.CREATING}`, 
        code: errorType.CREATING, 
        title: 'Помилка статусу',
        detail: 'Помилка передачі значення статусу в базу даних',
        source: `${req.originalUrl}`,
      }],
      });
    }
    const to = `${baseURL}/t/${code}`;

    const link = new Link({
      name, status, code, to, from, owner: req.user.userId,
    });
    logger.info('Нову книжку додано');
    await link.save();
    return res.status(checkErrorCode('SUCCESS')).json({ link });
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(checkErrorCode('SERVER')).json({
            'HTTP/1.1': `${checkErrorCode(errorType.SERVER)} ${errorType.SERVER}`,
          'Content-Type': req.headers.accept,

            errors: [{ 
      id: `LR${errorID.SERVER}`, 
      code: errorType.SERVER, 
      title: 'Щось не то',
      detail: 'Відбулась помилка на стороні сервера',
      source: `${req.originalUrl}`,
    }],
    });
  }
});

router.get('/', Auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);    
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(checkErrorCode('SERVER')).json({
            'HTTP/1.1': `${checkErrorCode(errorType.SERVER)} ${errorType.SERVER}`,
          'Content-Type': req.headers.accept,

            errors: [{ 
      id: `LR${errorID.SERVER}`, 
      code: errorType.SERVER, 
      title: 'Щось не то',
      detail: 'Відбулась помилка на стороні сервера',
      source: `${req.originalUrl}`,
    }],
    });
  }
});

router.get('/:id', Auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(checkErrorCode('SERVER')).json({
            'HTTP/1.1': `${checkErrorCode(errorType.SERVER)} ${errorType.SERVER}`,
          'Content-Type': req.headers.accept,

            errors: [{ 
      id: `LR${errorID.SERVER}`, 
      code: errorType.SERVER, 
      title: 'Щось не то',
      detail: 'Відбулась помилка на стороні сервера',
      source: `${req.originalUrl}`,
    }],
    });
  }
});

router.get('/delete/:id', Auth, async (req, res) => {
  try {
    await Link.findByIdAndDelete(req.params.id);
    logger.info('Книжку видалено');
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(checkErrorCode('SERVER')).json({
            'HTTP/1.1': `${checkErrorCode(errorType.SERVER)} ${errorType.SERVER}`,
          'Content-Type': req.headers.accept,

            errors: [{ 
      id: `LR${errorID.SERVER}`, 
      code: errorType.SERVER, 
      title: 'Щось не то',
      detail: 'Відбулась помилка на стороні сервера',
      source: `${req.originalUrl}`,
    }],
    });
  }
});

module.exports = router;
