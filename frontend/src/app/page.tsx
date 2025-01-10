import Link from 'next/link'
import styles from './page.module.scss'
import logoImg from '/public/logo-original.svg'
import Image  from 'next/image'
import { api } from '@/services/api'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AxiosError } from 'axios'


export default function Page(){

  async function handleLogin(formData: FormData) {
    "use server"

    const email = formData.get("email")
    const password = formData.get("password")

    if( !email  || !password ){
      return
    }

    console.log("Dados de login: ", { email, password })

    try {
      const response = await api.post("/session",{
        email,
        password
      }, {
        headers: {
          'Content-type': 'application/json'
        }
      })

      console.log("Resposta da api", response.data.token)

      if(!response.data.token){
        console.log("token nao encontrado na resposta")
        return
      }

      console.log("token recebido", response.data )

      const expressTime = 60 * 60 *24 * 30 * 1000
      //se acusar o erro no cookies store use abaixo
      const cookiestore = await cookies()
      //const serializedCookie = cookie.serialize
      cookiestore.set("session", response.data.token, {
        maxAge: expressTime,
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production"

      } )

    } catch (error) {
      const err = error as AxiosError
      console.log("Erro ao fazer login", err.message)
      console.log("Dados enviados:", {email, password})
      if(err.response){
        console.log("erro detalhado da resposta: ", err.response.data)
        console.log("Status:" , err.response.status)
        console.log("Cabeçalhos da resposta:", err.response.headers)
      }else{console.log("Erro detalhado:", err.message)
        
      }
      
      return
    }

    redirect("/dashboard")
    
  }

  return(
    <>
      <div className={styles.containercenter}>
        <Image
          src={logoImg}
          alt="logo do app"
        />
      <section className={styles.Login}>
        <form action={handleLogin}>
          
          <input
            type="email"
            required
            name="email"
            placeholder="Digite seu email..."
            className={styles.input}
          />
          
          <input
            type="password"
            required
            name="password"
            placeholder="**********"
            className={styles.input}
          />

          <button type="submit" className={styles.button}>
            Acessar
          </button>
        </form>

        <Link href='/signup' className={styles.text}>
          Não possui cadastro? Cadastre-se
        </Link>
      </section>
      </div>
    </>
    
  )
}