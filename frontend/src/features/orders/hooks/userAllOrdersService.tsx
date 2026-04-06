// features/orders/hooks/useAllOrdersService.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { 
    getAllOrders, 
    getOrderById, 
    getOrderStatuses,
    createOrder, 
    updateOrder, 
    changeOrderStatus,
    deleteOrder 
} from "../services/ordersService"
import type { Order, CreateOrder, UpdateOrder } from "../types/ordersTypes"

// Obtener todos los pedidos
export const useAllOrders = () => {
    return useQuery<Order[], Error>({
        queryKey: ["allOrders"],
        queryFn: () => getAllOrders(),
        staleTime: 1000 * 60 * 2, // 2 minutos
    })
}

// Obtener un pedido específico
export const useOrderById = (orderId: number) => {
    return useQuery<Order, Error>({
        queryKey: ["order", orderId],
        queryFn: () => getOrderById(orderId),
        enabled: !!orderId,
    })
}

// Obtener estados de pedidos
export const useOrderStatuses = () => {
    return useQuery({
        queryKey: ["orderStatuses"],
        queryFn: getOrderStatuses,
        staleTime: 1000 * 60 * 60, // 1 hora
    })
}

// Crear un nuevo pedido
export const useCreateOrder = () => {
    const queryClient = useQueryClient()
    
    return useMutation<Order, Error, CreateOrder>({
        mutationFn: createOrder,
        onSuccess: () => {
            toast.success("Pedido creado exitosamente")
            queryClient.invalidateQueries({ queryKey: ["allOrders"] })
        },
        onError: (error) => {
            toast.error(`Error al crear el pedido: ${error.message}`)
        }
    })
}

// Actualizar un pedido
export const useUpdateOrder = () => {
    const queryClient = useQueryClient()
    
    return useMutation<Order, Error, UpdateOrder>({
        mutationFn: updateOrder,
        onSuccess: (_, variables) => {
            toast.success("Pedido actualizado exitosamente")
            queryClient.invalidateQueries({ queryKey: ["allOrders"] })
            queryClient.invalidateQueries({ queryKey: ["order", variables.orders_id] })
        },
        onError: (error) => {
            toast.error(`Error al actualizar el pedido: ${error.message}`)
        }
    })
}

// Cambiar estado de un pedido
export const useChangeOrderStatus = () => {
    const queryClient = useQueryClient()
    
    return useMutation<void, Error, { 
        orderId: number
        statusId: number
        notes?: string 
    }>({
        mutationFn: ({ orderId, statusId, notes }) => 
            changeOrderStatus(orderId, statusId, notes),
        onSuccess: () => {
            toast.success("Estado actualizado exitosamente")
            queryClient.invalidateQueries({ queryKey: ["allOrders"] })
        },
        onError: (error) => {
            toast.error(`Error al cambiar el estado: ${error.message}`)
        }
    })
}

// Eliminar un pedido
export const useDeleteOrder = () => {
    const queryClient = useQueryClient()
    
    return useMutation<void, Error, { orderId: number }>({
        mutationFn: ({ orderId }) => deleteOrder(orderId),
        onSuccess: () => {
            toast.success("Pedido eliminado")
            queryClient.invalidateQueries({ queryKey: ["allOrders"] })
        },
        onError: (error) => {
            toast.error(`Error al eliminar el pedido: ${error.message}`)
        }
    })
}