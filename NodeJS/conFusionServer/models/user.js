var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    // not required as handled
    // by passportLocalMongoose
    /*username : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },*/
    admin: {
        type: Boolean,
        default: false
    }
});

// support for username and hash for password
// also add additional method for user schema
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);