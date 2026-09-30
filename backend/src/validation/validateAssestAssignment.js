export const validateAssignAsset = (req, res, next) => {
    const { asset_id, staff_id } = req.body;
    const errors = [];

    if (!asset_id) errors.push('asset_id is required');
    if (!staff_id) errors.push('staff_id is required');

    if (errors.length > 0) {
        return res.status(400).json({ status: 'error', errors });
    }
    next();
};