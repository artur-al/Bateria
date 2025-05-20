var usuarioModel = require("../models/usuarioModel");
var levadaModel = require("../models/levadaModel");

function autenticar(req, res) {
    var email = req.body.emailServer;  
    var senha = req.body.senhaServer;  

    console.log("Dados recebidos:", { email, senha });

    if (email == undefined) {
        return res.status(400).json({ erro: "Email é obrigatório" });
    } else if (senha == undefined) {
        return res.status(400).json({ erro: "Senha é obrigatória" });
    }

    usuarioModel.autenticar(email, senha)
        .then(function (resultadoAutenticar) {
            console.log("Resultados encontrados:", resultadoAutenticar);

            if (resultadoAutenticar.length == 1) {
                const usuario = resultadoAutenticar[0];
                res.json({
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    agremiacaoId: usuario.agremiacaoId
                });
            } else if (resultadoAutenticar.length == 0) {
                res.status(401).json({ erro: "Credenciais inválidas" });
            } else {
                res.status(500).json({ erro: "Múltiplos usuários encontrados" });
            }
        })
        .catch(function (erro) {
            console.error("Erro ao autenticar:", erro);
            res.status(500).json({ erro: "Erro interno no servidor" });
        });
}

function cadastrar(req, res) {
    console.log("Dados recebidos", req.body)
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var idAgremiacao = req.body.idAgremiacaoVincularServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (idAgremiacao == undefined) {
        res.status(400).send("Sua empresa a vincular está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, email, senha, idAgremiacao)
            .then(
                function (resultado) {  
                    res.json(resultado);    
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}
module.exports = {
    autenticar,
    cadastrar
}
