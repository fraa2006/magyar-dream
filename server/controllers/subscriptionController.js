import User from '../models/User.js';

export const upgrade = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isPremium: true, premiumSince: new Date() },
      { new: true }
    );
    res.json({
      message: 'Abbonamento Premium attivato con successo!',
      user: {
        id: user._id,
        isPremium: user.isPremium,
        premiumSince: user.premiumSince,
      },
    });
  } catch (err) { next(err); }
};

export const cancel = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isPremium: false });
    res.json({ message: 'Abbonamento cancellato.' });
  } catch (err) { next(err); }
};
