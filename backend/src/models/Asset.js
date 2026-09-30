import { DataTypes } from "sequelize"
import sequelize from "../config/dbconfig"

const Asset = sequelize.define("asset", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM("laptop", "monitor", "phone", "other"),
        allowNull: false
    },
    asset_tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    serial_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM("available", "assigned", "under_repair"),
        allowNull: false
    },
}, {
    freezeTableName: true,
    updatedAt: false,
})

export default Asset