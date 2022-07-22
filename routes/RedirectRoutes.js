const { Router } = require('express');
const Link = require('../models/Link');

const router = Router();

router.get('/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });

    if (link) {
      link.clicks++;
      await link.save();
      return res.redirect(link.from);
    }
    res.status(404).json({ message: 'Посилання не знайдено' });
  } catch (e) {
    res.status(500).json({ message: 'Щось не то' });
  }
});

module.exports = router;
