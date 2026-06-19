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
            variant: "warn", 
            title: "Operação Negada", 
            message: `Incubadora cheia! Não há espaços para incubar ${species.name}!` 
        });
        return;
    }

    // Checa insuficiência do saldo
    const newBalance = park.balance - species.hatchCost;
    if (newBalance < 0) {
        toast({
            variant: "warn",
            title: "Operação Negada",
            message: "Você não possui saldo suficiente!"
        });
        return;
    }
    
    // Atualiza sessionStorage
    park.balance = newBalance;
    storage.set("JPWG_DATA", gameData);

    // Cria timer de incubação
    const timeToHatch = (BASE_SPECIES_HATCH_INTERVAL_MS * (species.ratingWeight))
    let timeLeft = timeToHatch;

    const hatchTimer = createTimer(`hatchery-${emptySlot.id}`, () => {
        let progress =  Math.round(((timeToHatch - timeLeft) / timeToHatch) * 100);

        loadHatcherySlots();
        let slotContent = emptySlot.querySelector(".slot-content");
        if(slotContent) {
            const spanHatchProgress = document.createElement("span");
            spanHatchProgress.className = "slot-hatch-progress";
            spanHatchProgress.innerHTML = `${progress}%`;

            slotContent.appendChild(spanHatchProgress);
        }
        
        if(timeLeft <= 0) {
            hatchSpecies(species, emptySlot);
            return;
        }
        
        timeLeft -= BASE_HATCH_INTERVAL_MS;
    }, 1000);

    // Altera status do slot de incubação
    emptySlot.classList.replace("slot--empty", "slot--hatching");
    emptySlot.classList.add(`hatching--${species.name}`);

    // Atualiza UI
    loadStatusbar();
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
    console.log("INCUBADO!");
    console.log(species);
    loadHatcherySlots();
}