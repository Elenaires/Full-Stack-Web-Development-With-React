var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next){

  // check that username is not already in the system
  // will return user (null means cannot find)
  User.findOne({username: req.body.username})

  .then((user) => {
    // user exists
    if(user != null) {
      var err = new Error('User ' + req.body.username + ' already exists!');
      err.status = 403; // forbidden
      next(err);
    }

    // will return a promise and hand it over to 
    // the next then
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password});
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }, (err) => next(err)) // if there is an error, pass it to next to handle
  .catch((err) => next(err));
});

// to login
router.post('/login', (req, res, next) => {
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
    
      User.findOne({username: username})
      .then((user) => {
        // couldnt find user with that username
        if(user === null) {
          var err = new Error('User ' + username + ' does not exists');
          err.status = 403;
          return next(err);
        } 
        // user exist but password does not match
        else if (user.password !== password) {
          var err = new Error('Your password is incorrect');
          err.status = 403;
          return next(err);
        }
        // username and password match
        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!');
        }
      })
      // for error handler to handle error
      .catch((err) => next(err));
    }

    // user already logged in (req.sessions.user not null)
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
    }
});

// logging user out - using GET as we are not submitting
// any info, server already has our info in session
router.get('/logout', (req,res) => {
  // first they need to be logged in
  if(req.session) {
    // remove session info from server side
    req.session.destroy();
    // request client side to remove cookie
    res.clearCookie('session-id');
    // back to home page
    res.redirect('/'); 
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
module.exports = router;
