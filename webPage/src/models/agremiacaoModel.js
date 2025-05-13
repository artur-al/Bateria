var database = require("../database/config");

function buscarPoridAgremiacao(idAgremiacao) {
  var instrucaoSql = `SELECT * FROM agremiacao WHERE id = '${idAgremiacao}'`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT idAgremiacao, nome, categoria, FROM agremiacao`;

  return database.executar(instrucaoSql);
}

function buscarPorCategoria(categoria) {
  var instrucaoSql = `SELECT * FROM agremiacao WHERE categoria = '${categoria}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(categoria, idAgremiacao) {
  var instrucaoSql = `INSERT INTO empresa (razao_social, cnpj) VALUES ('${categoria}', '${idAgremiacao}')`;

  return database.executar(instrucaoSql);
}

module.exports = { buscarPorCategoria, buscarPoridAgremiacao, cadastrar, listar };
