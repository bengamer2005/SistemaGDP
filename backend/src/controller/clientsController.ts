import { Request, Response } from "express"
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
    telephones: { 
        telephone: string,
        id: number
    }[]
}

type Client = {
    clientsId: number
    name: string
    telephones: { 
        telephone: string,
        clients_tel_id: number
    }[]
    address: {
        street: string
        exterior_number: string
        neighborhood: string
        city: string
        state: string
        postal_code: string
        country: string
        reference?: string
    }
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
            attributes: ["clients_id", "telephone", "clients_tel_id"],
            raw: true,
            where: { active: true }
        })

        const dirMap = new Map<number, any>()
        const telMap = new Map<number, any[]>()

        clientsDir.forEach(dir => {
            dirMap.set(dir.clients_id, dir)
        })

        clientsTel.forEach(tel => {
            if(!telMap.has(tel.clients_id)) {
                telMap.set(tel.clients_id, [])
            }
            telMap.get(tel.clients_id)!.push({ telephone: tel.telephone, clients_tel_id: tel.clients_tel_id })
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
    const body: Client = req.body

    const address = body.address
    const telephones = body.telephones

    const transaction = await DB.transaction()

    try {
        const newClient = await ClientsModel.create({ name: body.name.trim(), active: true, created_by: 1 }, { transaction })

        if(address) {
            await ClientsDirModel.create({
                clients_id: newClient.clients_id,
                active: true,
                created_by: 1,
                ...address
            }, {
                transaction
            })
        }

        if(telephones?.length) {
            for(const tel of telephones) {
                await ClientsTelModel.create({
                    clients_id: newClient.clients_id,
                    telephone: tel.telephone,
                    created_by: 1,
                    active: true
                }, {
                    transaction
                })
            }
        }

        await transaction.commit()

        res.status(201).json({ message: "Cliente creado exitosamente" })
    } catch (error) {
        await transaction.rollback()
        console.error("Error al crear el cliente:", error)
        res.status(500).json({ error: "Error al crear el cliente" })
    }
}

export const updateClient = async (req: Request, res: Response) => {
    const body: Client = req.body

    const address = body.address
    const telephones = body.telephones

    const transaction = await DB.transaction()

    try {
        await ClientsModel.update({ name: body.name.trim() }, { where: { clients_id: body.clientsId }, transaction })
                    
        if(address) {
            await ClientsDirModel.update({ ...address }, { where: { clients_id: body.clientsId }, transaction })
        }

        const allClientTel = await ClientsTelModel.findAll({ raw: true, where: { clients_id: body.clientsId, active: true }, transaction })
        
        // sacamos los telefonos que no vengan en el body
        const telToInactiveMap = new Map<number, any>()

        const telToInactive = allClientTel.filter(dbTel =>
            !telephones.some(bodyTel => bodyTel.clients_tel_id === dbTel.clients_tel_id)
        )

        for (const tel of telToInactive) {
            await ClientsTelModel.update({ active: false }, { where: { clients_tel_id: tel.clients_tel_id }, transaction })
        }

        // inactivamos los telefonos que no vienen en el body
        for(const [telId, tel] of telToInactiveMap) {
            await ClientsTelModel.update({ active: false }, { where: { clients_tel_id: telId }, transaction })
        }

        if(telephones?.length) {
            for (const tel of telephones) {
                if(tel.clients_tel_id) {
                    await ClientsTelModel.update({ telephone: tel.telephone }, { where: { clients_tel_id: tel.clients_tel_id }, transaction })
                } else {
                    await ClientsTelModel.create({
                        clients_id: body.clientsId,
                        telephone: tel.telephone,
                        created_by: 1,
                        active: true
                    }, {
                        transaction
                    })
                }
            }
        }

        await transaction.commit()
    
        res.json({ message: "Cliente actualizado exitosamente" })
    } catch (error) {
        await transaction.rollback()
        console.error("Error al actualizar el cliente:", error)
        res.status(500).json({ error: "Error al actualizar el cliente" })
    }
}