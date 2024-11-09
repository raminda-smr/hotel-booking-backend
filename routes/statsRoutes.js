import expres from "express"
import { getModuleStats } from "../controllers/StatsController.js"

let statsRoutes = expres.Router()

statsRoutes.get('/get-module-stats', getModuleStats)


export default statsRoutes