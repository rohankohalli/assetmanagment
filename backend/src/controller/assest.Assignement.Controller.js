import Asset from "../models/Asset.js"
import sequelize from "../config/dbconfig.js"
import AssetAssignment from "../models/Asset_assignement.js"
import staff from "../models/staff.js"

export const assignAsset = async (req, res) => {
    const transaction = await sequelize.transaction()
    try {
        const { asset_id, staff_id } = req.body

        const assetRecord = await Asset.findByPk(asset_id, { transaction })
        if (!assetRecord) {
            await transaction.rollback()
            return res.status(404).json({ error: 'Asset not found' })
        }
        if (assetRecord.status !== 'available') {
            await transaction.rollback()
            return res.status(400).json({ error: 'Asset is not available for assignment' })
        }

        const staffRecord = await staff.findByPk(staff_id, { transaction })
        if (!staffRecord) {
            await transaction.rollback()
            return res.status(404).json({ error: 'Staff member not found' })
        }

        const assignment = await AssetAssignment.create({
            asset_id,
            staff_id,
            assigned_date: new Date(),
            status: 'assigned',
        }, { transaction })

        await assetRecord.update({ status: 'assigned' }, { transaction })

        await transaction.commit()
        res.status(201).json({ message: 'Asset assigned successfully', assignment })
    } catch (err) {
        await transaction.rollback()
        console.error(err)
        res.status(500).json({ error: 'Failed to assign asset' })
    }
}

export const returnAsset = async (req, res) => {
    const transaction = await sequelize.transaction()
    try {
        const { assetId } = req.params
        const { return_status = 'available' } = req.body

        const activeAssignment = await AssetAssignment.findOne({
            where: { asset_id: assetId, status: 'assigned' },
            transaction,
        })

        if (!activeAssignment) {
            await transaction.rollback()
            return res.status(400).json({ error: 'No active assignment found for this asset' })
        }

        await activeAssignment.update({
            return_date: new Date(),
            status: 'returned',
        }, { transaction })

        const assetRecord = await Asset.findByPk(assetId, { transaction })
        await assetRecord.update({ status: return_status }, { transaction })

        await transaction.commit()
        res.json({ message: 'Asset returned successfully' })
    } catch (err) {
        await transaction.rollback()
        console.error(err)
        res.status(500).json({ error: 'Failed to return asset' })
    }
}

export const getAllAssignments = async (req, res) => {
    try {
        const assignments = await AssetAssignment.findAll({
            include: [
                { model: Asset, as: 'asset', attributes: ['id', 'name', 'asset_tag', 'type'] },
                { model: staff, as: 'staff', attributes: ['id', 'name', 'email', 'department'] },
            ],
            order: [['assigned_date', 'DESC']],
        })
        res.json(assignments)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch assignments' })
    }
}