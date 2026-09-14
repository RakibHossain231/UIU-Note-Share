export default async function handler(req, res) {
  const { id } = req.query || {};
  if (!id) {
    return res.status(400).send('Missing file id');
  }

  try {
    const driveUrl = 'https://drive.usercontent.google.com/download?id=' + id + '&export=download&confirm=t';
    const driveRes = await fetch(driveUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });

    if (!driveRes.ok) {
      return res.status(driveRes.status).send('Failed to fetch from Google Drive');
    }

    const contentType = driveRes.headers.get('content-type') || 'application/pdf';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');

    const arrayBuffer = await driveRes.arrayBuffer();
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Drive proxy error:', err);
    return res.status(500).send('Internal proxy error');
  }
}
