var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  res.render('index', { titulo: 'Gestão de Compositores', data: d});
});


// /compositores
router.get('/compositores', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/compositores')
  .then(function(compositores){
    axios.get('http://localhost:3000/periodos')
    .then(function(periodos){
      res.render('listaCompositores', {compositores: compositores.data, periodos: periodos.data, data: d, titulo: "Lista de Compositores"});
    })
    .catch(function(erro){
      res.render('error',{error: erro, message: 'Erro ao recuperar os periodos'})
    })
  })
  .catch(function(erro){
      res.render('error',{error: erro, message: 'Erro ao recuperar os compositores'})
  })
});


// /compositores/registo
router.get('/compositores/registo', function(req, res) {
  axios.get('http://localhost:3000/periodos')
  .then(function(periodos){
    var d = new Date().toISOString().substring(0, 16)
    res.render('registoCompositor', {periodos: periodos.data, data: d, titulo: "Registo de Aluno"})  
  })
  .catch(function(erro){
    res.render('error',{error: erro, message: 'Erro ao Recuperar os Periodos'})
  })
});

router.post('/compositores/registo', function(req,res){
  var d = new Date().toISOString().substring(0, 16)
  axios.post('http://localhost:3000/compositores',req.body)
    .then(function(resposta){
      var compositor = resposta.data
      axios.get('http://localhost:3000/periodos/'+compositor.periodo)
      .then(function(periodo){
        res.render('compositor', {compositor: compositor, periodo: periodo.data, data: d, titulo: "Página do Compositor"});
      })
      .catch(function(erro){
        res.render('error',{error: erro, message: 'Erro ao recuperar o periodo'})
      })
    })
    .catch(function(erro){
      res.render('error',{error: erro, message: 'Erro ao gravar um Aluno novo'})
    })
});


// /compositores/:id
router.get('/compositores/:id', function(req, res) { //no fim, pois apanha tudo /compositores  
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/compositores/'+ req.params.id)
  .then(function(resposta){
    var compositor = resposta.data
    axios.get('http://localhost:3000/periodos/'+compositor.periodo)
    .then(function(periodo){
      res.render('compositor', {compositor: compositor, periodo: periodo.data, data: d, titulo: "Página do Compositor"});
    })
    .catch(function(erro){
      res.render('error',{error: erro, message: 'Erro ao recuperar o periodo'})
    })
  })
  .catch(function(erro){
      res.render('error',{error: erro, message: 'Erro ao recuperar o compositor'})
  })
});


// /compositores/edit/:id
router.get('/compositores/edit/:id', function(req, res) {
  axios.get('http://localhost:3000/periodos')
  .then(function(periodos){
    var d = new Date().toISOString().substring(0, 16)
    res.render('editarCompositor', {periodos: periodos.data, data: d, titulo: "Edição de um Compositor"})  
  })
  .catch(function(erro){
    res.render('error',{error: erro, message: 'Erro ao Recuperar os Compositores'})
  })
});

router.post('/compositores/edit/:id', function(req,res){
  var d = new Date().toISOString().substring(0, 16)
  axios.put('http://localhost:3000/compositores/'+req.params.id,req.body)
    .then(function(resposta){
      var compositor = resposta.data
      axios.get('http://localhost:3000/periodos/'+compositor.periodo)
      .then(function(periodo){
        res.render('compositor', {compositor: compositor, periodo: periodo.data, data: d, titulo: "Página do Compositor"});
      })
      .catch(function(erro){
        res.render('error',{error: erro, message: 'Erro ao recuperar o periodo'})
      })
    })
    .catch(function(erro){
      res.render('error',{error: erro, message: 'Erro ao gravar um Aluno novo'})
    })
});


// /compositores/delete/:id
router.get('/compositores/delete/:id', function(req,res){
  var d = new Date().toISOString().substring(0, 16)
  axios.delete('http://localhost:3000/compositores/'+req.params.id)
    .then(function(resposta){
      var compositor = resposta.data
      axios.get('http://localhost:3000/periodos/'+compositor.periodo)
      .then(function(periodo){
        res.render('compositor', {compositor: compositor, periodo: periodo.data, data: d, titulo: "Página do Compositor"});
      })
      .catch(function(erro){
        res.render('error',{error: erro, message: 'Erro ao recuperar o periodo'})
      })
    })
    .catch(function(erro){
      res.render('error',{error: erro, message: 'Erro ao gravar um Aluno novo'})
    })
});
module.exports = router;