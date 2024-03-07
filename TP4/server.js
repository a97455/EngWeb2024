var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates.js')        // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation
var alunosServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if (req.url=='/compositores'){
                    axios.get('http://localhost:3000/compositores')
                        .then(function(resposta){
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            res.end(templates.compositoresListPage(resposta.data,d))
                        })
                        .catch(function(erro){
                            res.writeHead(520, {'Content-Type': 'text/html'})
                            res.end(templates.errorPage(erro,d))
                        })
                }
                // GET /alunos/:id --------------------------------------------------------------------
                else if (/\/alunos\/A[0-9]+/.test(req.url)){
                    axios.get('http://localhost:3000'+req.url)
                        .then(function(resposta){
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            res.end(templates.studentPage(resposta.data,d))
                        })
                        .catch(function(erro){
                            res.writeHead(520, {'Content-Type': 'text/html'})
                            res.end(templates.errorPage(erro,d))
                        })
                }
                // GET /alunos/registo --------------------------------------------------------------------
                else if (req.url=='/alunos/registo'){
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(templates.studentFormPage(d))
                }
                // GET /alunos/edit/:id --------------------------------------------------------------------
                else if (/\/alunos\/edit\/A[0-9]+/.test(req.url)){
                    var partes = req.url.split('/')
                    idAluno = partes[partes.length-1]
                    axios.get('http://localhost:3000/alunos/'+idAluno)
                        .then(function(resposta){
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            res.end(templates.studentFormEditPage(resposta.data,d))
                        })
                        .catch(function(erro){
                            res.writeHead(525, {'Content-Type': 'text/html'})
                            res.end(templates.errorPage(erro,d))
                        })
                }
                // GET /alunos/delete/:id --------------------------------------------------------------------
                else if(/\/alunos\/delete\/A[0-9]+/.test(req.url)){
                    var partes = req.url.split('/')
                    idAluno = partes[partes.length-1]
                    axios.delete('http://localhost:3000/alunos/'+idAluno)
                        .then(function(resposta){
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            res.end(templates.studentPage(resposta.data,d))
                        })
                        .catch(function(erro){
                            res.writeHead(530, {'Content-Type': 'text/html'})
                            res.end(templates.errorPage(erro,d))
                        })
                }
                // GET ? -> Lancar um erro
                else{
                    res.writeHead(404, {'Content-Type': 'text/html'})
                    res.end(templates.errorPage(`Pedido GET nao suportado ${req.url}`,d))
                }
                break
            case "POST":
                // POST /alunos/registo --------------------------------------------------------------------
                if (req.url== '/alunos/registo'){
                    collectRequestBodyData(req, function(result){
                        if(result){
                            axios.post("http://localhost:3000/alunos",result)
                                .then(function(resposta){
                                    res.writeHead(201, {'Content-Type': 'text/html'})
                                    res.end(templates.studentPage(resposta.data,d))
                                })
                                .catch(function(erro){
                                    res.writeHead(520, {'Content-Type': 'text/html'})
                                    res.end(templates.errorPage(erro,d))
                                })
                        }else{
                            res.writeHead(404, {'Content-Type': 'text/html'})
                            res.end(templates.errorPage(`Pedido POST nao foi possivel ${req.url}`,d))
                        }
                    })
                }
                // POST /alunos/edit/:id --------------------------------------------------------------------
                else if (/\/alunos\/edit\/A[0-9]+/.test(req.url)){
                    var partes = req.url.split('/')
                    idAluno = partes[partes.length-1]
                    console.log(idAluno)
                    collectRequestBodyData(req, function(result){
                        if(result){
                            axios.put("http://localhost:3000/alunos/"+idAluno,result)
                                .then(function(resposta){
                                    res.writeHead(201, {'Content-Type': 'text/html'})
                                    res.end(templates.studentPage(resposta.data,d))
                                })
                                .catch(function(erro){
                                    res.writeHead(520, {'Content-Type': 'text/html'})
                                    res.end(templates.errorPage(erro,d))
                                })
                        }else{
                            res.writeHead(404, {'Content-Type': 'text/html'})
                            res.end(templates.errorPage(`Pedido POST nao foi possivel ${req.url}`,d))
                        }
                    })
                }
                // POST ? -> Lancar um erro
                else{
                    res.writeHead(404, {'Content-Type': 'text/html'})
                    res.end(templates.errorPage(`Pedido POST nao suportado ${req.url}`,d))
                }
            default: 
                // Outros metodos nao sao suportados
        }
    }
})

alunosServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})