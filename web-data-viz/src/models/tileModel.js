var database = require("../database/config")

function create(idPark, positionRow, positionCol, idBuilding) {
    var instrucaoSql = `
        INSERT INTO tile(idPark, positionRow, positionCol, idBuilding) VALUE (${idPark}, ${positionRow}, ${positionCol}, ${idBuilding});
    `;
    console.log("[tileModel] Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function getAllByParkId(idPark) {
    var instrucaoSql1 = `
    SELECT * FROM vw_tiles WHERE idPark = ${idPark};
    `;
    console.log("[tileModel] Executando a instrução SQL: \n" + instrucaoSql1);
    
    let tiles = await database.executar(instrucaoSql1);
    
    for (let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        if(!tile.idSpecies) continue;

        const instrucaoSql2 = `
            SELECT * FROM vw_dinosaurs 
            WHERE idPark = ${idPark} 
            AND positionRow = ${tile.positionRow} 
            AND positionCol = ${tile.positionCol}
        `;

        const dinosaur = await database.executar(instrucaoSql2);
        tile["dinosaur"] = dinosaur[0];
    }

    return tiles;
}

async function getOneByParkId(idPark, positionRow, positionCol) {
    var instrucaoSql1 = `
    SELECT * FROM vw_tiles 
    WHERE idPark = ${idPark} 
    AND positionRow = ${positionRow} 
    AND positionCol = ${positionCol}
    `;
    console.log("[tileModel] Executando a instrução SQL: \n" + instrucaoSql1);
    
    let tile = await database.executar(instrucaoSql1);
    if(tile.idSpecies) {
        const instrucaoSql2 = `
            SELECT * FROM vw_dinosaurs 
            WHERE idPark = ${idPark} 
            AND positionRow = ${tile.positionRow} 
            AND positionCol = ${tile.positionCol}
        `;
    
        const dinosaur = await database.executar(instrucaoSql2);
        tile["dinosaur"] = dinosaur[0];
    };

    return tile;
}

async function updateOne(idPark, positionRow, positionCol, fields = {}) {
    let fieldKeys = Object.keys(fields);
    if(fieldKeys.length < 1) return;

    let treatedFields = 
        fieldKeys.map(k => [k, fields[k] === null ? `null` : fields[k]].join("=")).join(", ");

    var instrucaoSql = `
        UPDATE tile SET ${treatedFields} WHERE idPark = ${idPark} AND positionRow = ${positionRow} AND positionCol = ${positionCol};
    `;   
    console.log("[tileModel] Executando a instrução SQL: \n" + instrucaoSql);
    const updateResult = await database.executar(instrucaoSql);

    return getOneByParkId(idPark, positionRow, positionCol);
}

async function updateMany(idPark, tiles) {
    const updatedTiles = [];

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const updated = await updateOne(idPark, tile.positionRow, tile.positionCol, tile.fields)
        .then((result) => result[0]);
        updatedTiles.push(updated);
    }

    return updatedTiles;
}

module.exports = {
    create,
    getAllByParkId,
    getOneByParkId,
    updateOne,
    updateMany
};