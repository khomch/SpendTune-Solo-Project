import bcrypt from 'bcrypt';
import { Request, RequestHandler, Response } from 'express';
import User from '../models/user';
import 'dotenv/config';
import { generateToken } from '../utils/generateToken';

const userController: { [k: string]: RequestHandler } = {};

// METHODS TO INTERACT WITH CLIENT

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
      res.status(201).send({ user: user, token: generateToken(user) });
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

    if (!user) {
      res.status(401).send({ message: 'User not found' });
      return;
    }
    const validatePass = await bcrypt.compare(password, user.password);
    if (validatePass) {
      res.status(200).send({ user: user, token: generateToken(user) });
      return;
    }
    if (!validatePass) throw new Error('Password/Username is not correct');
  } catch (e) {
    console.log(e);
    res.status(401).send({ message: 'Username or password is incorrect' });
  }
};

export default userController;
