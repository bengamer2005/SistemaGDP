import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla OrderStatus
export interface ProductsAttributes {
    products_id: number,
    name: string,
    price: number,
    quantity: number,
    unit_price: number,
    active: number
}

// atributo que es opcional al momento de crear un nuevo OrderStatus
export interface ProductsCreationAttributes extends Optional<ProductsAttributes, "products_id"> {}

// modelo tipado de OrderStatus
class ProductsModel extends Model<ProductsAttributes, ProductsCreationAttributes> implements ProductsAttributes {
    public products_id!: number
    public name!: string
    public price!: number
    public quantity!: number
    public unit_price!: number
    public active!: number
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
    },
    price: {
        type: DataTypes.DECIMAL(18, 2)
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    unit_price: {
        type: DataTypes.DECIMAL(18, 2)
    },
    active: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: DB,
    tableName: "Products",
    timestamps: false
})

export default ProductsModel