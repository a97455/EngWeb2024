var mongoose = require('mongoose')

// Schema para morada
const enderecoSchema = new mongoose.Schema({
    cidade: String,
    distrito: String
}, { _id: false });
  
// Schema para partido político
const partidoPoliticoSchema = new mongoose.Schema({
    party_abbr: String,
    party_name: String
}, { _id: false });

// Schema para atributos
const atributosSchema = new mongoose.Schema({
    fumador: Boolean,
    gosta_cinema: Boolean,
    gosta_viajar: Boolean,
    acorda_cedo: Boolean,
    gosta_ler: Boolean,
    gosta_musica: Boolean,
    gosta_comer: Boolean,
    gosta_animais_estimacao: Boolean,
    gosta_dancar: Boolean,
    comida_favorita: String
}, { _id: false });
  
// Schema para pessoa
const pessoaSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    idade: Number,
    sexo: String,
    morada: enderecoSchema, 
    descrição: String,
    profissao: String,
    partido_politico: partidoPoliticoSchema,
    religiao: String,
    desportos: [String],
    animais: [String],
    figura_publica_pt: [String],
    marca_carro: String,
    destinos_favoritos: [String],
    atributos: atributosSchema
}, { versionKey: false });

module.exports = mongoose.model('pessoa',pessoaSchema) //nome correspondente à collection na db