import { loadRestaurant, getServiceRanges, formatServiceHours } from "./restaurant.js";

const serviceHours = document.querySelectorAll("[data-service-hours]");
const serviceHoursNote = document.getElementById("serviceHoursNote");

loadServiceHours();

async function loadServiceHours(){
    try {
        const ranges = getServiceRanges(await loadRestaurant());
        serviceHours.forEach((element) => {
            element.textContent = ranges.length ? formatServiceHours(ranges) : "Services à confirmer";
        });
    }
    catch(error) {
        serviceHoursNote.hidden = false;
    }
}
