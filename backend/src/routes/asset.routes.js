import express from "express";
import { createAsset, deleteAsset, exportAssetsCsv, getAssetById, getAssets, updateAsset } from "../controller/Asset.Controller";
import { validateCreateAsset, validateUpdateAsset } from "../validation/ValidateAssest";

const router = express.Router();

router.post('/', validateCreateAsset, createAsset);
router.get('/', getAssets);
router.get('/:id', getAssetById);
router.put('/:id', validateUpdateAsset, updateAsset);
router.delete('/:id', deleteAsset);
router.get('/export/csv', exportAssetsCsv);

export default router;