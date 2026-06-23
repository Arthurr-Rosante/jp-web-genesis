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
        const rating = IS_RAINING ? Math.max(park.rating - RATING_DECREASED_WHEN_RAINING, 0) : park.rating; 
        const amount = Math.round((BASE_BALANCE_INCREASE + rating) * Math.max(rating, 1));    // Math.max() p/ impedir montante de zerar qnd rating for 0
        const newBalance = park.balance + amount;
        if(newBalance > MAX_BALANCE_AMOUNT) return;

        // Atualizar sessionStorage
        park.balance = newBalance;
        storage.set("JPWG_DATA", gameData);

        // Atualizar UI
        loadParkBalance(newBalance);
        updateBalanceChart(newBalance);

        console.log(`Evento: "increaseBalance" (+${amount} de saldo) às ${new Date().toLocaleTimeString()}`);
    },
    randomEvent: () => {
        // Escolhe evento para ocorrer
        const eventsNameList = Object.keys(eventsDataMap);
        const eventName = eventsNameList[Math.floor(Math.random() * eventsNameList.length)];

        // Impede evento de chuva de acumular
        if(IS_RAINING && eventName === "pouringRain") return;

        // Verifica se evento ocorreu ou falhou
        const successChance = eventsDataMap[eventName].spawnChance;
        const failChance = Math.random();

        if(failChance < successChance) return;

        events[eventName]();
    },
    sabotage: () => {
        let gameData = storage.get("JPWG_DATA");
        if(!gameData || !gameData.tiles || !gameData.park) return;

        const tilesToUpdate = gameData.tiles
        .filter(t => t.category === "enclosure" && t.currentHp > 0)
        .map(t => {
            t.currentHp = Math.max(
                (t.currentHp - (t.maxHp * 0.25)) + t.durability, // remove 25% do HP total do Cercado (durabilidade influencia no valor final)
                1
            );  // Math.max() para impedir que o currentHp fique negativo ou que ele quebre

            return {
                positionRow: t.positionRow,
                positionCol: t.positionCol,
                currentHp: t.currentHp
            };
        });

        fetch(`/api/tiles/${gameData.park.idUser}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({tiles: tilesToUpdate})
        })
        .then(res => res.json().then(data => {
            if(!res.ok) throw data.error;

            // Atualiza sessionStorage
            gameData.tiles = data.tiles;
            storage.set("JPWG_DATA", gameData);

            // Atualiza UI
            loadGrid();
            if(isOverlayOpen("enclosure-panel")) {
                togglePanel("enclosure-panel");
            }

            toast({
                variant: "warn",
                title: eventsDataMap["sabotage"].translatedName,
                message: eventsDataMap["sabotage"].consequences
            });
            console.log(`Evento: "sabotage" às ${new Date().toLocaleTimeString()}`);
        }))
        .catch((error) => {
            toast({
                variant: "destructive",
                title: "Erro ao sabotar Cercados",
                message: error
            });
        });
    },
    pouringRain: () => {
        let gameData = storage.get("JPWG_DATA");

        // Por precaução, previne timers duplicados 
        if(activeTimers.has("pouringRain")) activeTimers.get("pouringRain").destroy();
        
        // Altera parâmetros globais
        IS_RAINING = true;
        BASE_AGGRESSIVENESS_MULTIPLIER = 2;
        BASE_HATCH_PROGRESS_MS = 1 * 0.67 * 1000;
        
        // Cria timer de chuva
        const rainTimer = createTimer("pouringRain", () => {
            let gameData = storage.get("JPWG_DATA");

            // Retorna parâmetros globais para o normal 
            IS_RAINING = false;
            BASE_AGGRESSIVENESS_MULTIPLIER = 1;
            BASE_HATCH_PROGRESS_MS = 1 * 1 * 1000;

            // Atualiza UI
            const rainPanel = document.getElementById("rain-panel");
            if(rainPanel) rainPanel.classList.remove("rain");
            if(gameData) loadParkRating(gameData.park.rating);
        }, BASE_RAIN_DURATION_MS, true);    // em modo timeout
        
        // Atualiza UI
        if(gameData) loadParkRating(Math.max(gameData.park.rating - RATING_DECREASED_WHEN_RAINING, 0));

        let rainPanel = document.getElementById("rain-panel");
        if(!rainPanel) {
            rainPanel = document.createElement("div");
            rainPanel.id = "rain-panel";
            document.body.appendChild(rainPanel);
        };
        rainPanel.classList.add("rain");

        toast({
            variant: "warn",
            title: eventsDataMap["pouringRain"].translatedName,
            message: eventsDataMap["pouringRain"].consequences
        });
        console.log(`Evento: "pouringRain" às ${new Date().toLocaleTimeString()}`);
    },
    dinosaurAttack: (tile) => {
        let gameData = storage.get("JPWG_DATA");

        const dinosaur = tile.dinosaur;

        // Calcula o dano do ataque
        const weightFactor = Number(dinosaur.weightInKilograms) / 1000;    // leva em conta o peso do dinossauro p/ aumentar o dano
        const damage = Math.max(
            Math.floor(((BASE_ATTACK_DAMAGE * dinosaur.aggressiveness) + weightFactor) - tile.durability),  // Math.floor() p/ evitar número quebrado
            1
        );  // Math.max() pois quero que, em casos onde a durabilidade abater todo o dano recebido, o ataque dê ao menos 1pt de dano

        const newHp = Math.max(tile.currentHp - damage, 0);    // Math.max() p/ impedir de HP ficar negativo

        // Verifica Fuga de Dinossauro
        if(FLEES_ENABLED && newHp <= 0) {
            events.dinosaurEscape(tile);
            return;   
        } else if (!FLEES_ENABLED && newHp <= 0) {
            // quando fugas estiverem desabilitadas e o cercado estiver prestes a quebrar
            // impede que dinossauros continuem a atacar o cercado
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
            updateSpeciesChart(gameData.tiles);
            loadGeneralInfo(gameData);

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
    if(isOverlayOpen("enclosure-panel")) {
        if(enclosurePanel.classList.contains(`r${tile.positionRow}_c${tile.positionCol}`)) {
            loadEnclosure(tile);
        }
    }
}