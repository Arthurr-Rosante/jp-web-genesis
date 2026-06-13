var parkModel = require("../models/parkModel");

function create(req, res) {
    const {idUser, name, rating, balance} = req.body;

    if (idUser == undefined) {
        res.status(400).send({message: "Seu idUser está undefined!"});
    } else if (name == undefined) {
        res.status(400).send({message: "Seu name está undefined!"});
    } else {
        if (rating == undefined) rating = 0;
        if (balance == undefined) balance = 0;

        parkModel.create(idUser, name, rating, balance)
        .then((result) => res.status(201).send(result[0]))
        .catch((error) => {
            console.error("[parkController] Erro: ", error);
            res.status(500).json({error: error.sqlMessage});
        })
    }
}

function getOneById(req, res) {
    const {idUser} = req.params;

    if (idUser == undefined) {
        res.status(400).send({message: "Seu idUser está undefined!"});
    } else {
        parkModel.getOneById(idUser)
        .then((result) => res.status(200).send(result[0] || {}))
        .catch((error) => {
            console.error("[parkController] Erro: ", error);
            res.status(500).json({error: error.sqlMessage});
        })
    }
}

function update(req, res) {
    const fieldsToUpdate = {};
    const {idUser} = req.params;
    const {name, rating, balance} = req.body;

    if (idUser == undefined) {
        res.status(400).send({message: "Seu idUser está undefined!"});
    } else if(name == undefined && rating == undefined && balance == undefined) {
        res.status(200).send({message: "Nenhum campo foi alterado!"});
    }
    else {
        if(name != undefined && name != "") fieldsToUpdate["name"] = name;

        if(rating != undefined) {
            let treatedRating = rating;
            if(rating > 5) treatedRating = 5;
            if(rating < 0) treatedRating = 0;
            if(rating % 0.5 !== 0) {
                treatedRating = Math.round(rating);
            }

            fieldsToUpdate["rating"] = treatedRating;
        };

        if(balance != undefined) {
            let treatedBalance = balance;

            if(balance > 999999) treatedBalance = 999999;
            if(balance < 0) treatedBalance = 0;

            fieldsToUpdate["balance"] = treatedBalance;
        };

        parkModel.update(idUser, fieldsToUpdate)
        .then((result) => res.status(200).send({message: "Parque atualizado com sucesso!"}))
        .catch((error) => {
            console.error("[parkController] Erro: ", error);
            res.status(500).json({error: error.sqlMessage});
        })
    }
}

module.exports = {
    create,
    getOneById,
    update
}