import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla OrderStatusHistory
export interface OrderStatusHistoryAttributes {
    order_status_history_id: number,
    orders_id: number,
    orders_status_id: number,
    previous_status_id: number | null,
    changed_by: number,
    changed_at: Date,
    notes: string | null
}

// atributo que es opcional al momento de crear un nuevo OrderStatusHistory
export interface OrderStatusHistoryCreationAttributes extends Optional<OrderStatusHistoryAttributes, "order_status_history_id" | "previous_status_id" | "notes"> {}

// modelo tipado de OrderStatusHistory
class OrderStatusHistoryModel extends Model<OrderStatusHistoryAttributes, OrderStatusHistoryCreationAttributes> implements OrderStatusHistoryAttributes {
    public order_status_history_id!: number
    public orders_id!: number
    public orders_status_id!: number
    public previous_status_id!: number | null
    public changed_by!: number
    public changed_at!: Date
    public notes!: string | null
}

// inicializar el modelo con sus atributos y opciones
OrderStatusHistoryModel.init({
    order_status_history_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orders_id: {
        type: DataTypes.INTEGER
    },
    orders_status_id: {
        type: DataTypes.INTEGER
    },
    previous_status_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    changed_by: {
        type: DataTypes.INTEGER
    },
    changed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: DB,
    tableName: "order_status_history",
    timestamps: false
})

export default OrderStatusHistoryModel