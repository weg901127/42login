require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('./passportset');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ resave: false, saveUninitialized: false, secret: process.env.SESSION_SECRET }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',
  ensureLoggedIn('/login/42'),
  function (req, res) {
    console.log(req.user['username'],'loggedin');
    res.render('index', {name : req.user['username']});
  });

app.get('/login/42',
  passport.authenticate('42'));

app.get('/login/42/return',
  passport.authenticate('42', { failureRedirect: '/login/42' }),
  function (req, res) {
    res.redirect('/')
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
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
  res.render('error');
});

module.exports = app;
