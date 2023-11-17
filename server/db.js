const mongoose = require('mongoose');
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || 'SpendTune';

mongoose.connect(
  `mongodb://localhost:${DB_PORT}/${DB_NAME}`
  )
  .then(() => console.log(`🦆 Database for SpendTune connected @ port ${DB_PORT}!`))
  .catch((err) => console.log(`😞 Sorry, something went wrong! ${err}`));

module.exports = mongoose;
