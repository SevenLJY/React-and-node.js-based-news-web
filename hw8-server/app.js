var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

// 1. Define router
var navRouter = require("./routes/nav");
var articleRouter = require('./routes/article');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build'))); // for deploy
app.use(cors());

// 2. endpoints
app.use('/nav', navRouter);
app.use('/article', articleRouter);

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

// for deploy
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});


module.exports = app;

// This is for localhost serving in package.json
//  "scripts": {
//    "start": "supervisor --inspect ./bin/www",
//  },