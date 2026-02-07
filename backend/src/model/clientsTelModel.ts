import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla de ClientsTel
export interface ClientsTelAttributes {
    clientsTelId: number,
    clientsId: number,
    telephone: string,
    active: number,
    createdBy: number,
    createdAt: Date,
    updatedBy: number,
    updatedAt: Date
}

// atributo que es opcional al momento de crear un nuevo ClientsTel
export interface ClientsTelCreationAttributes extends Optional<ClientsTelAttributes, "clientsTelId" | "updatedAt" | "updatedBy"> {}

// modelo tipado de ClientsTel
class ClientsTelModel extends Model<ClientsTelAttributes, ClientsTelCreationAttributes> implements ClientsTelAttributes {
    public clientsTelId!: number
    public clientsId!: number
    public telephone!: string
    public active!: number
    public createdBy!: number
    public createdAt!: Date
    public updatedBy!: number
    public updatedAt!: Date
}

ClientsTelModel.init({
    clientsTelId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clientsId: {
        type: DataTypes.INTEGER
    },
    telephone: {
        type: DataTypes.STRING
    },
    active: {
        type: DataTypes.INTEGER
    },
    createdBy: {
        type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedBy: {
        type: DataTypes.INTEGER
    },
    updatedAt: {
        type: DataTypes.DATE
    }

}, {
    sequelize: DB,
    tableName: "ClientsTel",
    timestamps: false
})

export default ClientsTelModel