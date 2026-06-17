function loadGrid() {
    const data = storage.get("JPWG_DATA");
    if(!data.tiles) return;

    const gridDiv = document.getElementById("grid");
    if(!grid) return;

    gridDiv.innerHTML = "";
    const {tiles} = data;

    tiles.forEach((tile) => {
        const tileDiv = document.createElement("div");
        const tRow = tile.positionRow;
        const tCol = tile.positionCol;

        tileDiv.className=`tile ${tile.category} ${tile.name} ${tile.removable ? "removable" : ""}`;
        tileDiv.id = `r${tRow}_c${tCol}`;
        if(tile.dinosaur) {
            const dinoDiv = document.createElement("div");
            dinoDiv.className = `dinosaur ${tile.dinosaur.name}`;
            tileDiv.appendChild(dinoDiv);
        }

        tileDiv.onclick = () => onTileClick(tile);

        gridDiv.appendChild(tileDiv);
    });

}

function onTileClick(tile) {
    if(storage.get("JPWG_EDITOR_MODE")) {
        loadTileSwitcher(tile);
        togglePanel("tile-switcher");
        return;
    }

    if(tile.name === "entrance") {
        togglePanel("entrance-panel");
    } else if (tile.name === "visitor-center") {
        loadGeneral();
        togglePanel("general-panel");
    } else if (tile.name === "hatchery") {
        loadHatchery();
        togglePanel("hatchery-panel");
    } else if (tile.category === "enclosure") {
        loadEnclosure(tile);
        togglePanel("enclosure-panel");
    }
}