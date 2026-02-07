import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Users
export interface UsersAttributes {
    usersId: number,
    name: string,
    lastName: string,
    email: string,
    password: string,
    roleId: number,
    active: number,
    createdBy: number,
    createdAt: Date,
    updatedBy: number | null,
    updatedAt: Date | null
}

// atributo que es opcional al momento de crear un nuevo Users
export interface UsersCreationAttributes extends Optional<UsersAttributes, "usersId" | "updatedBy" | "updatedAt"> {}

// modelo tipado de Users
class UsersModel extends Model<UsersAttributes, UsersCreationAttributes> implements UsersAttributes {
    public usersId!: number
    public name!: string
    public lastName!: string
    public email!: string
    public password!: string
    public roleId!: number
    public active!: number
    public createdBy!: number
    public createdAt!: Date
    public updatedBy!: number | null
    public updatedAt!: Date | null
}

// inicializar el modelo con sus atributos y opciones
UsersModel.init({
    usersId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    },
    roleId: {
        type: DataTypes.INTEGER
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
    tableName: "Users",
    timestamps: false
})

export default UsersModel