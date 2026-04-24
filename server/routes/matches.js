import { Router } from 'express';
import { getMatches, getMatch, createMatch, updateMatch, deleteMatch } from '../controllers/matchController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', getMatches);
router.get('/:id', getMatch);
router.post('/', protect, createMatch);
router.put('/:id', protect, updateMatch);
router.delete('/:id', protect, deleteMatch);
export default router;
