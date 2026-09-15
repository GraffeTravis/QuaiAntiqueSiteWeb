const apiUrl = window.apiUrl;
const sanitizeHtml = window.sanitizeHtml;
const foodsList = document.getElementById("foodsList");
const menusList = document.getElementById("menusList");

loadCarte();

async function loadCarte(){
    try {
        const [foodsResponse, menusResponse] = await Promise.all([
            fetch(apiUrl + "foods"),
            fetch(apiUrl + "menus")
        ]);

        if(!foodsResponse.ok || !menusResponse.ok){
            throw new Error("Impossible de charger la carte pour le moment.");
        }

        const foodsData = await foodsResponse.json();
        const menusData = await menusResponse.json();

        renderFoods(foodsData.foods || []);
        renderMenus(menusData.menus || []);
    }
    catch(error) {
        foodsList.innerHTML = `<p class="text-center text-danger">${sanitizeHtml(error.message)}</p>`;
        menusList.innerHTML = "";
    }
}

function renderFoods(foods){
    if(foods.length === 0){
        foodsList.innerHTML = `<p class="text-center">Aucun plat n'est disponible pour le moment.</p>`;
        return;
    }

    foodsList.innerHTML = foods.map((food) => `
        <article class="col">
            <div class="border border-primary b-rounded h-100 p-3">
                <h3 class="h5 text-primary">${sanitizeHtml(food.title)}</h3>
                <p>${sanitizeHtml(food.description)}</p>
                <p class="fw-bold mb-0">${Number(food.price).toFixed(2)} €</p>
            </div>
        </article>
    `).join("");
}

function renderMenus(menus){
    if(menus.length === 0){
        menusList.innerHTML = `<p class="text-center">Aucun menu n'est disponible pour le moment.</p>`;
        return;
    }

    menusList.innerHTML = menus.map((menu) => `
        <article class="border border-primary b-rounded p-3">
            <h3 class="h5 text-primary">${sanitizeHtml(menu.title)}</h3>
            <p>${sanitizeHtml(menu.description)}</p>
            <p class="fw-bold mb-0">${Number(menu.price).toFixed(2)} €</p>
        </article>
    `).join("");
}
