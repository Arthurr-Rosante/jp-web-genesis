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