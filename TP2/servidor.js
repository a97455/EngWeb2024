const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    let filePath = '.' + decodeURIComponent(req.url); //faz o decode para nao dar problema para paginas com acentuacao, etc
    if (filePath === './') {
        filePath = './index.html';
    }

    fs.readFile(filePath, (err, data) => {
        res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
        res.write(data);
        res.end();
    });
}).listen(7777);