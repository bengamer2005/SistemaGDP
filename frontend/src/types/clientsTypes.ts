export type ClientAddress = {
    street: string
    neighborhood: string
    exterior_number: string
    postal_code: string
    city: string
    state: string
    reference: string
    country: string
}

export type ClientTelephone = {
    telephone: string,
    clients_tel_id?: number
}

export type Clients = {
    clientsId: number
    name: string
    created_at: string | Date
    address: ClientAddress | null
    telephones: ClientTelephone[]
}

export type ModalMode = "view" | "edit" | "create"

export type CreateClients = {
    name: string
    modalMode: ModalMode
    address: ClientAddress
    telephones: ClientTelephone[]
}