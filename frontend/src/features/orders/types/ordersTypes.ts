// features/orders/types/ordersTypes.ts

// Estructura real del producto en la orden
export interface OrderProduct {
    id: number
    name: string
    quantity: number
    unit_price: number
    subtotal: number
}

// Estructura real de los datos del cliente
export interface ClientData {
    id: number
    name: string
    tel: string
    street: string
    neighborhood: string
}

// Estructura principal de la orden (coincide con el backend)
export interface Order {
    orders_id: number
    order_date: string
    delivery_date: string
    total_amount: string | number
    notes: string | null
    status: string
    order_status_id: number
    products: OrderProduct[]
    client_data: ClientData
}

// Para crear un producto en una orden
export interface CreateOrderProduct {
    products_id: number
    quantity: number
    unit_price: number
}

// Para crear una nueva orden
export interface CreateOrder {
    clients_id: number
    order_date: string
    delivery_date: string
    total_amount: number
    notes?: string
    order_status_id: number
    products: CreateOrderProduct[]
}

// Para actualizar una orden existente
export interface UpdateOrder {
    orders_id: number
    clients_id?: number
    order_date?: string
    delivery_date?: string
    total_amount?: number
    notes?: string
    order_status_id?: number
    products?: CreateOrderProduct[]
}

// Estados de orden disponibles
export interface OrderStatus {
    order_status_id: number
    name: string
    description: string
}