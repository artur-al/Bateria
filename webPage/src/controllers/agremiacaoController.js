var agremiacaoModel = require("../models/agremiacaoModel");

function buscarPoridAgremiacao(req, res) {
  var idAgremiacao = req.params.idAgremiacao;

  agremiacaoModel.buscarPoridAgremiacao(idAgremiacao).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listar(req, res) {
  console.log('Iniciando listagem de agremiações...'); // Log adicional
  
  agremiacaoModel.listar()
    .then((resultado) => {
      console.log('Dados do banco:', resultado); // Verifique os dados reais
      
      // Garante que está enviando como array mesmo se for undefined/null
      const dados = Array.isArray(resultado) ? resultado : [];
      console.log('Dados enviados para o frontend:', dados);
      
      res.status(200).json(dados);
    })
    .catch((erro) => {
      console.error('Erro ao listar:', erro);
      res.status(200).json([]); // Mantém consistência na resposta
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

  if (!nome || !categoria) {
    return res.status(400).json({ mensagem: "Nome e categoria são obrigatórios" })
  }

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
