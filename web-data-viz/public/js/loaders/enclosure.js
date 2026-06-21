function loadEnclosure(tile) {
    if(tile.category !== "enclosure") return;

    const panel = document.getElementById("enclosure-panel");
    if(!panel) return;
    panel.innerHTML = "";

    if(tile.idSpecies) {
        // Carrega UI de cercado com dinossauro
        panel.innerHTML = occupiedEnclosureHTML(tile);
    } else {
        // Carrega UI de cercado vazio
        panel.innerHTML = emptyEnclosureHTML(tile);
    }

    // Eventos HTML
    const goToHatcheryBtn = document.getElementById("go-to-hatchery-btn");
    if(goToHatcheryBtn) {
        goToHatcheryBtn.onclick = goToHatchery;
    }
    
    const repairEnclosureBtn = document.getElementById("repair-enclosure-btn");
    if(repairEnclosureBtn) {
        repairEnclosureBtn.onclick = () => repairEnclosure(tile);
    }
    
    const upgradeEnclosureBtn = document.getElementById("upgrade-enclosure-btn");
    if(upgradeEnclosureBtn) {
        upgradeEnclosureBtn.onclick = () => upgradeEnclosure(tile);
    }
    
    const releaseDinoBtn = document.getElementById("release-dinosaur-btn");
    if(releaseDinoBtn) {
        releaseDinoBtn.onclick = () => releaseDinosaur(tile);
    }


}

function occupiedEnclosureHTML(tile) {
    const dino = tile.dinosaur;

    return `
        <h3 class="panel-title">Cercado de ${dino.name}</h3>
        <div class="enclosure-dinosaur">
            <img src="${speciesDataMap[dino.name].spriteUrl}" alt="${dino.name}" class="species-img">
            <div class="enclosure-dinosaur-card">
                <div class="card-image">
                    <img src="${speciesDataMap[dino.name].iconUrl}" alt="${dino.name}" class="species-icon">
                    <img src="./assets/images/frame.png" alt="frame" class="frame">
                </div>
                <button id="release-dinosaur-btn" class="button--accent">Soltar ${dino.name}</button>
            </div>
        </div>
        <div class="enclosure-status">
            <div class="enclosure-status-header">
                <h2>${buildingsDataMap[tile.name].translatedName}</h2>
            </div>
            <div class="enclosure-status-body">
                <div class="enclosure-radar">
                    <canvas id="enclosure-radar-chart"></canvas>
                </div>
                <div class="enclosure-info">
                    <ul>
                        <li>Era: <span>${dino.temporalRange}</span></li>
                        <li>Locomoção: <span>${dino.locomotionType}</span></li>
                        <li>Dieta: <span>${dino.diet}</span></li>
                        <li>Altura: <span>${formatDinoHeight(Number(dino.heightInMeters))}</span></li>
                        <li>Peso: <span>${formatDinoWeight(Number(dino.weightInKilograms))}</span></li>
                        <li>Agressividade: <span>${formatDinoAggressiveness(dino.aggressiveness)}</span></li>
                    </ul>
                </div>
            </div>
            ${enclosureFooterHTML(tile)}
        </div>
    `;
}

function emptyEnclosureHTML(tile) {
    return `
        <h3 class="panel-title">Cercado Vazio</h3>
        <div class="enclosure-dinosaur"></div>
        <div class="enclosure-status">
            <div class="enclosure-status-header">
                <h2>${buildingsDataMap[tile.name].translatedName}</h2>
            </div>
            <div class="enclosure-status-body">
                <div class="empty-enclosure">
                    <p>Cercado Vazio</p>
                    <button id="go-to-hatchery-btn">Incubar Espécime</button>  
                </div>
            </div>
            ${enclosureFooterHTML(tile)}
        </div>
    `;
}

function enclosureFooterHTML(tile) {
    return `
        <div class="enclosure-status-footer">
            ${enclosureHealthbarHTML(tile)}
            <div class="enclosure-actions">
                <button id="repair-enclosure-btn" class="button--secondary"><i class="ph-fill ph-wrench"></i>Reparar (${tile.baseCost * BASE_REPAIR_FEE})</button>
                ${tile.idUpgrade ? `<button id="upgrade-enclosure-btn" class="button--primary"><i class="ph-fill ph-coins"></i> Melhorar (${tile.upgradeCost})</button>` : ""}
            </div>
        </div>
    `;
}

function enclosureHealthbarHTML(tile) {
    const hpInPercentage = Math.round((tile.currentHp / tile.maxHp) * 100);

    return `
        <div class="enclosure-health">
            <span>HP:</span>
            <div class="enclosure-healthbar-wrapper">
                <div id="enclosure-healthbar" style="width:${hpInPercentage}%;"></div>
            </div>
            <span>${tile.currentHp}/${tile.maxHp}</span>
        </div>
    `;
}