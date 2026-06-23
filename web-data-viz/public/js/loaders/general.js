function loadGeneral() {
    const panel = document.getElementById("general-panel");
    if (!panel) return;

    // Busca dados do sessionStorage
    const gameData = storage.get("JPWG_DATA");
    if(!gameData || !gameData.park || !gameData.tiles) {
        toast({
            variant: "destructive",
            title: "Erro",
            message: "Dados estão corrompidos. Tente logar-se novamente."
        });
        return;
    }

    loadGeneralInfo(gameData);
    loadGeneralKPIs(gameData);
}

function loadGeneralInfo(data) {
    // Informações do Painel Esquerdo
    const spanParkName = document.getElementById("general-park-name");
    if(spanParkName) spanParkName.innerHTML = data.park.name;
    
    const spanParkBalance = document.getElementById("general-park-balance");
    if(spanParkBalance) spanParkBalance.innerHTML = Number(data.park.balance).toLocaleString("pt-br");
    
    // Informações do Painel Direito
    const speciesList = document.getElementById("general-species-list");
    if(speciesList) loadSpeciesList(speciesList, data.tiles);
}

function loadSpeciesList(listElement, tiles) {
    listElement.innerHTML = "";

    const tilesWithDinosaur = tiles.filter(t => t.idSpecies && t.dinosaur);

    if(tilesWithDinosaur.length <= 0) {
        const noSpeciesItem = document.createElement("li");
        noSpeciesItem.classList.add("card");
        noSpeciesItem.innerHTML = "<p>Seu Parque ainda não possui espécies!</p>";

        listElement.appendChild(noSpeciesItem);
        return;
    }

    for (let i = 0; i < tilesWithDinosaur.length; i++) {
        const tile = tilesWithDinosaur[i];

        const speciesItem = document.createElement("li");
        speciesItem.classList.add("species-item");
        speciesItem.innerHTML = generalSpeciesCardHTML(tile);
        speciesItem.onclick = () => togglePanel("general-panel", {
            onToggle: () => {
                const freshGameData = storage.get("JPWG_DATA");
                if(!freshGameData) return;
                
                // Pega tile atualizado
                const freshTile = freshGameData.tiles.find(
                    t => t.positionRow === tile.positionRow && t.positionCol === tile.positionCol
                );
                if(!freshTile) return;

                togglePanel("enclosure-panel");        
                loadEnclosure(freshTile);
            }
        });

        listElement.appendChild(speciesItem);
    }
}

function generalSpeciesCardHTML(tile) {
    const species = tile.dinosaur;

    const speciesIconColor = species.diet === "carnívoro"
        ? "var(--accent)"
        : species.diet === "herbívoro"
            ? "var(--secondary)"
            : "var(--primary)";

    return `
        <div class="species-image">
            <img src="${speciesDataMap[species.name].iconUrl}" alt="${species.name}" class="species-icon" style="background-color: ${speciesIconColor};">
            <img src="./assets/images/frame.png" alt="frame" class="frame">
        </div>
        <div class="species-info">
            <p class="dino-name">${species.name}</p>
            <p class="enclosure-name">${buildingsDataMap[tile.name].translatedName} <span>(L: ${tile.positionRow + 1} | C: ${tile.positionCol + 1})</span></p>
        </div>
    `;
}

function loadGeneralKPIs(data) {
    // 1° KPI (Avaliação)
    const parkRatingKPI = document.getElementById("park-rating-kpi");
    if(parkRatingKPI) parkRatingKPI.innerHTML = data.park.rating;

    const parkRatingKPIFooter = document.getElementById("park-rating-kpi-footer");
    if(parkRatingKPIFooter) {
        const ratingAnalysis = data.park.rating <= 1.5
            ? "Parque Comum"
            : data.park.rating <= 3.5
                ? "Parque Interessante"
                : "Parque Fantástico!";
        parkRatingKPIFooter.innerHTML = ratingAnalysis;
    };

    // 2° KPI (Construções)
    const parkBuildingsKPI = document.getElementById("park-buildings-kpi");
    if(parkBuildingsKPI) {
        const distinctBuildings = [];
        data.tiles.forEach(t => {
            if((t.category === "enclosure" || t.category === "building") && !distinctBuildings.includes(t.name)) {
                distinctBuildings.push(t.name);
            } 
        });

        parkBuildingsKPI.innerHTML = distinctBuildings.length;
    }

    const parkBuildingsKPIFooter = document.getElementById("park-buildings-kpi-footer");
    if(parkBuildingsKPIFooter) {
        parkBuildingsKPIFooter.innerHTML = Object.keys(buildingsMap).filter(
            k => buildingsMap[k].category === "enclosure" || buildingsMap[k].category === "building"
        ).length;
    }

    // 3° KPI (Espécimes)
    const parkSpeciesKPI = document.getElementById("park-species-kpi");
    if(parkSpeciesKPI) {
        const distinctSpecies = [];
        data.tiles.forEach(t => {
            if((t.idSpecies && t.dinosaur) && !distinctSpecies.includes(t.dinosaur.name)) {
                distinctSpecies.push(t.dinosaur.name);
            } 
        });

        parkSpeciesKPI.innerHTML = distinctSpecies.length;
    }

    const parkSpeciesKPIFooter = document.getElementById("park-species-kpi-footer");
    if(parkSpeciesKPIFooter) {
        parkSpeciesKPIFooter.innerHTML = Object.keys(speciesMap).length;
    }
}