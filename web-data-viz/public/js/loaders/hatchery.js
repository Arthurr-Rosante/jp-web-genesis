function loadHatchery() {
    const hatcheryList = document.getElementById("hatchery-list");
    if(!hatcheryList) return;
    hatcheryList.innerHTML = "";

    // Busca dados do sessionStorage
    const gameData = storage.get("JPWG_DATA");
    if(!gameData) {
        toast({
            variant: "destructive",
            title: "Erro",
            message: "Dados estão corrompidos. Tente logar-se novamente."
        });
        return;
    }

    // Carrega lista de espécies para incubação
    Object.values(speciesMap).forEach(sp => {
       const speciesCard = document.createElement("li");
       speciesCard.className = "hatchery-item";
       speciesCard.style.backgroundImage = `url(${speciesDataMap[sp.name].iconUrl})`;
        speciesCard.innerHTML = speciesCardHTML(sp);
        
        const incubateBtn = speciesCard.querySelector(".hatch-btn");
        if(!incubateBtn) return;
        incubateBtn.onclick = () => incubateSpecies(sp);

        hatcheryList.appendChild(speciesCard);
    });

    // Carrega Slots da Incubadora
    loadHatcherySlots()
};

function speciesCardHTML(species) {
    return `
        <p class="hatchery-title">${species.name.charAt(0).toUpperCase() + species.name.slice(1)}</p>
        <div class="hatchery-item-info">
            <p><span><i class="ph-fill ph-coins"></i> ${species.hatchCost}</span></p>
            <p><span><i class="ph-fill ph-timer"></i> ${formatDinoHatchTime(SPECIES_HATCH_INTERVAL_MS * species.ratingWeight)}</span></p>
            <p><span><i class="ph-fill ph-egg-crack"></i> ${formatDinoHatchSuccess(species.hatchSuccessRate)}</span></p>
        </div>
        <div class="hatchery-item-footer">
            <button class="hatch-btn button--primary">Incubar</button>
        </div>
    `;
}

function loadHatcherySlots() {
    const hatcherySlots = document.querySelectorAll(".hatchery-slot");
    hatcherySlots.forEach((slot) => {
        // slot.classList[1], pois: ['hatchery-slot', 'slot--hatching', 'hatching--tiranossauro']; 
        const status = slot.classList[1].split("--")[1];
        const speciesName = slot.classList[2]?.split("--")[1];

        if(status === "empty" || !speciesName) {
            slot.innerHTML = "";
            return;
        };
        
        const species = speciesMap[speciesName];
        slot.innerHTML = hatcherySlotHTML(species, slot);

        if(status === "done") {
            const placeForm = slot.querySelector(`#${slot.id}-place-form`); 
            placeForm.onsubmit = async (event) => {
                event.preventDefault();

                const gameData = storage.get("JPWG_DATA");
                if(!gameData) {
                    toast({
                        variant: "destructive",
                        title: "Erro",
                        message: "Dados estão corrompidos. Tente logar-se novamente."
                    });
                    return;
                }

                // Descobre posição do tile a partir do valor do select
                const position = placeForm.querySelector(".place-dinosaur").value;
                if(!position) {
                    toast({
                        variant: "warn",
                        title: "Operação Negada",
                        message: `Selecione um Cercado vazio para colocar ${species.name}`
                    });
                    return;
                };

                const positionRow = Number(position.split("_")[0].slice(1));
                const positionCol = Number(position.split("_")[1].slice(1));
                const tile = gameData.tiles.find((t) => t.positionRow === positionRow && t.positionCol === positionCol);
                if(!tile) {
                    toast({
                        variant: "warn",
                        title: "Operação Negada",
                        message: `Este Tile parece estar indefinido. Tente logar-se novamente.`
                    });
                    return;
                }

                await placeDinosaur(species, tile);

                // Atualiza UI
                togglePanel("hatchery-panel", {onToggle: () => {
                    slot.className = "hatchery-slot slot--empty";
                }});
            };
            
            const discardBtn = slot.querySelector(".discard-dino-btn"); 
            discardBtn.onclick = () => {
                slot.className = "hatchery-slot slot--empty";
                loadHatcherySlots();
                
                console.log(`Evento: ${species.name} descartado de ${slot.id} às ${new Date().toLocaleTimeString()}`);
                toast({
                    variant: "success",
                    title: "Descarte concluído",
                    message: `O embrião de ${species.name} foi descartado`
                });
            };
        }
    });
}

function hatcherySlotHTML(species, slot) {
    // slot.classList[1], pois: ['hatchery-slot', 'slot--hatching', 'hatching--tiranossauro']; 
    const status = slot.classList[1].split("--")[1];
    const speciesData = speciesDataMap[species.name];

    if(status === "hatching") {
        return `
            <div class="slot-dinosaur" style="background-image: url(${speciesData.iconUrl});">
                <div class="slot-content">
                    <p>Progresso da Incubação</p>
                    <span class="slot-hatch-progress">0%</span>
                </div>
            </div>
        `;
    };

    if(status === "done") {
        const gameData = storage.get("JPWG_DATA");
        let availableEnclosuresList = 
            gameData.tiles.filter((t) => t.category === "enclosure" && t.idSpecies === null && t.currentHp > 0);

        const enclosureOptionHTML = (tile) => `
            <option value="r${tile.positionRow}_c${tile.positionCol}">
            ${printBuildingNameWithPosition(tile)}
            </option>
        `;

        return `
            <div class="slot-dinosaur" style="background-image: url(${speciesData.iconUrl});">
                <button class="discard-dino-btn"><p class="ph-fill ph-trash"></p></button>
                <form id="${slot.id}-place-form" class="slot-content">
                    <select name="tilePosition" class="place-dinosaur">
                    ${availableEnclosuresList.map((tile) => enclosureOptionHTML(tile)).join("")}
                    </select>
                    <button type="submit" class="place-dino-btn">Colocar Dinossauro</button>
                </form>
            </div>
        `;
    };

}