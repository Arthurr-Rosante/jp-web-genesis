var express = require("express");
var router = express.Router();

var userRouter = require("./users");
var parkRouter = require("./parks");
// var tileRouter = require("./tiles");
var buildingRouter = require("./buildings");
// var speciesRouter = require("./species");

router.use("/users", userRouter);
router.use("/parks", parkRouter);
// router.use("/tiles", tileRouter);
router.use("/buildings", buildingRouter);
// router.use("/species", speciesRouter);

module.exports = router;