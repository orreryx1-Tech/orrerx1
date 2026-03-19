export const config = {
  api: { bodyParser: false, externalResolver: true },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const KEY = process.env.TWELVE_DATA_KEY;
  if (!KEY) return res.status(500).json({ error: 'TWELVE_DATA_KEY not set in Vercel environment variables.' });

  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'symbols param required' });

  const safe = decodeURIComponent(symbols).replace(/[^A-Z0-9,/. ]/gi, '').substring(0, 500);

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(safe)}&apikey=${KEY}`;
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!r.ok) return res.status(r.status).json({ error: `Twelve Data error ${r.status}` });
    return res.status(200).json(await r.json());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
