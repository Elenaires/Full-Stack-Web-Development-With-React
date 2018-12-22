const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req,res) => {
    console.log("Request for " + req.url + ' by method ' + req.method);
    /*
    // 200 means successful
    res.statusCode = 200;

    // informing client that content is sent in html format
    res.setHeader('Content-Type', 'text/html');

    // content
    res.end('<html><body><h1>Hello, World!</h1></body></html>');
    */

    if(req.method == 'GET') {
        var fileUrl;
        if(req.url == '/') fileUrl = '/index.html'
        else fileUrl = req.url;

        var filePath = path.resolve('./public'+ fileUrl);
        const fileExt = path.extname(filePath);
        if(fileExt == '.html') {
            // check if filePath exists, then use the yes/no as argument
            // in the call back function
            fs.exists(filePath, (exists) => {
                if(!exists) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<html><body><h1>Error 404: ' + fileUrl + ' not found</h1></body></html>');
                    return;
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html');
                    fs.createReadStream(filePath).pipe(res);
                }
            })
        }
        //if the file extension is not html
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><h1>Error 404: ' + fileUrl + ' not an HTML file</h1></body></html>');
            return;
        }
    }
    //request method is not GET
    else {
        // wont handle here
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>Error 404: ' + req.method+ ' not supported</h1></body></html>');
        return;
    }
});

// start server by listening incoming request
// start server at the port and hostname specified
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}: ${port}`);
});