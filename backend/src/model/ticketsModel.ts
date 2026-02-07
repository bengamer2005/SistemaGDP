import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Tickets
export interface TicketsAttributes {
    ticketId: number,
    rawText: string,
    detectedAt: Date,
    status: string,
    ordersId: number,
    createdAt: Date
}

// atributo que es opcional al momento de crear un nuevo Tickets
export interface TicketsCreationAttributes extends Optional<TicketsAttributes, "ticketId" | "ordersId" | "rawText"> {}

// modelo tipado de Tickets
class TicketsModel extends Model<TicketsAttributes, TicketsCreationAttributes> implements TicketsAttributes {
    public ticketId!: number
    public rawText!: string
    public detectedAt!: Date
    public status!: string
    public ordersId!: number
    public createdAt!: Date
}

// inicializar el modelo con sus atributos y opciones
TicketsModel.init({
    ticketId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    rawText: {
        type: DataTypes.STRING
    },
    detectedAt: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.INTEGER
    },
    ordersId: {
        type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize: DB,
    tableName: "Tickets",
    timestamps: false
})

export default TicketsModel