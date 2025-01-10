"use client"

import Link from 'next/link'
import styles from './styles.module.scss'
import Image from 'next/image'
import logoImg from '/public/rivagro.jpeg'
import { LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteCookie } from 'cookies-next'
import { toast } from 'sonner'

export function Header(){

    const router = useRouter()

    async function handleLogout() {
        deleteCookie("session", { path: "/"})
        toast.success("Logout feito com sucesso!")
        router.replace("/")
    }
    return (
        <header className={styles.headercontainer}>
           <div className={styles.headercontent}>
                <Link href="/dashboard">
                    <Image 
                        alt="Logo Rivagro"
                        src={logoImg}
                        width={190}
                        height={60}
                        priority={true}
                        quality={100}
                    />
                </Link>
                <nav>
                
                    <Link href="/dashboard/category">
                        Categorias
                    </Link>
                    <Link href="/dashboard/product">
                        Produtos
                    </Link>

                    <form action={handleLogout}>
                        <button>
                            <LogOutIcon size={25} />
                        </button>
                    </form>
                </nav>
           </div>
        </header>
    )
}