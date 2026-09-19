export async function loadRestaurant(){
    const response = await fetch(window.apiUrl + "restaurants/1");
    if(!response.ok){
        throw new Error("Les horaires ne sont pas disponibles pour le moment.");
    }
    return response.json();
}

export function getServiceRanges(restaurant){
    const ranges = [restaurant.amOpeningTime, restaurant.pmOpeningTime];
    if(ranges.some((range) => !Array.isArray(range))){
        throw new Error("Les horaires du restaurant doivent être confirmés.");
    }
    return ranges.filter((range) => range.length > 0).map((range) => {
        if(range.length !== 2 || !range.every(isValidHour) || range[0] >= range[1]){
            throw new Error("Les horaires du restaurant doivent être confirmés.");
        }
        return range;
    });
}

export function formatServiceHours(ranges){
    return ranges.map(([start, end]) => `${start.replace(":", "h")}–${end.replace(":", "h")}`).join(" · ");
}

export function getReservationSlots(ranges){
    const slots = new Set();
    for(const [start, end] of ranges){
        const first = toMinutes(start);
        const last = toMinutes(end);
        for(let minutes = Math.ceil(first / 15) * 15; minutes <= last; minutes += 15){
            slots.add(`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`);
        }
    }
    return [...slots].sort();
}

export function isClosedOnMonday(date){
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(date + "T12:00:00Z").getUTCDay() === 1;
}

function isValidHour(hour){
    return typeof hour === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(hour);
}

function toMinutes(hour){
    const [hours, minutes] = hour.split(":").map(Number);
    return hours * 60 + minutes;
}
