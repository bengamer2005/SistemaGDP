import { Router } from "express"
import { getAllProducts, createProducts, bulkCreateProducts, updateProducts } from "../controller/productsController"
import authUser from "../middleware/authUser"
import { upload } from "../middleware/upload"

const router = Router()

router.get("/products", authUser, getAllProducts)
router.post("/products", authUser, createProducts)
router.post("/products/bulk", upload.single("file"), authUser, bulkCreateProducts)

export default router