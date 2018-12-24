/* this file will contain the implementing of handing of REST api
* endpoint for /dishes and /dishes:dishId 
*/

const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
    //when a request comes in, for all the request, no matter
    //what method invoked (get, put, post etc)
    //for /dishes end point, these code will be executed first
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    // calling next() will continue to look for additional specification
    // that matches '/dishes' endpoint
    next();
})
// the above next() will invoke this function passing along req and res as arg
.get((req, res, next) => {
    res.end('Will send all the dishes to you!');
})
.post((req,res,next) => {
    res.end('Will add the dish: ' + req.body.name + 
    ' with details: ' + req.body.description);
})
// since put operation on /dishes doesn't make sense??
// maybe it means not possible to edit all dishes at once?
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all the dishes');
});

module.exports = dishRouter;