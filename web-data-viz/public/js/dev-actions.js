function enabledOrDisabled(bool) {
    if(bool === true) return "abilitados(as)";
    return "desabilitados(as)"
}

// Controles de Incubação
function toggleFails(event) {
   const value = JSON.parse(event.target.value);
   HATCH_FAILS_ENABLED = value;
   console.log(`Dev: Falhas de incubação ${enabledOrDisabled(value)} às ${new Date().toLocaleTimeString()}`);
}

function setHatchSuccessMultiplier(event) {
    const value = Number(event.target.value);
    BASE_HATCH_SUCCESS_MULTIPLIER = value;
    console.log(`Dev: Sucesso de incubação configurado para: ${value} às ${new Date().toLocaleTimeString()}`);
}

function setHatchProgress(event) {
    const value = Number(event.target.value);
    BASE_HATCH_SUCCESS_MULTIPLIER = value;
    console.log(`Dev: Progresso de incubação configurado para: ${value} às ${new Date().toLocaleTimeString()}`);
}

// Controles de Cercados/Dinossauros
function toggleEnclosureAttacks(event) {
    const value = JSON.parse(event.target.value);
    ATTACKS_ENABLED = value;
    console.log(`Dev: Ataques ${enabledOrDisabled(value)} às ${new Date().toLocaleTimeString()}`);
}

function toggleEnclosureFlees(event) {
    const value = JSON.parse(event.target.value);
    FLEES_ENABLED = value;
    console.log(`Dev: Fugas ${enabledOrDisabled(value)} às ${new Date().toLocaleTimeString()}`);
}

function setSpeciesAggressivinessMultiplier(event) {
    const value = Number(event.target.value);
    BASE_AGGRESSIVENESS_MULTIPLIER = value;
    console.log(`Dev: Agressividade de espécies configurada para: ${value} às ${new Date().toLocaleTimeString()}`);
}

// Controles de Eventos
function toggleRandomEvents(event) {
    const value = JSON.parse(event.target.value);
    EVENTS_ENABLED = value;
    console.log(`Dev: Eventos randômicos ${enabledOrDisabled(value)} às ${new Date().toLocaleTimeString()}`);
}