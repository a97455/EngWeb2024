var http = require('http')
var fs = require('fs')
var url = require('url')
var axios = require('axios')

http.createServer(function (req, res) {
    var regexFilmes = /^\/filmes\/[a-z0-9]{4}$/
    var q = url.parse( req.url, true)
    if(q.pathname == '/'){
        fs.readFile('principal.html', function(erro, dados) {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(dados)
            res.end()
        })
    }
    else if(q.pathname == '/ocorrencias'){
        axios.get('http://localhost:3000/ocorrencias')
            .then(function(resp){
                dados = resp.data
                pagHTML = genOcorrencias(dados)
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(pagHTML)
                res.end()
            })
            .catch(function(erro){
                res.writeHead(500, {'Content-Type': 'text/html'})
                res.write("<pre>" + erro + "</pre>")
                res.end()
            })
    }
    else if(regex.test(q.pathname)){
        axios.get('http://localhost:3000'+q.pathname)
            .then(function(resp){
                dados = resp.data
                pagHTML = genOcorrencia(dados)
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(pagHTML)
                res.end()
            })
            .catch(function(erro){
                res.writeHead(500, {'Content-Type': 'text/html'})
                res.write("<pre>" + erro + "</pre>")
                res.end()
            })
    }
    else if(q.pathname == '/w3.css'){
        fs.readFile('w3.css', function(erro, dados) {
            res.writeHead(200, {'Content-Type': 'text/css'})
            res.write(dados)
            res.end()
        })
    }
    else{
        res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'})
        res.write('<p>Erro: Pedido nao suportado.</p>')
        res.write('<pre>' + q.pathname + '</pre>')
        res.end()
    }
}).listen(7777)