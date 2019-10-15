var errorhandler = require('errorhandler');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var reload = require('reload');

var indexRouter = require('./routes/index');

var app = express();

app.disable('x-powered-by');

var allowCrossDomain = function (req, res, next){
  var allowedOrigins = [
    'https://kotobago.com',
    'http://localhost:3000',
  ];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(allowCrossDomain);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next){
  next(createError(404));
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next){
    console.log(err.message);
    res.status(err.code || 500).json({
      status: 'error',
      message: err,
    });
  });
}

app.use(function (err, req, res, next){
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message,
  });
});

// error handler
app.use(errorhandler({ dumpExceptions: true, showStack: true }));

app.use(function (err, req, res, next){
  // set locals, only providing error in development
  console.log(err.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

reload(app);
module.exports = app;
