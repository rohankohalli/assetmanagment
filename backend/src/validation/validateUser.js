export const validateLogin = (req, res, next) => {
    const { email, password } = req.body
    const errors = []

    if (!email || !email.trim()) errors.push('Email is required')
    if (!password || !password.trim()) errors.push('Password is required')

    if (errors.length > 0) {
        return res.status(400).json({ status: 'error', errors })
    }
    next()
}

export const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body
    const errors = []

    if (!name || !name.trim()) errors.push('Name is required')
    if (!email || !email.trim()) errors.push('Email is required')
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.push('Valid email format is required')
    }
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters')
    }

    if (errors.length > 0) {
        return res.status(400).json({ status: 'error', errors })
    }
    next()
}