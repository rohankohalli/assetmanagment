import express from 'express'
import sequelize from './config/dbconfig.js'

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const startServer = async () => {
    try {
        await sequelize.authenticate()
        console.log("Connected to Database")
        await sequelize.sync({ alter: true })

        app.listen(port, () => { console.log(`Server listening on port:${port}`) })
    } catch (err) {
        console.error("Failed to start server:", err)
    }
}

startServer()
export default app