export const validateCreateStaff = (req, res, next) => {
    const { name, email, department } = req.body
    const errors = []

    if (!name || !name.trim()) errors.push('Staff name is required')
    if (!email || !email.trim()) errors.push('Email is required')
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.push('Valid email format is required')
    }
    if (!department || !department.trim()) errors.push('Department is required')

    if (errors.length > 0) {
        return res.status(400).json({ status: 'error', errors })
    }
    next()
}