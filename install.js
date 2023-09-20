// scripts.js

// Récupérer la boîte de dialogue modale
var modal = document.getElementById('myModal');

// Récupérer le bouton pour fermer la boîte de dialogue
var closeBtn = document.getElementById('closeBtn');
var image = document.getElementById('image');
var lien = document.getElementById('lien');

function ouvrir() {
    window.open('https://chrome.google.com/webstore/detail/methodophilo/jcjbabbbpbnhidgppijldkmhicccgeoc?hl=fr');
}

// Afficher la boîte de dialogue modale lorsque la page se charge
window.onload = function() {
    modal.style.display = 'block';
}

// Fonction pour fermer la boîte de dialogue
function closeModal() {
    modal.style.display = 'none';
}

// Événement pour fermer la boîte de dialogue en cliquant sur le bouton OK
closeBtn.addEventListener('click', closeModal);
image.addEventListener('click', ouvrir);
lien.addEventListener('click', ouvrir);

// Événement pour fermer la boîte de dialogue en cliquant en dehors de celle-ci
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        closeModal();
    }
});
