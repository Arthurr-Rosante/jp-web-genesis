var express = require("express");
var router = express.Router();

var tileController = require("../controllers/tileController");

router.post("/:idPark/create", function (req, res) {
    tileController.create(req, res);
});

router.get("/:idPark", function (req, res) {
    tileController.getAllByParkId(req, res);
});

router.put("/:idPark", function (req, res) {
    tileController.update(req, res);
});

module.exports = router;