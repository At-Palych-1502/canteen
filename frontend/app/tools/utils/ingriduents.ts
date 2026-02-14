import { endpoints } from "@/app/config/endpoints"
import { getAccessToken } from "./auth"

interface IIngredientRequest {
    ingredient_id: number,
    quantity: number
}

export const putIngridientsRequest = async(data: IIngredientRequest) => {
    try {
        const jwt = getAccessToken();
        const response = await fetch(endpoints.ingredients.putIngridientsRequest, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return { ok: true, text: "Запрос успешно добавлен" };
        } else {
            return { ok: false, text: response.statusText }
        }
    } catch (error) {
        console.log(error);
        return { ok: false, text: "Неизвестная ошибка" }
    } 
}