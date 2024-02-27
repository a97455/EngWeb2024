var http = require('http')
var fs = require('fs')
var url = require('url')
var axios = require('axios')

function createListaFilmesHTML(ocorrencias){
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
                        <th>Identificador</th>
                        <th>Título</th>
                        <th>Ano</th>
                        <th>Elenco</th>
                        <th>Gênero</th>
                    </tr>
    `
    ocorrencias.forEach(function(ocorr){
        pagHTML += `
                    <tr>
                        <td><a href='/ocorrencias/${ocorr.id}'>${ocorr.id}</a></td>
                        <td>${ocorr.title}</td>
                        <td>${ocorr.year}</td>
                        <td>${ocorr.cast}</td>         
                        <td>${ocorr.genres}</td>
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

http.createServer(function (req, res) {
    var regexFilmes = /^\/filmes\/[a-z0-9]{4}$/
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