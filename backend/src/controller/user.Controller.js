import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Users from '../models/Users.js'

const JWT_SECRET = process.env.JWT_SECRET

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existing = await Users.findOne({ where: { email: email.trim().toLowerCase() } })
        if (existing) {
            return res.status(409).json({ error: 'User with this email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await Users.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
        })

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, name: user.name, email: user.email },
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Registration failed' })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await Users.findOne({ where: { email: email.trim().toLowerCase() } })
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email },
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Login failed' })
    }
}