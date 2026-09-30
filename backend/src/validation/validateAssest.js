export const validateCreateAsset = (req, res, next) => {
    const { name, type, asset_tag, serial_number } = req.body

    const errors = []

    if (!name || !name.trim()) errors.push('Asset name is required.')
    if (!type || !type.trim()) errors.push('Asset type is required.')
    if (!asset_tag || !asset_tag.trim()) errors.push('Asset tag is required.')
    if (!serial_number || !serial_number.trim()) errors.push('Serial number is required.')
    const validTypes = ['laptop', 'monitor', 'phone', 'other']
    if (type && !validTypes.includes(type.toLowerCase())) {
        errors.push(`Type must be one of: ${validTypes.join(', ')}`)
    }
    if (errors.length > 0) {
        return res.status(400).json({ status: 'error', errors })
    }
    next()
}

export const validateUpdateAsset = (req, res, next) => {
    const { name, type, asset_tag, serial_number, status } = req.body
    const errors = []
    if (name !== undefined && !name.trim()) errors.push('Asset name cannot be empty.')
    if (type !== undefined && !type.trim()) errors.push('Asset type cannot be empty.')
    if (asset_tag !== undefined && !asset_tag.trim()) errors.push('Asset tag cannot be empty.')
    if (serial_number !== undefined && !serial_number.trim()) errors.push('Serial number cannot be empty.')
    const validStatuses = ['available', 'assigned', 'under_repair']
    if (status && !validStatuses.includes(status.toLowerCase())) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`)
    }
    if (errors.length > 0) {
        return res.status(400).json({ status: 'error', errors })
    }
    next()
}
