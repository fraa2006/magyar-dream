import { Router } from 'express';
import { upgrade, cancel } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/upgrade', protect, upgrade);
router.post('/cancel', protect, cancel);
export default router;
