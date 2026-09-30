import Asset from "./Asset";
import AssetAssignment from "./Asset_assignement";
import staff from "./staff";

staff.hasMany(AssetAssignment, { foreignKey: "staff_id", as: "assignments" });
AssetAssignment.belongsTo(staff, { foreignKey: "staff_id", as: "staff" });

Asset.hasMany(AssetAssignment, { foreignKey: "asset_id", as: "assignments" });
AssetAssignment.belongsTo(Asset, { foreignKey: "asset_id", as: "asset" });