import { Request, Response } from "express"
import { Sequelize, QueryTypes } from "sequelize"
import DB from "../config/DBconfig"
import OrdersModel from "../model/ordersModel"
import ProductsPerOrderModel from "../model/productsPerOrder"
import OrderStatusModel from "../model/orderStatus"
import OrderStatusHistoryModel from "../model/orderStatusHistory"

// types
type OrderProduct = {
    products_id: number
    quantity: number
    unit_price: number
}

type OrderBody = {
    orders_id: number
    clients_id: number
    order_date: string
    delivery_date: string
    total_amount: number
    notes?: string
    order_status_id: number
    products?: OrderProduct[]
}

type OrderResponse = {
    ordersId: number
    clientsId: number
    orderDate: Date
    deliveryDate: Date | null
    totalAmount: number
    notes?: string
    status: string
    products: {
        id: number
        name: string
        quantity: number
        unit_price: number
        subtotal: number
    }[]
}

// llamamos a todos los pedidos
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const allOrders = await DB.query("SELECT * FROM xv_all_orders", {
            type: QueryTypes.SELECT
        })

        res.status(200).json(allOrders)
    } catch (error) {
        console.error("Error al obtener pedidos:", error)
        res.status(500).json({ error: "Error al obtener pedidos" })
    }
}

// creamos un pedido
export const createOrder = async (req: Request, res: Response) => {
    const body: OrderBody = req.body
    const transaction = await DB.transaction()

    try {
        let total = 0

        const newOrder = await OrdersModel.create({
            clients_id: body.clients_id,
            order_date: new Date(body.order_date),
            delivery_date: body.delivery_date ? new Date(body.delivery_date) : undefined,
            total_amount: 0,
            notes: body.notes,
            order_status_id: body.order_status_id,
            created_by: req.user?.id
        }, { transaction })

        if (body.products?.length) {
            for (const product of body.products) {
                total += product.quantity * product.unit_price

                await ProductsPerOrderModel.create({
                    orders_id: newOrder.orders_id,
                    products_id: product.products_id,
                    quantity: product.quantity,
                    unit_price: product.unit_price
                }, { transaction })
            }
        }

        await OrdersModel.update({
            total_amount: total
        }, {
            where: { orders_id: newOrder.orders_id },
            transaction
        })

        await OrderStatusHistoryModel.create({
            orders_id: newOrder.orders_id,
            order_status_id: body.order_status_id,
            previous_status_id: null,
            changed_by: req.user?.id,
            notes: "Pedido creado"
        }, { transaction })

        await transaction.commit()

        res.status(201).json({ message: "Pedido creado exitosamente" })

    } catch (error) {
        await transaction.rollback()
        console.error("Error al crear pedido:", error)
        res.status(500).json({ error: "Error al crear pedido" })
    }
}

// actualiza un pedido
export const updateOrder = async (req: Request, res: Response) => {
    const body: OrderBody = req.body
    const transaction = await DB.transaction()

    try {
        let total = 0

        // Actualizamos datos generales del pedido
        await OrdersModel.update({
            clients_id: body.clients_id,
            order_date: new Date(body.order_date),
            delivery_date: body.delivery_date ? new Date(body.delivery_date) : undefined,
            notes: body.notes,
            order_status_id: body.order_status_id
        }, {
            where: { orders_id: body.orders_id },
            transaction
        })

        // Si vienen productos, eliminamos los viejos y agregamos los nuevos
        if (body.products?.length) {

            await ProductsPerOrderModel.destroy({
                where: { orders_id: body.orders_id },
                transaction
            })

            const productsToCreate = body.products.map(product => {
                total += product.quantity * product.unit_price
                return {
                    orders_id: body.orders_id,
                    products_id: product.products_id,
                    quantity: product.quantity,
                    unit_price: product.unit_price
                }
            })

            await ProductsPerOrderModel.bulkCreate(productsToCreate, { transaction })
        }

        // Actualizamos el total del pedido
        await OrdersModel.update({
            total_amount: total
        }, {
            where: { orders_id: body.orders_id },
            transaction
        })

        // Opcional: registrar el cambio de estado si quieres trackearlo
        await OrderStatusHistoryModel.create({
            orders_id: body.orders_id,
            order_status_id: body.order_status_id,
            previous_status_id: null,
            changed_by: req.user?.id,
            notes: "Pedido actualizado"
        }, { transaction })

        await transaction.commit()

        res.json({ message: "Pedido actualizado exitosamente" })

    } catch (error) {
        await transaction.rollback()
        console.error("Error al actualizar pedido:", error)
        res.status(500).json({ error: "Error al actualizar pedido" })
    }
}

// llama a todos los estatus para los pedidos
export const getAllOrderStatuses = async (req: Request, res: Response) => {
    try {
        const allStatuses = await OrderStatusModel.findAll()

        res.status(200).json(allStatuses)
    } catch (error) {
        console.error("Error al obtener los estatus disponibles de los pedidos:", error)
        res.status(500).json({ error: "Error al obtener los estatus disponibles de los pedidos" })
    }
}

// actualiza el estatus de un pedido
export const updateOrderStatus = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { order_status_id, notes }  = req.body

    const transaction = await DB.transaction()

    try {
        const order = await OrdersModel.findOne({
            where: { orders_id: id },
            raw: true,
            transaction
        })

        if (!order) {
            await transaction.rollback()
            return res.status(404).json({ error: "Pedido no encontrado" })
        }

        const notesValue = await notes ? notes : null

        await OrdersModel.update({
            order_status_id
        }, {
            where: { orders_id: id },
            transaction
        })

        await OrderStatusHistoryModel.create({
            orders_id: id,
            order_status_id,
            previous_status_id: order.order_status_id,
            changed_by: req.user?.id,
            notes: notesValue
        }, { transaction })

        await transaction.commit()

        res.json({ message: "Estado actualizado exitosamente" })

    } catch (error) {
        await transaction.rollback()
        console.error("Error al actualizar estado:", error)
        res.status(500).json({ error: "Error al actualizar estado" })
    }
}