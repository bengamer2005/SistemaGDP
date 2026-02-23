import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla ProductsPerOrder
export interface ProductsPerOrderAttributes {
    products_per_order_id: number,
    products_id: number,
    orders_id: number
}

// atributo que es opcional al momento de crear un nuevo ProductsPerOrder
export interface ProductsPerOrderCreationAttributes extends Optional<ProductsPerOrderAttributes, "orders_id"> {}

// modelo tipado de ProductsPerOrder
class ProductsPerOrderModel extends Model<ProductsPerOrderAttributes, ProductsPerOrderCreationAttributes> implements ProductsPerOrderAttributes {
    public products_per_order_id!: number
    public products_id!: number
    public orders_id!: number
}

// inicializar el modelo con sus atributos y opciones
ProductsPerOrderModel.init({
    products_per_order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    products_id: {
        type: DataTypes.INTEGER
    },
    orders_id: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: DB,
    tableName: "ProductsPerOrder",
    timestamps: false
})

export default ProductsPerOrderModel