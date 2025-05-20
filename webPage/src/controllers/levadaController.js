var levadaModel = require("../models/levadaModel");

function buscarLevadasPorUsuarios(req, res) {
  var idLevada = req.params.idLevada;

  levadaModel.buscarLevadasPorUsuarios(idLevada).then((resultado) => {
    if (resultado.length > 0) {
      res.status(200).json(resultado);
    } else {
      res.status(204).json([]);
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log('Houve um erro ao buscar as levadas: ', erro.sqlMessage);
    res.status(500).json(erro.sqlMessage);
  });
}


function cadastrar(req, res) {
  var nome = req.body.nome;
  var idLevada = req.body.idLevada;

  if (nome == undefined) {
    res.status(400).send("nome está undefined!");
  } else if (idLevada == undefined) {
    res.status(400).send("idLevada está undefined!");
  } else {


    levadaModel.cadastrar(nome, idLevada)
      .then((resultado) => {
        res.status(201).json(resultado);
      }
      ).catch((erro) => {
        console.log(erro);
        console.log(
          "\nHouve um erro ao realizar o cadastro! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

module.exports = {
  buscarLevadasPorUsuarios,
  cadastrar
}