const { Router } = require('express');
const config = require('config');
const shortid = require('shortid');
const Link = require('../models/Link');

const router = Router();
const Auth = require('../middleware/AuthMiddleware');

router.post('/create', Auth, async (req, res) => {
  try {
    const baseURL = config.get('baseURL');
    const { from, name } = req.body;

    const code = shortid.generate();
    const existing = await Link.findOne({ from });

    if (existing) {
      return (res.json({ link: existing }));
    }

    const to = `${baseURL}/t/${code}`;

    const link = new Link({
      name, code, to, from, owner: req.user.userId,
    });
    await link.save();
    res.status(201).json({ link });
  } catch (e) {
    res.status(500).json({ message: 'Щось не то' });
  }
});

router.get('/', Auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: 'Щось не то' });
  }
});

router.get('/:id', Auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (e) {
    res.status(500).json({ message: 'Щось не то' });
  }
});

router.get('/delete/:id', Auth, async (req, res) => {
  try {
    const link = await Link.findByIdAndDelete(req.params.id);
  } catch (e) {
    res.status(500).json({ message: 'Щось не то' });
  }
});

module.exports = router;
