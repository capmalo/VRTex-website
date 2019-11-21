const express = require('express')
var router = express.Router()
const Article = require('../models/article.model.js')
const { ObjectId } = require('mongodb')

async function createArticle (title, content, _writer) {
  try {
    const article = new Article({
      _writer: _writer,
      title: title,
      content: content,
      date: new Date()
    })
    await article.save()
  } catch (err) {
    console.log(err)
  }
}

async function getArticle (id) {
  try {
    return Article.findById(id)
  } catch (err) {
    console.log(err)
  }
}

router.get('/new', (req, res) => {
  res.render('newpost')
})

router.get('/list', async (req, res) => {
  const posts = await Article.find().sort({ date: 1 })
  res.render('listposts', { posts: posts })
})

router.post('/new', async (req, res) => {
  const { body } = req
  await createArticle(body.post_title, body.post_content, req.user)
  res.redirect('/post/list')
})

router.post('/newcom', async (req, res) => {
  const { body } = req
  const article = await getArticle(req.query.id)
  article.comments.push({ _writer: req.user, content: body.content })
  await article.save()
  res.redirect('/post/list')
})

router.post('/upvote', async (req, res) => {
  const id = ObjectId(req.user._id)
  const vote = await Article.findOne({
    $and: [
      { _id: req.query.id },
      { upvotes: { $elemMatch: { _writer: id } } }
    ]
  }).lean()
  if (vote === null) {
    console.log('entre dans le if')
    article.upvotes.push({ _writer: req.session.userId })
  }
  await article.save()
  res.redirect('/post/list')
})

module.exports = router
