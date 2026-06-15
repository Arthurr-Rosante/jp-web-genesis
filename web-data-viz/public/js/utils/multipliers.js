let DINOSAUR_AGGRESSIVENESS_MULTIPLIER = 1;
let HATCH_SUCCESS_MULTIPLIER = 1;

function setDinosaurAggressivenessMultiplier(multiplier) {
    DINOSAUR_AGGRESSIVENESS_MULTIPLIER = multiplier;
    console.log(`[multiplier] Alterando Agressividade: ${multiplier}`)
}
const getDinosaurAggressivenessMultiplier = () => DINOSAUR_AGGRESSIVENESS_MULTIPLIER;

function setHatchSuccessMultiplier(multiplier) {
    HATCH_SUCCESS_MULTIPLIER = multiplier;
    console.log(`[multiplier] Alterando Chances de Sucesso: ${multiplier}`)
}
const getHatchSuccessMultiplier = () => HATCH_SUCCESS_MULTIPLIER;