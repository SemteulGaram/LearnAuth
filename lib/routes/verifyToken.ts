import jwt from 'jsonwebtoken';

import { instance as config } from '../config';

function auth (req, res, next) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, config.get('jsonWebTokenSecreatKey'));
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}

export default auth;
