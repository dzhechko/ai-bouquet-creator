import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { createServer } from 'vite';
import compression from 'compression';

const app = express();
const OPENAI_API_URL = 'https://api.openai.com/v1';

// Enable compression
app.use(compression());

// Configure CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// OpenAI API proxy
app.post('/api/openai/v1/*', async (req, res) => {
  try {
    const endpoint = req.path.replace('/api/openai/v1/', '');
    const url = `${OPENAI_API_URL}/${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization,
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return res.status(response.status).json({
        error: {
          message: data.error?.message || 'OpenAI API error',
          type: data.error?.type,
          code: data.error?.code
        }
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Internal server error',
        type: 'internal_error'
      }
    });
  }
});

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }));

async function startServer() {
  try {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    app.use(vite.middlewares);

    const port = 5000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer();