function loadStatusbar() {
    const gameData = storage.get("JPWG_DATA");
    if(!gameData || !gameData.park) return;
    const {park} = gameData;

    loadParkName(park.name);
    loadParkBalance(park.balance);
    loadParkRating(park.rating);
}

function loadParkName(name) {
    const pParkName = document.getElementById("park-name");
    pParkName.innerHTML = name;
}

function loadParkBalance(balance) {
    const pParkBalance = document.getElementById("park-balance");
    pParkBalance.innerHTML = Number(balance).toLocaleString("pt-br");
}
function loadParkRating(rating) {
    const pParkRating = document.getElementById("park-rating");    
    pParkRating.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        const star = document.createElement("i");
        if(rating - i === 0.5) {
            star.classList.add("rating", "ph-fill", "ph-star-half");
        } else if(rating - i <= 0) {
            star.classList.add("rating", "ph", "ph-star");
        }
        else {
            star.classList.add("rating", "ph-fill", "ph-star");
        }
        pParkRating.appendChild(star);
    }
}