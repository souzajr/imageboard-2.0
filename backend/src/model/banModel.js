const mongoose = require('mongoose');

const BanSchema = new mongoose.Schema({
  description: { type: String, required: true },
  ip: { type: String, required: true },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      require: true,
    },
  ],
  expiresAt: { type: String, required: true },
  createdAt: { type: String, required: true },
});

mongoose.model('Ban', BanSchema);
