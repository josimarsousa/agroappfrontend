import { cookies } from 'next/headers'

//erro relacionando ao get, cria uma const cookiestore e 
//usa o await transformando a funcao em assincrona (async)

export async function getCookieServer(){

    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value
    
    return token || null
}