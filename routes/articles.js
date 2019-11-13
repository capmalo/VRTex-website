const express = require('express')
var router = express.Router()
const Article = require('../models/article.model.js')

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
  res.send('SAVED')
})

router.post('/newcom/:id', (req, res) => {
  console.log(req.query.id)
  res.send('YES')
})

module.exports = router
