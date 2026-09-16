const apiUrl = window.apiUrl;
const getAuthHeaders = window.getAuthHeaders;
const getRole = window.getRole;
const sanitizeHtml = window.sanitizeHtml;
const apiAssetUrl = window.apiAssetUrl;
const showAndHideElementsForRoles = window.showAndHideElementsForRoles;
const galerieImage = document.getElementById("allImages");
const pictureForm = document.getElementById("pictureForm");
const pictureIdInput = document.getElementById("PictureIdInput");
const titleInput = document.getElementById("NamePhotoInput");
const imageInput = document.getElementById("ImageInput");
const deleteTitle = document.getElementById("DeletePhotoTitle");
const deleteImage = document.getElementById("DeletePhotoImage");
const confirmDeletePictureBtn = document.getElementById("confirmDeletePictureBtn");
const editionPhotoModal = document.getElementById("EditionPhotomodal");
const deletePhotoModal = document.getElementById("DeletePhotomodal");
const addPictureBtn = document.querySelector("[data-bs-target='#EditionPhotomodal']");
const restaurantId = 1;
let selectedPictureId = null;

addPictureBtn?.addEventListener("click", resetPictureForm);
loadPictures();
pictureForm.addEventListener("submit", savePicture);
confirmDeletePictureBtn.addEventListener("click", deletePicture);
showAndHideElementsForRoles();

async function loadPictures(){
    try {
        const response = await fetch(apiUrl + `restaurants/${restaurantId}/pictures`);

        if(!response.ok){
            throw new Error("Impossible de charger la galerie.");
        }

        const data = await response.json();
        renderPictures(data.pictures || []);
    }
    catch(error) {
        renderPictures(getFallbackPictures());
    }
}

function renderPictures(pictures){
    if(pictures.length === 0){
        galerieImage.innerHTML = `<p class="text-center">Aucune photo n'est disponible pour le moment.</p>`;
        showAndHideElementsForRoles();
        return;
    }

    galerieImage.innerHTML = pictures.map((picture) => `
        <div class="col">
            <div class="image-card text-white">
                <img src="${sanitizeHtml(apiAssetUrl(picture.imageUrl))}" alt="${sanitizeHtml(picture.title)}" class="b-round w-100">
                <p class="titre-image">${sanitizeHtml(picture.title)}</p>
                <div class="action-image-buttons" data-show="admin">
                    <button type="button" class="btn btn-outline-light" data-edit-picture="${Number(picture.id)}" data-title="${sanitizeHtml(picture.title)}" data-bs-toggle="modal" data-bs-target="#EditionPhotomodal"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-outline-light" data-delete-picture="${Number(picture.id)}" data-title="${sanitizeHtml(picture.title)}" data-image="${sanitizeHtml(apiAssetUrl(picture.imageUrl))}" data-bs-toggle="modal" data-bs-target="#DeletePhotomodal"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        </div>
    `).join("");

    document.querySelectorAll("[data-edit-picture]").forEach((button) => {
        button.addEventListener("click", () => {
            pictureIdInput.value = button.dataset.editPicture;
            titleInput.value = button.dataset.title;
            imageInput.value = "";
        });
    });

    document.querySelectorAll("[data-delete-picture]").forEach((button) => {
        button.addEventListener("click", () => {
            selectedPictureId = button.dataset.deletePicture;
            deleteTitle.textContent = button.dataset.title;
            deleteImage.src = button.dataset.image;
        });
    });

    showAndHideElementsForRoles();
}

async function savePicture(event){
    event.preventDefault();

    if(getRole() !== "admin"){
        alert("Action réservée à l'administrateur.");
        return;
    }

    if(!pictureIdInput.value && !imageInput.files[0]){
        alert("Veuillez sélectionner une image.");
        return;
    }

    try {
        const pictureId = pictureIdInput.value;
        const requestOptions = pictureId ? {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ title: titleInput.value })
        } : {
            method: "POST",
            headers: new Headers({ "X-AUTH-TOKEN": window.getToken() }),
            body: buildPictureFormData()
        };

        const endpoint = apiUrl + `restaurants/${restaurantId}/pictures` + (pictureId ? `/${pictureId}` : "");
        const response = await fetch(endpoint, requestOptions);

        if(!response.ok){
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "L'enregistrement de la photo a échoué.");
        }

        hideBootstrapModal(editionPhotoModal);
        resetPictureForm();
        loadPictures();
    }
    catch(error) {
        alert(error.message);
    }
}

function buildPictureFormData(){
    const formData = new FormData();
    formData.append("title", titleInput.value);

    if(imageInput.files[0]){
        formData.append("imageFile", imageInput.files[0]);
    }

    return formData;
}

async function deletePicture(){
    if(!selectedPictureId || getRole() !== "admin"){
        return;
    }

    try {
        const response = await fetch(apiUrl + `restaurants/${restaurantId}/pictures/${selectedPictureId}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if(!response.ok){
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "La suppression de la photo a échoué.");
        }

        hideBootstrapModal(deletePhotoModal);
        selectedPictureId = null;
        loadPictures();
    }
    catch(error) {
        alert(error.message);
    }
}

function getFallbackPictures(){
    return [
        { id: 0, title: "Plat savoyard", imageUrl: "/images/plat1.jpg" },
        { id: 0, title: "Produits frais", imageUrl: "/images/produitsfrais.jpg" },
        { id: 0, title: "Dessert maison", imageUrl: "/images/dessert3.jpg" }
    ];
}

function resetPictureForm(){
    pictureForm.reset();
    pictureIdInput.value = "";
}

function hideBootstrapModal(modal){
    if(!modal || !window.bootstrap){
        return;
    }

    window.bootstrap.Modal.getInstance(modal)?.hide();
}
