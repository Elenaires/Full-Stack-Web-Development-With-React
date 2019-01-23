var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// to keep track of sessions
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//added these
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db)=> {
  console.log('Connected correctly to server');
}, (err) => { console.log(err);
});

var app = express();

app.all('*', (req, res, next) => {
  if(req.secure) {
    return next();
  }
  // redirect incoming request if it's not already directing to https
  else {
    // written status code 307 - target resource resides temporarily in a different uri
    // user agent must not change the request method if it performs 
    // an automatic redirection to the uri
    // user agent is expected to retry with the same method they have used
    // for the original end point
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// signed cookies - need to supply secret key 
//app.use(cookieParser('12345-67890-09876-54321'));

// for session - removed since we are using token based auth
/*app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));*/

app.use(passport.initialize());
//app.use(passport.session());

// must appear before authentication
// user can visit these endpoints without logging in
app.use('/', indexRouter);
app.use('/users', usersRouter);

// serve static data from public server
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);

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
