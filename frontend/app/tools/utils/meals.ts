import { endpoints } from "@/app/config/endpoints"

export const getMealsForCook = async(jwt: string, dayOfWeek: string) => {
    try {
        const response = await fetch(`${endpoints.meals.getMealsDayOfWeek}?day_of_week=${dayOfWeek}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });
        
        if (response.ok) {
            const json = await response.json();
            return { ok: true, response: json }
        } else {
            return { ok: false, error: `${response.status} ${response.statusText}`}
        }
    } catch (error) {
        console.log(error);
        return { ok: false, error: "Неизвестная ошибка"}
    }
}