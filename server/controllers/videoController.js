import Video from '../models/Video.js';

const toEmbedUrl = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
};

export const getVideos = async (req, res, next) => {
  try {
    const { position } = req.query;
    const filter = position ? { position } : {};
    const videos = await Video.find(filter)
      .populate('user', 'username name position')
      .sort({ createdAt: -1 });
    const result = videos.map((v) => ({
      ...v.toObject(),
      embedUrl: toEmbedUrl(v.videoUrl),
    }));
    res.json(result);
  } catch (err) { next(err); }
};

export const createVideo = async (req, res, next) => {
  try {
    const { title, description, videoUrl, position } = req.body;
    if (!title || !videoUrl)
      return res.status(400).json({ message: 'Titolo e URL video sono richiesti' });

    const video = await Video.create({
      user: req.user._id,
      title,
      description: description || '',
      videoUrl,
      position: position || req.user.position || '',
    });
    await video.populate('user', 'username name position');
    res.status(201).json({ ...video.toObject(), embedUrl: toEmbedUrl(video.videoUrl) });
  } catch (err) { next(err); }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video non trovato' });
    if (video.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Non autorizzato' });
    await video.deleteOne();
    res.json({ message: 'Video eliminato' });
  } catch (err) { next(err); }
};

export const incrementViews = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
