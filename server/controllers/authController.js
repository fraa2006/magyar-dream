import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const formatUser = (user) => ({
  id: user._id,
  username: user.username,
  name: user.name || user.username,
  email: user.email,
  role: user.role,
  isPremium: user.isPremium,
  premiumSince: user.premiumSince,
  position: user.position,
  bio: user.bio,
});

export const register = async (req, res, next) => {
  try {
    const { username, name, email, password, position } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Username, email e password sono richiesti' });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res.status(400).json({ message: 'Email o username già in uso' });

    const user = await User.create({
      username,
      name: name || username,
      email,
      password,
      position: position || '',
      role: 'user',
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email e password richieste' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Credenziali non valide' });

    const token = signToken(user._id);
    res.json({ token, user: formatUser(user) });
  } catch (err) { next(err); }
};

export const getMe = async (req, res) => {
  res.json({ user: formatUser(req.user) });
};

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Token Google mancante' });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, given_name, family_name } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 100);
      user = await User.create({
        googleId,
        email,
        username,
        name: name || `${given_name} ${family_name}`,
        password: Math.random().toString(36) + Math.random().toString(36),
        role: 'user',
      });
    }

    const token = signToken(user._id);
    res.json({ token, user: formatUser(user) });
  } catch (err) { next(err); }
};
