var database = require("../database/config");

function buscarPoridAgremiacao(idAgremiacao) {
  var instrucaoSql = `SELECT * FROM agremiacao WHERE idAgremiacao = '${idAgremiacao}'`;
  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT idAgremiacao, nome, categoria FROM agremiacao`;
  console.log("Executando query:", instrucaoSql); // Adicione este log
  return database.executar(instrucaoSql);
}
function buscarPorCategoria(categoria) {
  var instrucaoSql = `SELECT * FROM agremiacao WHERE categoria = '${categoria}'`;
  return database.executar(instrucaoSql);
}

function cadastrar(nome, categoria) {
  var instrucaoSql = `INSERT INTO agremiacao (nome, categoria) VALUES ('${nome}', '${categoria}')`;
  return database.executar(instrucaoSql);
}

module.exports = { buscarPorCategoria, buscarPoridAgremiacao, cadastrar, listar };
