const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();
const logger = require('./winston');

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/link', require('./routes/LinkRoutes'));
app.use('/t', require('./routes/RedirectRoutes'));

const PORT = config.get('port') || 5000;

async function start() {
  try {
    await mongoose.connect(
      config.get('mongoURL'),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    app.listen(PORT, () => {
      console.log('Start work');
      logger.info(`Server started and running on : ${PORT} port`)
    }
    
    );
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
