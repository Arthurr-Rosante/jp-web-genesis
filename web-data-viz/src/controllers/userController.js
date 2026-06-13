var userModel = require("../models/userModel");

function login(req, res) {
    const {email, password} = req.body;

    if (email == undefined) {
        res.status(400).send({message: "Seu email está undefined!"});
    } else if (password == undefined) {
        res.status(400).send({message: "Sua senha está indefinida!"});
    } else {
        userModel.login(email, password)
        .then((result) => {
            if(!result[0]) {
                res.status(404).json({message: "Credenciais inválidas ou login inexistente!"});
            } else {
                res.status(200).json(result[0]);
            }
        })
        .catch((error) => {
            console.error("[userController] Erro: ", error);
            res.status(500).json(error.sqlMessage);
        })
    }

}

function register(req, res) {
    const { username, email, password } = req.body;

    if (username == undefined) {
        res.status(400).send({message: "Seu nome está undefined!"});
    } else if (email == undefined) {
        res.status(400).send({message: "Seu email está undefined!"});
    } else if (password == undefined) {
        res.status(400).send({message: "Sua senha está undefined!"});
    } else {
        userModel.getByEmail(email)
        .then((result) => {
            if(result.length > 0) {
                res.status(409).json({message: "Este endereço de email já está em uso!"});
                return;
            }

            userModel.register(username, email, password)
            .then(registerResult => res.status(201).json(registerResult))
            .catch((error) => {
                console.error("[userController] Erro: ", error);
                res.status(500).json(error.sqlMessage);
            })
        })
        .catch((error) => {
            console.error("[userController] Erro: ", error);
            res.status(500).json(error.sqlMessage);
        })
    }
}

module.exports = {
    login,
    register
}