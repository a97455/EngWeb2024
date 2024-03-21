var express = require('express');
var router = express.Router();
var Compositor = require('../controllers/compositor')


router.get('/compositores', function(req, res) {
  Compositor.list()
  .then(function(data){
    res.jsonp(data)
  })
  .catch(function(erro){
    res.jsonp(erro)
  })
});


router.get('/compositores/:id', function(req, res) {
  Compositor.findById(req.params.id)
  .then(function(data){
    res.jsonp(data)
  })
  .catch(function(erro){
    res.jsonp(erro)
  })
});


router.post('/compositores', function(req, res) {
  Compositor.insert(req.body)
  .then(function(data){
    res.jsonp(data)
  })
  .catch(function(erro){
    res.jsonp(erro)
  })
});


router.put('/compositores/:id', function(req, res) {
  Compositor.update(req.params.id,req.body)
  .then(function(data){
    res.jsonp(data)
  })
  .catch(function(erro){
    res.jsonp(erro)
  })
});


module.exports = router;