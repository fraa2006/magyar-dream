export const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Errore interno del server';

  console.error(`[ERROR] ${status} — ${message}`);
  if (err.stack) console.error(err.stack.split('\n')[1]);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Dati non validi',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `Il campo "${field}" esiste già` });
  }

  res.status(status).json({ message, detail: process.env.NODE_ENV !== 'production' ? err.stack?.split('\n')[0] : undefined });
};
