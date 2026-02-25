import { Router } from "express"
import { getAllClients, createClient } from "../controller/clientsController"

const router = Router()

router.get("/get/clientsInfo", getAllClients)
router.post("/create", createClient)

export default router