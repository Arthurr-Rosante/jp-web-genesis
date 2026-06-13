var database = require("../database/config")

function getAll() {
    var instrucaoSql = `
        SELECT * FROM species;
    `;
    console.log("[speciesModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getOneById(id) {
    var instrucaoSql = `
        SELECT * FROM species WHERE id = ${id};
    `;
    console.log("[speciesModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getByDiet(diet) {
    var instrucaoSql = `
        SELECT * FROM species WHERE diet = '${diet}';
    `;
    console.log("[speciesModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    getAll,
    getOneById,
    getByDiet
};