var express = require("express");
var router = express.Router();
var levadaController = require("../controllers/levadaController");

router.get("/usuario/:idUsuario", levadaController.buscarLevadasPorUsuario);
router.post("/cadastrar", levadaController.cadastrar);
router.get("/agremiacao/:idAgremiacao", levadaController.buscarPorAgremiacao);
router.get("/kpis",levadaController.buscarKPIs);

router.get("/listar", levadaController.listarTodas);
router.get("/detalhes/:idLevada", levadaController.buscarPorId); 
router.put("/atualizar/:idLevada", levadaController.atualizar); 
router.delete("/remover/:idLevada", levadaController.remover); 

router.get("/teste", (req, res) => {
  res.json({ message: "Rota de levadas funcionando!" });
});

module.exports = router;