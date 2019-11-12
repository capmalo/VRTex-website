const express = require('express')
const app = express()
// const fs = require('fs')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const User = require('./models/user.model.js')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const users = require('./routes/users.js')
const articles = require('./routes/articles.js')

// let calendar
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/calendarDB', { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
  if (error) console.log(error)

  console.log('connection successful')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'keyboardcat',
  name: 'sessId'
}))

async function tokenToUserMiddleware (req, res, next) {
  console.log(req.session)
  if (req.session && req.session.userId) {
    req.user = await User.findById(req.session.userId)
  }
  next()
}

app.use(tokenToUserMiddleware)

app.use('/user', users)
app.use('/post', articles)

app.listen(3000, () => {
  // readCalendar()
})

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.status(401)
    res.send('you are already connected')
    return
  }

  res.render('index')
})

app.get('/register', (req, res) => {
  res.render('register')
})
