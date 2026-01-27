export function setJWT(jwt: string) {
    localStorage.setItem("jwt", jwt);
}

export function getJWT(): string | null {
    return localStorage.getItem("jwt");
}

export function deleteJWT() {
    localStorage.removeItem("jwt");
}