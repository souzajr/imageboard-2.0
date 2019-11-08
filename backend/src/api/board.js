'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const fs = require('fs');

const Post = mongoose.model('Post');
const Board = mongoose.model('Board');
moment.locale(process.env.LOCATION);

module.exports = app => {
  const { existOrError, tooSmall, notExistOrError } = app.src.api.validation;

  const index = async (req, res) => {
    const boards = await Board.find().lean();

    res.status(200).json(boards);
  };

  const show = async (req, res) => {
    const board = await Board.paginate(
      {
        url: req.params.url,
      },
      {
        sort: { _id: -1 },
        populate: 'posts.post',
        lean: true,
        page: 1,
        limit: 10,
      }
    );

    if (!board) return res.status(404).end();

    res.status(200).json(board);
  };

  const store = async (req, res) => {
    if (!req.session.user.permissions.addBoard)
      return res.status(401).json('You do not have permission');

    const { name, description, url } = req.body;

    try {
      existOrError(name, 'Enter the name of the board');
      existOrError(description, 'Enter the description of the board');
      tooSmall(description, 'The description is too short');
      existOrError(url, 'Enter the URL of the board');
      const checkIfAlreadyExists = await Board.findOne({ url });
      notExistOrError(
        checkIfAlreadyExists,
        'The URL you entered already exists, choose another'
      );
    } catch (msg) {
      return res.status(400).json(msg);
    }

    await Board.create({
      name,
      description,
      url,
      createdAt: moment().format('L - LTS'),
    });

    res.status(200).end();
  };

  const remove = async (req, res) => {
    if (!req.session.user.permissions.removeBoard)
      return res.status(401).json('You do not have permission');

    const { board } = req.body;

    try {
      existOrError(board, 'Select the board you want to remove');
      const checkIfExists = await Board.findOne({ _id: board });
      existOrError(checkIfExists, 'Board not found');
    } catch (msg) {
      return res.status(400).json(msg);
    }

    const getPosts = Board.findOne({ _id: board })
      .populate('posts.post')
      .lean();

    if (getPosts.posts.length) {
      const executeDelete = async id => {
        const post = await Post.findOne({ _id: id });

        if (post.files.length)
          post.files.map(file => fs.unlinkSync(`./public/${file.name}`));

        try {
          await Post.deleteOne({ _id: id });
          Promise.resolve();
        } catch (err) {
          Promise.reject(err);
        }
      };

      const removePosts = async posts =>
        Promise.all(posts.map(post => executeDelete(post._id)));

      await removePosts(getPosts.posts);
    }

    await Board.deleteOne({ _id: board });

    res.status(200).end();
  };

  return {
    index,
    show,
    store,
    remove,
  };
};
