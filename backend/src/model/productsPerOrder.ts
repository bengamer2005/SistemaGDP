import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla ProductsPerOrder
export interface ProductsPerOrderAttributes {
    productsPerOrderId: number,
    productsId: number,
    ordersId: number
}

// atributo que es opcional al momento de crear un nuevo ProductsPerOrder
export interface ProductsPerOrderCreationAttributes extends Optional<ProductsPerOrderAttributes, "ordersId"> {}

// modelo tipado de ProductsPerOrder
class ProductsPerOrderModel extends Model<ProductsPerOrderAttributes, ProductsPerOrderCreationAttributes> implements ProductsPerOrderAttributes {
    public productsPerOrderId!: number
    public productsId!: number
    public ordersId!: number
}

// inicializar el modelo con sus atributos y opciones
ProductsPerOrderModel.init({
    productsPerOrderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productsId: {
        type: DataTypes.INTEGER
    },
    ordersId: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: DB,
    tableName: "ProductsPerOrder",
    timestamps: false
})

export default ProductsPerOrderModel