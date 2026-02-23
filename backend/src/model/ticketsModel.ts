import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Tickets
export interface TicketsAttributes {
    ticket_id: number,
    raw_text: string,
    detected_at: Date,
    status: string,
    orders_id: number,
    created_at: Date
}

// atributo que es opcional al momento de crear un nuevo Tickets
export interface TicketsCreationAttributes extends Optional<TicketsAttributes, "ticket_id" | "orders_id" | "raw_text"> {}

// modelo tipado de Tickets
class TicketsModel extends Model<TicketsAttributes, TicketsCreationAttributes> implements TicketsAttributes {
    public ticket_id!: number
    public raw_text!: string
    public detected_at!: Date
    public status!: string
    public orders_id!: number
    public created_at!: Date
}

// inicializar el modelo con sus atributos y opciones
TicketsModel.init({
    ticket_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    raw_text: {
        type: DataTypes.STRING
    },
    detected_at: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.INTEGER
    },
    orders_id: {
        type: DataTypes.INTEGER
    },
    created_at: {
        type: DataTypes.DATE
    }
}, {
    sequelize: DB,
    tableName: "Tickets",
    timestamps: false
})

export default TicketsModel