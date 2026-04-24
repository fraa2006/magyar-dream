import { Router } from 'express';
import { getStandings, getTopScorers } from '../controllers/standingController.js';

const router = Router();
router.get('/:leagueSlug/scorers', getTopScorers);
router.get('/:leagueSlug/scorers/:seasonName', getTopScorers);
router.get('/:leagueSlug', getStandings);
router.get('/:leagueSlug/:seasonName', getStandings);
export default router;
