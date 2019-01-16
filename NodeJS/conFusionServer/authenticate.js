var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

// without using passport-local-mongoose in user schema
// need to write authenticate method
exports.LocalStrategy = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



