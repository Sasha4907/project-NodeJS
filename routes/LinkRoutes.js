const { Router } = require('express');
const config = require('config');
const shortid = require('shortid');
const logger = require('../winston');
const Link = require('../models/Link');
const Status = require('../models/Status');
const Auth = require('../middleware/AuthMiddleware');

const router = Router();

router.post('/update/:id', Auth, async (req, res) => {
  try {
    const candidate = await Link.findById(req.params.id);
    await Link.updateOne({ _id: candidate._id }, { $set: { status: 'Прочитані' } });
    logger.info('Статус книжки змінено');
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(500).json({ message: 'Помилка зміни статусу' });
  }
});

router.post('/create', Auth, async (req, res) => {
  try {
    const baseURL = config.get('baseURL');
    const { from, name, status } = req.body;

    const code = shortid.generate();
    const existing = await Link.findOne({ from });
    if (existing) {
      return (res.json({ link: existing }));
    }
    
    const check = await Status.findOne({ name: status });
    if (!check) {
      return res.status(404).json({ message: 'Помилка' });
    }
    const to = `${baseURL}/t/${code}`;

    const link = new Link({
      name, status, code, to, from, owner: req.user.userId,
    });
    logger.info('Нову книжку додано');
    await link.save();
    return res.status(201).json({ link });
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(500).json({ message: 'Помилка створення' });
  }
});

router.get('/', Auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);    
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(500).json({ message: 'Помилка' });
  }
});

router.get('/:id', Auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(500).json({ message: 'Щось не то' });
  }
});

router.get('/delete/:id', Auth, async (req, res) => {
  try {
    await Link.findByIdAndDelete(req.params.id);
    logger.info('Книжку видалено');
  } catch (e) {
    logger.error(`Щось не то - ${req.originalUrl}`);
    return res.status(500).json({ message: 'Щось не то' });
  }
});

module.exports = router;
