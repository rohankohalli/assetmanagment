import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig";

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
        type: DataTypes.ENUM("available", "assigned", "maintenance"),
        allowNull: false
    },
}, {
    freezeTableName: true,
    updatedAt: false,
})

export default staff