'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('client-sessions');
const passport = require('passport');
const helmet = require('helmet');

module.exports = app => {
  app.use(helmet());
  if (process.env.AMBIENT_MODE === 'PROD') {
    const expressEnforcesSsl = require('express-enforces-ssl');
    app.enable('trust proxy');
    app.use(expressEnforcesSsl());
    app.use(
      session({
        cookieName: 'session',
        encryptionAlgorithm: 'aes256',
        encryptionKey: new Buffer.from(process.env.SESSION_SECRET1),
        signatureAlgorithm: 'sha256-drop128',
        signatureKey: new Buffer.from(process.env.SESSION_SECRET2, 'base64'),
        duration: 3600000,
        cookie: {
          path: '/',
          httpOnly: true,
          secureProxy: true,
          ephemeral: false,
        },
      })
    );
  } else {
    app.use(
      session({
        cookieName: 'session',
        secret: process.env.SESSION_SECRET1,
        duration: 3600000,
        cookie: {
          path: '/',
          httpOnly: true,
          secure: false,
          ephemeral: true,
        },
      })
    );
  }
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.json());
  app.use(cors());
  app.use(morgan('dev'));
};
