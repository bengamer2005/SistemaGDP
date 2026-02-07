import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Orders
export interface OrdersAttributes {
    ordersId: number,
    clientsId: number,
    orderDate: Date,
    deliveryDate: Date,
    totalAmount: number,
    notes: string,
    orderStatusId: number,
    createdBy: number,
    createdAt: Date,
    updatedBy: number,
    updatedAt: Date
}

// atributo que es opcional al momento de crear un nuevo Orders
export interface OrdersCreationAttributes extends Optional<OrdersAttributes, "ordersId" | "notes" | "updatedBy" | "updatedAt"> {}

// modelo tipado de Orders
class OrdersModel extends Model<OrdersAttributes, OrdersCreationAttributes> implements OrdersAttributes {
    public ordersId!: number
    public clientsId!: number
    public orderDate!: Date
    public deliveryDate!: Date
    public totalAmount!: number
    public notes!: string
    public orderStatusId!: number
    public createdBy!: number
    public createdAt!: Date
    public updatedBy!: number
    public updatedAt!: Date
}

// inicializar el modelo con sus atributos y opciones
OrdersModel.init({
    ordersId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clientsId: {
        type: DataTypes.INTEGER
    },
    orderDate: {
        type: DataTypes.DATE
    },
    deliveryDate: {
        type: DataTypes.DATE
    },
    totalAmount: {
        type: DataTypes.DECIMAL(18,2)
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    orderStatusId: {
        type: DataTypes.INTEGER
    },
    createdBy: {
        type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: DB,
    tableName: "Orders",
    timestamps: false
})

export default OrdersModel