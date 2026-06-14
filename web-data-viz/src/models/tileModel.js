var database = require("../database/config")

function create(idPark, positionRow, positionCol, idBuilding) {
    var instrucaoSql = `
        INSERT INTO tile(idPark, positionRow, positionCol, idBuilding) VALUE (${idPark}, ${positionRow}, ${positionCol}, ${idBuilding});
    `;
    console.log("[tileModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getAllByParkId(idPark) {
    var instrucaoSql = `
        SELECT * FROM vw_tiles WHERE idPark = ${idPark};
    `;
    console.log("[tileModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function update(idPark, positionRow, positionCol, fields = {}) {
    let fieldKeys = Object.keys(fields);
    if(fieldKeys.length < 1) return;

    let treatedFields = 
        fieldKeys.map(k => [k, fields[k] === null ? `null` : fields[k]].join("=")).join(", ");

    var instrucaoSql = `
        UPDATE tile SET ${treatedFields} WHERE idPark = ${idPark} AND positionRow = ${positionRow} AND positionCol = ${positionCol};
    `;
    console.log("[tileModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    create,
    getAllByParkId,
    update
};