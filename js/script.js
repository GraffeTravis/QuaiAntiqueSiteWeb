const tokenCookieName = "accesstoken";
const RoleCookieName = "role";
const signoutBtn = document.getElementById("signout-btn");
const localApiUrl = "http://127.0.0.1:8000/api/";
const productionApiUrl = "https://api.quaiantique.tech/api/";
const stagingApiUrl = "https://quai-antique-api-staging-c0e2bc904c02.herokuapp.com/api/";
const configuredApiUrl = window.QUAI_ANTIQUE_API_URL;
const apiUrl = configuredApiUrl || (["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? localApiUrl
    : ["quaiantique.tech", "www.quaiantique.tech"].includes(window.location.hostname)
        ? productionApiUrl
        : window.location.hostname.endsWith(".vercel.app")
            ? stagingApiUrl
            : "/__api_not_configured__/");
const useHttpOnlySession = !["localhost", "127.0.0.1"].includes(window.location.hostname)
    && apiUrl.startsWith("https://");

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

async function signout(){
    try {
        await fetch(apiUrl + "logout", {
            method: "POST",
            headers: getAuthHeaders(),
            credentials: useHttpOnlySession ? "include" : "omit"
        });
    } catch {
        // Local sign-out must remain possible while the API is unavailable.
    } finally {
        clearSession();
        window.location.replace("/signin");
    }
}

function clearSession(){
    eraseCookie(tokenCookieName);
    eraseCookie(RoleCookieName);
    eraseCookie("sessionExpiresAt");
}

function setToken(token, expiresAt){
    const days = Math.max(0, (Date.parse(expiresAt) - Date.now()) / 86400000);
    if(!Number.isFinite(days) || days <= 0){
        throw new Error("La session reçue est invalide.");
    }
    setCookie(tokenCookieName, token, days);
    setCookie("sessionExpiresAt", expiresAt, days);
}

function setSessionExpiry(expiresAt){
    const days = Math.max(0, (Date.parse(expiresAt) - Date.now()) / 86400000);
    if(!Number.isFinite(days) || days <= 0){
        throw new Error("La session reçue est invalide.");
    }
    setCookie("sessionExpiresAt", expiresAt, days);
}

function getToken(){
    const expiry = getCookie("sessionExpiresAt");
    if(expiry && (!Number.isFinite(Date.parse(expiry)) || Date.parse(expiry) <= Date.now())){
        clearSession();
        return null;
    }
    return getCookie(tokenCookieName) || (expiry ? "http-only-session" : null);
}

function setCookie(name,value,days){
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/; SameSite=Lax"
        + (window.location.protocol === "https:" ? "; Secure" : "");
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
    // Also escape quotes: callers use both text nodes and quoted HTML attributes.
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(text ?? "").replace(/[&<>"']/g, character => entities[character]);
}

function getAuthHeaders(){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const token = getToken();
    if(token && token !== "http-only-session"){
        myHeaders.append("X-AUTH-TOKEN", token);
    }
    if(useHttpOnlySession){
        myHeaders.append("X-AUTH-SESSION", "cookie");
    }

    return myHeaders;
}

async function apiFetch(input, options = {}){
    const response = await fetch(input, {
        ...options,
        credentials: useHttpOnlySession && isConnected() ? "include" : "omit"
    });
    const url = new URL(input, window.location.origin);
    const isCredentialEndpoint = /\/api\/(login|registration)\/?$/.test(url.pathname);

    if(response.status === 401 && !isCredentialEndpoint){
        clearSession();
        if(!["/signin", "/signup"].includes(window.location.pathname)){
            const redirect = window.location.pathname + window.location.search + window.location.hash;
            window.location.replace(`/signin?redirect=${encodeURIComponent(redirect)}`);
        }
    }

    return response;
}

function apiAssetUrl(path){
    if(!path){
        return "";
    }

    if(typeof path !== "string"){
        return "";
    }
    if(path.startsWith("data:")){
        return /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(path) ? path : "";
    }

    if(path.startsWith("/images/")){
        return path;
    }

    try {
        const base = new URL(apiUrl, window.location.origin);
        const image = new URL(path, base.origin);
        return ["http:", "https:"].includes(image.protocol) && image.origin === base.origin ? image.href : "";
    } catch {
        return "";
    }
}

function getInfosUser(){
    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    apiFetch(apiUrl+"account/me", requestOptions)
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
window.useHttpOnlySession = useHttpOnlySession;
window.tokenCookieName = tokenCookieName;
window.RoleCookieName = RoleCookieName;
window.getRole = getRole;
window.signout = signout;
window.clearSession = clearSession;
window.setToken = setToken;
window.setSessionExpiry = setSessionExpiry;
window.getToken = getToken;
window.setCookie = setCookie;
window.getCookie = getCookie;
window.eraseCookie = eraseCookie;
window.isConnected = isConnected;
window.showAndHideElementsForRoles = showAndHideElementsForRoles;
window.sanitizeHtml = sanitizeHtml;
window.getAuthHeaders = getAuthHeaders;
window.apiFetch = apiFetch;
window.apiAssetUrl = apiAssetUrl;
