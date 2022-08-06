const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const logger = require('./winston');

app.use(express.json({ extended: true }));

if(process.env.NODE_ENV === 'production'){
  //set static folder
  app.use(express.static('client/build'));
}
app.get('*',(req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/link', require('./routes/LinkRoutes'));
app.use('/api/admin', require('./routes/AdminRoutes'));
app.use('/t', require('./routes/RedirectRoutes'));

const PORT = process.env.PORT || 5000;

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
