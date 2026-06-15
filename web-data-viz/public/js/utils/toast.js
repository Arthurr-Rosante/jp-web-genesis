function toast({
    variant = "default",
    title = "",
    message = "",
    duration = 3000
} = {}) {
    const icon = 
        variant === "success" ? "check-circle"  : 
        variant === "warn" ? "warning-circle"   :
        variant === "destructive" ? "x-circle"  : 
        "info";

    let toastContainer = document.getElementById("toast-container");
    if(!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast--${variant}`;
    toast.innerHTML = `
        <i class="ph-fill ph-${icon}"></i>
        <div class="toast-content">
            ${title ? `<h1 class="toast-title">${title}</h1>` : ""}
            ${message ? `<p class="toast-message">${message}</p>` : ""}
        </div>
    `;

    let toastList = toastContainer.querySelectorAll(".toast");
    if(toastList.length >= 3) {
        toastList[0].remove();
    } 
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();

        if(toastContainer.querySelectorAll(".toast").length === 0) {
            toastContainer.remove()
        }
    }, duration);
}