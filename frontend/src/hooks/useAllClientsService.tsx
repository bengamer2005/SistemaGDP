import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
// service
import { getClientsInfo, createClient } from "../services/clientsService"
// types
import type { Clients, CreateClients } from "../types/clientsTypes"

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
            toast.error(`Error al crear el cliente: ${error.message}`)
        }
    })
}