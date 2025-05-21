var levadaModel = require("../models/levadaModel");

function buscarLevadasPorUsuario(req, res) {
  var idUsuario = req.params.idUsuario;

  if (!idUsuario || isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID de usuário inválido" });
  }

  levadaModel.buscarLevadasPorUsuario(idUsuario)
    .then((resultado) => {
      if (resultado.length > 0) {
        resultado = resultado.map(levada => ({
          ...levada,
          padrao: levada.padrao ? JSON.parse(levada.padrao) : []
        }));
        res.status(200).json(resultado);
      } else {
        res.status(204).json([]);
      }
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json({ error: "Erro ao buscar levadas" });
    });
}

function cadastrar(req, res) {
  var { nome, padrao, idAgremiacao, idUsuario } = req.body;

  if (!nome || nome.length < 3) {
    return res.status(400).json({ error: "Nome deve ter pelo menos 3 caracteres" });
  }

  if (!padrao || !Array.isArray(padrao)) {
    return res.status(400).json({ error: "Padrão inválido" });
  }

  if (!idUsuario || isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID de usuário inválido" });
  }

  levadaModel.verificarUsuario(idUsuario)
    .then(usuario => {
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      if (idAgremiacao) {
        return levadaModel.verificarAgremiacao(idAgremiacao);
      }
      return Promise.resolve();
    })
    .then(() => {
      return levadaModel.cadastrar(nome, padrao, idUsuario, idAgremiacao);
    })
    .then((resultado) => {
      res.status(201).json({
        idLevada: resultado.insertId,
        message: "Levada cadastrada com sucesso!"
      });
    })
    .catch((erro) => {
      console.log(erro);
      res.status(500).json({ error: "Erro ao cadastrar levada" });
    });
}

function buscarPorAgremiacao(req, res) {
  var idAgremiacao = req.params.idAgremiacao;

  if (!idAgremiacao || isNaN(idAgremiacao)) {
    return res.status(400).json({ error: "ID de agremiação inválido" });
  }

  levadaModel.buscarPorAgremiacao(idAgremiacao)
    .then((resultado) => {
      if (resultado.length > 0) {
        resultado = resultado.map(levada => ({
          ...levada,
          padrao: levada.padrao ? JSON.parse(levada.padrao) : []
        }));
        res.status(200).json(resultado);
      } else {
        res.status(204).json([]);
      }
    })
    .catch(erro => {
      console.log(erro);
      res.status(500).json({ error: "Erro ao buscar levadas" });
    });
}

module.exports = {
  buscarLevadasPorUsuario,
  cadastrar,
  buscarPorAgremiacao
};