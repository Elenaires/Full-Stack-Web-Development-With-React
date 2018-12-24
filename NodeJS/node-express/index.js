const express = require('express');
const http = require('http');

// log incoming request on the screen
// allow the browser to serve up static html files 
// a middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRouter');
const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
// allows us to parse the body of the request in json format as req.body
app.use(bodyParser.json());

// mounting of router
// any request coming to /dishes end point will be
// handled by dishRouter
app.use('/dishes', dishRouter);

/* for dishes/:dishId */
app.get('/dishes/:dishId', (req, res, next) => {
    res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
});

app.post('/dishes/:dishId', (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'
    + req.params.dishId);
});

app.put('/dishes/:dishId', (req,res,next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' 
    + req.body.description);
});

app.delete('/dishes/:dishId', (req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId);
});

// __dirname means root folder
app.use(express.static(__dirname + '/public'));

// next is an optional parameter - invoke additional middleware
app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express server</h1></body><html>');
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}`);
});