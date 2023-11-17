import { Request, RequestHandler, Response } from "express";
import apiClient from "../API/plaidClient";
import User from "../models/user";
import bcrypt from "bcrypt";
import syncTransactions from '../utils/syncTransactions';
import { CountryCode, Products, Transaction } from "plaid";
import { TUser } from "../@types";

const masterController:{[k:string]:RequestHandler} = {};

// METHODS TO INTERACT WITH API

masterController.createLinkToken = async (req:Request, res:Response) => {
  try {
    console.log('createLinkToken - start')
    const tokenResponse = await apiClient.linkTokenCreate({
      user: { client_user_id: loggedUser?._id },
      client_name: "SpendTune",
      language: "en",
      products: [Products.Transactions],
      country_codes: [CountryCode.Gb],
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });
    console.log('createLinkToken - after API token response', tokenResponse)
    if (!tokenResponse.data) {
      res
        .status(400)
        .send({ error: "400", message:"Couldn't authenticate Link Token"})
    }
    res.status(200).json(tokenResponse.data);
  } catch (e) {
    console.log('createLinkToken - e :>> ', e);
    res.status(500).send({ message: "Couldn't fetch Link Token" });
  }
};

masterController.exchangePublicToken = async (req:Request, res:Response) => {
  // Send public token to api to receive access token and itemID
  try {
    const { token } = req.body;

    const response = await apiClient.itemPublicTokenExchange({
      public_token: token,
    });
    if (!response.data.access_token) {
      console.log('ERROR - response.data.access_token')
      return res
        .status(400)
        .send({ message: "Couldn't retrieve access token from the API"});
    }
    const accessToken = response.data.access_token;
    console.log('accessToken :>> ', accessToken);
    const itemID = response.data.item_id;
    // Update user in DB with access token and itemID
    const user = await User.findById(loggedUser?._id);
    
    if(!user) throw Error('No user found.')
    


    user.accessToken = accessToken;

    let id = (user.linkedBanks && user.linkedBanks.length) ? 
      user.linkedBanks.length + 1 
      : 1;
    
    const keyName = 'bank' + id;
    user.linkedBanks = Object.assign({}, user.linkedBanks, { [keyName]: itemID });
    // @ts-ignore
    const updatedUser = await user.save({ new: true });
    res.status(200).json(updatedUser);
  } catch {
    res.status(500).send({ message: "Could not exchange Public Token" });
  }
};

masterController.syncTransactions = async (req:Request, res:Response):Promise<void> => {
  try {
    const user = await User.findOne({ _id: loggedUser?._id });
    console.log('syncTransactions - user :>> ', user);
   
    if (user) {
      const transactions = await syncTransactions(user);
      res.status(200).json(transactions);
    }
    
    res
      .status(400)
      .send({ message: "User not found in the database"});
  } catch (e) {
    console.log(e)
    res.status(500).send({message: "Failed to sync transactions"})
  }
}

// METHODS TO INTERACT WITH CLIENT

let loggedUser:TUser | null;

masterController.createUser = async (req:Request, res:Response) => {
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
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Could not create user" });
  }
};

masterController.login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) throw new Error();
    console.log('user :>> ', user);
    const validatePass = await bcrypt.compare(password, user.password);
    if (!validatePass) throw new Error();
    loggedUser = user;
    console.log('loggedUser :>> ', loggedUser);
    res.status(200).send(loggedUser);
  } catch (e) {
    console.log(e)
    res
      .status(401)
      .send({ message: "Username or password is incorrect" });
  }
};

masterController.loggedUser = async (req:Request, res:Response) => {
  try {
    console.log('loggedUser :>> ', loggedUser);
    res.status(200).send(loggedUser);
  } catch {
    res.status(500).send({ message: "Something went wrong" });
  }
};

masterController.logout = async (req:Request, res:Response) => {
  try {
    loggedUser = null;
    res.status(200).send({ message: "User logged out" });
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Something went wrong" });
  }
};

masterController.addCategory = async (req:Request, res:Response) => {
  try {
    const { category }  = req.body;
    const user = await User.findOne({ _id: loggedUser?._id });
    if (user) {
      if (user.categories?.length) user.categories.push(category);
      // @ts-ignore
      const updatedUser = await user.save({ new: true });
      loggedUser = updatedUser;
      res.status(200).json(updatedUser);
    } 
    else {
      res
        .status(400)
        .send({ message: "User not found in the database"});
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({message: "Failed to add category"})
  }
}

masterController.assignCategory = async (req:Request, res:Response) => {
  try {
    const { category, id }  = req.body;
    const transactions = (loggedUser?.transactions) ? 
      loggedUser.transactions : 
      [];
    
    const [ transaction ] = transactions.filter(transaction => transaction.id === id);
    transaction.user_category = category;

    const user = await User.findOne({_id: loggedUser?._id})

    if (!user) throw new Error('No user on category assignment.')
    if (!user.transactions) throw new Error('No transactions found')
    const removeIndex = user.transactions.findIndex(transaction => transaction.id === id)

    user.transactions.splice(removeIndex, 1);
    
    const prevTransactions = user.transactionsCategorized ? user.transactionsCategorized : [];
    user.transactionsCategorized = [...prevTransactions,transaction ]

    // @ts-ignore
    const updatedUser = await user.save({ new: true });
    loggedUser = updatedUser;
    res.status(200).json(updatedUser);
  } catch (error){
    console.log(error)
    res.status(500).send({message: "Failed to assign category"})
  }
}

export default masterController;
