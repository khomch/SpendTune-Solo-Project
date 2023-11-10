const apiClient = require ("../API/plaidClient");
const User = require("../models/user");
const bcrypt = require("bcrypt")

const masterController = {};

// METHODS TO INTERACT WITH API

masterController.createLinkToken = async (req, res) => {
  try {
    const tokenResponse = await apiClient.linkTokenCreate({
      user: { client_user_id: loggedUser._id },
      client_name: "SpendTune",
      language: "en",
      products: ["transactions"],
      country_codes: ["GB"],
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });
    res.json(tokenResponse.data);
  } catch(error) {
      res.status(400).send({error, message: "Could not fetch Link Token"})
  }
}

masterController.processPublicToken = async (req, res) => {
  try {
    const { token } = req.body

    res.status(200).send(token);
  } catch(error) {
    res.status(400).send({error, message: "Could not process Public Token"})
  }
}

// METHODS TO INTERACT WITH CLIENT APP

let loggedUser = null;

masterController.createUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email});
  if (user)
    return res
      .status(409)
      .send({ error: "409", message: "User already exists" });
  try {
    if ( password === "") throw new Error();
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...req.body,
      password: hash
    });
    const user = await newUser.save();
    loggedUser = user;
    res.status(201).send(loggedUser);
  } catch(error) {
    res.status(400).send({ error, message: "Could not create user" });
  }
}

masterController.login = async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const validatePass = await bcrypt.compare(password, user.password);
    if (!validatePass) throw new Error();
    loggedUser = user;
    res.status(200).send(loggedUser);
  } catch(error) {
    res
      .status(401)
      .send({ error: "401", message: "Username or password is incorrect" });
  }
}

masterController.loggedUser = async (req, res) => {
  try {
    res.status(200).send(loggedUser);
  } catch(error) {
    res
      .status(400)
      .send({ error: "400", message: "Something went wrong" });
  }
}

masterController.logout = async (req, res) => {
  try {
    loggedUser = null;
    res.status(200).send({ message: "User logged out" });
  } catch(error) {
    res
      .status(400)
      .send({ error: "400", message: "Something went wrong" });
  }
}

module.exports = masterController;