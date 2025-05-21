var database = require("../database/config");

function verificarUsuario(idUsuario) {
  return database.executar(`SELECT id FROM usuario WHERE id = ${idUsuario}`)
    .then(resultado => resultado[0]);
}

function verificarAgremiacao(idAgremiacao) {
  return database.executar(`SELECT idagremiacao FROM agremiacao WHERE idagremiacao = ${idAgremiacao}`)
    .then(resultado => {
      if (resultado.length === 0) {
        throw new Error("Agremiação não encontrada");
      }
    });
}

function buscarLevadasPorUsuario(idUsuario) {
  var instrucaoSql = `
    SELECT 
      l.idlevada, 
      l.nome, 
      l.padrao,
      l.bpm,
      l.instrumento,
      l.datacriacao,
      a.nome as agremiacao
    FROM levada l
    LEFT JOIN agremiacao a ON l.fkagremiacao = a.idagremiacao
    WHERE l.fkuser = ${idUsuario}
    ORDER BY l.datacriacao DESC
  `;
  return database.executar(instrucaoSql);
}

function cadastrar(nome, padrao, idUsuario, idAgremiacao = null, bpm = null, instrumento = null) {
  var instrucaoSql = `
    INSERT INTO levada 
    (nome, padrao, bpm, instrumento, publica, fkuser, fkagremiacao) 
    VALUES 
    ('${nome}', '${JSON.stringify(padrao)}', ${bpm || 'NULL'}, '${instrumento || ''}', 0, ${idUsuario}, ${idAgremiacao || 'NULL'})
  `;
  return database.executar(instrucaoSql);
}

function buscarPorAgremiacao(idAgremiacao) {
  var instrucaoSql = `
    SELECT 
      l.idlevada,
      l.nome,
      l.padrao,
      l.bpm,
      l.instrumento,
      l.datacriacao,
      u.nome as usuario
    FROM levada l
    JOIN usuario u ON l.fkuser = u.id
    WHERE l.fkagremiacao = ${idAgremiacao}
    ORDER BY l.datacriacao DESC
  `;
  return database.executar(instrucaoSql);
}

module.exports = {
  verificarUsuario,
  verificarAgremiacao,
  buscarLevadasPorUsuario,
  cadastrar,
  buscarPorAgremiacao
};