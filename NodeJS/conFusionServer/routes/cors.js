const express = require('express');
const cors = require('cors');
const app = express();

// contains all the origins
// that server is willing to accept
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    // if incoming request header contains
    // an Origin field
    // then we will check through whitelist 
    // to see if it's present in the whitelist
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

// standard cors
exports.cors = cors();
//if we need to apply cors with specific option
exports.corsWithOptions = cors(corsOptionsDelegate);