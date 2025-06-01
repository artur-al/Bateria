var express = require("express");
var router = express.Router();
var levadaController = require("../controllers/levadaController");

router.get("/usuario/:idUsuario", levadaController.buscarLevadasPorUsuario);
router.post("/cadastrar", levadaController.cadastrar);
router.get("/agremiacao/:idAgremiacao", levadaController.buscarPorAgremiacao);
router.get("/kpis",levadaController.buscarKPIs);
router.get("/listar", levadaController.listarTodas);

router.get("/:idLevada", levadaController.buscarPorId); 
router.put("/:idLevada", levadaController.atualizar);
router.delete("/:idLevada", levadaController.remover);

router.post("/:idLevada/reproduzir/iniciar", levadaController.iniciarReproducao);
router.post("/:idLevada/reproduzir/pausar", levadaController.pausarReproducao);
router.get("/:idLevada/reproduzir/progresso", levadaController.verificarProgresso);

module.exports = router;