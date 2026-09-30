import { DataTypes } from "sequelize"
import sequelize from "../config/dbconfig.js"

const Users = sequelize.define("users", {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // role: {
    //     type: DataTypes.ENUM("ITAdmin"),
    //     defaultValue: "ITAdmin",
    //     allowNull: false
    // },
})

export default Users
