import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getAllPosts, 
  createPost, 
  getPostById, 
  addComment,
  likePost,
  unlikePost,
  addReaction
} from '../controllers/communityController.js';

const router = express.Router();

router.route('/').get(getAllPosts).post(protect, createPost);
router.route('/:id').get(getPostById);
router.route('/:id/comments').post(protect, addComment);
// Fix: Update route paths to remove 'posts' segment
router.route('/:id/like').post(protect, likePost).delete(protect, unlikePost);
router.route('/:id/reaction').post(protect, addReaction);

export default router;