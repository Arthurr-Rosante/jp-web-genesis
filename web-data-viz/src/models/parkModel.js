var database = require("../database/config")

function create(idUser, name, rating, balance) {
    var instrucaoSql = `
        INSERT INTO park(idUser, name, rating, balance) VALUE (${idUser}, '${name}', ${rating}, ${balance});
    `;
    console.log("[parkModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getOneById(idUser) {
    var instrucaoSql = `
        SELECT * FROM park WHERE idUser = ${idUser};
    `;
    console.log("[parkModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function update(idUser, fields = {}) {
    let fieldKeys = Object.keys(fields);
    if(fieldKeys.length < 1) return;

    let treatedFields = 
        fieldKeys.map(k => [k, typeof fields[k] == 'string' ? `"${fields[k]}"` : fields[k]].join("=")).join(", ");

    var instrucaoSql = `
        UPDATE park SET ${treatedFields} WHERE idUser = ${idUser};
    `;
    console.log("[parkModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    create,
    getOneById,
    update
};