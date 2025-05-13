var empresaModel = require("../models/agremiacaoModel");

function buscarPoridAgremiacao(req, res) {
  var idAgremiacao = req.query.idAgremiacao;

  agremiacaoModel.buscarPoridAgremiacao(idAgremiacao).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listar(req, res) {
  agremiacaoModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarPorCategoria(req, res) {
  var categoria = req.params.categoria;

  agremiacaoModel.buscarPorCategoria(categoria).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrar(req, res) {
  var idAgremiacao = req.body.idAgremiacao;
  var nome = req.body.nome;

  agremiacaoModel.buscarPoridAgremiacao(idAgremiacao).then((resultado) => {
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `a agremiacao ${cnpj} já existe` });
    } else {
        agremiacaoModel.cadastrar(nome, idAgremiacao).then((resultado) => {
        res.status(201).json(resultado);
      });
    }
  });
}

module.exports = {
  buscarPoridAgremiacao,
  buscarPorCategoria,
  cadastrar,
  listar,
};
