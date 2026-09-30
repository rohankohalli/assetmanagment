import { Op } from "sequelize"
import Asset from "../models/Asset.js"
import AssetAssignment from "../models/Asset_assignement.js"
import staff from "../models/staff.js"

export const createAsset = async (req, res) => {
    try {
        const { name, type, asset_tag, serial_number, status } = req.body

        const existing = await Asset.findOne({
            where: {
                [Op.or]: [{ asset_tag }, { serial_number }],
            },
        })

        if (existing) {
            return res.status(409).json({
                error: 'Asset tag or serial number already exists in system'
            })
        }

        const asset = await Asset.create({ name, type, asset_tag, serial_number, status: status || 'available' })
        res.status(201).json(asset)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create asset' })
    }
}

export const getAssets = async (req, res) => {
    try {
        const { status, type, search } = req.query;
        const where = {};
        if (status && status !== 'All') where.status = status.toLowerCase();
        if (type && type !== 'All') where.type = type.toLowerCase();
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { asset_tag: { [Op.like]: `%${search}%` } },
                { serial_number: { [Op.like]: `%${search}%` } },
            ];
        }
        const assets = await Asset.findAll({
            where,
            include: [
                {
                    model: AssetAssignment,
                    as: 'assignments',
                    where: { status: 'assigned' },
                    required: false, // LEFT JOIN to show available assets too
                    include: [{ model: staff, as: 'staff', attributes: ['id', 'name', 'department'] }],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        // Format for frontend
        const formatted = assets.map(a => ({
            id: a.id,
            name: a.name,
            type: a.type,
            asset_tag: a.asset_tag,
            serial_number: a.serial_number,
            status: a.status,
            current_holder: a.assignments?.[0]?.staff?.name || null,
            holder_department: a.assignments?.[0]?.staff?.department || null,
        }));
        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
};

export const getAssetById = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id, {
            include: [
                {
                    model: AssetAssignment,
                    as: 'assignments',
                    include: [{ model: staff, as: 'staff', attributes: ['id', 'name', 'email', 'department'] }],
                    order: [['assigned_date', 'DESC']],
                },
            ],
        });
        if (!asset) return res.status(404).json({ error: 'Asset not found' });
        res.json(asset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch asset details' });
    }
};

export const updateAsset = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) return res.status(404).json({ error: 'Asset not found' });
        const { name, type, asset_tag, serial_number, status } = req.body;
        // Check if new tag/serial conflicts with another asset
        if (asset_tag !== asset.asset_tag || serial_number !== asset.serial_number) {
            const existing = await Asset.findOne({
                where: {
                    [Op.or]: [{ asset_tag: asset_tag || '' }, { serial_number: serial_number || '' }],
                    id: { [Op.ne]: req.params.id },
                },
            });
            if (existing) {
                return res.status(409).json({ error: 'Asset tag or serial number already in use by another asset' });
            }
        }
        await asset.update({
            name: name ?? asset.name,
            type: type ? type.toLowerCase() : asset.type,
            asset_tag: asset_tag ?? asset.asset_tag,
            serial_number: serial_number ?? asset.serial_number,
            status: status ? status.toLowerCase() : asset.status,
        });
        res.json(asset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update asset' });
    }
};
// 5. DELETE /api/assets/:id - Delete asset (only if available)
export const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) return res.status(404).json({ error: 'Asset not found' });
        if (asset.status !== 'available') {
            return res.status(400).json({ error: 'Cannot delete an asset that is currently assigned or under repair' });
        }
        await asset.destroy();
        res.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete asset' });
    }
};
// 6. GET /api/assets/export/csv - CSV data dump
export const exportAssetsCsv = async (req, res) => {
    try {
        const assets = await Asset.findAll({
            include: [
                {
                    model: AssetAssignment,
                    as: 'assignments',
                    where: { status: 'assigned' },
                    required: false,
                    include: [{ model: staff, as: 'staff', attributes: ['name', 'department'] }],
                },
            ],
            order: [['name', 'ASC']],
        });
        const data = assets.map(a => ({
            asset_tag: a.asset_tag,
            name: a.name,
            type: a.type,
            serial_number: a.serial_number,
            status: a.status,
            current_holder: a.assignments?.[0]?.staff?.name || 'N/A',
            department: a.assignments?.[0]?.staff?.department || 'N/A',
        }));
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to export assets' });
    }
};