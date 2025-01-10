import { api } from "@/services/api"
import { getCookieServer } from "@/lib/cookieServer"
import { Orders } from "./components/orders"
import { OrderProps } from "@/lib/order.type"

async function getOrders(): Promise<OrderProps[] | []>{
    try {
        const token = getCookieServer()

        const response = await api.get("/ordersok", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data || []

    } catch (err) {
        return []
    }
}

export default async function Dashboard(){

    const orders = await getOrders()

    return(
        <>
            <Orders orders={orders}/>
        </>
    )
}