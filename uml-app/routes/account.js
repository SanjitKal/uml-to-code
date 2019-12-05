var express = require('express')
var router = express.Router()
var User = require('../models/user.js')

router.get('/signup', function(req, res) {
  res.render('signup.html')
})

router.post('/signup', function(req, res, next) {
  var username = req.body.username
  var password = req.body.password
  var u = new User({ username: username, password: password, umlCreations: [], curr_diagram: ''})
  u.save(function(err) {
    if (err) {
      next(err)
    }
    if (!err) {
      res.redirect('/account/login')
    }
  })
})

router.get('/login', function(_, res) {
  res.render('login.html')
})

router.post('/login', function(req, res, next) {
  var username = req.body.username
  var password = req.body.password
  User.findOne({ username: username, password: password }, function(
    err,
    result
  ) {
    if (!err && result != null) {
      req.session.user = username
      res.redirect('/?username=' + username)
    } else {
      next(new Error('invalid credentials'))
    }
  })
})

router.post('/logout', function(req, res) {
  req.session.user = ''
  res.redirect('/account/login')
})

module.exports = router
