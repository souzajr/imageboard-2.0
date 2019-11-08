'use strict';

const mongoose = require('mongoose');
const moment = require('moment');

const Post = mongoose.model('Post');
const Board = mongoose.model('Board');
moment.locale(process.env.LOCATION);

module.exports = app => {
  const { existOrError } = app.src.api.validation;

  const store = async (req, res) => {
    const { mainPost, files, board } = req.body;
    const { ip } = req;

    if (typeof mainPost !== 'boolean')
      return res.status(400).json('Something went wrong');

    try {
      existOrError(board, 'Something went wrong');
      const checkIfExists = await Board.findOne({ _id: board });
      existOrError(checkIfExists, 'Something went wrong');
      if (mainPost === true) existOrError(files, 'You must select an image');
      existOrError(ip, 'Something went wrong');
    } catch (msg) {
      return res.status(400).json(msg);
    }

    const post = await Post.create({
      mainPost,
      ip,
      files,
      createdAt: moment().format('L - LTS'),
    });

    await Board.updateOne(
      { _id: board },
      {
        $push: {
          posts: post._id,
        },
      }
    );

    res.status(200).json(post._id);
  };

  return {
    store,
  };
};
