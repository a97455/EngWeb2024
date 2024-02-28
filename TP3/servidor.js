var http = require('http')
var fs = require('fs')
var url = require('url')
var axios = require('axios')

function createListaFilmesHTML(filmes){
    pagHTML = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Lista de Filmes</title>
        <link rel="stylesheet" href="/w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-blue">
              <h1>Lista de Filmes</h1>
            </header>
            
            <div class="w3-container">
                <table class="w3-table w3-striped">
                    <tr>
                        <th>Título</th>
                        <th>Ano</th>
                        <th>Elenco</th>
                        <th>Género</th>
                    </tr>`
    filmes.forEach(function(filme){
        pagHTML += `
                    <tr>
                        <td><a href='/filmes/${filme.id}'>${filme.title}</a></td>
                        <td>${filme.year}</td>
                        <td>${filme.cast}</td>         
                        <td>${filme.genres}</td>
                    </tr>`
    });
    pagHTML += `
                </table>
            </div>
            
            <footer class="w3-container w3-blue">
              <h5>TPC3 in EngWeb2024</h5>
            </footer>
        </div>
    </body>
</html>`
    
    return pagHTML
}


function createFilmeHTML(filme){
    pagHTML=`
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>${filme.title}</title>
        <link rel="stylesheet" href="/w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-blue">
                <h1>${filme.title}</h1>
            </header>
            
            <div class="w3-container">
                <table class="w3-table w3-striped">
                    <tr>
                        <th>Título</th>
                        <th>Ano</th>
                        <th>Elenco</th>
                        <th>Género</th>
                    </tr>
                    <tr>
                        <td>${filme.title}</td>
                        <td>${filme.year}</td>
                        <td>${filme.cast}</td>         
                        <td>${filme.genres}</td>
                    </tr>
                </table>
            </div>
            
            <footer class="w3-container w3-blue">
                <h5>TPC3 in EngWeb2024</h5>
            </footer>
        </div>
    </body>
</html>`

    return pagHTML
}


function createListaGenerosHTML(generos){
    pagHTML = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Lista de Géneros</title>
        <link rel="stylesheet" href="/w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-blue">
              <h1>Lista de Géneros</h1>
            </header>
            
            <div class="w3-container">
                <table class="w3-table w3-striped">
                    <tr>
                        <th>Nome</th>
                    </tr>`
    generos.forEach(function(genero){
        pagHTML += `
                    <tr>
                        <td><a href='/generos/${genero.id}'>${genero.name}</a></td>
                    </tr>`
    });
    pagHTML += `
                </table>
            </div>
            
            <footer class="w3-container w3-blue">
              <h5>TPC3 in EngWeb2024</h5>
            </footer>
        </div>
    </body>
</html>`
    
    return pagHTML
}


function createGeneroHTML(genero){
    pagHTML=`
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>${genero.name}</title>
        <link rel="stylesheet" href="/w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-blue">
                <h1>${genero.name}</h1>
            </header>
            
            <div class="w3-container">
                <table class="w3-table w3-striped">
                    <tr>
                        <th>Nome</th>
                    </tr>
                    <tr>
                        <td>${genero.name}</td>
                    </tr>
                </table>
            </div>
            
            <footer class="w3-container w3-blue">
                <h5>TPC3 in EngWeb2024</h5>
            </footer>
        </div>
    </body>
</html>`

    return pagHTML
}


http.createServer(function (req, res) {
    var regexFilmes = /^\/filmes\/[a-z0-9]{24}$/
    var regexGeneros = /^\/generos\/\d+$/

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
                pagHTML = createListaFilmesHTML(dados)
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
                pagHTML = createFilmeHTML(dados)
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
                pagHTML = createListaGenerosHTML(dados)
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
                pagHTML = createGeneroHTML(dados)
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