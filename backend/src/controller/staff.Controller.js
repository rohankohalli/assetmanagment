import { Op } from "sequelize"
import staff from "../models/staff.js"
import AssetAssignment from "../models/Asset_assignement.js"
import Asset from "../models/Asset.js"

export const createStaff = async (req, res) => {
    try {
        const { name, email, department } = req.body

        const existing = await staff.findOne({ where: { email: email.trim().toLowerCase() } })
        if (existing) {
            return res.status(409).json({ error: 'Staff email already exists' })
        }

        const newStaff = await staff.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            department: department.trim(),
        })

        res.status(201).json(newStaff)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create staff' })
    }
}

export const getAllStaff = async (req, res) => {
    try {
        const staffList = await staff.findAll({
            include: [
                {
                    model: AssetAssignment,
                    as: 'assignments',
                    where: { status: 'assigned' },
                    required: false,
                },
            ],
            order: [['name', 'ASC']],
        })

        const formatted = staffList.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            department: s.department,
            assets_held_count: s.assignments ? s.assignments.length : 0,
        }))

        res.json(formatted)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch staff list' })
    }
}

export const getStaffById = async (req, res) => {
    try {
        const staffMember = await staff.findByPk(req.params.id, {
            include: [
                {
                    model: AssetAssignment,
                    as: 'assignments',
                    include: [{ model: Asset, as: 'asset' }],
                    order: [['assigned_date', 'DESC']],
                },
            ],
        })

        if (!staffMember) return res.status(404).json({ error: 'Staff member not found' })

        const currently_held = staffMember.assignments
            .filter(a => a.status === 'assigned')
            .map(a => a.asset)

        res.json({
            id: staffMember.id,
            name: staffMember.name,
            email: staffMember.email,
            department: staffMember.department,
            currently_held,
            assignment_history: staffMember.assignments,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch staff profile' })
    }
}
