"use client"

import styles from './styles.module.scss'
import { AwardIcon, X } from 'lucide-react'
import { use } from 'react'
import { OrderContext } from '@/providers/order'
import { calculateTotalOrder } from '@/lib/helper'

export function ModalOrder(){

    const { onRequestClose, order, finishOrder} = use(OrderContext)

    async function handleFinishOrder() {
        await finishOrder(order[0].order_id)
    }
    
    return (
        <dialog className={styles.dialogcontainer}>

            <section className={styles.dialogcontent}>
                <button className={styles.dialogback} onClick={onRequestClose }>
                    <X size={40} color="#FF3f4b" />
                </button>

                <article className={styles.container}>
                    
                    <h2>Detalhes do pedido</h2>

                    {order[0].order?.description && (
                        <span className={styles.table}>
                            <b>Cliente:</b> {order[0].order.client}
                            <br/>
                            <b>Endereço:</b> {order[0].order.description}
                        </span>
                    )}
                   
                    {order.map(item => (
                        <section className={styles.itemspedido} key={item.id}>
                        <span><b>Qtde: {item.amount} {item.product.name} - R$ {parseFloat(item.product.price) * item.amount}</b>
                        </span>
                        <span className={styles.description}> {item.product.description}</span>
                    </section>
                    ))}

                    <h3 className={styles.total}>Valor total: {calculateTotalOrder(order)}</h3>

                   </article>
                   
                    <button className={styles.buttonorder} onClick={handleFinishOrder}>
                        Concluir pedido
                    </button>
            </section>
        </dialog>
    )
}