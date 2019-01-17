// passport-based authentication

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');


// without using passport-local-mongoose in user schema
// need to write authenticate method
exports.LocalStrategy = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, 
        { expiresIn: 3600 /* sec */});
};

var opts = {};

// speficy how the json webtoken should be
// extracted from incoming msg
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT paylod: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if(err) {
                // callback that passport will
                // pass into the strategy
                return done(err,false);
            }
            else if(user){
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

    // verify user using token
    exports.verifyUser = passport.authenticate('jwt', {session: false});




