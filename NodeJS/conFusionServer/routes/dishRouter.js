/* this file will contain the implementation of handling of REST api
* endpoint for /dishes and /dishes:dishId 
*/

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');

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
    // ensure that author field
    // is populated with the appro info
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
    //res.end('Will send all the dishes to you!');
})
// only authenticated user are allowed to post
// if authentication fail, passport authenticator 
// will respond to the client
.post(authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
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
/*.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})*/
.put(authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
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
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/'
        + req.params.dishId);
})
.put(authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
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
.delete(authenticate.verifyUser, (req, res, next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
        Dishes.findByIdAndRemove(req.params.dishId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

// comments
dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //app.js will handle error
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

// if authenticate.verifyUser is successful
// it will add user field to req.
.post(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {
            // since we are not allowing client to enter 
            // author name when posting a comment
            // we retrieve user id through req.user 
            // (we know which user is posting the comment since we have
            // done authenticate.verfiyUser, which when successful, will
            // add a user field to req)
            // recall comment schema now take objectid as author type
            // and add it to req.body.author
            req.body.author = req.user._id;   
            // now we have all the fields of a comment
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                // need to populate author info to the dish comment
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish.comments);
                    })
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //app.js will handle error
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/' 
            + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
        Dishes.findById(req.params.dishId)
        .then((dish) => {
            if(dish != null) {
                for(var i = (dish.comments.length - 1); i >= 0; i--){
                    dish.comments.id(dish.comments[i]._id).remove();
                }
                dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err); //app.js will handle error
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

/* /:dishId/comments/:commentId */
dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //app.js will handle error
        }    
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err); //app.js will handle error
        }     
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'
    + req.params.dishId + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        var comment = dish.comments.id(req.params.commentId);
        if(dish != null && comment != null) {
            if(req.user._id.equals(comment.author)){
                // update the rating or comment only
                if(req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.comment) {
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id) 
                        .populate('comments.author')
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish.comments);
                        })
                }, (err) => next(err));
            }
            else {
                err = new Error('You do not have the permission to perform this action');
                err.status = 403;
                return next(err); 
            }
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //app.js will handle error
        }    
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err); //app.js will handle error
        }     
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        var comment = dish.comments.id(req.params.commentId);
        if(dish != null && comment != null) {
            if(req.user._id.equals(comment.author)){
                // delete specific comment
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        })
                }, (err) => next(err))
                .catch((err) => next(err));
            }
            else {
                err = new Error('You do not have the permission to perform this action');
                err.status = 403;
                return next(err); 
            }
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //app.js will handle error
        }    
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err); //app.js will handle error
        } 
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;