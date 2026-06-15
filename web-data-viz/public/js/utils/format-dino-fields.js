function isValid(num) {
    if(!num || typeof num !== "number") return false;
    return true;
}

function formatDinoWeight(weight) {         // dado que weight é passado em Kg, por padrão
    if(!isValid(weight)) return "[erro de parâmetro]"

    if(weight < 1) {
        return String((weight * 1000) + "g")
    } else if (weight <= 999) {
        return String(weight + "kg")
    } else {
        return String((weight / 1000) + "T")
    }
}

function formatDinoHeight(height) {         // dado que height é passado em Metros, por padrão
    if(!isValid(height)) return "[erro de parâmetro]"

    if(height < 1) {
        return String((height * 100) + "cm")
    } else {
        return String(height + "m")
    }
}

function formatDinoAggressiveness(aggressiveness) {     // dado que aggressiveness é passado na faixa 0-1
    if(!isValid(aggressiveness)) return "[erro de parâmetro]"

    if(aggressiveness <= 0.4) {
        return "Calmo";
    } else if(aggressiveness <= 0.7) {
        return "Temperamental";
    } else {
        return "Agressivo";
    }
}

function formatDinoHatchSuccess(hatchSuccess) {     // dado que hatchSuccess é passado na faixa 0-1
    if(!isValid(hatchSuccess)) return "[erro de parâmetro]"

    return String((hatchSuccess * 100) + "%")
}