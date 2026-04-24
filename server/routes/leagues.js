import { Router } from 'express';
import { getLeagues, getLeague, createLeague, updateLeague, getSeasons, createSeason } from '../controllers/leagueController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', getLeagues);
router.get('/:slug', getLeague);
router.get('/:slug/seasons', getSeasons);
router.post('/', protect, createLeague);
router.put('/:id', protect, updateLeague);
router.post('/seasons', protect, createSeason);
export default router;
