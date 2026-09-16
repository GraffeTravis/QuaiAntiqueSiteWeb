const apiUrl = window.apiUrl;
const getAuthHeaders = window.getAuthHeaders;
const sanitizeHtml = window.sanitizeHtml;
const adminMessage = document.getElementById("adminMessage");
const restaurantId = 1;

const restaurantForm = document.getElementById("restaurantForm");
const restaurantName = document.getElementById("restaurantName");
const restaurantDescription = document.getElementById("restaurantDescription");
const restaurantMaxGuest = document.getElementById("restaurantMaxGuest");
const amOpeningStart = document.getElementById("amOpeningStart");
const amOpeningEnd = document.getElementById("amOpeningEnd");
const pmOpeningStart = document.getElementById("pmOpeningStart");
const pmOpeningEnd = document.getElementById("pmOpeningEnd");

const categoryForm = document.getElementById("categoryForm");
const categoryId = document.getElementById("categoryId");
const categoryTitle = document.getElementById("categoryTitle");
const categoriesList = document.getElementById("categoriesList");
const resetCategoryForm = document.getElementById("resetCategoryForm");

const foodForm = document.getElementById("foodForm");
const foodId = document.getElementById("foodId");
const foodTitle = document.getElementById("foodTitle");
const foodDescription = document.getElementById("foodDescription");
const foodPrice = document.getElementById("foodPrice");
const foodCategories = document.getElementById("foodCategories");
const foodsAdminList = document.getElementById("foodsAdminList");
const resetFoodForm = document.getElementById("resetFoodForm");

const menuForm = document.getElementById("menuForm");
const menuId = document.getElementById("menuId");
const menuTitle = document.getElementById("menuTitle");
const menuDescription = document.getElementById("menuDescription");
const menuPrice = document.getElementById("menuPrice");
const menuCategories = document.getElementById("menuCategories");
const menusAdminList = document.getElementById("menusAdminList");
const resetMenuForm = document.getElementById("resetMenuForm");

let categories = [];
let foods = [];
let menus = [];

restaurantForm.addEventListener("submit", saveRestaurant);
categoryForm.addEventListener("submit", saveCategory);
foodForm.addEventListener("submit", saveFood);
menuForm.addEventListener("submit", saveMenu);
resetCategoryForm.addEventListener("click", resetCategory);
resetFoodForm.addEventListener("click", resetFood);
resetMenuForm.addEventListener("click", resetMenu);

setupAdminTabs();
loadAdmin();

function setupAdminTabs(){
    const tabButtons = Array.from(document.querySelectorAll("#adminTabs [data-bs-target]"));
    const tabPanels = Array.from(document.querySelectorAll("#adminTabsContent .tab-pane"));

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetPanel = document.querySelector(button.dataset.bsTarget);

            if(!targetPanel){
                return;
            }

            tabButtons.forEach((tabButton) => {
                tabButton.classList.remove("active");
                tabButton.setAttribute("aria-selected", "false");
            });

            tabPanels.forEach((panel) => {
                panel.classList.remove("show", "active");
            });

            button.classList.add("active");
            button.setAttribute("aria-selected", "true");
            targetPanel.classList.add("show", "active");
        });
    });
}

async function loadAdmin(){
    try {
        await Promise.all([
            loadRestaurant(),
            loadCategories(),
            loadFoods(),
            loadMenus()
        ]);
    }
    catch(error) {
        showMessage(error.message, "danger");
    }
}

async function loadRestaurant(){
    const restaurant = await requestJson(`restaurants/${restaurantId}`);
    restaurantName.value = restaurant.name || "";
    restaurantDescription.value = restaurant.description || "";
    restaurantMaxGuest.value = restaurant.maxGuest || 1;
    amOpeningStart.value = restaurant.amOpeningTime?.[0] || "12:00";
    amOpeningEnd.value = restaurant.amOpeningTime?.[1] || "14:00";
    pmOpeningStart.value = restaurant.pmOpeningTime?.[0] || "19:00";
    pmOpeningEnd.value = restaurant.pmOpeningTime?.[1] || "21:00";
}

async function loadCategories(){
    const data = await requestJson("categories");
    categories = data.categories || [];
    renderCategories();
    renderCategoryOptions(foodCategories, getSelectedValues(foodCategories));
    renderCategoryOptions(menuCategories, getSelectedValues(menuCategories));
}

async function loadFoods(){
    const data = await requestJson("foods");
    foods = data.foods || [];
    renderFoods();
}

async function loadMenus(){
    const data = await requestJson("menus");
    menus = data.menus || [];
    renderMenus();
}

async function saveRestaurant(event){
    event.preventDefault();

    await submitJson(`restaurants/${restaurantId}`, "PUT", {
        name: restaurantName.value,
        description: restaurantDescription.value,
        maxGuest: Number(restaurantMaxGuest.value),
        amOpeningTime: [amOpeningStart.value, amOpeningEnd.value],
        pmOpeningTime: [pmOpeningStart.value, pmOpeningEnd.value]
    });

    showMessage("Informations du restaurant enregistrées.", "success");
}

async function saveCategory(event){
    event.preventDefault();

    const id = categoryId.value;
    await submitJson("categories" + (id ? `/${id}` : ""), id ? "PUT" : "POST", {
        title: categoryTitle.value
    });

    resetCategory();
    await loadCategories();
    showMessage("Catégorie enregistrée.", "success");
}

async function saveFood(event){
    event.preventDefault();

    const id = foodId.value;
    await submitJson("foods" + (id ? `/${id}` : ""), id ? "PUT" : "POST", {
        title: foodTitle.value,
        description: foodDescription.value,
        price: Number(foodPrice.value),
        categoryIds: getSelectedValues(foodCategories)
    });

    resetFood();
    await loadFoods();
    showMessage("Plat enregistré.", "success");
}

async function saveMenu(event){
    event.preventDefault();

    const id = menuId.value;
    await submitJson("menus" + (id ? `/${id}` : ""), id ? "PUT" : "POST", {
        title: menuTitle.value,
        description: menuDescription.value,
        price: Number(menuPrice.value),
        restaurantId,
        categoryIds: getSelectedValues(menuCategories)
    });

    resetMenu();
    await loadMenus();
    showMessage("Menu enregistré.", "success");
}

function renderCategories(){
    if(categories.length === 0){
        categoriesList.innerHTML = `<p>Aucune catégorie.</p>`;
        return;
    }

    categoriesList.innerHTML = categories.map((category) => `
        <article class="border rounded p-3 d-flex justify-content-between align-items-center gap-2">
            <strong>${sanitizeHtml(category.title)}</strong>
            <div class="d-flex gap-2">
                <button type="button" class="btn btn-sm btn-primary" data-edit-category="${Number(category.id)}">Modifier</button>
                <button type="button" class="btn btn-sm btn-danger" data-delete-category="${Number(category.id)}">Supprimer</button>
            </div>
        </article>
    `).join("");

    bindListActions("category");
}

function renderFoods(){
    if(foods.length === 0){
        foodsAdminList.innerHTML = `<p>Aucun plat.</p>`;
        return;
    }

    foodsAdminList.innerHTML = foods.map((food) => `
        <article class="border rounded p-3">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
                <div>
                    <strong>${sanitizeHtml(food.title)}</strong>
                    <p class="mb-1">${sanitizeHtml(food.description)}</p>
                    <p class="mb-0">${Number(food.price).toFixed(2)} €</p>
                </div>
                <div class="d-flex gap-2 align-items-start">
                    <button type="button" class="btn btn-sm btn-primary" data-edit-food="${Number(food.id)}">Modifier</button>
                    <button type="button" class="btn btn-sm btn-danger" data-delete-food="${Number(food.id)}">Supprimer</button>
                </div>
            </div>
        </article>
    `).join("");

    bindListActions("food");
}

function renderMenus(){
    if(menus.length === 0){
        menusAdminList.innerHTML = `<p>Aucun menu.</p>`;
        return;
    }

    menusAdminList.innerHTML = menus.map((menu) => `
        <article class="border rounded p-3">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
                <div>
                    <strong>${sanitizeHtml(menu.title)}</strong>
                    <p class="mb-1">${sanitizeHtml(menu.description)}</p>
                    <p class="mb-0">${Number(menu.price).toFixed(2)} €</p>
                </div>
                <div class="d-flex gap-2 align-items-start">
                    <button type="button" class="btn btn-sm btn-primary" data-edit-menu="${Number(menu.id)}">Modifier</button>
                    <button type="button" class="btn btn-sm btn-danger" data-delete-menu="${Number(menu.id)}">Supprimer</button>
                </div>
            </div>
        </article>
    `).join("");

    bindListActions("menu");
}

function bindListActions(type){
    document.querySelectorAll(`[data-edit-${type}]`).forEach((button) => {
        button.addEventListener("click", () => editItem(type, Number(button.dataset[`edit${capitalize(type)}`])));
    });

    document.querySelectorAll(`[data-delete-${type}]`).forEach((button) => {
        button.addEventListener("click", () => deleteItem(type, Number(button.dataset[`delete${capitalize(type)}`])));
    });
}

function editItem(type, id){
    if(type === "category"){
        const category = categories.find((item) => item.id === id);
        categoryId.value = category.id;
        categoryTitle.value = category.title;
        return;
    }

    if(type === "food"){
        const food = foods.find((item) => item.id === id);
        foodId.value = food.id;
        foodTitle.value = food.title;
        foodDescription.value = food.description;
        foodPrice.value = food.price;
        renderCategoryOptions(foodCategories, food.categories.map((category) => category.id));
        return;
    }

    const menu = menus.find((item) => item.id === id);
    menuId.value = menu.id;
    menuTitle.value = menu.title;
    menuDescription.value = menu.description;
    menuPrice.value = menu.price;
    renderCategoryOptions(menuCategories, menu.categories.map((category) => category.id));
}

async function deleteItem(type, id){
    if(!confirm("Supprimer cet élément ?")){
        return;
    }

    const endpointByType = {
        category: "categories",
        food: "foods",
        menu: "menus"
    };

    await requestJson(`${endpointByType[type]}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    if(type === "category"){
        await Promise.all([loadCategories(), loadFoods(), loadMenus()]);
    }
    else if(type === "food"){
        await loadFoods();
    }
    else {
        await loadMenus();
    }

    showMessage("Élément supprimé.", "success");
}

function renderCategoryOptions(select, selectedIds = []){
    select.innerHTML = categories.map((category) => `
        <option value="${Number(category.id)}" ${selectedIds.includes(category.id) ? "selected" : ""}>${sanitizeHtml(category.title)}</option>
    `).join("");
}

function getSelectedValues(select){
    return Array.from(select.selectedOptions).map((option) => Number(option.value));
}

function resetCategory(){
    categoryForm.reset();
    categoryId.value = "";
}

function resetFood(){
    foodForm.reset();
    foodId.value = "";
    renderCategoryOptions(foodCategories);
}

function resetMenu(){
    menuForm.reset();
    menuId.value = "";
    renderCategoryOptions(menuCategories);
}

async function submitJson(endpoint, method, body){
    return requestJson(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
    });
}

async function requestJson(endpoint, options = {}){
    const response = await fetch(apiUrl + endpoint, options);

    if(response.status === 204){
        return null;
    }

    const data = await response.json().catch(() => null);

    if(!response.ok){
        throw new Error(data?.message || "Une erreur est survenue.");
    }

    return data;
}

function showMessage(message, type){
    adminMessage.innerHTML = `<div class="alert alert-${type}" role="alert">${sanitizeHtml(message)}</div>`;
}

function capitalize(value){
    return value.charAt(0).toUpperCase() + value.slice(1);
}
