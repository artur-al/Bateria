var mysql = require("mysql2");

// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function executar(instrucao, parametros = []) {
    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();
        
        conexao.query(instrucao, parametros, function (erro, resultados) {
            conexao.end();
            if (erro) {
                console.error("Erro na execução SQL:", erro);
                reject(erro);
                return;
            }
            resolve(resultados);
        });
        
        conexao.on('error', function (erro) {
            console.error("ERRO NO MySQL SERVER:", erro.sqlMessage);
            reject(erro);
        });
    });
}

module.exports = {
    executar
};