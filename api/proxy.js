jsmodule.exports = async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send('No URL provided');

  try {
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9',
      }
    });

    const contentType = response.headers.get('content-type') || 'text/html';
    const body = await response.text();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Frame-Options', 'ALLOWALL');

    res.send(body);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
};
