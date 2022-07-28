const { Router } = require('express');
const Link = require('../models/Link');
const logger = require('../winston').default;

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
    return res.status(404).json({ message: 'Посилання не знайдено' });
  } catch (e) {
    logger.error(`Щось не то - ${res.statusMessage} - ${req.originalUrl}`);
    return res.status(500).json({ message: 'Щось не то' });
  }
});

module.exports = router;
