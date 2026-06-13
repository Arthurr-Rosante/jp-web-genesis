var express = require("express");
var router = express.Router();

var parkController = require("../controllers/parkController");

router.post("/create", function (req, res) {
    parkController.create(req, res);
})

router.get("/:idUser", function (req, res) {
    parkController.getOneById(req, res);
});

router.put("/:idUser", function (req, res) {
    parkController.update(req, res);
});

module.exports = router;