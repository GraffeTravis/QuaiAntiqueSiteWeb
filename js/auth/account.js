const apiUrl = window.apiUrl;
const getAuthHeaders = window.getAuthHeaders;
const sanitizeHtml = window.sanitizeHtml;
const signout = window.signout;
const accountForm = document.querySelector("form");
const inputNom = document.getElementById("NomInput");
const inputPrenom = document.getElementById("PrenomInput");
const inputAllergy = document.getElementById("AllergieInput");
const inputGuestNumber = document.getElementById("NbConvivesInput");
const submitButton = accountForm.querySelector("button[type='submit']");
const deleteButton = accountForm.querySelector(".btn-danger");

loadAccount();

accountForm.addEventListener("submit", updateAccount);
deleteButton.addEventListener("click", deleteAccount);

async function loadAccount(){
    try {
        const response = await fetch(apiUrl + "account/me", {
            method: "GET",
            headers: getAuthHeaders()
        });

        if(!response.ok){
            throw new Error("Impossible de récupérer vos informations.");
        }

        const user = await response.json();
        inputNom.value = user.lastName || "";
        inputPrenom.value = user.firstName || "";
        inputAllergy.value = user.allergy || "";
        inputGuestNumber.value = user.guestNumber || 1;
    }
    catch(error) {
        alert(error.message);
    }
}

async function updateAccount(event){
    event.preventDefault();
    submitButton.disabled = true;

    try {
        const response = await fetch(apiUrl + "account/me", {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                firstName: inputPrenom.value,
                lastName: inputNom.value,
                allergy: inputAllergy.value,
                guestNumber: Number(inputGuestNumber.value)
            })
        });

        if(!response.ok){
            throw new Error("La modification du compte a échoué.");
        }

        alert("Vos informations ont été modifiées.");
    }
    catch(error) {
        alert(error.message);
    }
    finally {
        submitButton.disabled = false;
    }
}

async function deleteAccount(){
    if(!confirm("Supprimer définitivement votre compte ?")){
        return;
    }

    try {
        const response = await fetch(apiUrl + "account/me", {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if(!response.ok){
            throw new Error("La suppression du compte a échoué.");
        }

        signout();
    }
    catch(error) {
        alert(error.message);
    }
}
