import type { Order, CreateOrder, UpdateOrder } from "../types/ordersTypes"
const APIs = import.meta.env.VITE_API_URL
const token = localStorage.getItem("token")

export const getAllOrders = async (): Promise<Order[]> => {
    const response = await fetch(`${APIs}/orders`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if(!response.ok) throw new Error("Fallo al obtener los pedidos")

    return await response.json() as Promise<Order[]>
}

export const getOrderById = async (orderId: number): Promise<Order> => {
    const response = await fetch(`${APIs}/orders/get/${orderId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok) throw new Error("Fallo al obtener el pedido")

    return await response.json() as Promise<Order>
}

export const createOrder = async (body: CreateOrder): Promise<Order> => {
    const response = await fetch(`${APIs}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
    
    if (!response.ok) throw new Error("Fallo al crear el pedido")
    return await response.json() as Promise<Order>
}

export const updateOrder = async (body: UpdateOrder): Promise<Order> => {
    const response = await fetch(`${APIs}/orders/update/${body.orders_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    
    if (!response.ok) throw new Error("Fallo al actualizar el pedido")
    return await response.json() as Promise<Order>
}

export const changeOrderStatus = async (
    orderId: number, 
    statusId: number,
    notes?: string
): Promise<void> => {
    const response = await fetch(`${APIs}/orders/status/change/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            order_status_id: statusId,
            notes
        })
    })
    
    if (!response.ok) throw new Error("Fallo al cambiar el estado del pedido")
}

export const getOrderStatuses = async (): Promise<Array<{ 
    order_status_id: number
    name: string
    description: string 
}>> => {
    const response = await fetch(`${APIs}/orders/status`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok) throw new Error("Fallo al obtener los estados")

    return await response.json()
}

export const deleteOrder = async (orderId: number): Promise<void> => {
    const response = await fetch(`${APIs}/orders/delete/${orderId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    
    if (!response.ok) throw new Error("Fallo al eliminar el pedido")
}