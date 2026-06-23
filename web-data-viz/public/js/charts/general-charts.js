function createGeneralCharts() {
    const gameData = storage.get("JPWG_DATA");
    if(!gameData || !gameData.park || !gameData.tiles) {
        toast({ 
            variant: "destructive", 
            title: "Erro", 
            message: "Dados estão corrompidos. Tente logar-se novamente."
        });
        return;
    }

    // Cria gráfico de variação do saldo
    const balanceChartCanvas = document.getElementById("park-balance-chart");
    if(balanceChartCanvas) {
        const newChart = new Chart(balanceChartCanvas, balanceChartConfig(gameData.park.balance));
        activeCharts.set("park-balance-chart", {
            chart: newChart,
            canvas: balanceChartCanvas
        });
    };
    
    // Cria gráfico de espécies por dieta
    const speciesChartCanvas = document.getElementById("species-diet-chart");
    if(speciesChartCanvas) {
        const newChart = new Chart(speciesChartCanvas, speciesChartConfig(gameData.tiles));
        activeCharts.set("species-diet-chart", {
            chart: newChart,
            canvas: speciesChartCanvas
        });
    };
}

// Gráfico de Saldo
function updateBalanceChart(balance) {
    if(!activeCharts.has("park-balance-chart")) return;
    const chart = activeCharts.get("park-balance-chart").chart;

    if(chart.data.labels.length === 10 && chart.data.datasets[0].data.length === 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(balance);

    chart.update();
}

function balanceChartConfig(balance) {
    let config = {
        type: "line"
    };

    config["data"] = {
        labels: [new Date().toLocaleTimeString()],
        datasets: [{
            label: "Saldo Atual",
            data: [balance],
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            borderWidth: 2,
            backgroundColor: "#3e4a1b60",
            borderColor: "#3e4a1b"
        }]
    }
    
    config["options"] = {
        responsive: true,
        scales: {
            x: {
                beginAtZero: true,
                grid: { color: "#6B4F2A80" },
                ticks: {
                    color: "#d0c1a1",
                },
            },
            y: {
                beginAtZero: true,
                min: 0,
                suggestedMax: 10000,
                ticks: {
                    color: "#d0c1a1",
                },
                grid: { color: "#6B4F2A80" }
            }
        },
        plugins: {
            legend: {
                labels: { color: "#d0c1a1" }
            }
        }
    }

    return config;
}

// Gráfico de Espécies por dieta
function updateSpeciesChart(tiles) {
    if(!activeCharts.has("species-diet-chart")) return;
    const chart = activeCharts.get("species-diet-chart").chart;

    const tilesWithDinosaur = tiles.filter(t => t.idSpecies && t.dinosaur);

    // Dataset dos Carnívoros
    chart.data.datasets[0].data = [tilesWithDinosaur.filter(t => t.dinosaur.diet === "carnívoro").length];
    // Dataset dos Herbívoros
    chart.data.datasets[1].data = [tilesWithDinosaur.filter(t => t.dinosaur.diet === "herbívoro").length];
    // Dataset dos Onívoros
    chart.data.datasets[2].data = [tilesWithDinosaur.filter(t => t.dinosaur.diet === "onívoro").length];

    chart.update();
}

function speciesChartConfig(tiles) {
    let config = {
        type: "bar"
    };

    const tilesWithDinosaur = tiles.filter(t => t.idSpecies && t.dinosaur);

    config["data"] = {
        labels: ["Espécimes"],
        datasets: [
            {
                label: "Carnívoros",
                data: [tilesWithDinosaur.filter(t => t.dinosaur.diet === "carnívoro").length],
                fill: true,
                pointRadius: 4,
                borderWidth: 2,
                backgroundColor: "#71383220",
                borderColor: "#713832"
            },
            {
                label: "Herbívoros",
                data: [tilesWithDinosaur.filter(t => t.dinosaur.diet === "herbívoro").length],
                fill: true,
                pointRadius: 4,
                borderWidth: 2,
                backgroundColor: "#e1f1b220",
                borderColor: "#647339"
            },
            {
                label: "Onívoros",
                data: [tilesWithDinosaur.filter(t => t.dinosaur.diet === "onívoro").length],
                fill: true,
                pointRadius: 4,
                borderWidth: 2,
                backgroundColor: "#e4aa2720",
                borderColor: "#e4aa27"
            },
        ]
    }

    config["options"] = {
        responsive: true,
        indexAxis: "y",
        scales: {
            x: {
                beginAtZero: true,
                min: 0,
                suggestedMax: 10,
                ticks: {
                    color: "#d0c1a1",
                    stepSize: 2
                },
                grid: { color: "#6B4F2A80" }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#d0c1a1",
                    minRotation: 90,
                },
                grid: { color: "#6B4F2A80" }
            }, 
        },
        plugins: {
            legend: {
                labels: { color: "#d0c1a1" }
            }
        }
    }

    return config;
}