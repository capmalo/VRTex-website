const express = require('express')
var router = express.Router()
const User = require('../models/user.model.js')
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

router.post('/login', async (req, res) => {
  const { body } = req
  const user = await getUser(body.username, body.password)
  if (user) {
    req.session.userId = user._id
    res.redirect(req.query.from)
  } else { res.send('USER NOT EXIST') }
})

router.post('/register', (req, res) => {
  const { body } = req
  createUser(body.username, body.password)
  res.render('index')
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  if (req.user) {
    res.send('Au revoir ' + req.user.username + '!')
  } else {
    res.send('Qui étiez-vous ?')
  }
})

module.exports = router
