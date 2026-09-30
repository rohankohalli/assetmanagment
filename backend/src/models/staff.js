import { DataTypes } from "sequelize"
import sequelize from "../config/dbconfig"

const staff = sequelize.define("staff", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    updatedAt: false,
})

export default staff