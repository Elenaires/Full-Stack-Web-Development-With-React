/* this file will contain the implementing of handing of REST api
* endpoint for /dishes and /dishes:dishId 
*/

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
/*.all((req, res, next) => {
    //when a request comes in, for all the request, no matter
    //what method invoked (get, put, post etc)
    //for /dishes end point, these code will be executed first
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    // calling next() will continue to look for additional specification
    // that matches '/dishes' endpoint
    next();
})*/
// the above next() will invoke this function passing along req and res as arg
.get((req, res, next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
    //res.end('Will send all the dishes to you!');
})
.post((req,res,next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log("Dish Created ", dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
// since put operation on /dishes doesn't make sense??
// maybe it means not possible to edit all dishes at once?
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

/* for dishes/:dishId */
dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'
    + req.params.dishId);
})
.put((req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
        // will return the updated dish as json string in the reply
    }, { new: true })
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;