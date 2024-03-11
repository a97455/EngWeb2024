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
                        .then(function(compositores){
                            axios.get('http://localhost:3000/periodos')
                                .then(function(periodos){
                                    res.writeHead(200, {'Content-Type': 'text/html'})
                                    res.end(templates.compositoresListPage(compositores.data,periodos.data,d))
                                })
                                .catch(function(erro){
                                    res.writeHead(521, {'Content-Type': 'text/html'})
                                    res.end(templates.errorPage(erro,d))
                                })
                        })
                        .catch(function(erro){
                            res.writeHead(520, {'Content-Type': 'text/html'})
                            res.end(templates.errorPage(erro,d))
                        })
                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if (/\/compositores\/C[0-9]+/.test(req.url)){
                    axios.get('http://localhost:3000'+req.url)
                        .then(function(resposta){
                            var compositor = resposta.data
                            axios.get('http://localhost:3000/periodos/'+compositor.periodo)
                            .then(function(periodo){
                                res.writeHead(200, {'Content-Type': 'text/html'})
                                res.end(templates.compositorPage(compositor,periodo.data,d))
                            })
                            .catch(function(erro){
                                res.writeHead(521, {'Content-Type': 'text/html'})
                                res.end(templates.errorPage(erro,d))
                            })
                        })
                        .catch(function(erro){
                            res.writeHead(520, {'Content-Type': 'text/html'})
                            res.end(templates.errorPage(erro,d))
                        })
                }
                // GET /compositores/registo --------------------------------------------------------------------
                else if (req.url=='/compositores/registo'){
                    axios.get('http://localhost:3000/periodos')
                        .then(function(resposta){
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            res.end(templates.compositorFormPage(resposta.data,d))
                        })
                        .catch(function(erro){
                            res.writeHead(550, {'Content-Type': 'text/html'})
                            res.end(templates.errorPage(erro,d))
                        })
                }
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/C[0-9]+/.test(req.url)){
                    axios.get('http://localhost:3000/periodos')
                        .then(function(resposta){
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            res.end(templates.compositorFormEditPage(resposta.data,d))
                        })
                        .catch(function(erro){
                            res.writeHead(525, {'Content-Type': 'text/html'})
                            res.end(templates.errorPage(erro,d))
                        })
                }
                // GET /compositores/delete/:id --------------------------------------------------------------------
                else if(/\/compositores\/delete\/C[0-9]+/.test(req.url)){
                    var partes = req.url.split('/')
                    isCompositor = partes[partes.length-1]
                    axios.delete('http://localhost:3000/compositores/'+isCompositor)
                        .then(function(resposta){
                            var compositor = resposta.data
                            axios.get('http://localhost:3000/periodos/'+compositor.periodo)
                            .then(function(periodo){
                                res.writeHead(200, {'Content-Type': 'text/html'})
                                res.end(templates.compositorPage(compositor,periodo.data,d))
                            })
                            .catch(function(erro){
                                res.writeHead(521, {'Content-Type': 'text/html'})
                                res.end(templates.errorPage(erro,d))
                            })
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
                // POST /compositores/registo --------------------------------------------------------------------
                if (req.url== '/compositores/registo'){
                    collectRequestBodyData(req, function(result){
                        if(result){
                            axios.post("http://localhost:3000/compositores",result)
                                .then(function(resposta){
                                    var compositor = resposta.data
                                    axios.get('http://localhost:3000/periodos/'+compositor.periodo)
                                    .then(function(periodo){
                                        res.writeHead(200, {'Content-Type': 'text/html'})
                                        res.end(templates.compositorPage(compositor,periodo.data,d))
                                    })
                                    .catch(function(erro){
                                        res.writeHead(521, {'Content-Type': 'text/html'})
                                        res.end(templates.errorPage(erro,d))
                                    })
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
                // POST /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/C[0-9]+/.test(req.url)){
                    var partes = req.url.split('/')
                    idCompositor = partes[partes.length-1]
                    collectRequestBodyData(req, function(result){
                        if(result){
                            axios.put("http://localhost:3000/compositores/"+idCompositor,result)
                                .then(function(resposta){
                                    var compositor = resposta.data
                                    axios.get('http://localhost:3000/periodos/'+compositor.periodo)
                                    .then(function(periodo){
                                        res.writeHead(200, {'Content-Type': 'text/html'})
                                        res.end(templates.compositorPage(compositor,periodo.data,d))
                                    })
                                    .catch(function(erro){
                                        res.writeHead(521, {'Content-Type': 'text/html'})
                                        res.end(templates.errorPage(erro,d))
                                    })
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