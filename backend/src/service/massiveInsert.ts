import DB from "../config/DBconfig"
import ClientsModel from "../model/clientsModel"
import ClientsDirModel from "../model/clientsDirModel"
import ClientsTelModel from "../model/clientsTelModel"

const massiveInsert = async (amount: number) => {
    const transaction = await DB.transaction()

    try {
        const clientsArray: any[] = []

        // generamos los clientes en memoria
        for (let i = 2; i <= amount; i++) {
            clientsArray.push({
                name: `Cliente ${i}`,
                active: true,
                created_by: 1
            })
        }

        // insertamos todos los clientes de golpe
        const insertedClients = await ClientsModel.bulkCreate(clientsArray, {
            transaction,
            returning: true
        })

        const dirArray: any[] = []
        const telArray: any[] = []

        // generamos direcciones y teléfonos usando los IDs reales
        insertedClients.forEach((client, index) => {
            const i = index + 2

            dirArray.push({
                clients_id: client.clients_id,
                street: `Calle ${i}`,
                neighborhood: `Colonia 1`,
                city: "Monterrey",
                state: "Nuevo Leon",
                country: "Mexico",
                postal_code: "66000",
                active: true,
                created_by: 1
            })

            telArray.push({
                clients_id: client.clients_id,
                telephone: `811000${String(i).padStart(4, '0')}`,
                active: true,
                created_by: 1
            })
        })

        // insertamos direcciones y teléfonos masivamente
        await ClientsDirModel.bulkCreate(dirArray, { transaction })
        await ClientsTelModel.bulkCreate(telArray, { transaction })

        await transaction.commit()

        console.log(`Inserción masiva de ${amount} clientes completada correctamente`)

    } catch (error: any) {
        await transaction.rollback()
        console.error("Error en inserción masiva:", error.message)
    }
}

export default massiveInsert