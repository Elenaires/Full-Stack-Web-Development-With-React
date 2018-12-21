const http = require('http');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req,res) => {
    console.log(req.headers);

    // 200 means successful
    res.statusCode = 200;

    // informing client that content is sent in html format
    res.setHeader('Content-Type', 'text/html');

    // content
    res.end('<html><body><h1>Hello, World!</h1></body></html>')
});

// start server by listening incoming request
// start server at the port and hostname specified
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}: ${port}`);
});