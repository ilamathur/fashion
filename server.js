import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const fallback = {
  summary: {
    velocity: 'Live sources temporarily unavailable',
    topTheme: 'Spring 2026 runway reports',
    stylingFocus: 'Layered tailoring and statement texture',
  },
  editorNote:
    'We could not reach the live fashion sources just now, so this view is showing a backup edit based on recent runway reporting.',
  palette: [
    { name: 'Rose Smoke', hex: '#d9a6a0', note: 'Muted pinks continue to replace louder brights.' },
    { name: 'Butter Cream', hex: '#f4df9b', note: 'Soft yellow neutrals are still strong in knits and accessories.' },
    { name: 'Espresso Gloss', hex: '#5a3a2c', note: 'Deep brown leather remains a grounding accent.' },
  ],
  trends: [
    {
      category: 'Runway',
      name: 'Uniform dressing',
      momentum: 'Current',
      description: 'A polished, repeatable wardrobe formula is dominating the season with tailored separates and practical styling.',
      keyPieces: ['structured blazer', 'column skirt', 'refined loafer'],
      source: 'Backup trend edit',
    },
    {
      category: 'Romance',
      name: 'Rococo flourishes',
      momentum: 'Current',
      description: 'Decorative volume, ornate trims, and historical references are adding drama to otherwise modern silhouettes.',
      keyPieces: ['ruffled blouse', 'full skirt', 'embellished heel'],
      source: 'Backup trend edit',
    },
    {
      category: 'Texture',
      name: 'Fringe and movement',
      momentum: 'Current',
      description: 'Pieces with swing, fringe, and tactile finishes are creating motion both on the runway and in retail edits.',
      keyPieces: ['fringe dress', 'textured knit', 'statement bag'],
      source: 'Backup trend edit',
    },
  ],
};

const LIVE_SOURCES = [
  {
    name: 'Vogue',
    url: 'https://www.vogue.com/article/the-spring-2026-trend-report-a-season-of-uniform-dressing-rococo-flourishes-and-much-more',
  },
  {
    name: 'ELLE',
    url: 'https://www.elle.com/fashion/trend-reports/a70290808/spring-2026-statement-fashion-trends-photos/',
  },
  {
    name: "Harper's Bazaar",
    url: 'https://www.harpersbazaar.com/fashion/fashion-week/a69000477/spring-2026-paris-fashion-week-trends//',
  },
];

const trendDefinitions = [
  {
    category: 'Runway',
    name: 'Uniform dressing',
    matchers: ['uniform dressing', 'uniform style', 'club khaki'],
    description:
      'Tailored separates and repeatable outfit formulas are leading the conversation, with khaki, suiting, and polished staples showing up across runway coverage.',
    keyPieces: ['tailored jacket', 'khaki separates', 'sleek loafer'],
    palette: { name: 'Club Khaki', hex: '#b8a27a', note: 'Utility khaki is surfacing as a refined neutral.' },
  },
  {
    category: 'Romance',
    name: 'Rococo flourishes',
    matchers: ['rococo', 'panniers', 'petticoats', 'marie antoinette'],
    description:
      'Historical romance is back through panniers, decorative volume, and ornate detailing that make evening and occasionwear feel theatrical.',
    keyPieces: ['corseted top', 'full skirt', 'ornate pump'],
    palette: { name: 'Powder Petal', hex: '#d8b7c8', note: 'Powdery pinks echo the season’s romantic mood.' },
  },
  {
    category: 'Texture',
    name: 'Fringe and movement',
    matchers: ['fringe', 'streamers', 'trains', 'feathery'],
    description:
      'Swingy trims and tactile surfaces are adding motion to dresses, tops, and accessories in the latest runway reports.',
    keyPieces: ['fringe dress', 'textured top', 'swing bag'],
    palette: { name: 'Espresso Gloss', hex: '#5a3a2c', note: 'Rich brown grounds the season’s more expressive textures.' },
  },
  {
    category: 'Silhouette',
    name: 'Drop-waist and elongated lines',
    matchers: ['drop-waisted', 'drop waist', 'tunic', 'trouser'],
    description:
      'Longer lines and low-slung proportions are reshaping dresses and layered looks, especially in tunic-over-trouser styling.',
    keyPieces: ['drop-waist dress', 'tunic top', 'fluid trouser'],
    palette: { name: 'Butter Cream', hex: '#f4df9b', note: 'Soft buttery tones keep elongated silhouettes feeling light.' },
  },
  {
    category: 'Mood',
    name: 'Gothic romance',
    matchers: ['gothic', 'victorian', 'black lace'],
    description:
      'Dark romance is gaining traction through black lace, dramatic gowns, and Victorian-inspired styling cues.',
    keyPieces: ['lace gown', 'dark heel', 'dramatic earring'],
    palette: { name: 'Midnight Plum', hex: '#4b3148', note: 'Inky plum tones support the gothic mood.' },
  },
];

function buildLivePayload(articles) {
  const combinedText = articles.map((article) => article.text.toLowerCase()).join(' ');

  const matched = trendDefinitions
    .map((definition) => {
      const hits = definition.matchers.reduce((count, matcher) => {
        const escaped = matcher.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'g');
        return count + ((combinedText.match(regex) || []).length);
      }, 0);

      return { ...definition, hits };
    })
    .filter((item) => item.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 4);

  const trends = (matched.length ? matched : trendDefinitions.slice(0, 4)).map((item, index) => ({
    category: item.category,
    name: item.name,
    momentum: item.hits >= 4 ? 'Surging' : item.hits >= 2 ? 'Rising' : 'Emerging',
    description: item.description,
    keyPieces: item.keyPieces,
    source: articles[index % articles.length]?.name || 'Live fashion sources',
  }));

  const palette = [];
  for (const item of matched.length ? matched : trendDefinitions.slice(0, 3)) {
    if (!palette.find((entry) => entry.name === item.palette.name)) {
      palette.push(item.palette);
    }
  }

  const topTheme = trends[0]?.name || fallback.summary.topTheme;
  const stylingFocus = trends[1]?.name || trends[0]?.name || fallback.summary.stylingFocus;

  return {
    updatedAt: new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    fetchedAt: new Date().toISOString(),
    sourceCount: articles.length,
    sourceNames: articles.map((article) => article.name),
    summary: {
      velocity: `${articles.length} live source${articles.length === 1 ? '' : 's'} checked just now`,
      topTheme,
      stylingFocus,
    },
    editorNote: `Live trend pulse built from ${articles.map((article) => article.name).join(', ')}. Refreshing re-checks those sources and updates the timestamp.`,
    palette,
    trends,
  };
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/trends', async (req, res) => {
  try {
    const responses = await Promise.allSettled(
      LIVE_SOURCES.map((source) => axios.get(source.url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } }))
    );

    const articles = responses
      .map((result, index) => {
        if (result.status !== 'fulfilled') {
          return null;
        }

        const text = String(result.value.data)
          .replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<style[\s\S]*?<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        return {
          name: LIVE_SOURCES[index].name,
          text,
        };
      })
      .filter(Boolean);

    if (!articles.length) {
      res.json({
        ...fallback,
        updatedAt: new Date().toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
        fetchedAt: new Date().toISOString(),
        sourceCount: 0,
        sourceNames: [],
      });
      return;
    }

    res.json(buildLivePayload(articles));
  } catch {
    res.json({
      ...fallback,
      updatedAt: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      fetchedAt: new Date().toISOString(),
      sourceCount: 0,
      sourceNames: [],
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(process.env.PORT || 3001);
