import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla OrdersStatus
export interface OrdersStatusAttributes {
    order_status_id: number,
    name: string,
    description: string
}

// atributo que es opcional al momento de crear un nuevo OrdersStatus
export interface OrdersStatusCreationAttributes extends Optional<OrdersStatusAttributes, "order_status_id"> {}

// modelo tipado de OrdersStatus
class OrdersStatusModel extends Model<OrdersStatusAttributes, OrdersStatusCreationAttributes> implements OrdersStatusAttributes {
    public order_status_id!: number
    public name!: string
    public description!: string
}

OrdersStatusModel.init({
    order_status_id: {
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