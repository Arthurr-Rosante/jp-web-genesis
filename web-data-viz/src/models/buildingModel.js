var database = require("../database/config")

function getAll() {
    var instrucaoSql = `
        SELECT * FROM building;
    `;
    console.log("[buildingModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getOneById(id) {
    var instrucaoSql = `
        SELECT * FROM building WHERE id = ${id};
    `;
    console.log("[buildingModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getByCategory(category) {
    var instrucaoSql = `
        SELECT * FROM building WHERE category = '${category}';
    `;
    console.log("[buildingModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    getAll,
    getOneById,
    getByCategory
};