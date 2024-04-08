var Pessoa = require('../models/pessoa')

module.exports.list = function(){
    return Pessoa.find().sort({nome: 1}).exec()
}

module.exports.findById = function(id){
    return Pessoa.findOne({_id: id}).exec()
}

module.exports.insert = function(pessoa){
    return Pessoa.create(pessoa)
}

module.exports.update = function(id,pessoa){
    return Pessoa.updateOne({_id:id}, pessoa)
}

module.exports.delete = function(id){
    return Pessoa.deleteMany({_id:id})
}