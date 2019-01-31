var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');
var router = express.Router();
router.use(bodyParser.json());


/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });
router.get('/', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  authenticate.verifyAdmin(req,res,next);
  }, (req, res, next) => { 
    User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({users});
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/signup', cors.corsWithOptions, function(req, res, next){
  User.register(new User({username: req.body.username}),
  req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err});
    }
    else {
      if(req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save((err, user) => {
        if(err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err:err});
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      })
    }
  });
});

// to login
// if passport.authenticate is successful
// the next function will be called
// otherwise it will return err msg to user
// all taken care by passport
router.post('/login', cors.corsWithOptions, (req, res, next) => {
  
  // if user doesnt exists, info will contain such info
  // which will be passed back to the client
  passport.authenticate('local', (err, user, info) => {
    if(err) {
      return next(err); // express error handler to take care
    }
    // no error but user is not found (null) 
    // (username or password incorrect)
    if(!user) {
      res.statusCode = 401; // unauthorized
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'login unsuccessfull!', err: info});
    }
    // if user is successfully verified, passport.authenticate
    // would have addded logIn to req
    // req.logIn -> try to login user
    req.logIn(user, (err) => {
      if(err) {
        res.statusCode = 401; // unauthorized
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'login unsuccessfull!', err: 'Could not log in user'});
      }
  
      // if all good, create token
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully logged in!'});
    });
  }) (req, res, next); // part of the structure
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

router.get('/facebook/token', passport.authenticate
// if authenticate successful, user field will be added to req
('facebook-token'), (req, res) => {
  if(req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

// after login and obtaining token
// token may expire, and server fail to authenticate user
// this is added to cross check token is still valid
// else provide a new token
router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if(err) {
      return next(err);
    }
    // user doesnt exists -> JWT expire
    if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status:'JWT invalid', success: false, err: info})
    }
    // token is still valid
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status:'JWT valid', success: true, user: user})
    }
  }) (req, res); // part of the passport.authenticate structure
})
module.exports = router;
