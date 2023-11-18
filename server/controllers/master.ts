import { Request, RequestHandler, Response } from 'express';
import apiClient from '../API/plaidClient';
import User from '../models/user';
import bcrypt from 'bcrypt';
import syncTransactions from '../utils/syncTransactions';
import { CountryCode, Products, Transaction } from 'plaid';
import { TUser } from '../@types';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET_KEY } from './user.controller';
import { getUserIdFromToken } from '../utils/getUserIdFromToken';

const masterController: { [k: string]: RequestHandler } = {};

// METHODS TO INTERACT WITH API

masterController.createLinkToken = async (req: Request, res: Response) => {
  try {
    console.log('createLinkToken - start');
    const userId = getUserIdFromToken(req);
    if (userId) {
      console.log('userId: ', userId);
      const tokenResponse = await apiClient.linkTokenCreate({
        user: { client_user_id: userId },
        client_name: 'SpendTune',
        language: 'en',
        products: [Products.Transactions],
        country_codes: [CountryCode.Gb],
        redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
      });
      console.log('tokenResponse: ', tokenResponse);
      console.log('createLinkToken - after API token response', tokenResponse);
      res.status(200).json(tokenResponse.data);
    } else {
      res
        .status(400)
        .send({ error: '400', message: "Couldn't authenticate Link Token" });
    }
  } catch (e) {
    console.log('createLinkToken - e :>> ', e);
    res.status(500).send({ message: "Couldn't fetch Link Token" });
  }
};

masterController.exchangePublicToken = async (req: Request, res: Response) => {
  // Send public token to api to receive access token and itemID
  try {
    const { token } = req.body;

    const response = await apiClient.itemPublicTokenExchange({
      public_token: token,
    });
    if (!response.data.access_token) {
      console.log('ERROR - response.data.access_token');
      return res
        .status(400)
        .send({ message: "Couldn't retrieve access token from the API" });
    }
    const accessToken = response.data.access_token;
    console.log('accessToken :>> ', accessToken);
    const itemID = response.data.item_id;
    // Update user in DB with access token and itemID
    const userId = getUserIdFromToken(req);
    const user = await User.findById(userId);

    if (!user) throw Error('No user found.');

    user.accessToken = accessToken;

    let id =
      user.linkedBanks && user.linkedBanks.length
        ? user.linkedBanks.length + 1
        : 1;

    const keyName = 'bank' + id;
    user.linkedBanks = Object.assign({}, user.linkedBanks, {
      [keyName]: itemID,
    });
    // @ts-ignore
    const updatedUser = await user.save({ new: true });
    res.status(200).json(updatedUser);
  } catch {
    res.status(500).send({ message: 'Could not exchange Public Token' });
  }
};

masterController.syncTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserIdFromToken(req);
    const user = await User.findOne({ _id: userId });
    if (user) {
      console.log('user: ', user);
      const updatedUser = await syncTransactions(user);
      res.status(200).send(updatedUser);
      return;
    }
    res.status(400).send({ message: 'User not found in the database' });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: 'Failed to sync transactions' });
  }
};

// masterController.createLinkToken = async (req: Request, res: Response) => {
//   try {
//     console.log('createLinkToken - start');
//     const tokenResponse = await apiClient.linkTokenCreate({
//       user: { client_user_id: loggedUser?._id },
//       client_name: 'SpendTune',
//       language: 'en',
//       products: [Products.Transactions],
//       country_codes: [CountryCode.Gb],
//       redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
//     });
//     console.log('createLinkToken - after API token response', tokenResponse);
//     if (!tokenResponse.data) {
//       res
//         .status(400)
//         .send({ error: '400', message: "Couldn't authenticate Link Token" });
//     }
//     res.status(200).json(tokenResponse.data);
//   } catch (e) {
//     console.log('createLinkToken - e :>> ', e);
//     res.status(500).send({ message: "Couldn't fetch Link Token" });
//   }
// };

// masterController.exchangePublicToken = async (req: Request, res: Response) => {
//   // Send public token to api to receive access token and itemID
//   try {
//     const { token } = req.body;

//     const response = await apiClient.itemPublicTokenExchange({
//       public_token: token,
//     });
//     if (!response.data.access_token) {
//       console.log('ERROR - response.data.access_token');
//       return res
//         .status(400)
//         .send({ message: "Couldn't retrieve access token from the API" });
//     }
//     const accessToken = response.data.access_token;
//     console.log('accessToken :>> ', accessToken);
//     const itemID = response.data.item_id;
//     // Update user in DB with access token and itemID
//     const user = await User.findById(loggedUser?._id);

//     if (!user) throw Error('No user found.');

//     user.accessToken = accessToken;

//     let id =
//       user.linkedBanks && user.linkedBanks.length
//         ? user.linkedBanks.length + 1
//         : 1;

//     const keyName = 'bank' + id;
//     user.linkedBanks = Object.assign({}, user.linkedBanks, {
//       [keyName]: itemID,
//     });
//     // @ts-ignore
//     const updatedUser = await user.save({ new: true });
//     res.status(200).json(updatedUser);
//   } catch {
//     res.status(500).send({ message: 'Could not exchange Public Token' });
//   }
// };

// masterController.syncTransactions = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const user = await User.findOne({ _id: loggedUser?._id });
//     console.log('syncTransactions - user :>> ', user);

//     if (user) {
//       const transactions = await syncTransactions(user);
//       res.status(200).json(transactions);
//     }

//     res.status(400).send({ message: 'User not found in the database' });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({ message: 'Failed to sync transactions' });
//   }
// };

// // METHODS TO INTERACT WITH CLIENT

// let loggedUser: TUser | null;

// masterController.loggedUser = async (req: Request, res: Response) => {
//   try {
//     console.log('loggedUser :>> ', loggedUser);
//     res.status(200).send(loggedUser);
//   } catch {
//     res.status(500).send({ message: 'Something went wrong' });
//   }
// };

// masterController.logout = async (req: Request, res: Response) => {
//   try {
//     loggedUser = null;
//     res.status(200).send({ message: 'User logged out' });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({ message: 'Something went wrong' });
//   }
// };

export default masterController;
