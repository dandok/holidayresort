import crypto from 'crypto';
import User from '../models/usersModel';
import { Request, Response } from 'express';
// import { HttpError } from 'http-errors';
import jwt from 'jsonwebtoken';
// import config from "config";
// import sendEmail from "../utils/email";
const secret: string = process.env.JWT_SECRET as string;
const days: string = process.env.JWT_EXPIRES_IN as string;
const signToken = (id: string) => {
  return jwt.sign({ id }, secret, {
    expiresIn: days,
  });
};
export async function signup(req: Request, res: Response): Promise<void> {
  try {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const token = signToken(newUser._id);
    res.cookie('jwt', token, { httpOnly: true });
    res.redirect('/login');
    res.status(201).json({
      token: newUser._id,
    });
    return;
  } catch (err) {
    res.redirect(`/register?message=${err.message}`);
    res.status(400).json({
      message: err.message,
    });
    return;
  }
}
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  //(1) if email and password exist
  if (!email || !password) {
    res.render('login', { message: 'please provide email and password' });
    return;
  }
  //(2) check if user exist && passwod is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    res.render('login', { message: 'Incorrect Email or password' });
    return;
  } else {
    //(3) if everything is ok,send the token to the client
    const token = signToken(user._id);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.cookie('jwt', token, { httpOnly: true });
    res.redirect('/loginusers');
    res.status(201).json({
      token: user._id,
    });
    return;
  }
}

