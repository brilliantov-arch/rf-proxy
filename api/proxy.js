jsconst https = require('https');
const http = require('http');
const { URL } = require('url');

module.exports = async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send('No URL');

  try {
    const url = new URL(target);
    const lib = url.protocol === 'https:' ? https : http;

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9',
      }
    };

    lib.get(options, (proxyRes) => {
      const ct = proxyRes.headers['content-type'] || 'text/html';
      res.setHeader('Content-Type', ct);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.removeHeader('x-frame-options');
      res.removeHeader('content-security-policy');
      proxyRes.pipe(res);
    }).on('error', (e) => {
      res.status(500).send('Ошибка: ' + e.message);
    });

  } catch(e) {
    res.status(500).send('Ошибка: ' + e.message);
  }
};
