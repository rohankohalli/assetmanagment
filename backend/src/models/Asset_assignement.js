import { DataTypes } from "sequelize"
import sequelize from "../config/dbconfig"

const AssetAssignment = sequelize.define("asset_assignment", {
    staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "staff",
            key: "id"
        }
    },
    asset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "asset",
            key: "id"
        }
    },
    assigned_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("assigned", "returned"),
        allowNull: false,
    }
}, {
    freezeTableName: true,
})
export default AssetAssignment