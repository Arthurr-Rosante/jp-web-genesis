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

function updateOne(req, res) {
    const fieldsToUpdate = {};
    const {idPark} = req.params;
    const {positionRow, positionCol} = req.query;
    const {idBuilding, idSpecies, currentHp, maxHp, removable} = req.body;

    if (idPark == undefined) {
        res.status(400).send({message: "Seu idPark está undefined!"});
    } else if(positionRow == undefined || positionCol == undefined) {
        res.status(400).send({message: "Sua posição está undefined!"});
    } else if(idBuilding == undefined && idSpecies == undefined && currentHp == undefined && maxHp == undefined && removable == undefined) {
        res.status(400).send({error: "Nenhum campo foi alterado!"});
    } else {
        if(idBuilding !== null) fieldsToUpdate["idBuilding"] = idBuilding;
        if(idSpecies || idSpecies === null) fieldsToUpdate["idSpecies"] = idSpecies;
        if(currentHp !== null) fieldsToUpdate["currentHp"] = currentHp;
        if(maxHp !== null) fieldsToUpdate["maxHp"] = maxHp;
        if(removable !== null) fieldsToUpdate["removable"] = removable;

        tileModel.updateOne(idPark, positionRow, positionCol, fieldsToUpdate)
        .then((result) => res.status(200).send({message: "Tile atualizado com sucesso!", updated: result[0]}))
        .catch((error) => {
            console.error("[tileController] Erro: ", error);
            res.status(500).json({error: error.sqlMessage});
        })
    }
}

function updateMany(req, res) {
    const {idPark} = req.params;
    const {tiles} = req.body;
    
    if (idPark == undefined) {
        res.status(400).send({message: "Seu idPark está undefined!"});
    } else if(tiles.length <= 0) {
        res.status(200).send({message: "Nenhum Tile foi enviado para atualização!"});
    } else {
        let tilesToUpdate = [];

        for (let i = 0; i < tiles.length; i++) {
            let fieldsToUpdate = {};
            const tile = tiles[i];
            if(tile.positionRow == undefined || tile.positionCol == undefined) continue;
            
            if(tile.idBuilding !== null) fieldsToUpdate["idBuilding"] = tile.idBuilding;
            if(tile.idSpecies || tile.idSpecies === null) fieldsToUpdate["idSpecies"] = tile.idSpecies;
            if(tile.currentHp !== null) fieldsToUpdate["currentHp"] = tile.currentHp;
            if(tile.maxHp !== null) fieldsToUpdate["maxHp"] = tile.maxHp;
            if(tile.removable !== null) fieldsToUpdate["removable"] = tile.removable;

            tilesToUpdate.push({
                positionRow: tile.positionRow,
                positionCol: tile.positionCol,
                fields: fieldsToUpdate
            });
        }

        tileModel.updateMany(idPark, tilesToUpdate)
        .then((updateResult) => {
            tileModel.getAllByParkId(idPark)
            .then((tilesResult) => res.status(200).send({
                message: "Tiles atualizados com sucesso!",
                count: updateResult.length,
                updated: updateResult,
                tiles: tilesResult
            }))
            .catch((error) => {
                console.error("[tileController] Erro: ", error);
                res.status(500).json({error: error.sqlMessage});
            });
        })
        .catch((error) => {
            console.error("[tileController] Erro: ", error);
            res.status(500).json({error: error.sqlMessage});
        });
    }
}

module.exports = {
    create,
    getAllByParkId,
    updateOne,
    updateMany
}