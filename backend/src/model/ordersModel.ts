import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Orders
export interface OrdersAttributes {
    orders_id: number,
    clients_id: number,
    order_date: Date,
    delivery_date: Date,
    total_amount: number,
    notes: string,
    order_status_id: number,
    created_by: number,
    created_at: Date,
    updated_by: number,
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo Orders
export interface OrdersCreationAttributes extends Optional<OrdersAttributes, "orders_id" | "notes" | "updated_by" | "updated_at"> {}

// modelo tipado de Orders
class OrdersModel extends Model<OrdersAttributes, OrdersCreationAttributes> implements OrdersAttributes {
    public orders_id!: number
    public clients_id!: number
    public order_date!: Date
    public delivery_date!: Date
    public total_amount!: number
    public notes!: string
    public order_status_id!: number
    public created_by!: number
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

// inicializar el modelo con sus atributos y opciones
OrdersModel.init({
    orders_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clients_id: {
        type: DataTypes.INTEGER
    },
    order_date: {
        type: DataTypes.DATE
    },
    delivery_date: {
        type: DataTypes.DATE
    },
    total_amount: {
        type: DataTypes.DECIMAL(18,2)
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    order_status_id: {
        type: DataTypes.INTEGER
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: DB,
    tableName: "Orders",
    timestamps: false
})

export default OrdersModel