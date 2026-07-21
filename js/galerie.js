const galerieImage = document.getElementById("allImages");

//Récupérer les informations des images
let titre = "";
let imgSource = "";

let monImage = getImage(titre, imgSource);

galerieImage.innerHTML = monImage;

function getImage(titre, urlImage){

    titre = sanitizeHtml(titre);
    imgSource = sanitizeHtml(urlImage);
    return `
        <div class="col p-3">
            <div class="image-card text-white">
                <img src="${imgSource}" alt="Plat 1" class="b-round w-100">
                <p class="titre-image">${titre}</p>
                <div class="action-image-buttons" data-show="admin">
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#EditionPhotomodal"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#DeletePhotomodal"><i class="bi bi-trash"></i></button>
                </div>
            </div> `;
}
