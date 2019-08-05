import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { instance as config } from '../config';
import { User, isValidateUser } from '../model/User';
import { isValidateLogin } from '../model/Login';


const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  // LETS VALIDATE THE DATA BEFORE WE A USER
  const { error } = isValidateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  
  // Checking if the user is already in the database
  const emailExist = await User.findOne({
    email: req.body.email
  });
  if (emailExist === null) {
    return res.status(400).send('Email already exists');
  }

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });

  // Join to database
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  // LETS VALIDATE THE DATA BEFORE WE A USER
  const { error } = isValidateLogin(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Checking if the user is already in the database
  const user = await User.findOne({
    email: req.body.email
  });
  if (user === null) {
    return res.status(400).send('Email! or password is wrong');
  }
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send('Email or password! is wrong');
  }

  // Create and assign a token
  const token = jwt.sign({ _id: user.id }, config.get('jsonWebTokenSecreatKey'));
  res.header('auth-token', token).send(token);
});

export default router;
