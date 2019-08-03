import express from 'express';
import User from '../model/User';

const router = express.Router();

router.post('/register', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
});

export default router;
