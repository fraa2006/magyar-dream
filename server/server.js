import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import leagueRoutes from './routes/leagues.js';
import teamRoutes from './routes/teams.js';
import matchRoutes from './routes/matches.js';
import playerRoutes from './routes/players.js';
import standingRoutes from './routes/standings.js';
import subscriptionRoutes from './routes/subscription.js';
import videoRoutes from './routes/videos.js';
import liveStandingsRoutes from './routes/liveStandings.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

connectDB().catch((err) => {
  console.error('⚠️  Server avviato SENZA database — le route API falliranno finché Atlas non è raggiungibile');
  console.error('   Errore:', err.message);
});

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({ status: 'ok', db: states[mongoose.connection.readyState] });
});
app.use('/api/auth', authRoutes);
app.use('/api/leagues', leagueRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/standings', standingRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/live', liveStandingsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Magyar Dream server running on port ${PORT}`));
