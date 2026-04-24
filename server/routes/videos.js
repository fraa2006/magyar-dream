import { Router } from 'express';
import { getVideos, createVideo, deleteVideo, incrementViews } from '../controllers/videoController.js';
import { protect, requirePremium } from '../middleware/auth.js';

const router = Router();
router.get('/', getVideos);
router.post('/', protect, requirePremium, createVideo);
router.delete('/:id', protect, deleteVideo);
router.post('/:id/view', incrementViews);
export default router;
