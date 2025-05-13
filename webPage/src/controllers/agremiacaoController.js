var agremiacaoModel = require("../models/agremiacaoModel");

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
  var nome = req.body.nome;
  var categoria = req.body.categoria;

  agremiacaoModel.listar().then((todasAgremiacoes) => {
    const existe = todasAgremiacoes.some(a => a.nome === nome);

    if (existe) {
      res.status(401).json({ mensagem: `A agremiação ${nome} já existe` });
    } else {
      agremiacaoModel.cadastrar(nome, categoria).then((resultado) => {
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
