/* Multer is a node.js middleware for handling 
* multipart/form-data, which is primarily used for 
*uploading files. 
*It is written on top of busboy for maximum efficiency.
*/

const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');
const storage = multer.diskStorage({
    //cb is callback function
    destination: (req, file, cb) => {
        // error = null
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        // so that the file is stored with
        // the original name that its uploaded with
        // if not configured, multer will give random 
        // string as name
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files'), false);
    }
    // confirmed that it's an image file
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});
 
const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, 
    // upload.single will take care of error
    upload.single('imageFile'), (req,res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        // returns path of the file (url)
        // for client to include into json doc
        res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,res,next);
    }, (req, res, next) => { 
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})

module.exports = uploadRouter;