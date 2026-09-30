import express from "express"
import { createAsset, deleteAsset, exportAssetsCsv, getAssetById, getAssets, updateAsset } from "../controller/asset.Controller.js"
import { validateCreateAsset, validateUpdateAsset } from "../validation/validateAssest.js"

const router = express.Router()

router.post('/', validateCreateAsset, createAsset)
router.get('/', getAssets)
router.get('/export/csv', exportAssetsCsv)
router.get('/:id', getAssetById)
router.put('/:id', validateUpdateAsset, updateAsset)
router.delete('/:id', deleteAsset)

export default router