import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Clients
export interface ClientsAttributes {
    clientsId: number,
    name: string,
    active: number,
    createdBy: number,
    createdAt: Date,
    updatedBy: number,
    updatedAt: Date
}

// atributo que es opcional al momento de crear un nuevo Clients
export interface ClientsCreationAttributes extends Optional<ClientsAttributes, "clientsId" | "updatedBy" | "updatedAt"> {}

// modelo tipado de Clients
class ClientsModel extends Model<ClientsAttributes, ClientsCreationAttributes> implements ClientsAttributes {
    public clientsId!: number
    public name!: string
    public active!: number
    public createdBy!: number
    public createdAt!: Date
    public updatedBy!: number
    public updatedAt!: Date
}

// inicializar el modelo con sus atributos y opciones
ClientsModel.init({
    clientsId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
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
        type: DataTypes.INTEGER,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: DB,
    tableName: "Clients",
    timestamps: false
})

export default ClientsModel