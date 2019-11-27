const mongoose = require('mongoose')
const Schema = mongoose.Schema

var UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  votes: [{
    _article: { type: Schema.Types.ObjectId, ref: 'Article' }
  }]
})

const User = mongoose.model('User', UserSchema)

module.exports = User
