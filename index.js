const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const logger = require('./winston');

app.use(express.json({ extended: true }));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/link', require('./routes/LinkRoutes'));
app.use('/api/admin', require('./routes/AdminRoutes'));
app.use('/t', require('./routes/RedirectRoutes'));

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoose.connect(
      process.env.BD,
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
