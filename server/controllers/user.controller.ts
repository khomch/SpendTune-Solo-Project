import { Request, RequestHandler, Response } from 'express';
import apiClient from '../API/plaidClient';
import User from '../models/user';
import bcrypt from 'bcrypt';
import syncTransactions from '../utils/syncTransactions';
import { CountryCode, Products, Transaction } from 'plaid';
import { TUser } from '../@types';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

const userController: { [k: string]: RequestHandler } = {};

// ADD THIS TO THE ENV
export const SECRET_KEY: Secret = 'your-secret-key-here';

// METHODS TO INTERACT WITH CLIENT

let loggedUser: TUser | null;

userController.createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user)
    return res
      .status(409)
      .send({ error: '409', message: 'User already exists' });
  try {
    if (password === '') throw new Error();
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    const user = await newUser.save();
    if (user) {
      const token = jwt.sign(
        { _id: user._id, firstName: user.firstName },
        SECRET_KEY,
        {
          expiresIn: '2days',
        }
      );
      res.status(201).send({ user: user, token: token });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: 'Could not create user' });
  }
};

userController.login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    loggedUser = user;

    if (!user) throw new Error();
    console.log('user :>> ', user.lastName);
    const validatePass = await bcrypt.compare(password, user.password);
    if (validatePass) {
      const token = jwt.sign(
        { _id: user._id, firstName: user.firstName },
        SECRET_KEY,
        {
          expiresIn: '2days',
        }
      );
      res.status(200).send({ user: user, token: token });
      return;
    }
    if (!validatePass) throw new Error('Password/Username is not correct');
    // console.log('loggedUser :>> ', user);
  } catch (e) {
    console.log(e);
    res.status(401).send({ message: 'Username or password is incorrect' });
  }
};

userController.loggedUser = async (req: Request, res: Response) => {
  try {
    console.log('loggedUser :>> ', loggedUser);
    res.status(200).send(loggedUser);
  } catch {
    res.status(500).send({ message: 'Something went wrong' });
  }
};

userController.logout = async (req: Request, res: Response) => {
  try {
    loggedUser = null;
    res.status(200).send({ message: 'User logged out' });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: 'Something went wrong' });
  }
};

export default userController;
