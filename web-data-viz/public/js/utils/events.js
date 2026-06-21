const events = {
    save: async function ({silent = false} = {}) {
        const gameData = storage.get("JPWG_DATA");
        if(!gameData) {
            toast({
                variant: "destructive",
                title: "Erro ao salvar",
                message: "Dados estão corrompidos. Tente logar-se novamente."
            });
            return;
        }

        let updatedGameData = gameData;

        // Atualizar Dados do Parque
        await fetch(`/api/parks/${gameData.park.idUser}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameData.park)
        })
        .then((parkResponse) => parkResponse.json().then((parkResponseData) => {
            if(!parkResponse.ok) {
                throw parkResponseData.error;
            }

            updatedGameData.park = parkResponseData.updated;
        }))
        .catch((error) => {
            toast({
                variant: "warn",
                title: "Erro ao salvar Parque",
                message: error
            });
        });
        
        // Atualizar Dados dos Tiles
        await fetch(`/api/tiles/${gameData.park.idUser}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({tiles: gameData.tiles})
        })
        .then((tilesResponse) => tilesResponse.json().then((tilesResponseData) => {
            if(!tilesResponse.ok) {
                throw tilesResponseData.error;
            }

            updatedGameData.tiles = tilesResponseData.tiles;
        }))
        .catch((error) => {
            toast({
                variant: "warn",
                title: "Erro ao salvar Mapa",
                message: error
            });
        });

        // Atualizar sessionStorage com dados mais recentes
        storage.set("JPWG_DATA", updatedGameData);
        if(!silent) {
            toast({
                variant: "success",
                title: "Jogo salvo!"
            });
        }

        // Atualizar UI do Jogo
        loadGameUI();

        console.log(`Evento: "save" às ${new Date().toLocaleTimeString()}`);
    },
    increaseBalance: () => {
        let gameData = storage.get("JPWG_DATA");
        if(!gameData || !gameData.park) return;

        const {park} = gameData;
        const amount = Math.floor(BASE_BALANCE_INCREASE * park.rating);
        const newBalance = park.balance + amount;
        if(newBalance > MAX_BALANCE_AMOUNT) return;

        // Atualizar sessionStorage
        park.balance = newBalance;
        storage.set("JPWG_DATA", gameData);

        // Atualizar UI
        loadParkBalance(newBalance);

        console.log(`Evento: "increaseBalance" (+${amount} de saldo) às ${new Date().toLocaleTimeString()}`);
    },
    randomEvent: () => {
        toast({
            variant: "warn",
            title: "EVENTO",
            message: "ocorreu um evento!",
        });

        console.log(`Evento: "randomEvent" às ${new Date().toLocaleTimeString()}`);
    },
};