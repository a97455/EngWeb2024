var http = require('http')
var fs = require('fs')
var url = require('url')
var axios = require('axios')

var templates = require('./templates.js') 

http.createServer(function (req, res) {
    var regexFilmes = /^\/filmes\/[a-z0-9]{24}$/
    var regexGeneros = /^\/generos\/\d+$/
    var regexAtores = /^\/atores\/\d+$/

    var q = url.parse( req.url, true)
    if(q.pathname == '/'){
        fs.readFile('index.html', function(erro, dados) {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(dados)
            res.end()
        })
    }
    else if(q.pathname == '/filmes'){
        axios.get('http://localhost:3000/filmes')
            .then(function(resp){
                dados = resp.data
                pagHTML = templates.createListaFilmesHTML(dados)
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
    else if(regexFilmes.test(q.pathname)){
        axios.get('http://localhost:3000'+q.pathname)
            .then(function(resp){
                dados = resp.data
                pagHTML = templates.createFilmeHTML(dados)
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
    else if(q.pathname == '/generos'){
        axios.get('http://localhost:3000/generos')
            .then(function(resp){
                dados = resp.data
                pagHTML = templates.createListaGenerosHTML(dados)
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
    else if(regexGeneros.test(q.pathname)){
        axios.get('http://localhost:3000'+q.pathname)
            .then(function(resp){
                dados = resp.data
                pagHTML = templates.createGeneroHTML(dados)
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
    else if(q.pathname == '/atores'){
        axios.get('http://localhost:3000/atores')
            .then(function(resp){
                dados = resp.data
                pagHTML = templates.createListaAtoresHTML(dados)
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
    else if(regexAtores.test(q.pathname)){
        axios.get('http://localhost:3000'+q.pathname)
            .then(function(resp){
                dados = resp.data
                pagHTML = templates.createAtorHTML(dados)
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
        res.writeHead(400, {'Content-Type': 'text/html charset=utf-8'})
        res.write('<p>Erro: Pedido nao suportado.</p>')
        res.write('<pre>' + q.pathname + '</pre>')
        res.end()
    }
}).listen(7777)