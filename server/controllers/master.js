const apiClient = require ('../API/plaidClient');
const User = require('../models/user');
const bcrypt = require('bcrypt')

const masterController = {};

// METHODS TO INTERACT WITH API
masterController.getLinkToken = (req, res) => {

}

// METHODS TO INTERACT WITH CLIENT APP
masterController.createUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email});
  if (user)
    return res
      .status(409)
      .send({ error: '409', message: 'User already exists' });
  try {
    if ( password === '') throw new Error();
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...req.body,
      password: hash
    });
    const user = await newUser.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error, message: 'Could not create user' });
  }
}

module.exports = masterController;