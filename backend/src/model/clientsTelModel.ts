import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla de ClientsTel
export interface ClientsTelAttributes {
    clients_tel_id: number,
    clients_id: number,
    telephone: string,
    active: number,
    created_by: number,
    created_at: Date,
    updated_by: number,
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo ClientsTel
export interface ClientsTelCreationAttributes extends Optional<ClientsTelAttributes, "clients_tel_id" | "updated_at" | "updated_by"> {}

// modelo tipado de ClientsTel
class ClientsTelModel extends Model<ClientsTelAttributes, ClientsTelCreationAttributes> implements ClientsTelAttributes {
    public clients_tel_id!: number
    public clients_id!: number
    public telephone!: string
    public active!: number
    public created_by!: number
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

ClientsTelModel.init({
    clients_tel_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clients_id: {
        type: DataTypes.INTEGER
    },
    telephone: {
        type: DataTypes.STRING
    },
    active: {
        type: DataTypes.INTEGER
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_by: {
        type: DataTypes.INTEGER
    },
    updated_at: {
        type: DataTypes.DATE
    }

}, {
    sequelize: DB,
    tableName: "clients_tel",
    timestamps: false
})

export default ClientsTelModel