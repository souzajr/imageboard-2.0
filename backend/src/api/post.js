'use strict';

const mongoose = require('mongoose');
const moment = require('moment');

const Post = mongoose.model('Post');
const Board = mongoose.model('Board');
moment.locale(process.env.LOCATION);

module.exports = app => {
  const { existOrError } = app.src.api.validation;

  const store = async (req, res) => {
    const { type, files, board } = req.body;
    const { ip } = req;

    if (typeof type !== 'boolean')
      return res.status(400).json('Something went wrong');

    try {
      if (type === true) existOrError(files, 'You must select an image');
      existOrError(ip, 'Something went wrong');
    } catch (msg) {
      return res.status(400).json(msg);
    }

    const postId = await Post.create({
      type,
      ip,
      createdAt: moment().format('L - LTS'),
    }).then(post => post._id);

    Board.findOneAndUpdate({ board }, {});
  };

  return {
    store,
  };
};
