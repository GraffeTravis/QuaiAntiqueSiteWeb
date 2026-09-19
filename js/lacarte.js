const apiUrl = window.apiUrl;
const sanitizeHtml = window.sanitizeHtml;
const foodsList = document.getElementById("foodsList");

loadFoods();

async function loadFoods(){
    try {
        const response = await fetch(apiUrl + "foods");

        if(!response.ok){
            throw new Error("Impossible de charger la carte pour le moment.");
        }

        const data = await response.json();

        renderFoods(data.foods || []);
    }
    catch(error) {
        foodsList.innerHTML = `<p class="text-center text-danger">${sanitizeHtml(error.message)}</p>`;
    }
}

function renderFoods(foods){
    if(foods.length === 0){
        foodsList.innerHTML = `<p class="text-center">Aucun plat n'est disponible pour le moment.</p>`;
        return;
    }

    foodsList.innerHTML = foods.map((food) => `
        <article class="col">
            <div class="carte-item h-100">
                <h3 class="h5 text-primary">${sanitizeHtml(food.title)}</h3>
                <p>${sanitizeHtml(food.description)}</p>
                <p class="carte-price">${Number(food.price).toFixed(2)} €</p>
            </div>
        </article>
    `).join("");
}
