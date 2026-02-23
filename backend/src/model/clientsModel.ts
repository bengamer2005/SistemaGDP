import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Clients
export interface ClientsAttributes {
    clients_id: number,
    name: string,
    active: number,
    created_by: number,
    created_at: Date,
    updated_by: number,
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo Clients
export interface ClientsCreationAttributes extends Optional<ClientsAttributes, "clients_id" | "created_at" | "updated_by" | "updated_at"> {}

// modelo tipado de Clients
class ClientsModel extends Model<ClientsAttributes, ClientsCreationAttributes> implements ClientsAttributes {
    public clients_id!: number
    public name!: string
    public active!: number
    public created_by!: number
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

// inicializar el modelo con sus atributos y opciones
ClientsModel.init({
    clients_id: {
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
    created_by: {
        type: DataTypes.INTEGER
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: DB,
    tableName: "clients",
    timestamps: false
})

export default ClientsModel