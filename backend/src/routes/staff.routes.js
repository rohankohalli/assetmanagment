import express from 'express'
import { validateCreateStaff } from '../validation/validateStaff'
import { createStaff, getAllStaff, getStaffById } from '../controller/staff.Controller'

const router = express.Router()

router.post('/', validateCreateStaff, createStaff)
router.get('/', getAllStaff)
router.get('/:id', getStaffById)