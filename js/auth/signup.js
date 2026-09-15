const apiUrl = window.apiUrl;
const getAuthHeaders = window.getAuthHeaders;
const inputNom = document.getElementById("NomInput");
const inputPrenom = document.getElementById("PrenomInput");
const inputGuestNumber = document.getElementById("NbConvivesInput");
const inputMail = document.getElementById("MailInput");
const inputPwd = document.getElementById("PasswordInput");
const inputConfirmPwd = document.getElementById("ValidatePasswordInput");
const btnValidation = document.getElementById("btn-validation-inscription");
const formInscription = document.getElementById("formulaireInscription");

inputNom.addEventListener("keyup", validateForm);
inputPrenom.addEventListener("keyup", validateForm);
inputGuestNumber.addEventListener("keyup", validateForm);
inputGuestNumber.addEventListener("change", validateForm);
inputMail.addEventListener("keyup", validateForm);
inputPwd.addEventListener("keyup", validateForm);
inputConfirmPwd.addEventListener("keyup", validateForm);
btnValidation.addEventListener("click", InscrireUtilisateur);
btnValidation.disabled = true;

function validateForm() {
    const nomOk = validateRequired(inputNom);
    const prenomOk = validateRequired(inputPrenom);
    const guestNumberOk = validatePositiveNumber(inputGuestNumber);
    const mailOk = validateMail(inputMail);
    const passwordOk = validatePassword(inputPwd);
    const validPasswordOk = validateConfirmationPassword(inputPwd, inputConfirmPwd);

    btnValidation.disabled = !(nomOk && prenomOk && guestNumberOk && mailOk && passwordOk && validPasswordOk);
}

function validateConfirmationPassword(inputPwd, inputConfirmPwd){
    if(inputPwd.value === inputConfirmPwd.value && inputConfirmPwd.value !== ""){
        inputConfirmPwd.classList.add("is-valid");
        inputConfirmPwd.classList.remove("is-invalid");
        return true;
    }

    inputConfirmPwd.classList.add("is-invalid");
    inputConfirmPwd.classList.remove("is-valid");
    return false;
}

function validatePassword(input){
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if(input.value.match(passwordRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    }

    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
}

function validateMail(input){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(input.value.match(emailRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    }

    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
}

function validateRequired(input) {
    if(input.value.trim() !== "") {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    }

    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    return false;
}

function validatePositiveNumber(input) {
    const value = Number(input.value);

    if(Number.isInteger(value) && value > 0) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    }

    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
}

function InscrireUtilisateur(){
    let dataForm = new FormData(formInscription);

    let requestOptions = {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            firstName: dataForm.get("Prenom"),
            lastName: dataForm.get("Nom"),
            guestNumber: Number(dataForm.get("NbConvives")),
            allergy: dataForm.get("Allergies"),
            email: dataForm.get("Mail"),
            password: dataForm.get("Mdp")
        }),
        redirect: "follow"
    };

    fetch(apiUrl + "registration", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de l'inscription, veuillez vérifier vos informations.");
            }

            return response.json();
        })
        .then(() => {
            alert(`Inscription réussie ! Bienvenue ${dataForm.get("Prenom")}, vous pouvez désormais vous connecter.`);
            window.location.replace("/signin");
        })
        .catch(error => alert(error.message));
}
