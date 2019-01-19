const express = require('express');
const http = require('http');

// log incoming request on the screen
// allow the browser to serve up static html files 
// a middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
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
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);webkitConvertPointFromPageToNode

// __dirname means root folder
// request to localhost:3000 will return index.html by default
app.use(express.static(__dirname + '/public'));

// request to files that does not exists will go here
// since we did not write code to handle that
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