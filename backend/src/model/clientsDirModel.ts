import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla ClientsDir
export interface ClientsDirAttributes {
    clients_dir_id: number,
    clients_id: number,
    street: string,
    exterior_number: string,
    neighborhood: string,
    postal_code: string,
    city: string,
    state: string,
    country: string,
    reference: string,
    active: boolean,
    created_by: number,
    created_at: Date,
    updated_by: number,
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo ClientsDir
export interface ClientsDirCreationAttributes extends Optional<ClientsDirAttributes, "clients_dir_id" | "exterior_number"| "postal_code" | "reference" | "created_at" | "updated_by" | "updated_at"> {}

// modelo tipado de ClientsDir
class ClientsDirModel extends Model<ClientsDirAttributes, ClientsDirCreationAttributes> implements ClientsDirAttributes {
    public clients_dir_id!: number
    public clients_id!: number
    public street!: string
    public exterior_number!: string
    public neighborhood!: string
    public postal_code!: string
    public city!: string
    public state!: string
    public country!: string
    public reference!: string
    public active!: boolean
    public created_by!: number
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

// inicializar el modelo con sus atributos y opciones
ClientsDirModel.init({
    clients_dir_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clients_id: {
        type: DataTypes.INTEGER
    },
    street: {
        type: DataTypes.STRING,
    },
    exterior_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    neighborhood: {
        type: DataTypes.STRING,
    },
    postal_code: {
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
        type: DataTypes.BOOLEAN
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
} , {
    sequelize: DB,
    tableName: "clients_dir",
    timestamps: false
})

export default ClientsDirModel