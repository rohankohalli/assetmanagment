import express from 'express'
import { validateCreateStaff } from '../validation/validateStaff.js'
import { createStaff, getAllStaff, getStaffById } from '../controller/staff.Controller.js'

const router = express.Router()

router.post('/', validateCreateStaff, createStaff)
router.get('/', getAllStaff)
router.get('/:id', getStaffById)

export default router