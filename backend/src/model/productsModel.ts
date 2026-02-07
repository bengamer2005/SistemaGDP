import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla OrderStatus
export interface ProductsAttributes {
    productsId: number,
    name: string,
    price: number,
    quantity: number,
    unitPrice: number,
    active: number
}

// atributo que es opcional al momento de crear un nuevo OrderStatus
export interface ProductsCreationAttributes extends Optional<ProductsAttributes, "productsId"> {}

// modelo tipado de OrderStatus
class ProductsModel extends Model<ProductsAttributes, ProductsCreationAttributes> implements ProductsAttributes {
    public productsId!: number
    public name!: string
    public price!: number
    public quantity!: number
    public unitPrice!: number
    public active!: number
}

// inicializar el modelo con sus atributos y opciones
ProductsModel.init({
    productsId: {
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
    unitPrice: {
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