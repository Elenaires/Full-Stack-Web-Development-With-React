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
});

favouriteRouter.route('/:dishId')
.post(authenticate.verifyUser, (req,res,next) => {
    Favourites.findOne({ user:req.user._id })
    //Favourites.findById("5c4f9d6a93ad09f2577fca65")
    .then((favourite) => {
        if(favourite !== null) {
            favourite.dishes.push(req.params.dishId);
            favourite.save()
            .then((favourite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            }, (err) => next(err))
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
});
/*
.put(authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders/');
})
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