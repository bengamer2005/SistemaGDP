import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Roles
export interface RolesAttributes {
    roles_id: number,
    name: string,
    description: string
}

// atributo que es opcional al momento de crear un nuevo Roles
export interface RolesCreationsAttributes extends Optional<RolesAttributes, "roles_id"> {}

// modelo tipado de Roles
class RolesModel extends Model<RolesAttributes, RolesCreationsAttributes> implements RolesAttributes{
    public roles_id!: number
    public name!: string
    public description!: string
}

// inicializar el modelo con sus atributos y opciones
RolesModel.init({
    roles_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    }
}, {
    sequelize: DB,
    tableName: "Roles",
    timestamps: false
})