import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla OrderStatus
export interface ProductsAttributes {
    products_id: number,
    name: string,
    price_cost: number,
    price_sale: number,
    price_wholesale: number,
    inventory: number,
    inventory_min: number,
    active: number,
    created_by: number,
    created_at: Date,
    updated_by: number,
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo OrderStatus
export interface ProductsCreationAttributes extends Optional<ProductsAttributes, "products_id" | "price_wholesale" | "active" | "created_at" | "updated_by" | "updated_at"> {}

// modelo tipado de OrderStatus
class ProductsModel extends Model<ProductsAttributes, ProductsCreationAttributes> implements ProductsAttributes {
    public products_id!: number
    public name!: string
    public price_cost!: number
    public price_sale!: number
    public price_wholesale!: number
    public inventory!: number
    public inventory_min!: number
    public active!: number
    public created_by!: number
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

// inicializar el modelo con sus atributos y opciones
ProductsModel.init({
    products_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    price_sale: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    price_wholesale: {
        type: DataTypes.DECIMAL(10, 2),
    },
    inventory: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    inventory_min: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    active: {
        type: DataTypes.INTEGER
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    tableName: "products",
    timestamps: false
})

export default ProductsModel