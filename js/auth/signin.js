const apiUrl = window.apiUrl;
const setToken = window.setToken;
const setCookie = window.setCookie;
const RoleCookieName = window.RoleCookieName;
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

fetch(apiUrl + "login", requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error("Identifiants incorrects, veuillez réessayer.");
        }

        return response.json();
    })
    .then(result => {
        setToken(result.apiToken);
        const role = result.roles.includes("ROLE_ADMIN") ? "admin" : "client";
        setCookie(RoleCookieName, role, 7);
        window.location.replace("/");
    })
    .catch(error => {
        alert(error.message);
    });
  }


