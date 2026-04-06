import { Router } from "express"
import { getAllClients, createClient, updateClient, deleteClient } from "../controller/clientsController"
import authUser from "../middleware/authUser"

const router = Router()

router.get("/clients/get/clientsInfo", authUser, getAllClients)
router.post("/clients/create", authUser, createClient)
router.delete("/clients/delete/:clientId", authUser, deleteClient)    
router.put("/clients/edit", authUser, updateClient)


export default router