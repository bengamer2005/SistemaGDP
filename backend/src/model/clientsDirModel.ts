import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla ClientsDir
export interface ClientsDirAttributes {
    clientsDirId: number,
    clientsId: number,
    street: string,
    exteriorNumber: string,
    neighborhood: string,
    postalCode: string,
    city: string,
    state: string,
    country: string,
    reference: string,
    active: number,
    createdBy: number,
    createdAt: Date,
    updatedBy: number,
    updatedAt: Date
}

// atributo que es opcional al momento de crear un nuevo ClientsDir
export interface ClientsDirCreationAttributes extends Optional<ClientsDirAttributes, "clientsDirId" | "exteriorNumber"| "postalCode" | "reference" | "updatedBy" | "updatedAt"> {}

// modelo tipado de ClientsDir
class ClientsDirModel extends Model<ClientsDirAttributes, ClientsDirCreationAttributes> implements ClientsDirAttributes {
    public clientsDirId!: number
    public clientsId!: number
    public street!: string
    public exteriorNumber!: string
    public neighborhood!: string
    public postalCode!: string
    public city!: string
    public state!: string
    public country!: string
    public reference!: string
    public active!: number
    public createdBy!: number
    public createdAt!: Date
    public updatedBy!: number
    public updatedAt!: Date
}

// inicializar el modelo con sus atributos y opciones
ClientsDirModel.init({
    clientsDirId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clientsId: {
        type: DataTypes.INTEGER
    },
    street: {
        type: DataTypes.STRING,
    },
    exteriorNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    neighborhood: {
        type: DataTypes.STRING,
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: true
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
} , {
    sequelize: DB,
    tableName: "ClientsDir",
    timestamps: false
})

export default ClientsDirModel