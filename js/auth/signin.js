const inputMail = document.getElementById("MailInput");
const inputPassword = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");
const signinForm = document.getElementById("signinForm");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
    let dataForm = new FormData(signinForm);
    
    let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

let raw = JSON.stringify({
  "username": dataForm.get("Mail"),
  "password": dataForm.get("Mdp")
});

let requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(apiUrl+"login", requestOptions)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    else {
        alert("Erreur lors de l'inscription, veuillez réessayer.");
    }
  })
  .then(result => {
        const token = result.apiToken;
        setToken(token)

        setCookie(RoleCookieName, result.roles[0], 7);

        window.location.replace("/");
  })
  .catch(error => console.log('error', error));
}

    if(inputMail.value == "test@gmail.com" && inputPassword.value == "123") {
        alert("Vous êtes désormais connecté(test)")

        //Il faudra récupérer le vrai token
        const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
        setToken(token)

        setCookie(RoleCookieName, "admin", 7);

        window.location.replace("/");
    }
    else{
        inputMail.classList.add("is-invalid");
        inputPassword.classList.add("is-invalid");
    }
