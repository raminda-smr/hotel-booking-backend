import expres from "express"
import { getDashboardBookingStats, getModuleStats } from "../controllers/StatsController.js"

let statsRoutes = expres.Router()

statsRoutes.get('/get-module-stats', getModuleStats)
statsRoutes.get('/get-dashboad-booking-data', getDashboardBookingStats)


export default statsRoutes