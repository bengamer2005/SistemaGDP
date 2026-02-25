import { Request, Response } from "express"
import { DataTypes, QueryTypes } from "sequelize"
import DB from "../config/DBconfig"
import ClientsModel from "../model/clientsModel"
import ClientsDirModel from "../model/clientsDirModel"
import ClientsTelModel from "../model/clientsTelModel"

type ClientResponse = {
    clientsId: number
    name: string
    created_at: Date
    address: {
        street: string
        neighborhood: string
        exteriorNumber: number
        postalCode: number
        city: string
        state: string
    } | null
    telephones: { telephone: string }[]
}

// llama a todos los clientes
export const getAllClients = async (req: Request, res: Response) => {
    try {
        const clients = await ClientsModel.findAll({
            attributes: ["clients_id", "name", "created_at"],
            raw: true,
            where: { active: true }
        })

        const clientsDir = await ClientsDirModel.findAll({
            attributes: [
                "clients_id",
                "street",
                "neighborhood",
                "exterior_number",
                "postal_code",
                "city",
                "state"
            ],
            raw: true,
            where: { active: true }
        })

        const clientsTel = await ClientsTelModel.findAll({
            attributes: ["clients_id", "telephone"],
            raw: true,
            where: { active: true }
        })

        const dirMap = new Map<number, any>()
        const telMap = new Map<number, any[]>()

        clientsDir.forEach(dir => {
            dirMap.set(dir.clients_id, dir)
        })

        clientsTel.forEach(tel => {
            if (!telMap.has(tel.clients_id)) {
                telMap.set(tel.clients_id, [])
            }
            telMap.get(tel.clients_id)!.push({ telephone: tel.telephone })
        })

        const response: ClientResponse[] = clients.map(client => ({
            clientsId: client.clients_id,
            name: client.name,
            created_at: client.created_at,
            address: dirMap.get(client.clients_id) || null,
            telephones: telMap.get(client.clients_id) || []
        }))

        res.json(response)
    } catch (error) {
        console.error("Error al obtener los clientes:", error)
        res.status(500).json({ error: "Error al obtener los clientes" })
    }
}

// crear un nuevo cliente
export const createClient = async (req: Request, res: Response) => {
    try {
        const { name } = req.body

        const newClient = await ClientsModel.create({ name, active: 1, created_by: 1 })

        // if (address) {
        //     await ClientsDirModel.create({
        //         clientsId: newClient.clientsId,
        //         ...address
        //     })
        // }

        // if (telephones && Array.isArray(telephones)) {
        //     for (const tel of telephones) {
        //         await ClientsTelModel.create({
        //             clientsId: newClient.clientsId,
        //             telephone: tel.telephone,
        //             created_at: new Date(),
        //             created_by: 3, // ID de usuario ficticio para creación, cambiar despues
        //             active: true
        //         })
        //     }
        // }

        res.status(201).json({ message: "Cliente creado exitosamente", clientId: newClient.clients_id })
    } catch (error) {
        console.error("Error al crear el cliente:", error)
        res.status(500).json({ error: "Error al crear el cliente" })
    }
}