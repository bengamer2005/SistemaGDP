import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Users
export interface UsersAttributes {
    users_id: number,
    name: string,
    last_name: string,
    email: string,
    password: string,
    role_id: number,
    active: boolean,
}

// atributo que es opcional al momento de crear un nuevo Users
export interface UsersCreationAttributes extends Optional<UsersAttributes, "users_id" > {}

// modelo tipado de Users
class UsersModel extends Model<UsersAttributes, UsersCreationAttributes> implements UsersAttributes {
    public users_id!: number
    public name!: string
    public last_name!: string
    public email!: string
    public password!: string
    public role_id!: number
    public active!: boolean
}

// inicializar el modelo con sus atributos y opciones
UsersModel.init({
    users_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    last_name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    },
    role_id: {
        type: DataTypes.INTEGER
    },
    active: {
        type: DataTypes.BOOLEAN
    }
}, {
    sequelize: DB,
    tableName: "users",
    timestamps: false
})

export default UsersModel