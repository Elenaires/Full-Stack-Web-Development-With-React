var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());


/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

/* GET users listing. */
router.get('/', authenticate.verifyUser, (req, res, next) => {
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

router.post('/signup', function(req, res, next){
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
router.post('/login', passport.authenticate('local'), (req, res) => {
  
  // create token
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
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
