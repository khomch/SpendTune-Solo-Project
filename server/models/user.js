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
  },
  next_cursor: {
    type: String,
    default: null
  },
  transactions: {
    type: Array,
    default: []
  },
  transactionsCategorized: {
    type: Array,
    default: []
  },
  categories: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
