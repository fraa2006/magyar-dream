import { Router } from 'express';
import { getPlayers, getPlayer, getPlayerStats, createPlayer, updatePlayer, deletePlayer } from '../controllers/playerController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', getPlayers);
router.get('/:id/stats', getPlayerStats);
router.get('/:id', getPlayer);
router.post('/', protect, createPlayer);
router.put('/:id', protect, updatePlayer);
router.delete('/:id', protect, deletePlayer);
export default router;
