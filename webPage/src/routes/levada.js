var express = require("express");
var router = express.Router();
var levadaController = require("../controllers/levadaController");

router.get("/usuario/:idUsuario", levadaController.buscarLevadasPorUsuario);
router.post("/cadastrar", levadaController.cadastrar);
router.get("/agremiacao/:idAgremiacao", levadaController.buscarPorAgremiacao);

module.exports = router;