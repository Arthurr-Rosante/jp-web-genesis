var express = require("express");
var router = express.Router();

var buildingController = require("../controllers/buildingController");

router.get("/", function (req, res) {
    if(req.query.category) {
        buildingController.getByCategory(req, res);
    } else {
        buildingController.getAll(req, res);
    }
});

router.get("/:id", function (req, res) {
    buildingController.getOneById(req, res);
});

module.exports = router;