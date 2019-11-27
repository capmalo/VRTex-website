const express = require('express')
var router = express.Router()
const User = require('../models/user.model.js')
const Article = require('../models/article.model.js')
const bcrypt = require('bcrypt')

async function createUser (username, password) {
  try {
    const hash = await bcrypt.hash(password, 8)
    const user = new User({
      username: username,
      password: hash
    })
    await user.save()
  } catch (err) {
    console.log(err)
  }
}

async function getUser (username, password) {
  try {
    const user = await User.findOne({ username: username }).lean()
    if (await bcrypt.compare(password, user.password)) {
      return user
    } else { return false }
  } catch (err) {
    console.log(err)
  }
}

async function getUserArticles (id) {
  try {
    const articles = await Article.find({ _writer: { _writer: id } })
    return articles
  } catch (err) {
    console.log(err)
  }
}

async function getUserVotes (userId) {
  try {
    const user = await User.findOne({ username: userId })
    return user.votes
  } catch (err) {
    console.log(err)
  }
}

router.post('/login', async (req, res) => {
  const { body } = req
  var msg
  const user = await getUser(body.username, body.password)
  if (user) {
    req.session.userId = user._id
    if (req.query.from) { res.redirect(req.query.from) } else { res.redirect('/post/list') }
  } else {
    if (req.checklang === 'fr') {
      msg = "Nom d'utilisateur ou mot de passe incorrect, réessayez"
    } else { msg = 'Username or password incorrect, try again' }
    res.redirect('/login?msg=' + msg)
  }
})

router.post('/register', async (req, res) => {
  const { body } = req
  try {
    const user = await User.findOne({ username: body.username }).lean()
    var msg
    console.log(body)
    if (user === null) {
      createUser(body.username, body.password)
      if (req.checklang === 'fr') {
        msg = 'Votre compte a été créé avec succès ! vous pouvez maintenant vous connecter.'
      } else { msg = 'Your account have successfully been created ! you can now log in.' }
      res.redirect('/login?msg=' + msg)
    } else {
      if (req.checklang === 'fr') {
        msg = 'Pseudo indisponible, veuillez réessayer'
      } else { msg = 'Username unavailable, please try again' }
      res.redirect('/register?msg=' + msg)
    }
  } catch (err) {
    console.log(err)
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  var msg
  if (req.checklang === 'fr') {
    msg = 'Déconnecté avec succès'
  } else { msg = 'Sucessfully disconnected' }
  res.redirect('/login?msg=' + msg)
})

router.get('/profil', async (req, res) => {
  if (!req.user) {
    res.redirect('/login')
  } else {
    console.log(req.user.username)
    const posts = await getUserArticles(req.user.id)
    res.render('profil', { username: req.user.username, posts: posts })
  }
})

module.exports = router
