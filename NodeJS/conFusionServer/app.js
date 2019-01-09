var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// to keep track of sessions
var FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//added these
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=> {
  console.log('Connected correctly to server');
}, (err) => { console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// signed cookies - need to supply secret key 
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

function auth(req,res,next) {
  //console.log(req.signedCookies);
  console.log(req.session);

  // if the incoming request does not include
  // the user field in the signed cookie
  // means user has not been authorized yet
  //if(!req.signedCookies.user){
    if(!req.session.user){
    var authHeader = req.headers.authorization;

    // if client has not supplied auth header, asked for it
    if(!authHeader) {
      var err = new Error('You are not authenticated');
  
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  
    // if auth header provided, extract username and password
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  
    var username = auth[0];
    var password = auth[1];
  
    // default username and password for now
    if(username === 'admin' && password === 'password') {
      // set up cookie
      //res.cookie('user', 'admin', { signed: true })
      
      req.session.user = 'admin';
      // go on to next middleware
      next();
    }
    else { // challenge client
      var err = new Error('You are not authenticated');
  
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  }

  // user field included
  else {
    //if(req.signedCookies.user === 'admin') {
      if(req.session.user === 'admin'){
      next();
    }

    //invalid cookie
    else {
      var err = new Error('You are not authenticated');
      err.status = 401;
      return next(err);
    }
  }
}

// authentication before fetching from server
app.use(auth);

// serve static data from public server
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// added these
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

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
