const express = require('express')
var router = express.Router()
const Article = require('../models/article.model.js')

async function createArticle (title, content) {
  try {
    const article = new Article({
      title: title,
      content: content
    })
    await article.save()
  } catch (err) {
    console.log(err)
  }
}

router.get('/new', (req, res) => {
  if (req.user) {
    res.render('newpost')
  } else {
    res.send('ACCESS DENIED')
  }
})

router.post('/new', (req, res) => {
  if (req.user) {
    const { body } = req
    createArticle(body.post_title, body.post_content)
    res.render('index')
  } else {
    res.send('ACCESS DENIED')
  }
})

module.exports = router
