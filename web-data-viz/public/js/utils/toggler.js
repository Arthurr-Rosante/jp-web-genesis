function togglePanel(elementId, withOverlay = true) {
    let element = document.getElementById(elementId);
    if(withOverlay) {
        element = element.closest(".overlay");
    }

    const icon = document.querySelector(`#${elementId}-toggler i`);
    const isOpen = element.classList.contains("open");

    if(isOpen) {
        element.classList.replace("open", "closed");
        icon && icon.classList.replace("ph-caret-circle-left", "ph-caret-circle-right");
    } else {
        element.classList.replace("closed", "open");
        icon && icon.classList.replace("ph-caret-circle-right", "ph-caret-circle-left");
    }
}