const mongoose = require('./../db.js');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: ''
  },
  linkedBanks: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('User', userSchema);
