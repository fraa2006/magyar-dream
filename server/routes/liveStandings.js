import { Router } from 'express';
import { getLiveStandings, getLiveLeagues } from '../controllers/liveStandingsController.js';

const router = Router();
router.get('/', getLiveLeagues);
router.get('/:leagueKey', getLiveStandings);
export default router;
