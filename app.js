const express = require('express')
const app = express()
// const fs = require('fs')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const User = require('./models/user.model.js')
app.set('views', path.join(__dirname, 'views-en'))
app.set('view engine', 'ejs')

app.use(express.static(__dirname))

const users = require('./routes/users.js')
const articles = require('./routes/articles.js')

// let calendar
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/VRtexDB', { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
  if (error) console.log(error)

  console.log('connection successful')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'keyboardcat',
  name: 'sessId',
  resave: false,
  saveUninitialized: false
}))

async function tokenToUserMiddleware (req, res, next) {
  if (req.session && req.session.userId) {
    req.user = await User.findById(req.session.userId)
  }
  next()
}

app.use(tokenToUserMiddleware)

function onlyIfLoggedMiddleware (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/?from=' + req.originalUrl)
  }
}

app.use('/user', users)
app.use('/post', onlyIfLoggedMiddleware, articles)

app.listen(3000, () => {
  // readCalendar()
})

app.get('/login', (req, res) => {
  if (req.user) {
    res.redirect('/post/list')
    return
  }
  let from = ''
  let msg = ''
  if (req.query.from) {
    from = req.query.from
  }
  if (req.query.msg) {
    msg = req.query.msg
  }
  res.render('login', { from: from, msg: msg })
})

app.get('/register', (req, res) => {
  if (req.user) {
    res.redirect('/post/list')
  }
  let msg = ''
  if (req.query.msg) {
    msg = req.query.msg
  }
  console.log(msg)
  res.render('register', { msg: msg })
})

app.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/post/list')
  }
  let msg = ''
  if (req.query.msg) {
    msg = req.query.msg
  }
  var lang = req.acceptsLanguages('fr', 'en')
  if (lang) {
    if (lang === 'fr') {
      app.set('views', path.join(__dirname, 'views-fr'))
    } else {
      app.set('views', path.join(__dirname, 'views-en'))
    }
  } else {
    console.log('None of [fr, en] is accepted')
  }
  console.log(msg)
  res.render('frontpage', { msg: msg })
})
