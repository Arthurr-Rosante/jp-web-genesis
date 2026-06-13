var database = require("../database/config")

const allowedFields = "id, name, email, createdAt, updatedAt";

function login(email, password) {
    var instrucaoSql = `
        SELECT ${allowedFields} FROM user WHERE email = '${email}' AND password = '${password}';
    `;
    console.log("[userModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function register(name, email, password) {
    var instrucaoSql = `
        INSERT INTO user(name, email, password) VALUE ('${name}', '${email}', '${password}');
    `;
    console.log("[userModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getByEmail(email) {
    var instrucaoSql = `SELECT ${allowedFields} FROM user WHERE email = '${email}'`;
    console.log("[userModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    login,
    register,
    getByEmail
};