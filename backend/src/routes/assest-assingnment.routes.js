import express from 'express'
import { assignAsset, returnAsset, getAllAssignments } from '../controller/assignment.Controller.js'
import { validateAssignAsset } from '../validation/validateAssignment.js'

const router = express.Router()

router.get('/', getAllAssignments)
router.post('/assign', validateAssignAsset, assignAsset)
router.post('/return/:assetId', returnAsset)

export default router