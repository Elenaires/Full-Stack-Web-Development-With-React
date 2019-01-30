const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favourites = require('../models/favourite');
const favouriteRouter = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');
favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({ user:req.user._id })
    .populate('user')
    .populate('dishes')
    // populate author of comments
    .populate({
        path: 'dishes',
        populate: {
            path: 'comments.author',
            model: 'User'
        }
    })
    .then((favourite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourite);
    }, (err) => next(err))
    .catch((err) => next(err));
})

// post multiple favourite dishes at once
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favourites.findOne({ user:req.user._id })
    .then((favourite) => {
        // if user already has a favourite list
        if(favourite !== null) {
            // if user posted an array, loop through each object
            // add into favourite if it does not exist
            if(req.body instanceof Array) {
                for(var i in req.body) {
                    if(favourite.dishes.indexOf(req.body[i]._id) === -1) {
                        favourite.dishes.push(req.body[i]);
                    }
                }
            }
            // if user posted a single object
            // add the object into favourite if it does not already exist
            else {
                if(favourite.dishes.indexOf(req.body._id) === -1) {
                    favourite.dishes.push(req.body);
                }
            }
        }
        // if user does not have a favourite list
        else {
            Favourites.create({user: req.user._id})
            .then((favourite) => {
                // assumes that if it's the first time user is
                // creating a favourite list
                // the items he adds to the list must be unique
                favourite.dishes.push(...req.body);
            }, (err) => next(err))
        }
        favourite.save()
        .then((favourite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favourite);
        }, (err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourite');
})

favouriteRouter.route('/:dishId')
// post single dish to favourite
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favourites.findOne({ user:req.user._id })
    .then((favourite) => {
        if(favourite !== null) {
            // check that the dish to add is not already in favourite
            if(favourite.dishes.indexOf(req.params.dishId) === -1) {
                favourite.dishes.push(req.params.dishId);
                favourite.save()
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }, (err) => next(err))
            }
            // dish already exist in favourite
            else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Dish already exists in favourite list'});
            }
        }
        else {
            Favourites.create({user: req.user._id})
            .then((favourite) => {
                favourite.dishes.push(req.params.dishId);
                favourite.save()
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }, (err) => next(err))
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourite/');
});
/*
.delete(authenticate.verifyUser, (req, res, next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
        Leaders.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});*/


/*leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
        res.statusCode = 403;
        res.end('POST operation not supported on /leaders/'
        + req.params.leaderId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
            // will return the updated dish as json string in the reply
        }, { new: true })
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});*/

module.exports = favouriteRouter;