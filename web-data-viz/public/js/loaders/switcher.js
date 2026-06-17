async function loadTileSwitcher(selectedTile) {
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
    .then((res) => res.json())
    .then((data) => data.buildings)
    .catch((error) => {
        toast({
            variant: "destructive",
            title: "Erro ao retornar Construções",
            message: error
        });
    });

    
};

function cleanSelectedTiles() {
    document.querySelectorAll(".tile--selected").forEach((element) => {
        element.classList.remove("tile--selected");
    });
}