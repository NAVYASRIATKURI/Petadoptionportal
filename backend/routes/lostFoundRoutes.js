import express from 'express';
import { getAllReports, createReport, updateReport } from '../controllers/lostFoundController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllReports).post(protect, createReport);
router.route('/:id').put(protect, updateReport);

export default router;