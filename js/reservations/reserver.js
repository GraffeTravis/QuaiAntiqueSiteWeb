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

loadReservationPage();

reservationForm.addEventListener("submit", saveBooking);
inputGuestReservation.addEventListener("change", checkAvailability);
inputDateReservation.addEventListener("change", checkAvailability);
selectHour.addEventListener("change", checkAvailability);

async function loadReservationPage(){
    fillHourOptions();
    inputDateReservation.min = new Date().toISOString().split("T")[0];

    try {
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

function fillHourOptions(){
    const slots = [];
    addSlots(slots, "12:00", "14:00");
    addSlots(slots, "19:00", "21:00");

    selectHour.innerHTML = slots.map((slot) => `<option value="${slot}">${slot}</option>`).join("");
}

function addSlots(slots, start, end){
    const current = new Date("2026-01-01T" + start + ":00");
    const last = new Date("2026-01-01T" + end + ":00");

    while(current <= last){
        slots.push(current.toTimeString().slice(0, 5));
        current.setMinutes(current.getMinutes() + 15);
    }
}

async function checkAvailability(){
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

        if(availability.available){
            availabilityMessage.innerHTML = `<p class="text-success">Créneau disponible. Places restantes : ${Number(availability.remaining)}</p>`;
            submitBookingButton.disabled = false;
            return;
        }

        availabilityMessage.innerHTML = `<p class="text-danger">${sanitizeHtml(availability.message || "Créneau indisponible.")}</p>`;
        submitBookingButton.disabled = true;
    }
    catch(error) {
        availabilityMessage.innerHTML = `<p class="text-danger">${sanitizeHtml(error.message)}</p>`;
        submitBookingButton.disabled = false;
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
