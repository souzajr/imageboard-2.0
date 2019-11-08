'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('User');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');

module.exports = app => {
  const {
    existOrError,
    tooBigEmail,
    validEmailOrError,
  } = app.src.api.validation;

  const login = async (req, res) => {
    const { email, password } = req.body;

    try {
      existOrError(email, 'Type your email');
      tooBigEmail(email, 'Your Email is too long');
      validEmailOrError(email, 'Invalid email');
      existOrError(password, 'Type your password');
    } catch (msg) {
      return res.status(400).json(msg);
    }

    const user = await User.findOne({ email });
    if (!user || user.deletedAt)
      return res.status(401).json('Invalid email or password');

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json('Invalid email or password');

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      id: user._id,
      iss: process.env.DOMAIN_NAME,
      iat: now,
      exp: now + 60 * 60 * 24,
    };

    if (req.session) req.session.reset();
    req.session.user = user;
    req.session.token = jwt.encode(payload, process.env.AUTH_SECRET);
    res.status(200).end();
  };

  return {
    login,
  };
};
