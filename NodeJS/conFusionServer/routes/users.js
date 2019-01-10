var express = require('express');
const bodyParser = require('body-parser');
var User = require('./models/user');

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
  
});
module.exports = router;
