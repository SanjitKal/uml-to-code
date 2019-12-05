var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var mongoose = require('mongoose')
var logger = require('morgan');
var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');
var app = express();

mongoose.connect('mongodb://localhost:27017/uml_app', {useNewUrlParser: true})

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').__express)
app.set('view engine', 'html')

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)

app.use('/', indexRouter);
app.use('/account', accountRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.html');
  console.log(err)
});

module.exports = app;
