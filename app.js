var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models');

var indexRouter = require('./routes/main');
var register = require('./routes/register');
var login = require('./routes/login');
var userinfo = require('./routes/userinfo');
var payment = require('./routes/payment');
var ecbt = require('./routes/ecbt');
var success = require('./routes/success');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register', register);
app.use('/login', login);
app.use('/userinfo', userinfo);
app.use('/payment', payment);
app.use('/ecbt', ecbt);
app.use('/success', success);

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

// 启动mySQL的model
models.sequelize.sync({}).then(() => {
  console.log(`Database & tables created!`)
})

module.exports = app;
