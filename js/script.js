const tokenCookieName = "accesstoken";
const RoleCookieName = "role";
const signoutBtn = document.getElementById("signout-btn");
const localApiUrl = "http://127.0.0.1:8000/api/";
const productionApiUrl = "https://api.quaiantique.tech/api/";
const apiUrl = ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? localApiUrl
    : productionApiUrl;

if (signoutBtn) {
    signoutBtn.addEventListener("click", signout);
}

function getRole(){
    return normalizeRole(getCookie(RoleCookieName));
}

function normalizeRole(role){
    if(role === "ROLE_ADMIN"){
        return "admin";
    }

    if(role === "ROLE_USER"){
        return "client";
    }

    return role;
}

function signout(){
    eraseCookie(tokenCookieName);
    eraseCookie(RoleCookieName);
    window.location.reload();
}

function setToken(token){
    setCookie(tokenCookieName, token, 7);
}

function getToken(){
    return getCookie(tokenCookieName);
}

function setCookie(name,value,days){
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(const element of ca) {
        let c = element;
        while (c.startsWith(' ')) c = c.substring(1,c.length);
        if (c.startsWith(nameEQ)) return decodeURIComponent(c.substring(nameEQ.length,c.length));
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isConnected() {
    if(getToken() == null || getToken() == undefined) {
        return false;
    }
    else{
        return true;
    }
}

/*les types d'utilisateurs
disconnected
connected (admin ou client)
    -admin
    -cient
*/

function showAndHideElementsForRoles(){
    const userConnected = isConnected();
    const role = getRole();

    let allElementsToEdit = document.querySelectorAll('[data-show]');

    allElementsToEdit.forEach(element =>{
        element.classList.remove("d-none");

        switch(element.dataset.show){
            case 'disconnected': 
                if(userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'connected': 
                if(!userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'admin': 
                if(!userConnected || role != "admin"){
                    element.classList.add("d-none");
                }
                break;
            case 'client': 
                if(!userConnected || role != "client"){
                    element.classList.add("d-none");
                }
                break;
        }
    })
}

function sanitizeHtml(text){
    // Créez un élément HTML temporaire de type "div"
    const tempHtml = document.createElement('div');
    
    // Affectez le texte reçu en tant que contenu texte de l'élément "tempHtml"
    tempHtml.textContent = text;
    
    // Utilisez .innerHTML pour récupérer le contenu de "tempHtml"
    // Cela va "neutraliser" ou "échapper" tout code HTML potentiellement malveillant
    return tempHtml.innerHTML;
}

function getAuthHeaders(){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const token = getToken();
    if(token){
        myHeaders.append("X-AUTH-TOKEN", token);
    }

    return myHeaders;
}

function apiAssetUrl(path){
    if(!path){
        return "";
    }

    if(path.startsWith("http") || path.startsWith("data:")){
        return path;
    }

    if(path.startsWith("/images/")){
        return path;
    }

    return apiUrl.replace("/api/", "") + path;
}

function getInfosUser(){
    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(apiUrl+"account/me", requestOptions)
    .then(response =>{
        if(response.ok){
            return response.json();
        }
        else{
            console.log("Impossible de récupérer les informations utilisateur");
        }
    })
    .then(result => {
        return result;
    })
    .catch(error =>{
        console.error("erreur lors de la récupération des données utilisateur", error);
    });
}

window.apiUrl = apiUrl;
window.tokenCookieName = tokenCookieName;
window.RoleCookieName = RoleCookieName;
window.getRole = getRole;
window.signout = signout;
window.setToken = setToken;
window.getToken = getToken;
window.setCookie = setCookie;
window.getCookie = getCookie;
window.eraseCookie = eraseCookie;
window.isConnected = isConnected;
window.showAndHideElementsForRoles = showAndHideElementsForRoles;
window.sanitizeHtml = sanitizeHtml;
window.getAuthHeaders = getAuthHeaders;
window.apiAssetUrl = apiAssetUrl;
