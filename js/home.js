const homeGallery = document.getElementById("homeGallery");
const homeMenus = document.getElementById("homeMenus");

loadHomeGallery();
loadHomeMenus();

async function loadHomeMenus(){
    try {
        const response = await fetch(window.apiUrl + "menus");
        if(!response.ok){
            throw new Error("Menus indisponibles");
        }

        const data = await response.json();
        const menus = (data.menus || []).slice(0, 2);
        if(menus.length === 0){
            homeMenus.innerHTML = `<p>Le chef prépare les prochains menus. Retrouvez également les plats à la carte.</p><a class="identity-link" href="/lacarte">Voir la carte</a>`;
            return;
        }

        const priceFormat = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
        homeMenus.innerHTML = menus.map((menu) => `
            <article class="home-menu-item">
                <div class="home-menu-title">
                    <h3>${window.sanitizeHtml(menu.title)}</h3>
                    <p>${window.sanitizeHtml(priceFormat.format(Number(menu.price)))}</p>
                </div>
                <p>${window.sanitizeHtml(menu.description)}</p>
                <a class="identity-link" href="/menu">Découvrir ce menu <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
            </article>
        `).join("");
    }
    catch(error) {
        homeMenus.innerHTML = `<p>Les menus ne sont pas disponibles pour le moment. Revenez dans quelques instants.</p><a class="identity-link" href="/menu">Consulter les menus</a>`;
    }
    finally {
        homeMenus.setAttribute("aria-busy", "false");
    }
}

async function loadHomeGallery(){
    try {
        const response = await fetch(window.apiUrl + "restaurants/1/pictures", { cache: "no-store" });
        if(!response.ok){
            throw new Error("Galerie indisponible");
        }

        const data = await response.json();
        if(!Array.isArray(data.pictures)){
            throw new Error("Réponse de galerie invalide");
        }
        renderHomeGallery(data.pictures.slice(0, 3));
    }
    catch(error) {
        homeGallery.innerHTML = `<p>La galerie est momentanément indisponible. Réessayez dans quelques instants.</p>`;
    }
    finally {
        homeGallery.setAttribute("aria-busy", "false");
    }
}

function renderHomeGallery(pictures){
    if(pictures.length === 0){
        homeGallery.innerHTML = `<p>Les photos de la galerie arrivent bientôt.</p>`;
        return;
    }

    homeGallery.innerHTML = pictures.map((picture) => `
        <a class="home-gallery-item" href="/galerie" aria-label="Voir la galerie : ${window.sanitizeHtml(picture.title)}">
            <img src="${window.sanitizeHtml(window.apiAssetUrl(picture.imageUrl))}" alt="${window.sanitizeHtml(picture.title)}" loading="lazy">
            <span>${window.sanitizeHtml(picture.title)}</span>
        </a>
    `).join("");
}
