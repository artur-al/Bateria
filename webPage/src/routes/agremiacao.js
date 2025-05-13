var express = require("express");
var router = express.Router();

var agremiacaoController = require("../controllers/agremiacaoController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    agremiacaoController.cadastrar(req, res);
})

router.get("/categoria/:categoria", function (req,res){
    agremiacaoController.buscarPorCategoria(req,res);
})

// router.get("/buscar", function (req, res) {
//     agremiacaoController.buscarPorCategoria(req, res);
// });

router.get("/:idAgremiacao", function (req, res) {
  agremiacaoController.buscarPoridAgremiacao(req, res);
});

router.get("/", function (req, res) {
  agremiacaoController.listar(req, res);
});

module.exports = router;