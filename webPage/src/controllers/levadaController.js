var levadaModel = require("../models/levadaModel");
var database = require("../database/config");

function safeJsonParse(str) {
  try {
    const cleanStr = str.replace(/^"+|"+$/g, '');
    return JSON.parse(cleanStr);
  } catch (e) {
    return [];
  }
}

function calcularBPM(padrao) {
  if (!Array.isArray(padrao)) return 0;
  if (padrao.length < 2) return 120;

  const primeiro = padrao[0].tempo;
  const ultimo = padrao[padrao.length - 1].tempo;
  const duracaoSegundos = (ultimo - primeiro) / 1000;

  return duracaoSegundos > 0 ? Math.round((padrao.length / duracaoSegundos) * 60) : 120;
}

function determinarInstrumentoPrincipal(padrao) {
  if (!Array.isArray(padrao)) return 'Vários';

  const contagem = {};
  padrao.forEach(nota => {
    const instr = nota.nome.replace(/\d+$/, '');
    contagem[instr] = (contagem[instr] || 0) + 1;
  });

  return Object.keys(contagem).reduce((a, b) =>
    contagem[a] > contagem[b] ? a : b, 'Vários');
}

function calcularProgresso(padrao) {
  if (!Array.isArray(padrao)) return 0;
  return Math.min(100, padrao.length * 5);
}

function buscarLevadasPorUsuario(req, res) {
  const idUsuario = req.params.idUsuario;

  if (!idUsuario || isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID de usuário inválido" });
  }

  levadaModel.buscarLevadasPorUsuario(idUsuario)
    .then((resultado) => {
      const levadasFormatadas = resultado.map(levada => ({
        ...levada,
        padrao: safeJsonParse(levada.padrao),
        bpm: levada.bpm || calcularBPM(safeJsonParse(levada.padrao)),
        instrumento: levada.instrumento || determinarInstrumentoPrincipal(safeJsonParse(levada.padrao)),
        progresso: calcularProgresso(safeJsonParse(levada.padrao))
      }));

      res.status(200).json(levadasFormatadas);
    })
    .catch(erro => {
      console.error("Erro ao buscar levadas:", erro);
      res.status(500).json({
        error: "Erro ao buscar levadas do usuário",
        details: process.env.NODE_ENV === 'development' ? erro.message : undefined
      });
    });
}

function cadastrar(req, res) {
  const { nome, padrao, idAgremiacao, idUsuario } = req.body;

  if (!nome || nome.trim().length < 3) {
    return res.status(400).json({ error: "Nome deve ter pelo menos 3 caracteres" });
  }

  if (!padrao || !Array.isArray(padrao)) {
    return res.status(400).json({ error: "Padrão inválido" });
  }

  if (!idUsuario || isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID de usuário inválido" });
  }

  const bpm = calcularBPM(padrao);
  const instrumento = determinarInstrumentoPrincipal(padrao);

  Promise.all([
    levadaModel.verificarUsuario(idUsuario),
    idAgremiacao ? levadaModel.verificarAgremiacao(idAgremiacao) : Promise.resolve(true)
  ])
    .then(([usuario, agremiacao]) => {
      if (!usuario) throw { status: 404, message: "Usuário não encontrado" };
      if (idAgremiacao && !agremiacao) throw { status: 404, message: "Agremiação não encontrada" };

      return levadaModel.cadastrar(
        nome,
        JSON.stringify(padrao),
        idUsuario,
        idAgremiacao,
        bpm,
        instrumento
      );
    })
    .then(resultado => {
      res.status(201).json({
        idLevada: resultado.insertId,
        message: "Levada cadastrada com sucesso!",
        bpm,
        instrumento
      });
    })
    .catch(erro => {
      console.error("Erro no cadastro:", erro);
      const status = erro.status || 500;
      const message = erro.message || "Erro ao cadastrar levada";
      res.status(status).json({ error: message });
    });
}

function buscarPorAgremiacao(req, res) {
  const idAgremiacao = req.params.idAgremiacao;

  if (!idAgremiacao || isNaN(idAgremiacao)) {
    return res.status(400).json({ error: "ID de agremiação inválido" });
  }

  levadaModel.verificarAgremiacao(idAgremiacao)
    .then(agremiacao => {
      if (!agremiacao) {
        return res.status(404).json({ error: "Agremiação não encontrada" });
      }

      return levadaModel.buscarPorAgremiacao(idAgremiacao);
    })
    .then(resultado => {
      if (!resultado || resultado.length === 0) {
        return res.status(200).json([]);
      }

      const levadasFormatadas = resultado.map(levada => ({
        ...levada,
        padrao: safeJsonParse(levada.padrao),
        bpm: levada.bpm || calcularBPM(safeJsonParse(levada.padrao)),
        instrumento: levada.instrumento || determinarInstrumentoPrincipal(safeJsonParse(levada.padrao)),
        progresso: levada.progresso || calcularProgresso(safeJsonParse(levada.padrao))
      }));

      res.status(200).json(levadasFormatadas);
    })
    .catch(erro => {
      console.error("Erro ao buscar por agremiação:", erro);
      res.status(500).json({
        error: "Erro ao buscar levadas da agremiação",
        details: process.env.NODE_ENV === 'development' ? erro.message : undefined
      });
    });
}

async function buscarKPIs(req, res) {
  try {
    await database.executar("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
    const { idUsuario, idAgremiacao } = req.query;

    // Construção da consulta segura
    let query = `
      SELECT 
        COUNT(*) as totalLevadas,
        SUM(l.publica) as levadasPublicas,
        ROUND(AVG(l.bpm), 0) as bpmMedio,
        (
          SELECT a.nome 
          FROM agremiacao a 
          JOIN levada l2 ON a.idagremiacao = l2.fkagremiacao
          ${idUsuario ? 'WHERE l2.fkuser = ?' : ''}
          ${idAgremiacao ? `${idUsuario ? 'AND' : 'WHERE'} l2.fkagremiacao = ?` : ''}
          GROUP BY a.nome 
          ORDER BY COUNT(*) DESC 
          LIMIT 1
        ) as topAgremiacao,
        (
          SELECT i.instrumento
          FROM levada i
          ${idUsuario ? 'WHERE i.fkuser = ?' : ''}
          ${idAgremiacao ? `${idUsuario ? 'AND' : 'WHERE'} i.fkagremiacao = ?` : ''}
          GROUP BY i.instrumento
          ORDER BY COUNT(*) DESC
          LIMIT 1
        ) as instrumentoMaisUsado,
        COUNT(DISTINCT l.fkuser) as usuariosAtivos
      FROM levada l
      ${idUsuario || idAgremiacao ? 'WHERE' : ''}
      ${idUsuario ? ' l.fkuser = ?' : ''}
      ${idAgremiacao ? `${idUsuario ? ' AND' : ''} l.fkagremiacao = ?` : ''}
    `;

    // Preparar parâmetros na ordem correta
    const params = [];
    if (idUsuario) {
      params.push(idUsuario);
      params.push(idUsuario);
      params.push(idUsuario);
    }
    if (idAgremiacao) {
      params.push(idAgremiacao);
      params.push(idAgremiacao);
      params.push(idAgremiacao);
    }

    const [kpis] = await database.executar(query, params);

    res.status(200).json({
      success: true,
      data: {
        totalLevadas: parseInt(kpis.totalLevadas) || 0,
        levadasPublicas: parseInt(kpis.levadasPublicas) || 0,
        bpmMedio: parseInt(kpis.bpmMedio) || 0,
        topAgremiacao: kpis.topAgremiacao || 'Nenhuma',
        instrumentoMaisUsado: kpis.instrumentoMaisUsado || 'Não definido',
        usuariosAtivos: parseInt(kpis.usuariosAtivos) || 0
      }
    });
    
    await database.executar("SET SESSION sql_mode=(SELECT CONCAT(@@sql_mode,',ONLY_FULL_GROUP_BY'))");
  } catch (error) {
    console.error('Erro ao buscar KPIs:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao calcular KPIs',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

const listarTodas = async (req, res) => {
  try {
    const { idUsuario } = req.query;
    let levadas;

    if (idUsuario) {
      levadas = await levadaModel.buscarPorUsuario(idUsuario);
    } else {
      levadas = await levadaModel.listarTodas();
    }

    const levadasFormatadas = levadas.map(levada => ({
      ...levada,
      padrao: safeJsonParse(levada.padrao),
      progresso: calcularProgresso(safeJsonParse(levada.padrao)),
      bpm: levada.bpm || calcularBPM(safeJsonParse(levada.padrao)),
      instrumento: levada.instrumento || determinarInstrumentoPrincipal(safeJsonParse(levada.padrao))
    }));

    res.status(200).json(levadasFormatadas);
  } catch (error) {
    console.error("Erro ao listar levadas:", error);
    res.status(500).json({ error: "Erro ao listar levadas" });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { idLevada } = req.params;
    const levada = await levadaModel.buscarPorId(idLevada);

    if (!levada) {
      return res.status(404).json({ error: "Levada não encontrada" });
    }

    res.status(200).json({
      ...levada,
      padrao: safeJsonParse(levada.padrao),
      progresso: calcularProgresso(safeJsonParse(levada.padrao)),
      bpm: levada.bpm || calcularBPM(safeJsonParse(levada.padrao)),
      instrumento: levada.instrumento || determinarInstrumentoPrincipal(safeJsonParse(levada.padrao))
    });
  } catch (error) {
    console.error("Erro ao buscar levada:", error);
    res.status(500).json({ error: "Erro ao buscar levada" });
  }
};

const atualizar = async (req, res) => {
  try {
    const { idLevada } = req.params;
    const { nome, padrao, idAgremiacao } = req.body;

    if (!nome || nome.trim().length < 3) {
      return res.status(400).json({ error: "Nome deve ter pelo menos 3 caracteres" });
    }

    if (!padrao || !Array.isArray(padrao)) {
      return res.status(400).json({ error: "Padrão inválido" });
    }

    const bpm = calcularBPM(padrao);
    const instrumento = determinarInstrumentoPrincipal(padrao);

    const sucesso = await levadaModel.atualizar(
      idLevada,
      nome,
      JSON.stringify(padrao),
      idAgremiacao,
      bpm,
      instrumento
    );

    if (!sucesso) {
      return res.status(404).json({ error: "Levada não encontrada" });
    }

    res.status(200).json({
      message: "Levada atualizada com sucesso!",
      bpm,
      instrumento
    });
  } catch (error) {
    console.error("Erro ao atualizar levada:", error);
    res.status(500).json({ error: "Erro ao atualizar levada" });
  }
};

const remover = async (req, res) => {
  try {
    const { idLevada } = req.params;
    const sucesso = await levadaModel.remover(idLevada);

    if (!sucesso) {
      return res.status(404).json({ error: "Levada não encontrada" });
    }

    res.status(200).json({ message: "Levada removida com sucesso" });
  } catch (error) {
    console.error("Erro ao remover levada:", error);
    res.status(500).json({ error: "Erro ao remover levada" });
  }
};

module.exports = {
  buscarLevadasPorUsuario,
  cadastrar,
  buscarPorAgremiacao,
  buscarKPIs,
  listarTodas,
  buscarPorId,
  atualizar,
  remover
};