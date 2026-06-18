async function changeTile(oldTile, newTile) {
    let gameData = storage.get("JPWG_DATA");
    if(!gameData || !gameData.park) {
        toast({
            variant: "destructive",
            title: "Erro",
            message: "Dados estão corrompidos. Tente logar-se novamente."
        });
        return;
    }

    const {park} = gameData;

    // Checa insuficiência do saldo
    const newBalance = park.balance - newTile.baseCost;
    if(newBalance < 0) {
        toast({
            variant: "warn",
            title: "Operação Negada",
            message: "Você não possui saldo suficiente!"
        });
        return;
    }


    // Efetivamente atualiza Tile
    await fetch(`/api/tiles/${park.idUser}?positionRow=${oldTile.positionRow}&positionCol=${oldTile.positionCol}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({idBuilding: newTile.id})
    })
    .then((res) => res.json().then((data) => {
        if(!res.ok) throw data.error;

        // Atualiza sessionStorage
        park.balance = newBalance;
        gameData.tiles = gameData.tiles.map((t) => {
            if(t.positionRow === oldTile.positionRow && t.positionCol === oldTile.positionCol) {
                return data.updated;
            }
            return t;
        });

        storage.set("JPWG_DATA", gameData);
        loadGameUI();

        toast({
            variant: "success",
            title: "Construção Feita",
            message: `você construiu ${buildingsDataMap[newTile.name].translatedName}!`
        });
    }))
    .catch((error) => {
        toast({
            variant: "destructive",
            title: "Erro ao atualizar Construção",
            message: error
        });
    });
}