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

    fs.readFile(filepath, function(err,data){
        res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
        if(err){
            res.write(err)
        }else{
            res.write(data)
        }
        res.end()
    })
}).listen(7777);