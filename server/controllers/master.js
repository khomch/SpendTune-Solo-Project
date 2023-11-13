const apiClient = require("../API/plaidClient");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const syncTransactions = require('../utils/syncTransactions');

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
  } catch {
    res.status(500).send({ message: "Couldn't fetch Link Token" });
  }
};

masterController.exchangePublicToken = async (req, res) => {
  // Send public token to api to receive access token and itemID
  try {
    const { token } = req.body;
    const response = await apiClient.itemPublicTokenExchange({
      public_token: token,
    });
    if (!response.data.access_token) {
      return res
        .status(400)
        .send({ message: "Couldn't retrieve acccess token from the API"});
    }
    const accessToken = response.data.access_token;
    const itemID = response.data.item_id;
    // Update user in DB with access token and itemID
    const user = await User.findById(loggedUser._id);
    let id = 1;
    user.accessToken = accessToken;
    if (Object.keys(user.linkedBanks).length) {
      id = (Object.keys(user.linkedBanks).length) + 1;
    }
    const keyName = 'bank' + id;
    user.linkedBanks = Object.assign({}, user.linkedBanks, { [keyName]: itemID });
    const updatedUser = await user.save({ new: true });
    res.status(200).json(updatedUser);
  } catch {
    res.status(500).send({ message: "Could not exchange Public Token" });
  }
};

masterController.syncTransactions = async (req, res) => {
  try {
    const user = await User.findOne({ _id: loggedUser._id });
    if (!user) {
      return res
        .status(400)
        .send({ message: "User not found in the database"});
    }
    const transactions = await syncTransactions(user);
    res.status(200).json(transactions);
  } catch {
    res.status(500).send({message: "Failed to sync transactions"})
  }
}

// METHODS TO INTERACT WITH CLIENT

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
  } catch {
    res.status(500).send({ message: "Could not create user" });
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
  } catch {
    res
      .status(401)
      .send({ message: "Username or password is incorrect" });
  }
};

masterController.loggedUser = async (req, res) => {
  try {
    res.status(200).send(loggedUser);
  } catch {
    res.status(500).send({ message: "Something went wrong" });
  }
};

masterController.logout = async (req, res) => {
  try {
    loggedUser = null;
    res.status(200).send({ message: "User logged out" });
  } catch {
    res.status(500).send({ message: "Something went wrong" });
  }
};

masterController.addCategory = async (req, res) => {
  try {
    const { category }  = req.body;
    const user = await User.findOne({ _id: loggedUser._id });
    if (!user) {
      return res
        .status(400)
        .send({ message: "User not found in the database"});
    }
    user.categories.push(category);
    const updatedUser = await user.save({ new: true });
    loggedUser = updatedUser;
    res.status(200).json(updatedUser);
  } catch {
    res.status(500).send({message: "Failed to add category"})
  }
}

masterController.assignCategory = async (req, res) => {
  try {
    const { category, id }  = req.body;

    const [ transaction ] = loggedUser.transactions.filter(transaction => transaction.id === id);
    transaction.user_category = category;

    const user = await User.findOne({_id: loggedUser._id})

    const removeIndex = user.transactions.findIndex(transaction => transaction.id === id)

    await user.transactions.splice(removeIndex, 1);
    await user.transactionsCategorized.push(transaction);
    const updatedUser = await user.save({ new: true });
    loggedUser = updatedUser;
    res.status(200).json(updatedUser);
  } catch (error){
    console.log(error)
    res.status(500).send({message: "Failed to assign category"})
  }
}

module.exports = masterController;
