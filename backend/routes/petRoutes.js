import express from 'express';
import { createPet, getAllPets } from '../controllers/petController.js';

const router = express.Router();

router.get('/', getAllPets);
router.post('/', createPet);

export default router;