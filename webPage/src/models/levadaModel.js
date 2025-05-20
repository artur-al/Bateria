var database = require("../database/config");

function buscarLevadasPorUsuarios(id) {

  var instrucaoSql = `SELECT * FROM levada a WHERE fkUser = ${id}`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrar(id, nome) {
  
  var instrucaoSql = `INSERT INTO levada (nome, fkUser)  VALUES (${nome}, ${id})`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


module.exports = {
  buscarLevadasPorUsuarios,
  cadastrar
}
