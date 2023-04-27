function chargerTitre() {
var manifestData = chrome.runtime.getManifest();
document.getElementById("titre").innerHTML = "PhiloGPT v" + manifestData.version + " installé !"
}

document.addEventListener("DOMContentLoaded", chargerTitre);
