const inputMail = document.getElementById("MailInput");
const inputPassword = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
    //Ici, il faudra appeler l'API pour vérifier les credentials en BDD;

    if(inputMail.value == "test@gmail.com" && inputPassword.value == "123") {
        alert("Vous êtes désormais connecté(test)")

        //Il faudra récupérer le vrai token
        const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
        setToken(token)

        window.location.replace("/");
    }
    else{
        inputMail.classList.add("is-invalid");
        inputPassword.classList.add("is-invalid");
    }
}