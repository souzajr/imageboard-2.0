const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: String, required: true },
  deletedAt: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  permissions: {
    removePost: { type: Boolean, default: false },
    removeFiles: { type: Boolean, default: false },
    removeBoard: { type: Boolean, default: false },
    banIP: { type: Boolean, default: false },
    addBoard: { type: Boolean, default: false },
    removeUser: { type: Boolean, default: false },
    changePermissions: { type: Boolean, default: false },
  },
});

mongoose.model('User', UserSchema);
