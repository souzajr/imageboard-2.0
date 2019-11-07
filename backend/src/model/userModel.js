const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  createdAt: { type: String, required: true },
  deletedAt: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
  /*
    TODO
    permissions: {
        ...
    }
  */
})

mongoose.model('User', UserSchema)
