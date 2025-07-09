import express from 'express';
import {
  getAdoptions,
  getUserAdoptions,
  getShelterAdoptions,
  getAdoptionById,
  createAdoption,
  updateAdoptionStatus
} from '../controllers/adoptionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAdoptions);
router.get('/user', protect, getUserAdoptions);
router.get('/shelter', protect, getShelterAdoptions);
router.get('/:id', protect, getAdoptionById);
router.post('/', protect, createAdoption);
router.put('/:id', protect, updateAdoptionStatus);

export default router; 