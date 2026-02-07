import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla OrderStatusHistory
export interface OrderStatusHistoryAttributes {
    orderStatusHistoryId: number,
    ordersId: number,
    orderStatusId: number,
    previousStatusId: number | null,
    changedBy: number,
    changedAt: Date,
    notes: string | null
}

// atributo que es opcional al momento de crear un nuevo OrderStatusHistory
export interface OrderStatusHistoryCreationAttributes extends Optional<OrderStatusHistoryAttributes, "orderStatusHistoryId" | "previousStatusId" | "notes"> {}

// modelo tipado de OrderStatusHistory
class OrderStatusHistoryModel extends Model<OrderStatusHistoryAttributes, OrderStatusHistoryCreationAttributes> implements OrderStatusHistoryAttributes {
    public orderStatusHistoryId!: number
    public ordersId!: number
    public orderStatusId!: number
    public previousStatusId!: number | null
    public changedBy!: number
    public changedAt!: Date
    public notes!: string | null
}

// inicializar el modelo con sus atributos y opciones
OrderStatusHistoryModel.init({
    orderStatusHistoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ordersId: {
        type: DataTypes.INTEGER
    },
    orderStatusId: {
        type: DataTypes.INTEGER
    },
    previousStatusId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    changedBy: {
        type: DataTypes.INTEGER
    },
    changedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: DB,
    tableName: "OrderStatusHistory",
    timestamps: false
})

export default OrderStatusHistoryModel