var userModel = require("../models/userModel");
var parkModel = require("../models/parkModel");
var tileModel = require("../models/tileModel");
var buildingModel = require("../models/buildingModel");

function login(req, res) {
    const {email, password} = req.body;

    if (email == undefined) {
        res.status(400).send({message: "Seu email está undefined!"});
    } else if (password == undefined) {
        res.status(400).send({message: "Sua senha está indefinida!"});
    } else {
        userModel.login(email, password)
        .then((userResult) => {
            if(!userResult[0]) {
                res.status(404).json({message: "Credenciais inválidas ou login inexistente!"});
            } else {
                parkModel.getOneById(userResult[0].id)
                .then((parkResult) => {
                    if(!parkResult[0]) {
                        res.status(404).json({message: "Dados de Parque foram corrompidos!"});
                    } else {
                        tileModel.getAllByParkId(parkResult[0].idUser)
                        .then((tileResult) => {
                            return res.status(200).json({
                                user: userResult[0],
                                park: parkResult[0],
                                tiles: tileResult
                            });
                        })
                        .catch((error) => {
                            console.error("[userController] Erro: ", error);
                            res.status(500).json(error.sqlMessage);
                        });
                    }
                })
                .catch((error) => {
                    console.error("[userController] Erro: ", error);
                    res.status(500).json(error.sqlMessage);
                });
            }
        })
        .catch((error) => {
            console.error("[userController] Erro: ", error);
            res.status(500).json(error.sqlMessage);
        });
    }

}

// Register com Stored Procedure
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

            // Registra usuário
            userModel.register(username, email, password)
            .then((result) => res.status(200).json({message: "Usuário registrado com sucesso!"}))
            .catch((error) => {
                console.error("[userController] Erro: ", error);
                res.status(500).json(error.sqlMessage);
            });
        })
        .catch((error) => {
            console.error("[userController] Erro: ", error);
            res.status(500).json(error.sqlMessage);
        });
    }
}

// Register Padrão
/*
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

            // Registra usuário
            userModel.register(username, email, password)
            .then(registerResult => {
                // Registra Parque atrelado ao usuário
                const idUser = registerResult.insertId;
                parkModel.create(idUser, `Parque de ${username}`, 1, 1000)
                .then((parkResult) => {
                    // Popula GRID do Parque criado
                    buildingModel.getByCategory("terrain")
                    .then((buildingResult) => {
                        for (let colId = 0; colId < 5; colId++) {
                            for (let rowId = 0; rowId < 4; rowId++) {
                                // Tiles aleatorizados do tipo "terrain"
                                let idBuilding = Math.round(Math.random() * (buildingResult.length - 1) + 1);

                                // Tiles predefinidos
                                if(rowId === 0 && colId === 4) idBuilding = 12; // portão de entrada
                                if(rowId === 1 && colId === 0) idBuilding = 13; // centro de visitantes
                                if(rowId === 2 && colId === 0) idBuilding = 14; // laboratório de incubação
                                if(rowId === 2 && colId === 3) idBuilding = 9;  // cercado nível 1
                                
                                // Atualiza cercado nível 1 com primeiro dinossauro
                                tileModel.create(idUser, rowId, colId, idBuilding)
                                .then((tilResult) => {
                                    if(rowId === 2 && colId === 3) {
                                        tileModel.updateOne(idUser, 2, 3, {
                                            idSpecies: 6,                       // id da espécie parassaurolofo
                                            removable: 0
                                        });
                                    };
                                })
                                .catch((error) => {
                                    console.error("[userController] Erro: ", error);
                                    res.status(500).json(error.sqlMessage);
                                });
                            }
                        }
                    })
                    .then(() => res.status(201).json({message: "Usuário registrado com sucesso!"}))
                    .catch((error) => {
                        console.error("[userController] Erro: ", error);
                        res.status(500).json(error.sqlMessage);
                    });
                })
                .catch((error) => {
                    console.error("[userController] Erro: ", error);
                    res.status(500).json(error.sqlMessage);
                });
            })
            .catch((error) => {
                console.error("[userController] Erro: ", error);
                res.status(500).json(error.sqlMessage);
            });
        })
        .catch((error) => {
            console.error("[userController] Erro: ", error);
            res.status(500).json(error.sqlMessage);
        });
    }
}
*/
module.exports = {
    login,
    register
}