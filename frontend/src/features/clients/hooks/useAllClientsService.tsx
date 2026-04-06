import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
// service
import { getClientsInfo, createClient, deleteClient } from "../services/clientsService"
// types
import type { Clients, CreateClients,  } from "../types/clientsTypes"

export const useAllClients = () => {
    return useQuery<Clients[], Error>({
        queryKey: ["clientsInfo"],
        queryFn: getClientsInfo
    })
}

export const useCreateClient = () => {
    const queryClient = useQueryClient()
    
    return useMutation<void, Error, CreateClients>({
        mutationFn: createClient,
        onSuccess: () => {
            toast.success("Cliente creado exitosamente")
            queryClient.invalidateQueries({ queryKey: ["clientsInfo"] })
        },
        onError: (error) => {
            toast.error(`Error al crear el cliente`)
            console.error("Error al crear el cliente:", error)
        }
    })
}

export const useDeleteClient = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, number>({
        mutationFn: deleteClient,
        onSuccess: () => {
            toast.success("Cliente eliminado exitosamente")
            queryClient.invalidateQueries({ queryKey: ["clientsInfo"] })
        },
        onError: (error) => {
            toast.error(`Error al eliminar el cliente`)
            console.error("Error al eliminar el cliente:", error)
        }
    })
}