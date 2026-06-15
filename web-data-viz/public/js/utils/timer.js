const DECREASE_INTERVAL = 1000;
const SHOW_TIMER_LOGS = false;

const activeTimers = new Map();

function createTimer(timerName, fn, interval, timeoutMode = false) {
    if(typeof fn !== "function") {
        console.log("[timer.js] Erro: Paramêtro 'fn' não é uma função!");
        return;
    }

    let currentInterval = interval;
    let timerId = null;

    const start = () => {
        if(timerId !== null) return;

        if(!timeoutMode) {
            timerId = setInterval(() => {
                currentInterval -= DECREASE_INTERVAL;
                if(currentInterval <= 0) {
                    fn();
                    currentInterval = interval;
                    SHOW_TIMER_LOGS && console.log(`O timer "${timerName}" rodou!`);
                }
            }, DECREASE_INTERVAL);
        } else {
            timerId = setTimeout(() => {
                fn();
                destroy();
                SHOW_TIMER_LOGS && console.log(`O timer "${timerName}" rodou!`);
            }, interval);
        }

        SHOW_TIMER_LOGS && console.log(`O timer "${timerName}" foi iniciado!`);
    };
    
    const pause = () => {
        if(timerId !== null) {
            clearInterval(timerId);
            timerId = null;
            SHOW_TIMER_LOGS && console.log(`O timer "${timerName}" foi pausado!`);
        }
    };
    
    const resume = () => {
        start();
        SHOW_TIMER_LOGS && console.log(`O timer "${timerName}" foi despausado!`);
    };
    
    const reset = () => {
        pause();
        currentInterval = interval;
        start();
        SHOW_TIMER_LOGS && console.log(`O timer "${timerName}" foi reiniciado!`);
    };
    
    const destroy = () => {
        pause();
        activeTimers.delete(timerName);
        SHOW_TIMER_LOGS && console.log(`O timer "${timerName}" foi destruido!`);
    };

    const getCurrentInterval = () => currentInterval;

    const timerMethods = {start, pause, resume, reset, destroy, getCurrentInterval};

    activeTimers.set(timerName, timerMethods);
    start();

    return timerMethods;
}