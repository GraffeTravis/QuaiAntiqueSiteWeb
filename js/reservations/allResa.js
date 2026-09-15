const apiUrl = window.apiUrl;
const getAuthHeaders = window.getAuthHeaders;
const getRole = window.getRole;
const sanitizeHtml = window.sanitizeHtml;
const bookingMessage = document.getElementById("bookingMessage");
const bookingsList = document.getElementById("bookingsList");

loadBookings();

async function loadBookings(){
    try {
        const endpoint = getRole() === "admin" ? "bookings/admin" : "bookings/";
        const response = await fetch(apiUrl + endpoint, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if(!response.ok){
            throw new Error("Impossible de récupérer les réservations.");
        }

        const data = await response.json();
        const bookings = Array.isArray(data) ? data : data.bookings || [];

        renderBookings(bookings);
    }
    catch(error) {
        bookingMessage.innerHTML = `<p class="text-danger">${sanitizeHtml(error.message)}</p>`;
        bookingsList.innerHTML = "";
    }
}

function renderBookings(bookings){
    if(bookings.length === 0){
        bookingsList.innerHTML = `<p class="text-center">Aucune réservation pour le moment.</p>`;
        return;
    }

    bookingsList.innerHTML = bookings.map((booking) => `
        <article class="border border-primary b-rounded p-3">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
                <div>
                    <p class="mb-1 fw-bold">${sanitizeHtml(formatDate(booking.date))} à ${sanitizeHtml(booking.hour)}</p>
                    <p class="mb-1">${Number(booking.guestNumber)} convive(s)</p>
                    <p class="mb-0">${sanitizeHtml(booking.allergy || "Pas d'allergie renseignée")}</p>
                </div>
                <div class="d-flex gap-2 align-items-start justify-content-md-end">
                    <a class="btn btn-primary btn-sm" href="/reserver?id=${Number(booking.id)}">Modifier</a>
                    <button type="button" class="btn btn-danger btn-sm" data-delete-booking="${Number(booking.id)}">Supprimer</button>
                </div>
            </div>
        </article>
    `).join("");

    document.querySelectorAll("[data-delete-booking]").forEach((button) => {
        button.addEventListener("click", () => deleteBooking(button.dataset.deleteBooking));
    });
}

async function deleteBooking(id){
    if(!confirm("Supprimer cette réservation ?")){
        return;
    }

    try {
        const response = await fetch(apiUrl + "bookings/" + id, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if(!response.ok){
            throw new Error("La suppression a échoué.");
        }

        loadBookings();
    }
    catch(error) {
        alert(error.message);
    }
}

function formatDate(date){
    return new Date(date + "T00:00:00").toLocaleDateString("fr-FR");
}
