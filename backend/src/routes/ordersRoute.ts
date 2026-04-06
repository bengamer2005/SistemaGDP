import { Router } from "express"
import { getAllOrders, createOrder, updateOrder, getAllOrderStatuses, updateOrderStatus } from "../controller/ordersController"
import authUser from "../middleware/authUser"

const router = Router()

router.get("/orders", authUser, getAllOrders)
router.post("/orders", authUser, createOrder)
router.put("/orders", authUser, updateOrder)
router.get("/orders/status", authUser, getAllOrderStatuses)
router.put("/orders/status/change/:id", authUser, updateOrderStatus)

export default router