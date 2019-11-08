const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const BoardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  createdAt: { type: String, required: true },
});

BoardSchema.plugin(mongoosePaginate);
mongoose.model('Board', BoardSchema);
