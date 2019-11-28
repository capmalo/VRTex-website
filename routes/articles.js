const express = require('express')
var router = express.Router()
const User = require('../models/user.model.js')
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

async function getUser (userId) {
  try {
    return User.findById(userId)
  } catch (err) {
    console.log(err)
  }
}

router.get('/new', (req, res) => {
  res.render('newpost')
})

router.get('/list', async (req, res) => {
  const posts = await Article.find().sort({ date: 1 })
  const votes = (await getUser(req.user.id)).votes
  res.render('listposts', { posts: posts, votes: votes })
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
  if (req.query.from) {
    res.redirect(req.query.from)
  } else {
    res.redirect('/post/list')
  }
})

router.post('/upvote', async (req, res) => {
  const id = ObjectId(req.user.id)
  const obj = await Article.findOne({
    $and: [
      { _id: req.query.id },
      { upvotes: { $elemMatch: { _writer: id } } }
    ]
  })
  if (obj === null) {
    console.log('nouvel upvote')
    const article = await getArticle(req.query.id)
    await article.upvotes.push({ _writer: req.session.userId })

    const user = await getUser(req.user.id)
    await user.votes.push({ _article: article._id })
    await user.save()

    const newNbVotes = article.nbvotes + 1
    await article.updateOne({ $set: { nbvotes: newNbVotes } })
    await article.save()
  }
  res.redirect('/post/list')
})

router.post('/unvote', async (req, res) => {
  const id = ObjectId(req.user.id)
  const article = await Article.findOne({
    $and: [
      { _id: req.query.id },
      { upvotes: { $elemMatch: { _writer: id } } }
    ]
  })
  if (article != null) {
    console.log('nouvel unvote')
    await article.upvotes.pop({ _writer: req.session.userId })

    const user = await getUser(req.user.id)
    await user.votes.pop({ _article: article._id })
    await user.save()

    const newNbVotes = article.nbvotes - 1
    await article.updateOne({ $set: { nbvotes: newNbVotes } })
    await article.save()
  }
  res.redirect('/post/list')
})

module.exports = router
