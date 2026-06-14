var tileModel = require("../models/tileModel");

function create(req, res) {
    const {idPark} = req.params;
    const {positionRow, positionCol, idBuilding} = req.body;

    if (idPark == undefined) {
        res.status(400).send({message: "Seu idPark está undefined!"});
    } else if (positionRow == undefined) {
        res.status(400).send({message: "Seu positionRow está undefined!"});
    } else if (positionCol == undefined) {
        res.status(400).send({message: "Seu positionCol está undefined!"});
    } else if (idBuilding == undefined) {
        res.status(400).send({message: "Seu idBuilding está undefined!"});
    } else {
        tileModel.create(idPark, positionRow, positionCol, idBuilding)
        .then((result) => res.status(201).send(result))
        .catch((error) => {
            console.error("[tileController] Erro: ", error);
            res.status(500).json({error: error.sqlMessage});
        })
    }
}

function getAllByParkId(req, res) {
    const {idPark} = req.params;
    const {positionRow, positionCol} = req.query;

    if (idPark == undefined) {
        res.status(400).send({message: "Seu idPark está undefined!"});
    } else {
        tileModel.getAllByParkId(idPark)
        .then((result) => {
            let filteredResult = result.filter((tile) => {
                if(positionRow && positionCol) {
                    return tile.positionRow == positionRow && tile.positionCol == positionCol;
                } else if (positionRow) {
                    return tile.positionRow == positionRow;
                } else if (positionCol) {
                    return tile.positionCol == positionCol;
                } else return true;
            });

            return res.status(200).send({count: filteredResult.length, tiles: filteredResult});
        })
        .catch((error) => {
            console.error("[tileController] Erro: ", error);
            res.status(500).json({error: error.sqlMessage});
        })
    }
}

function update(req, res) {
    const fieldsToUpdate = {};
    const {idPark} = req.params;
    const {positionRow, positionCol} = req.query;
    const {idBuilding, idSpecies, currentHp, maxHp, removable} = req.body;

    if (idPark == undefined) {
        res.status(400).send({message: "Seu idPark está undefined!"});
    } else if(positionRow == undefined || positionCol == undefined) {
        res.status(400).send({message: "Sua posição está undefined!"});
    } else if(idBuilding == undefined && idSpecies == undefined && currentHp == undefined && maxHp == undefined && removable == undefined) {
        res.status(400).send({message: "Nenhum campo foi alterado!"});
    } else {
        if(idBuilding) fieldsToUpdate["idBuilding"] = idBuilding;
        if(idSpecies || idSpecies === null) fieldsToUpdate["idSpecies"] = idSpecies;
        if(currentHp) fieldsToUpdate["currentHp"] = currentHp;
        if(maxHp) fieldsToUpdate["maxHp"] = maxHp;
        if(removable) fieldsToUpdate["removable"] = removable;

        tileModel.update(idPark, positionRow, positionCol, fieldsToUpdate)
        .then((result) => res.status(200).send({message: "Tile atualizado com sucesso!"}))
        .catch((error) => {
            console.error("[tileController] Erro: ", error);
            res.status(500).json({error: error.sqlMessage});
        })
    }
}

module.exports = {
    create,
    getAllByParkId,
    update
}