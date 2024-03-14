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

module.exports = router;