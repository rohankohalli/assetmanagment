import express from 'express'
import { assignAsset, returnAsset, getAllAssignments } from '../controller/assest.Assignement.Controller.js'
import { validateAssignAsset } from '../validation/validateAssestAssignment.js'

const router = express.Router()

router.get('/', getAllAssignments)
router.post('/assign', validateAssignAsset, assignAsset)
router.post('/return/:assetId', returnAsset)

export default router