const activeCharts = new Map();

function loadEnclosure(tile) {
    if(tile.category !== "enclosure") return;

    const panel = document.getElementById("enclosure-panel");
    if(!panel) return;
    panel.innerHTML = "";

    // Permite saber a qual cercado o painél pertence
    const chartName = `r${tile.positionRow}_c${tile.positionCol}`;
    panel.className = `panel ${chartName}`;

    if(tile.currentHp <= 0) {
        panel.classList.add("broken");
        if(activeCharts.has(chartName)) {
            activeCharts.delete(chartName);
        }
    }

    if(tile.idSpecies) {
        // Carrega UI de cercado com dinossauro
        panel.innerHTML = occupiedEnclosureHTML(tile);

        if(!activeCharts.has(chartName)) {
            createEnclosureChart(tile);
        } else {
            const canvas = activeCharts.get(chartName).canvas;
            document.querySelector(".enclosure-radar")?.appendChild(canvas);
        }
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
        repairEnclosureBtn.onclick = () => {
            repairEnclosure(tile);
            if(panel.classList.contains("broken")) {
                panel.classList.remove("broken");
            }
        };
    }
    
    const upgradeEnclosureBtn = document.getElementById("upgrade-enclosure-btn");
    if(upgradeEnclosureBtn) {
        upgradeEnclosureBtn.onclick = () => {
            upgradeEnclosure(tile);
            updateEnclosureChart(tile);
        };
    }
    
    const releaseDinoBtn = document.getElementById("release-dinosaur-btn");
    if(releaseDinoBtn) {
        releaseDinoBtn.onclick = () => {
            releaseDinosaur(tile);
            activeCharts.delete(chartName);
        };
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
                <div class="enclosure-radar"></div>
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
        <h3 class="panel-title">${tile.currentHp > 0 ? "Cercado Vazio" : "Cercado Quebrado"}</h3>
        <div class="enclosure-dinosaur"></div>
        <div class="enclosure-status">
            <div class="enclosure-status-header">
                <h2>${buildingsDataMap[tile.name].translatedName}</h2>
            </div>
            <div class="enclosure-status-body">
                <div class="empty-enclosure">
                    <p>${tile.currentHp > 0 ? "Cercado Vazio" : "Cercado Quebrado"}</p>
                    ${tile.currentHp > 0 ? `<button id="go-to-hatchery-btn">Incubar Espécime</button>` : `<span>Repare a Construção!</span>`} 
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
                ${tile.idUpgrade && tile.currentHp > 0 ? `<button id="upgrade-enclosure-btn" class="button--primary"><i class="ph-fill ph-coins"></i> Melhorar (${tile.upgradeCost})</button>` : ""}
            </div>
        </div>
    `;
}

function enclosureHealthbarHTML(tile) {
    const hpInPercentage = Math.round((tile.currentHp / tile.maxHp) * 100);

    const bgColor = hpInPercentage <= 25
        ? "var(--accent)"
        : hpInPercentage <= 65
            ? "var(--primary)"
            : "var(--secondary)";

    return `
        <div class="enclosure-health">
            <span>HP:</span>
            <div class="enclosure-healthbar-wrapper">
                <div id="enclosure-healthbar" style="width:${hpInPercentage}%;background-color:${bgColor};"></div>
            </div>
            <span>${tile.currentHp}/${tile.maxHp}</span>
        </div>
    `;
}

function cleanEnclosureReference() {
    const panel = document.getElementById("enclosure-panel");
    panel.className = "panel";
}

function createEnclosureChart(tile) {
    const chartName = `r${tile.positionRow}_c${tile.positionCol}`;

    const canvasElement = document.createElement("canvas");
    document.querySelector(".enclosure-radar")?.appendChild(canvasElement);

    const newChart = new Chart(canvasElement, enclosureChartConfig(tile));
    activeCharts.set(chartName, {
        chart: newChart,
        canvas: canvasElement
    });
}

function updateEnclosureChart(tile) {
    const chartName = `r${tile.positionRow}_c${tile.positionCol}`;
    if(!activeCharts.has(chartName)) {
        createEnclosureChart(tile);
    }

    const chart = activeCharts.get(chartName).chart;
    const dinosaur = tile.dinosaur;
    if(!dinosaur) {
        chart.data.datasets[0].data = [];
        chart.update();
        return;
    }

    dinosaur.heightInMeters = Number(dinosaur.heightInMeters);
    dinosaur.weightInKilograms = Number(dinosaur.weightInKilograms);
    const weightFactor = dinosaur.weightInKilograms / 1000;
    const baseDamage = (BASE_ATTACK_DAMAGE * dinosaur.aggressiveness) + weightFactor

    chart.data.datasets[0].data = [
        normalizeValue(dinosaur.heightInMeters, 1, 10),
        normalizeValue(dinosaur.weightInKilograms / 1000, 1, 10),
        normalizeValue(dinosaur.aggressiveness * 10, 1, 10),
        normalizeValue(baseDamage / 2, 1, 10),
        normalizeValue(Math.max(baseDamage - tile.durability, 1) / 2, 1, 10)
    ];
    chart.update();
}

function enclosureChartConfig(tile) {
    let config = {
        type: "radar"
    };

    let dinosaur = tile.dinosaur;
    if(!dinosaur) return config;

    dinosaur.heightInMeters = Number(dinosaur.heightInMeters);
    dinosaur.weightInKilograms = Number(dinosaur.weightInKilograms);
    const weightFactor = dinosaur.weightInKilograms / 1000;
    const baseDamage = (BASE_ATTACK_DAMAGE * dinosaur.aggressiveness) + weightFactor

    config["data"] = {
        labels: ['Altura', 'Peso', 'Agressividade', 'Dano Bruto', 'Dano Líquido'],
        datasets: [{
            data: [
                normalizeValue(dinosaur.heightInMeters, 1, 10),
                normalizeValue(dinosaur.weightInKilograms / 1000, 1, 10),
                normalizeValue(dinosaur.aggressiveness * 10, 1, 10),
                normalizeValue(baseDamage / 2, 1, 10),
                normalizeValue(Math.max(baseDamage - tile.durability, 1) / 2, 1, 10)
            ],
            fill: true,
            backgroundColor: "rgba(184, 137, 26, 0.2)",
            borderColor: "#B8891A"
        }],
    };

    config["options"] = {
        responsive: true,
        elements: {
            point: { radius: 0 },
            line: { borderWidth: 2 }
        },
        scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 10,
                ticks: { 
                    display: false, 
                    stepSize: 2 
                },
                grid: { color: 'rgba(217, 202, 171, 0.2)' },
                angleLines: { color: 'rgba(217, 202, 171, 0.25)' },
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return config;
}

function normalizeValue(value, min, max) {
    return Math.round(Math.max(Math.min(Math.abs(value), max), min));
}