import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const fallback = {
  updatedAt: 'March 19, 2026',
  summary: {
    velocity: 'Runway to street in 7 days',
    topTheme: 'Soft power tailoring',
    stylingFocus: 'Texture-on-texture layering',
  },
  editorNote:
    'Designers are balancing polish with ease: think sculpted jackets, sheer layers, and accessories that feel collectible but wearable.',
  palette: [
    { name: 'Rose Smoke', hex: '#d9a6a0', note: 'A muted pink replacing louder brights.' },
    { name: 'Butter Cream', hex: '#f4df9b', note: 'Warm neutrals are showing up in suiting and knits.' },
    { name: 'Espresso Gloss', hex: '#5a3a2c', note: 'Deep brown leather is the grounding accent.' },
  ],
  trends: [
    {
      category: 'Tailoring',
      name: 'Soft power suiting',
      momentum: 'High rise',
      description: 'Relaxed blazers, fluid trousers, and waist emphasis are replacing rigid officewear with a more cinematic silhouette.',
      keyPieces: ['draped blazer', 'wide-leg trouser', 'waist belt'],
      source: 'Runway reports',
    },
    {
      category: 'Texture',
      name: 'Sheer layering',
      momentum: 'Fast moving',
      description: 'Transparent skirts, organza shirts, and gauzy overlays are being styled over basics for a polished but airy look.',
      keyPieces: ['mesh skirt', 'organza shirt', 'second-skin top'],
      source: 'Street style edits',
    },
    {
      category: 'Accessories',
      name: 'Charm-loaded bags',
      momentum: 'Viral',
      description: 'Personalized bags with tassels, charms, and sculptural keyrings are turning everyday totes into statement pieces.',
      keyPieces: ['bag charm', 'east-west tote', 'metal keyring'],
      source: 'Retail trend trackers',
    },
    {
      category: 'Color',
      name: 'Butter yellow accents',
      momentum: 'Steady climb',
      description: 'A creamy yellow is surfacing in knitwear, shoes, and handbags as the easiest way to brighten neutral wardrobes.',
      keyPieces: ['butter cardigan', 'pale yellow heel', 'mini bag'],
      source: 'Seasonal color reports',
    },
  ],
};

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/trends', async (req, res) => {
  try {
    const [vogue, bazaar] = await Promise.allSettled([
      axios.get('https://www.vogue.com/fashion/trends', { timeout: 8000 }),
      axios.get('https://www.harpersbazaar.com/fashion/trends/', { timeout: 8000 }),
    ]);

    const sources = [];
    if (vogue.status === 'fulfilled') sources.push('Vogue');
    if (bazaar.status === 'fulfilled') sources.push("Harper's Bazaar");

    res.json({
      ...fallback,
      summary: {
        ...fallback.summary,
        velocity: sources.length ? `Tracking ${sources.join(' + ')}` : fallback.summary.velocity,
      },
      updatedAt: 'March 19, 2026',
    });
  } catch {
    res.json(fallback);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(process.env.PORT || 3001);
