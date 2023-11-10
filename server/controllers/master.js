const { ItemUpdateTypeEnum } = require("plaid");
const apiClient = require("../API/plaidClient");
const User = require("../models/user");
const bcrypt = require("bcrypt");

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
    if (!tokenResponse.data) {
      return res
        .status(400)
        .send({ error: "400", message:"Couldn't authenticate Link Token"})
    }
    res.status(200).json(tokenResponse.data);
  } catch (error) {
    res.status(500).send({ error, message: "Couldn't fetch Link Token" });
  }
};

masterController.exchangePublicToken = async (req, res) => {
  try {
    const { token } = req.body;
    const response = await apiClient.itemPublicTokenExchange({
      public_token: token,
    });
    if (!response.data.access_token) {
      return res
        .status(400)
        .send({ error: "400", message: "Couldn't retrieve acccess token from the API"});
    }
    const accessToken = response.data.access_token;
    const itemID = response.data.item_id;

    const filter = { _id: loggedUser._id };
    const update = { $set: { accessToken: accessToken, itemID: itemID } };
    const item = await User.findOneAndUpdate(filter, update);

    res.status(200).json({
      public_token_exchange:
        "completed, token and itemID stored in users DB "
    });

  } catch (error) {
    res.status(500).send({ error, message: "Could not exchange Public Token" });
  }
};

// METHODS TO INTERACT WITH CLIENT APP

let loggedUser = null;

masterController.createUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user)
    return res
      .status(409)
      .send({ error: "409", message: "User already exists" });
  try {
    if (password === "") throw new Error();
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    const user = await newUser.save();
    loggedUser = user;
    res.status(201).send(loggedUser);
  } catch (error) {
    res.status(500).send({ error, message: "Could not create user" });
  }
};

masterController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const validatePass = await bcrypt.compare(password, user.password);
    if (!validatePass) throw new Error();
    loggedUser = user;
    res.status(200).send(loggedUser);
  } catch (error) {
    res
      .status(401)
      .send({ error: "401", message: "Username or password is incorrect" });
  }
};

masterController.loggedUser = async (req, res) => {
  try {
    res.status(200).send(loggedUser);
  } catch (error) {
    res.status(500).send({ error: "400", message: "Something went wrong" });
  }
};

masterController.logout = async (req, res) => {
  try {
    loggedUser = null;
    res.status(200).send({ message: "User logged out" });
  } catch (error) {
    res.status(500).send({ error: "400", message: "Something went wrong" });
  }
};

module.exports = masterController;
