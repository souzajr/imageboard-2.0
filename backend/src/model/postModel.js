const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  type: { type: Boolean, required: true },
  ip: { type: String, required: true },
  files: [
    {
      name: String,
      fileType: String,
    },
  ],
  createdAt: { type: String, required: true },
});

mongoose.model('Post', PostSchema);
