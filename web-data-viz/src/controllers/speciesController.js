var speciesModel = require("../models/speciesModel");

function getAll(req, res) {
    speciesModel.getAll()
    .then((result) => res.status(200).send(result))
    .catch((error) => {
        console.error("[speciesController] Erro: ", error);
        res.status(500).json({error: error.sqlMessage});
    })
}

function getOneById(req, res) {
    const {id} = req.params;

    speciesModel.getOneById(id)
    .then((result) => res.status(200).send(result[0] || {}))
    .catch((error) => {
        console.error("[speciesController] Erro: ", error);
        res.status(500).json({error: error.sqlMessage});
    })
}

function getByDiet(req, res) {
    const {diet} = req.query;
    
    speciesModel.getByDiet(diet)
    .then((result) => res.status(200).send(result))
    .catch((error) => {
        console.error("[speciesController] Erro: ", error);
        res.status(500).json({error: error.sqlMessage});
    })
}

module.exports = {
    getAll,
    getOneById,
    getByDiet
}