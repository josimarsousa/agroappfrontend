import { getCookie } from "cookies-next";


export function getCookieClient(){
    const token = getCookie("session")
    console.log('token obtido no cliente: ', token)
    return token || null

    
}