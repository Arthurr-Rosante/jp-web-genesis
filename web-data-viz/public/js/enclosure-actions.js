function goToHatchery() {
    const gameData = storage.get("JPWG_DATA");
    if(!gameData || !gameData.tiles) {
        toast({ 
            variant: "destructive", 
            title: "Erro", 
            message: "Dados estão corrompidos. Tente logar-se novamente."
        });
        return
    }

    const hasHatchery = gameData.tiles.some((t) => t.name === "hatchery");
    if(hasHatchery) {
        togglePanel("enclosure-panel");
        togglePanel("hatchery-panel", {onToggle: loadHatchery});
    } else {
        toast({ 
            title: "Operação Negada", 
            message: "Seu parque não possui nenhum laboratório de incubação."
        });
    }

}

function repairEnclosure(tile) {
    if(tile.currentHp >= tile.maxHp) {
        toast({
            title: "Operação Negada",
            message: `${buildingsDataMap[tile.name].translatedName} já está um brinco!`
        });
        return;
    }

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
    const newBalance = park.balance - (tile.baseCost * BASE_REPAIR_FEE); 
    if(newBalance < 0) {
        toast({
            title: "Operação Negada",
            message: "Você não possui saldo suficiente!"
        });
        return;
    }
    
    // Calcula novo HP do cercado (mantém na faixa 0-100)
    const newHp = Math.max(0, Math.min(100, tile.currentHp + BASE_REPAIR_HP));
    
    fetch(`/api/tiles/${tile.idPark}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            tiles: [
                {
                    positionRow: tile.positionRow,
                    positionCol: tile.positionCol,
                    currentHp: newHp
                }
            ]
        })
    })
    .then(res => res.json().then(data => {
        if(!res.ok) {
            throw data.error;
        }

        // atualiza sessionStorage
        const updatedTiles = data.tiles;

        gameData.park.balance = newBalance;
        gameData.tiles = updatedTiles;
        storage.set("JPWG_DATA", gameData);

        // Atualiza UI
        loadGameUI();
        loadEnclosure(data.updated[0]);

        console.log(`Evento: ${tile.name} reparado às ${new Date().toLocaleTimeString()}`);
    }))
    .catch((error) => {
        toast({
            variant: "destructive",
            title: "Erro ao reparar cercado",
            message: error
        })
    })
}

function upgradeEnclosure(tile) {
    // Checa se Tile possui upgrades
    if(!tile.idUpgrade) {
        toast({
            title: "Operação Negada",
            message: `${buildingsDataMap[tile.name].translatedName} não possui mais melhorias!`
        });
        return;
    }

    // Checa se Tile foi devidamente consertado
    if(tile.currentHp < tile.maxHp) {
        toast({
            title: "Operação Negada",
            message: `${buildingsDataMap[tile.name].translatedName} precisa estar 100% consertado!`
        });
        return;
    }

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
    const newBalance = park.balance - tile.upgradeCost; 
    if(newBalance < 0) {
        toast({
            title: "Operação Negada",
            message: "Você não possui saldo suficiente!"
        });
        return;
    }
    
    fetch(`/api/tiles/${tile.idPark}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            tiles: [
                {
                    positionRow: tile.positionRow,
                    positionCol: tile.positionCol,
                    idBuilding: tile.idUpgrade
                }
            ]
        })
    })
    .then(res => res.json().then(data => {
        if(!res.ok) {
            throw data.error;
        }

        // atualiza sessionStorage
        const updatedTiles = data.tiles;

        gameData.park.balance = newBalance;
        gameData.tiles = updatedTiles;
        storage.set("JPWG_DATA", gameData);

        // Atualiza UI
        loadGameUI();
        loadEnclosure(data.updated[0]);

        toast({
            variant: "success",
            title: "Construção Melhorada",
            message: `${buildingsDataMap[tile.name].translatedName} foi melhorado para ${buildingsDataMap[data.updated[0].name].translatedName}!`
        });
        console.log(`Evento: ${tile.name} melhorado para ${data.updated[0].name} às ${new Date().toLocaleTimeString()}`);
    }))
    .catch((error) => {
        toast({
            variant: "destructive",
            title: "Erro ao melhorar cercado",
            message: error
        })
    })
}

function releaseDinosaur(tile) {
    // Checa se Tile possui algum espécime
    if(!tile.idSpecies || !tile.dinosaur) return

    // Checa se Tile foi devidamente consertado
    if(tile.currentHp < tile.maxHp) {
        toast({
            title: "Operação Negada",
            message: `${buildingsDataMap[tile.name].translatedName} precisa estar 100% consertado!`
        });
        return;
    }

    let gameData = storage.get("JPWG_DATA");
    if(!gameData || !gameData.park) {
        toast({
            variant: "destructive",
            title: "Erro",
            message: "Dados estão corrompidos. Tente logar-se novamente."
        });
        return;
    }

    fetch(`/api/tiles/${tile.idPark}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            tiles: [
                {
                    positionRow: tile.positionRow,
                    positionCol: tile.positionCol,
                    idSpecies: null,
                    removable: 1
                }
            ]
        })
    })
    .then(res => res.json().then(data => {
        if(!res.ok) {
            throw data.error;
        }

        // atualiza sessionStorage
        const updatedTiles = data.tiles;

        gameData.tiles = updatedTiles;
        gameData.park.rating = gameData.park.rating - tile.dinosaur.ratingWeight;
        storage.set("JPWG_DATA", gameData);

        // Atualiza UI
        loadGameUI();
        loadEnclosure(data.updated[0]);

        toast({
            variant: "success",
            title: "Espécime Removido",
            message: `${tile.dinosaur.name} foi solto com sucesso!`
        });
        console.log(`Evento: ${tile.dinosaur.name} solto de ${tile.name} às ${new Date().toLocaleTimeString()}`);
    }))
    .catch((error) => {
        toast({
            variant: "destructive",
            title: "Erro ao soltar espécime",
            message: error
        })
    })
}