const mongoose = require('mongoose')
const Schema = mongoose.Schema

var articleSchema = new Schema({
  _writer: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, require: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  comments: [{
    _writer: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
})

const Article = mongoose.model('Article', articleSchema)
module.exports = Article
