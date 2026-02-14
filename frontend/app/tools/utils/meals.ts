import { endpoints } from "@/app/config/endpoints"
import { getAccessToken } from "./auth";
import { IMeal } from "@/app/components/cook/OrdersForCook/OrdersForCook";

export const getMealsForCook = async(dayOfWeek: string) => {
    const jwt = getAccessToken();
    try {
        const response = await fetch(`${endpoints.buyRequests.getMealsDayOfWeek}?day_of_week=${dayOfWeek}`, {
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

export const setMealsCount = async(array: Array<IMeal>) => {
    const jwt = getAccessToken();
    const response = await fetch(endpoints.buyRequests.setMealsCount, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({ meals: array })
    });
}