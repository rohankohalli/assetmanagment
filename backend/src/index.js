import express from 'express'
import sequelize from './config/dbconfig.js'
import assestRoutes from './routes/asset.routes.js'
import staffRoutes from './routes/staff.routes.js'
import assestAssignmentRoutes from './routes/assest-assingnment.routes.js'
import userRoutes from './routes/user.routes.js'
import './models/association.js'
import cors from 'cors'
import { verifyToken } from './middleware/auth.js'
import { seedDefaultAdmin } from './utils/seedAdmin.js'

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/assets", verifyToken, assestRoutes)
app.use("/api/staff", verifyToken, staffRoutes)
app.use("/api/assigned-assets", verifyToken, assestAssignmentRoutes)
app.use("/api/users", userRoutes)

const startServer = async () => {
    try {
        await sequelize.authenticate()
        console.log("Connected to Database")
        await sequelize.sync()
        await seedDefaultAdmin()

        app.listen(port, () => { console.log(`Server listening on port:${port}`) })
    } catch (err) {
        console.error("Failed to start server:", err)
    }
}

startServer()

export default app