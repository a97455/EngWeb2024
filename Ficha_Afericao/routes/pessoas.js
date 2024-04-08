var express = require('express');
var router = express.Router();
var Pessoa = require('../controllers/pessoa')


router.get('/pessoas', function(req, res) {
  Pessoa.list()
  .then(function(data){
    res.jsonp(data)
  })
  .catch(function(erro){
    res.jsonp(erro)
  })
});


router.get('/pessoas/:id', function(req, res) {
  Pessoa.findById(req.params.id)
  .then(function(data){
    res.jsonp(data)
  })
  .catch(function(erro){
    res.jsonp(erro)
  })
});


router.post('/pessoas/registo', function(req, res) {
  Pessoa.insert(req.body)
  .then(function(data){
    res.jsonp(data)
  })
  .catch(function(erro){
    res.jsonp(erro)
  })
});


router.put('/pessoas/edit/:id', function(req, res) {
  Pessoa.update(req.params.id,req.body)
  .then(function(data){
    res.jsonp(data)
  })
  .catch(function(erro){
    res.jsonp(erro)
  })
});


router.delete('/pessoas/delete/:id', function(req, res) {
  Pessoa.delete(req.params.id)
  .then(function(data){
    res.jsonp(data)
  })
  .catch(function(erro){
    res.jsonp(erro)
  })
});

module.exports = router;