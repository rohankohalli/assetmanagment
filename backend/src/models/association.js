import Asset from "./Asset.js"
import AssetAssignment from "./Asset_assignement.js"
import staff from "./staff.js"

staff.hasMany(AssetAssignment, { foreignKey: "staff_id", as: "assignments" })
AssetAssignment.belongsTo(staff, { foreignKey: "staff_id", as: "staff" })

Asset.hasMany(AssetAssignment, { foreignKey: "asset_id", as: "assignments" })
AssetAssignment.belongsTo(Asset, { foreignKey: "asset_id", as: "asset" })