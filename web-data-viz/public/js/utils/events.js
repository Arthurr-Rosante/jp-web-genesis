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
    dinosaurAttack: (tile) => {
        let gameData = storage.get("JPWG_DATA");

        const dinosaur = tile.dinosaur;

        // Calcula o dano do ataque
        const weight_factor = Number(dinosaur.weightInKilograms) / 1000;    // leva em conta o peso do dinossauro p/ aumentar o dano
        const damage = Math.max(
            Math.floor(((BASE_ATTACK_DAMAGE * dinosaur.aggressiveness) + weight_factor) - tile.durability),  // Math.floor() p/ evitar número quebrado
            1
        );  // Math.max() pois quero que, em casos onde a durabilidade abater todo o dano recebido, o ataque dê ao menos 1pt de dano

        const newHp = Math.max(tile.currentHp - damage, 0);    // Math.max() p/ impedir de HP ficar negativo

        // Verifica Fuga de Dinossauro
        if(FLEES_ENABLED && newHp <= 0) {
            events.dinosaurEscape(tile);
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
                        currentHp: newHp
                    }
                ]
            })
        })
        .then(res => res.json().then(data => {
            if(!res.ok) {
                throw data.error;
            }

            // Atualiza sessionStorage
            gameData.tiles = data.tiles;
            storage.set("JPWG_DATA", gameData);

            // Atualiza UI
            loadGrid();
            loadRightEnclosure(data.updated[0]);

            toast({
                title: "Ataque à Cercado",
                message: `${dinosaur.name} está atacando ${printBuildingNameWithPosition(tile)}!`
            })
            console.log(`Evento: "dinosaurAttack" em ${printBuildingNameWithPosition(tile)} às ${new Date().toLocaleTimeString()}`);
        }))
        .catch((error) => {
            toast({
                variant: "destructive",
                title: "Erro no ataque à Cercado",
                message: error
            })
        })
    },
    dinosaurEscape: (tile) => {
        let gameData = storage.get("JPWG_DATA");

        const dinosaur = tile.dinosaur;

        fetch(`/api/tiles/${tile.idPark}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                tiles: [
                    {
                        positionRow: tile.positionRow,
                        positionCol: tile.positionCol,
                        idSpecies: null,
                        currentHp: 0,
                        removable: 1
                    }
                ]
            })
        })
        .then(res => res.json().then(data => {
            if(!res.ok) {
                throw data.error;
            }

            // Atualiza sessionStorage
            const updatedTiles = data.tiles;

            gameData.tiles = updatedTiles;
            gameData.park.rating = gameData.park.rating - tile.dinosaur.ratingWeight;
            storage.set("JPWG_DATA", gameData);

            // Atualiza UI
            loadGameUI();
            loadRightEnclosure(data.updated[0]);

            toast({
                variant: "warn",
                title: "Fuga de Dinossauro",
                message: `${dinosaur.name} fugiu de ${printBuildingNameWithPosition(tile)}!`
            })
            console.log(`Evento: "dinosaurEscape" em ${printBuildingNameWithPosition(tile)} às ${new Date().toLocaleTimeString()}`);
        }))
        .catch((error) => {
            toast({
                variant: "destructive",
                title: "Erro na fuga de espécime",
                message: error
            })
        })
    },
};

function loadRightEnclosure(tile) {
    const enclosurePanel = document.getElementById("enclosure-panel");
    if(enclosurePanel.closest(".overlay").classList.contains("open")) {
        if(enclosurePanel.classList.contains(`r${tile.positionRow}_c${tile.positionCol}`)) {
            loadEnclosure(tile);
        }
    }
}