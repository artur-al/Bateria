var database = require("../database/config");

function verificarUsuario(idUsuario) {
  return database.executar(`SELECT id FROM usuario WHERE id = ${idUsuario}`)
    .then(resultado => resultado[0]);
}

function verificarAgremiacao(idAgremiacao) {
  const query = `SELECT idagremiacao FROM agremiacao WHERE idagremiacao = ?`;
  return database.executar(query, [idAgremiacao])
    .then(resultado => resultado[0]);
}

function buscarLevadasPorUsuario(idUsuario) {

  if (isNaN(idUsuario)) {
    return Promise.reject(new Error("ID de usuário inválido"));
  }

  var query = `
    SELECT 
      l.idlevada as id, 
      l.nome, 
      l.padrao,
      l.bpm,
      l.instrumento,
      l.datacriacao,
      l.publica,
      a.nome as agremiacao
    FROM levada l
    LEFT JOIN agremiacao a ON l.fkagremiacao = a.idagremiacao
    WHERE l.fkuser = ${idUsuario}
    ORDER BY l.datacriacao DESC
  `;

  return database.executar(query);
}


function cadastrar(nome, padrao, idUsuario, idAgremiacao = null) {
  let bpm = 120;
  if (Array.isArray(padrao) && padrao.length > 1) {
    const tempoTotal = padrao[padrao.length - 1].tempo - padrao[0].tempo;
    if (tempoTotal > 0) {
      bpm = Math.round((padrao.length / (tempoTotal / 1000)) * 60);
    }
  }

  let instrumento = 'Vários';
  if (Array.isArray(padrao) && padrao.length > 0) {
    const primeiroInstrumento = padrao[0].nome.replace(/\d+$/, '');
    instrumento = primeiroInstrumento || 'Vários';
  }

  var query = `
    INSERT INTO levada 
    (nome, padrao, bpm, instrumento, fkuser, fkagremiacao) 
    VALUES 
    ('${nome}', '${JSON.stringify(padrao)}', ${bpm}, '${instrumento}', ${idUsuario}, ${idAgremiacao || 'NULL'})
  `;
  return database.executar(query);
}

function buscarPorAgremiacao(idAgremiacao) {
  const query = `
        SELECT 
            l.idlevada as id,
            l.nome,
            l.padrao,
            l.bpm,
            l.instrumento,
            l.datacriacao,
            l.publica,
            l.progresso,
            u.nome as responsavel
        FROM levada l
        JOIN usuario u ON l.fkuser = u.id
        WHERE l.fkagremiacao = ?
        ORDER BY l.datacriacao DESC
    `;
  return database.executar(query, [idAgremiacao]);
}

function buscarTodas() {
  var query = `
    SELECT 
      l.idlevada as id,
      l.nome,
      l.padrao,
      l.bpm,
      l.instrumento,
      l.datacriacao,
      l.prazo,
      l.progresso,
      u.nome as responsavel,
      a.nome as agremiacao
    FROM levada l
    LEFT JOIN usuario u ON l.fkuser = u.id
    LEFT JOIN agremiacao a ON l.fkagremiacao = a.idagremiacao
    ORDER BY l.datacriacao DESC
  `;
  return database.executar(query);
}

const listarTodas = async () => {
  const query = `
        SELECT l.*, a.nome as agremiacao_nome 
        FROM levada l
        LEFT JOIN agremiacao a ON l.fkagremiacao = a.idagremiacao
    `;
  return await database.executar(query);
};

const buscarPorId = async (idLevada) => {
  const query = `
        SELECT l.*, a.nome as agremiacao_nome 
        FROM levada l
        LEFT JOIN agremiacao a ON l.fkagremiacao = a.idagremiacao
        WHERE l.idlevada = ?
    `;
  const [result] = await database.executar(query, [idLevada]);
  return result;
};

const remover = async (idLevada) => {
  const query = `DELETE FROM levada WHERE idlevada = ?`;
  const [result] = await database.executar(query, [idLevada]);
  return result.affectedRows > 0;
};

module.exports = {
  verificarUsuario,
  verificarAgremiacao,
  buscarLevadasPorUsuario,
  cadastrar,
  buscarPorAgremiacao,
  buscarTodas,
  buscarPorId,
  listarTodas,
  remover
};