async function loadTileSwitcher(selectedTile) {
    const tileSwitcherList = document.getElementById("tile-list");
    if(!tileSwitcherList) return;
    tileSwitcherList.innerHTML = "";

    // Limpa qualquer Tile préviamente selecionado
    cleanSelectedTiles();

    // Retorna e destaca a div do Tile selecionado
    const selectedTileDiv = document.getElementById(`r${selectedTile.positionRow}_c${selectedTile.positionCol}`);
    selectedTileDiv.classList.add("tile--selected");
    
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

    // Busca buildings disponíveis
    const buildings = await fetch(`/api/buildings`)
    .then((res) => res.json().then((data) => {
        if(!res.ok) throw data.error;
        return data.buildings;
    }))
    .catch((error) => {
        toast({
            variant: "destructive",
            title: "Erro ao retornar Construções",
            message: error
        });
    });

    // Carrega lista de opções (apenas Tiles colocáveis)
    buildings.filter(tile => tile.placeable)
    .forEach(tile => {
       const buildingOpt = document.createElement("li");
        buildingOpt.className = `tile-item ${tile.name}`;
        buildingOpt.innerHTML = tileOptionHTML(tile);
        buildingOpt.onclick = () => {
            cleanSelectedOptions();
            buildingOpt.classList.add("tile-item--selected");
        };

        tileSwitcherList.appendChild(buildingOpt);
    });

    // Eventos HTML
    const changeTileBtn = document.getElementById("change-tile-btn");
    if(changeTileBtn) {
        changeTileBtn.onclick = async () => {
            // checar por idSpecies é uma prevenção dupla pois, na prática,
            // removable já deveria contabilizar caso tile estivesse ocupado por um dino
            if (!selectedTile.removable || selectedTile.idSpecies) {
                toast({
                    variant: "warn",
                    title: "Tile Especial",
                    message: "Este tile não pode ser removido no momento!"
                });
                return;
            }

            const selectedOpt = document.querySelector(".tile-item--selected");
            if(!selectedOpt) {
                toast({
                    variant: "warn",
                    title: "Operação Negada",
                    message: "Selecione uma construção antes de alterar!"
                });
                return;
            };

            // classList[1], pois: ['tile-item', 'tile-name', 'tile--selected']
            const selectedOptData = buildings.find((b) => b.name === selectedOpt.classList[1]);
            await changeTile(selectedTile, selectedOptData);
            togglePanel("tile-switcher");
        }
    }
    
    const removeTileBtn = document.getElementById("remove-tile-btn");
    if(removeTileBtn) {
        // Sempre retorna o Tile para o padrão (terrain-grass)
        removeTileBtn.onclick = async () => {
            const terrainGrass = buildings.find(b => b.name === "terrain-grass");

            if (!selectedTile.removable || selectedTile.idSpecies) {
                toast({
                    variant: "warn",
                    title: "Tile Especial",
                    message: "Este tile não pode ser removido no momento!"
                });
                return;
            }

            await changeTile(selectedTile, terrainGrass);
            togglePanel("tile-switcher");
        }
    }
    
};

function cleanSelectedTiles() {
    document.querySelectorAll(".tile--selected").forEach((element) => {
        element.classList.remove("tile--selected");
    });
}

function cleanSelectedOptions() {
    document.querySelectorAll(".tile-item--selected").forEach((element) => {
        element.classList.remove("tile-item--selected");
    });
}

function tileOptionHTML(tile) {
    return `
        <div class="tile-header">
            <p>${buildingsDataMap[tile.name].translatedName}</p>
        </div>
        <img src="${buildingsDataMap[tile.name].spriteUrl}">
        <div class="tile-footer">
            <p class="tile-price">
                <i class="ph-fill ph-coins"></i><span>${tile.baseCost}</span>
            </p>
        </div>
    `;
}