const express = require('express');
const bodyParser = require('body-parser');
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
            favourite.save()
            .then((favourite) => {
                Favourites.findById(favourite._id)
                .populate('user')
                .populate('dishes')
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                })
            }, (err) => next(err))
        }
        // if user does not have a favourite list
        else {
            Favourites.create({user: req.user._id})
            .then((favourite) => {
                // assumes that if it's the first time user is
                // creating a favourite list
                // the items he adds to the list must be unique
                // OR create a new favourite along with {dishes: req.body}
                favourite.dishes.push(...req.body);
                favourite.save()
                .then((favourite) => {
                    Favourites.findById(favourite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favourite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    })
                }, (err) => next(err))
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user:req.user._id}) // OR findOneAndRemove
    .then((favourite) => {
        if(favourite !== null) {
            favourite.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
        }
        else {
            err = new Error('No favourites found');
            err.status = 404;
            return next(err); //app.js will handle error
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
// for the client side to check if a particular dish 
// is in a user's favourite list or not
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user: req.user._id})
    .then((favourite) => {
        // no favourite list
        if(!favourite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favourite": favourite});
        }
        else {
            // dish is not in favourite
            if(favourite.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favourite": favourite});
            }
            // dish exist in favourite
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favourite": favourite});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
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
                    Favourites.findById(favourite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favourite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    })
                }, (err) => next(err))
                .catch((err) => {
                    return next(err);
                })
            }
           
            // dish already exist in favourite
            else {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Dish ' + req.params.dishId + ' already exists in favourite list');
            }
        }
        else {
            Favourites.create({user: req.user._id})
            .then((favourite) => {
                favourite.dishes.push(req.params.dishId);
                favourite.save()
                .then((favourite) => {
                    Favourites.findById(favourite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favourite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    })
                })
                .catch((err) => {
                    return next(err);
                });
            })
            .catch((err) => {
                return next(err);
            });
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourite/');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user:req.user._id}) 
    .then((favourite) => {
        if(favourite !== null) {
            var dishIndex = favourite.dishes.indexOf(req.params.dishId);
            if(dishIndex !== -1) {
                //favourite.dishes.splice(dishIndex, 1); -> works
                //favourite.dishes[dishIndex].remove(); -> doesnt work
                //favourite.dishes.remove(mongoose.Types.ObjectId(req.params.dishId)); -> works
                favourite.dishes.remove(req.params.dishId);
                favourite.save()
                .then((favourite) => {
                    Favourites.findById(favourite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favourite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    })
                }, (err) => next(err))
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' is not in your favourite');
                err.status = 404;
                return next(err); //app.js will handle error
                //res.statusCode = 404;
                //res.setHeader('Content-Type', 'text/plain');
                //res.end('Dish ' + req.params._id + " not in your favourite");
            }
        }
        else {
            err = new Error('You do not have a favourite list');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favouriteRouter;