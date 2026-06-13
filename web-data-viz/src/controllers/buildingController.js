var buildingModel = require("../models/buildingModel");

function getAll(req, res) {
    buildingModel.getAll()
    .then((result) => res.status(200).send({count: result.length, buildings: result}))
    .catch((error) => {
        console.error("[buildingController] Erro: ", error);
        res.status(500).json({error: error.sqlMessage});
    })
}

function getOneById(req, res) {
    const {id} = req.params;

    buildingModel.getOneById(id)
    .then((result) => res.status(200).send(result[0] || {}))
    .catch((error) => {
        console.error("[buildingController] Erro: ", error);
        res.status(500).json({error: error.sqlMessage});
    })
}

function getByCategory(req, res) {
    const {category} = req.query;
    
    buildingModel.getByCategory(category)
    .then((result) => res.status(200).send({count: result.length, buildings: result}))
    .catch((error) => {
        console.error("[buildingController] Erro: ", error);
        res.status(500).json({error: error.sqlMessage});
    })
}

module.exports = {
    getAll,
    getOneById,
    getByCategory
}