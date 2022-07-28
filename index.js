const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const logger = require('./winston').default;

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/link', require('./routes/LinkRoutes'));
app.use('/t', require('./routes/RedirectRoutes'));

const PORT = config.get('port') || 5000;

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.BD_LOGIN}:${process.env.BD_PASSWORD}@${process.env.CLUSTER}/${process.env.BD}`,
      {
        useNewUrlParser: true,
        retryWrites: true,
      },
      );
    app.listen(PORT, () => {
      console.log('Start work');
      logger.info(`Server started and running on : ${PORT} port`)
    });
  } catch (e) {
    logger.error('Server Error')
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
