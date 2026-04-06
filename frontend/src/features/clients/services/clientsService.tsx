import type { Clients, CreateClients } from "../types/clientsTypes"
const APIs = import.meta.env.VITE_API_URL
const token = localStorage.getItem("token")

export const getClientsInfo = async (): Promise<Clients[]> => {
    const response = await fetch(`${APIs}/clients/get/clientsInfo`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok) throw new Error("Fallo llamada a los clientes")

    return await response.json() as Promise<Clients[]>
}

export const createClient = async (body: CreateClients): Promise<void> => {
    const response = await fetch(`${APIs}/clients/${body.modalMode}`, {
        method: body.modalMode === "create" ? "POST" : "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    if(!response.ok) throw new Error("Fallo al crear el cliente")
}

export const deleteClient = async (clientId: number): Promise<void> => {
    const response = await fetch(`${APIs}/clients/delete/${clientId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok) throw new Error("Fallo al eliminar el cliente")
}