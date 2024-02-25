var http= require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req,res){
    var request = url.parse(req.url, true).pathname
    var filepath = ''
    if (request =='/'){
        filepath = 'index.html'
    }else{
        filepath = "html/" + request.substring(1) + ".html"
    }

    fs.readFile(filepath, function(err, data) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write(err.toString()); // Convert error to string before writing
        } else {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(data);
        }
        res.end();
    })
}).listen(7777);