var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  res.render('index', { titulo: 'Gestão de Compositores', data: d});
});

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

router.get('/compositores/:id', function(req, res) {
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

module.exports = router;