const apiUrl = window.apiUrl;
const sanitizeHtml = window.sanitizeHtml;
const menusList = document.getElementById("menusList");

loadMenus();

async function loadMenus(){
    try {
        const response = await fetch(apiUrl + "menus");

        if(!response.ok){
            throw new Error("Impossible de charger les menus pour le moment.");
        }

        const data = await response.json();
        renderMenus(data.menus || []);
    }
    catch(error) {
        menusList.innerHTML = `<p class="text-center text-danger">${sanitizeHtml(error.message)}</p>`;
    }
}

function renderMenus(menus){
    if(menus.length === 0){
        menusList.innerHTML = `<p class="text-center">Aucun menu n'est disponible pour le moment.</p>`;
        return;
    }

    menusList.innerHTML = menus.map((menu) => `
        <article class="col">
            <div class="carte-item h-100">
                <h3 class="h5 text-primary">${sanitizeHtml(menu.title)}</h3>
                <p>${sanitizeHtml(menu.description)}</p>
                <p class="carte-price">${Number(menu.price).toFixed(2)} €</p>
            </div>
        </article>
    `).join("");
}
