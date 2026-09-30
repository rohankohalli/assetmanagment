import bcrypt from 'bcryptjs'
import Users from '../models/Users.js'

export const seedDefaultAdmin = async () => {
    try {
        const defaultEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@harvest.in').trim().toLowerCase()
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Test@123'
        const defaultName = process.env.DEFAULT_ADMIN_NAME || 'IT Admin'

        const existingUser = await Users.findOne({ where: { email: defaultEmail } })
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(defaultPassword, 10)
            await Users.create({
                name: defaultName,
                email: defaultEmail,
                password: hashedPassword,
            })
            console.log(`[Seed] Default admin user created successfully: ${defaultEmail}`)
        } else {
            console.log(`[Seed] Default admin user already exists: ${defaultEmail}`)
        }
    } catch (err) {
        console.error('[Seed] Failed to seed default admin user:', err)
    }
}
