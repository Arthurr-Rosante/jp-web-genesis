function incubateSpecies(species) {
    let gameData = storage.get("JPWG_DATA");
    if (!gameData || !gameData.park) {
        toast({ 
            variant: "destructive", 
            title: "Erro", 
            message: "Dados estão corrompidos. Tente logar-se novamente."
        });
        return;
    }

    const {park} = gameData;

    // Procura primeiro slot vazio
    const emptySlot = document.querySelector(".slot--empty");
    if(!emptySlot) {
        toast({ 
            title: "Operação Negada", 
            message: `Incubadora cheia! Não há espaços para incubar ${species.name}!` 
        });
        return;
    }

    // Checa insuficiência do saldo
    const newBalance = park.balance - species.hatchCost;
    if (newBalance < 0) {
        toast({
            title: "Operação Negada",
            message: "Você não possui saldo suficiente!"
        });
        return;
    }
    
    // Atualiza sessionStorage
    park.balance = newBalance;
    storage.set("JPWG_DATA", gameData);

    // Cria timer de incubação
    const timeToHatch = (SPECIES_HATCH_INTERVAL_MS * (species.ratingWeight))
    let timeLeft = timeToHatch;

    const hatchTimer = createTimer(`hatchery-${emptySlot.id}`, () => {
        let progress =  Math.round(((timeToHatch - timeLeft) / timeToHatch) * 100);

        let spanHatchProgress = emptySlot.querySelector(`#${emptySlot.id} .slot-hatch-progress`);
        if(spanHatchProgress) spanHatchProgress.innerHTML = `${progress}%`;
        
        if(timeLeft <= 0) {
            hatchSpecies(species, emptySlot);
            return;
        }
        
        timeLeft -= BASE_HATCH_PROGRESS_MS;
    }, 1000);

    // Altera status do slot de incubação
    emptySlot.classList.replace("slot--empty", "slot--hatching");
    emptySlot.classList.add(`hatching--${species.name}`);

    // Atualiza UI
    loadParkBalance(newBalance);
    loadHatcherySlots();

    toast({
        variant: "success",
        title: "Incubando",
        message: `${species.name} está sendo incubado!`
    });
}

function hatchSpecies(species, slot) {
    const timer = activeTimers.get(`hatchery-${slot.id}`);
    if(timer) timer.destroy();
    
    slot.classList.replace("slot--hatching", "slot--done");
    loadHatcherySlots();

    toast({
        variant: "success",
        title: "Incubação Concluída",
        message: `O embrião de ${species.name} está pronto.`
    });
}

async function placeDinosaur(species, tile) {
    let gameData = storage.get("JPWG_DATA");
    if(!gameData) {
        toast({
            variant: "destructive",
            title: "Erro",
            message: "Dados estão corrompidos. Tente logar-se novamente."
        });
        return;
    }
    
    // Verifica se o Tile está apto a receber o espécime. Na prática, essa parte
    // é preciocismo, dado que a este ponto tudo já deve estar nos conformes.
    if(tile.category !== "enclosure") {
        toast({
            title: "Operação Negada",
            message: `Este Tile não é um Cercado.`
        });
        return;
    } else if(tile.idSpecies) {
        toast({
            variant: "warn",
            title: "Operação Negada",
            message: "Uma dinossauro já ocupa este Cercado!"
        });
        return;
    }

    fetch(`/api/tiles/${tile.idPark}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ 
            tiles: [{
                positionRow: tile.positionRow, 
                positionCol: tile.positionCol, 
                idSpecies: species.id,
                removable: 0
            }] 
        })
    })
    .then((res) => res.json().then(data => {
        if(!res.ok) {
            throw data.error;
        }

        // Atualiza sessionStorage
        gameData.park.rating = gameData.park.rating + species.ratingWeight;
        gameData.tiles = data.tiles;
        storage.set("JPWG_DATA", gameData);

        // Atualiza UI
        loadGameUI();

        console.log(`Evento: ${species.name} colocado em ${printBuildingNameWithPosition(tile)} às ${new Date().toLocaleTimeString()}`);
        toast({
            variant: "success",
            title: "Espécime Colocado",
            message: `${species.name} colocado em ${printBuildingNameWithPosition(tile)}`
        });
    }))
    .catch((error) => {
        toast({
            variant: "destructive",
            title: "Erro ao colocar dinossauro",
            message: error
        });
    });
}