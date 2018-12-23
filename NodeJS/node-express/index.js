const express = require('express');
const http = require('http');

// log incoming request on the screen
// allow the browser to serve up static html files 
const morgan = require('morgan');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));

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