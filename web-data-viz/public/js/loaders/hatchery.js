async function loadHatchery() {
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

};

function speciesCardHTML(species) {
    return `
        <p class="hatchery-title">${species.name.charAt(0).toUpperCase() + species.name.slice(1)}</p>
        <div class="hatchery-item-info">
            <p><span><i class="ph-fill ph-coins"></i> ${species.hatchCost}</span></p>
            <p><span><i class="ph-fill ph-timer"></i> ${formatDinoHatchTime(BASE_SPECIES_HATCH_INTERVAL_MS * species.ratingWeight)}</span></p>
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
        slot.innerHTML = hatcherySlotHTML(status, species);

        if(status === "done") {
            const placeBtn = slot.querySelector(".place-dino-btn"); 
            placeBtn.onclick = () => {
                console.log("COLOCANDO DINO!");
                console.log(species);

                // Atualiza UI
                slot.className = "hatchery-slot slot--empty";
                loadHatcherySlots();
            };
            
            const discardBtn = slot.querySelector(".discard-dino-btn"); 
            discardBtn.onclick = () => {
                console.log("DESCARTANDO DINO!");
                console.log(species);

                // Atualiza UI
                slot.className = "hatchery-slot slot--empty";
                loadHatcherySlots();
            };
        }
    });
}

function hatcherySlotHTML(status, species) {
    const speciesData = speciesDataMap[species.name];

    if(status === "hatching") {
        return `
            <div class="slot-dinosaur" style="background-image: url(${speciesData.iconUrl});">
                <div class="slot-content">
                    <p>Progresso da Incubação</p>
                </div>
            </div>
        `;
    };

    if(status === "done") {
        const gameData = storage.get("JPWG_DATA");
        let availableEnclosuresList = 
            gameData.tiles.filter((t) => t.category === "enclosure" && t.idSpecies === null);

        const enclosureOptionHTML = (tile) => `
            <option value="r${tile.positionRow}_c${tile.positionCol}">
            ${buildingsDataMap[tile.name].translatedName} (L: ${tile.positionRow + 1} | C: ${tile.positionCol + 1})
            </option>
        `;

        return `
            <div class="slot-dinosaur" style="background-image: url(${speciesData.iconUrl});">
                <button class="discard-dino-btn"><p class="ph-fill ph-trash"></p></button>
                <div class="slot-content">
                    <select class="ipt-place-dinosaur">
                    ${availableEnclosuresList.map((tile) => enclosureOptionHTML(tile)).join("")}
                    </select>
                    <button class="place-dino-btn">Colocar Dinossauro</button>
                </div>
            </div>
        `;
    };

}