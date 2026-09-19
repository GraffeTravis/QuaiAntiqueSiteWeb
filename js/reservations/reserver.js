import { loadRestaurant, getServiceRanges, getReservationSlots, isClosedOnMonday } from "../restaurant.js";

const apiUrl = window.apiUrl;
const getAuthHeaders = window.getAuthHeaders;
const sanitizeHtml = window.sanitizeHtml;
const reservationForm = document.getElementById("reservationForm");
const reservationMessage = document.getElementById("reservationMessage");
const availabilityMessage = document.getElementById("availabilityMessage");
const inputNomReservation = document.getElementById("NomInput");
const inputPrenomReservation = document.getElementById("PrenomInput");
const inputAllergyReservation = document.getElementById("AllergieInput");
const inputGuestReservation = document.getElementById("NbConvivesInput");
const inputDateReservation = document.getElementById("DateInput");
const selectHour = document.getElementById("selectHour");
const submitBookingButton = document.getElementById("bookingSubmitBtn");
const bookingId = new URLSearchParams(window.location.search).get("id");
const restaurantId = 1;
let availabilityRequest = 0;

loadReservationPage();

reservationForm.addEventListener("submit", saveBooking);
inputGuestReservation.addEventListener("change", checkAvailability);
inputDateReservation.addEventListener("change", checkAvailability);
selectHour.addEventListener("change", checkAvailability);

async function loadReservationPage(){
    submitBookingButton.disabled = true;
    selectHour.disabled = true;
    inputDateReservation.min = new Date().toISOString().split("T")[0];

    try {
        const ranges = getServiceRanges(await loadRestaurant());
        const slots = getReservationSlots(ranges);
        selectHour.innerHTML = slots.map((slot) => `<option value="${slot}">${slot}</option>`).join("");
        selectHour.disabled = slots.length === 0;
        if(slots.length === 0){
            throw new Error("Aucun service n'est disponible pour le moment.");
        }
        const accountResponse = await fetch(apiUrl + "account/me", {
            method: "GET",
            headers: getAuthHeaders()
        });

        if(accountResponse.ok){
            const user = await accountResponse.json();
            inputNomReservation.value = user.lastName || "";
            inputPrenomReservation.value = user.firstName || "";
            inputAllergyReservation.value = user.allergy || "";
            inputGuestReservation.value = user.guestNumber || 1;
        }

        if(bookingId){
            submitBookingButton.textContent = "Modifier la réservation";
            const bookingResponse = await fetch(apiUrl + "bookings/" + bookingId, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if(!bookingResponse.ok){
                throw new Error("Impossible de charger la réservation.");
            }

            const booking = await bookingResponse.json();
            inputAllergyReservation.value = booking.allergy || "";
            inputGuestReservation.value = booking.guestNumber || 1;
            inputDateReservation.value = booking.date;
            selectHour.value = booking.hour;
        }

        checkAvailability();
    }
    catch(error) {
        reservationMessage.innerHTML = `<p class="text-danger">${sanitizeHtml(error.message)}</p>`;
    }
}

async function checkAvailability(){
    const requestId = ++availabilityRequest;
    submitBookingButton.disabled = true;
    if(isClosedOnMonday(inputDateReservation.value)){
        availabilityMessage.innerHTML = `<p class="text-danger">Le restaurant est fermé le lundi. Choisissez un jour du mardi au dimanche.</p>`;
        return;
    }
    if(!inputDateReservation.value || !selectHour.value || !inputGuestReservation.value){
        availabilityMessage.innerHTML = "";
        return;
    }

    const params = new URLSearchParams({
        restaurantId,
        date: inputDateReservation.value,
        hour: selectHour.value,
        guestNumber: inputGuestReservation.value
    });

    if(bookingId){
        params.append("excludeBookingId", bookingId);
    }

    try {
        const response = await fetch(apiUrl + "bookings/availability?" + params.toString());

        if(!response.ok){
            throw new Error("Disponibilité impossible à vérifier.");
        }

        const availability = await response.json();
        if(requestId !== availabilityRequest){
            return;
        }

        if(availability.available){
            availabilityMessage.innerHTML = `<p class="text-success">Créneau disponible. Places restantes : ${Number(availability.remaining)}</p>`;
            submitBookingButton.disabled = false;
            return;
        }

        availabilityMessage.innerHTML = `<p class="text-danger">${sanitizeHtml(availability.message || "Créneau indisponible.")}</p>`;
        submitBookingButton.disabled = true;
    }
    catch(error) {
        if(requestId !== availabilityRequest){
            return;
        }
        availabilityMessage.innerHTML = `<p class="text-danger">${sanitizeHtml(error.message)}</p>`;
        submitBookingButton.disabled = true;
    }
}

async function saveBooking(event){
    event.preventDefault();
    submitBookingButton.disabled = true;

    const payload = {
        restaurantId,
        date: inputDateReservation.value,
        hour: selectHour.value,
        guestNumber: Number(inputGuestReservation.value),
        allergy: inputAllergyReservation.value
    };

    try {
        const response = await fetch(apiUrl + "bookings" + (bookingId ? "/" + bookingId : ""), {
            method: bookingId ? "PUT" : "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if(!response.ok){
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "La réservation a échoué.");
        }

        alert(bookingId ? "Réservation modifiée." : "Réservation créée.");
        window.location.replace("/allresa");
    }
    catch(error) {
        alert(error.message);
        submitBookingButton.disabled = false;
    }
}
