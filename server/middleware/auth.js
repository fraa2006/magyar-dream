import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) return res.status(401).json({ message: 'Non autorizzato' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'Utente non trovato' });
    next();
  } catch {
    res.status(401).json({ message: 'Token non valido' });
  }
};

export const requirePremium = (req, res, next) => {
  const isAdmin = ['admin', 'superadmin'].includes(req.user?.role);
  if (!req.user?.isPremium && !isAdmin)
    return res.status(403).json({ message: 'Abbonamento Premium richiesto' });
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!['admin', 'superadmin'].includes(req.user?.role))
    return res.status(403).json({ message: 'Accesso riservato agli amministratori' });
  next();
};
