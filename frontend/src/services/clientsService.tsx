const APIs = import.meta.env.VITE_API_URL
import type { Clients, CreateClients } from "../types/clientsTypes"

export const getClientsInfo = async (): Promise<Clients[]> => {
    const response = await fetch(`${APIs}/sistemagdp/clients/get/clientsInfo`)

    if(!response.ok) throw new Error("Fallo llamada a los clientes")

    return await response.json() as Promise<Clients[]>
}

export const createClient = async (body: CreateClients): Promise<void> => {
    const response = await fetch(`${APIs}/sistemagdp/clients/${body.modalMode}`, {
        method: body.modalMode === "create" ? "POST" : "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    if(!response.ok) throw new Error("Fallo al crear el cliente")
}