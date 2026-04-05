import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla ProductsPerOrder
export interface ProductsPerOrderAttributes {
    products_per_order_id: number,
    products_id: number,
    orders_id: number,
    quantity: number,
    unit_price: number,
    subtotal: number
}

// atributo que es opcional al momento de crear un nuevo ProductsPerOrder
export interface ProductsPerOrderCreationAttributes extends Optional<ProductsPerOrderAttributes, "products_per_order_id" | "orders_id" | "subtotal"> {}

// modelo tipado de ProductsPerOrder
class ProductsPerOrderModel extends Model<ProductsPerOrderAttributes, ProductsPerOrderCreationAttributes> implements ProductsPerOrderAttributes {
    public products_per_order_id!: number
    public products_id!: number
    public orders_id!: number
    public quantity!: number
    public unit_price!: number
    public subtotal!: number
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
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unit_price: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: true
    }
}, {
    sequelize: DB,
    tableName: "products_per_order",
    timestamps: false
})

export default ProductsPerOrderModel