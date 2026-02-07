import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla OrdersStatus
export interface OrdersStatusAttributes {
    orderStatusId: number,
    name: string,
    description: string
}

// atributo que es opcional al momento de crear un nuevo OrdersStatus
export interface OrdersStatusCreationAttributes extends Optional<OrdersStatusAttributes, "orderStatusId"> {}

// modelo tipado de OrdersStatus
class OrdersStatusModel extends Model<OrdersStatusAttributes, OrdersStatusCreationAttributes> implements OrdersStatusAttributes {
    public orderStatusId!: number
    public name!: string
    public description!: string
}

OrdersStatusModel.init({
    orderStatusId: {
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
    tableName: "OrderStatus",
    timestamps: false
})

export default OrdersStatusModel