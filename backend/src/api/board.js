'use strict';

const mongoose = require('mongoose');

const Board = mongoose.model('Board');

module.exports = app => {
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

  return {
    index,
    show,
  };
};
