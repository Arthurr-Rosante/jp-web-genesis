var express = require("express");
var router = express.Router();

var speciesController = require("../controllers/speciesController");

router.get("/", function (req, res) {
    if(req.query.diet) {
        speciesController.getByDiet(req, res);
    } else {
        speciesController.getAll(req, res);
    }
});

router.get("/:id", function (req, res) {
    speciesController.getOneById(req, res);
});

module.exports = router;