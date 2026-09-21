const apiUrl = window.apiUrl;
const getAuthHeaders = window.getAuthHeaders;
const passwordForm = document.querySelector("form");
const inputPassword = document.getElementById("PasswordInput");
const inputCurrentPassword = document.getElementById("CurrentPasswordInput");
const inputConfirmPassword = document.getElementById("ValidatePasswordInput");
const submitPasswordButton = passwordForm.querySelector("button[type='submit']");

passwordForm.addEventListener("submit", updatePassword);

async function updatePassword(event){
    event.preventDefault();

    if(inputPassword.value.length < 12 || new TextEncoder().encode(inputPassword.value).length > 72){
        alert("Utilisez au moins 12 caractères.");
        return;
    }

    if(inputPassword.value !== inputConfirmPassword.value){
        alert("Les mots de passe ne correspondent pas.");
        return;
    }

    submitPasswordButton.disabled = true;

    try {
        const response = await fetch(apiUrl + "account/password", {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                password: inputPassword.value,
                currentPassword: inputCurrentPassword.value
            })
        });

        if(!response.ok){
            throw new Error("Le changement de mot de passe a échoué.");
        }

        window.clearSession();
        alert("Votre mot de passe a été modifié. Veuillez vous reconnecter.");
        window.location.replace("/signin");
    }
    catch(error) {
        alert(error.message);
    }
    finally {
        submitPasswordButton.disabled = false;
    }
}
