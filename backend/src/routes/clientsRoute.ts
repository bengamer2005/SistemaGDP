import { Router } from "express"
import { getAllClients, createClient, updateClient } from "../controller/clientsController"

const router = Router()

router.get("/get/clientsInfo", getAllClients)
router.post("/create", createClient)
router.put("/edit", updateClient)

export default router