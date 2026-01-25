import { endpoints } from "../config/endpoints"
import { User } from "./classes/user"
import { setJWT } from "./jwt";

export async function loginUser(username: string, password: string) {
    const response = await fetch(endpoints.auth.login, { 
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ username, password })
    });
    const json = await response.json();
    const user: User = json.user;

    setJWT(json.access_token);

    return user;
}