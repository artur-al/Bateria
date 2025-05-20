var express = require("express");
var router = express.Router();

var levadaController = require("../controllers/levadaController");

router.get("/:id", function (req, res) {
  levadaController.buscarLevadasPorUsuarios(req, res);
});

router.post("/cadastrar", function (req, res) {
  levadaController.cadastrar(req, res);
})

module.exports = router;