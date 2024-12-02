import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const DEBUG = process.env.DEBUG === 'true';

const log = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[Server Debug] ${new Date().toISOString()} ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    log('Completion endpoint called');

    if (!req.headers.authorization) {
      log('Missing Authorization header');
      return res.status(400).json({
        error: {
          message: 'Missing Authorization header',
          type: 'validation_error'
        }
      });
    }

    if (!req.headers['x-folder-id']) {
      log('Missing x-folder-id header');
      return res.status(400).json({
        error: {
          message: 'Missing x-folder-id header',
          type: 'validation_error'
        }
      });
    }

    const url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';
    
    log('Request body:', JSON.stringify(req.body, null, 2));

    const response = await axios({
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization,
        'x-folder-id': req.headers['x-folder-id']
      },
      data: req.body,
      timeout: 60000,
      validateStatus: null
    });

    log('YandexGPT API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: JSON.stringify(response.data, null, 2)
    });

    if (response.status !== 200) {
      log('YandexGPT API Error Response:', response.data);
      return res.status(response.status).json({
        error: {
          message: response.data.message || 'YandexGPT API error',
          type: 'api_error',
          details: response.data
        }
      });
    }

    return res.json(response.data);
  } catch (error: any) {
    log('Completion endpoint error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      response: error.response?.data,
      stack: error.stack
    });

    return res.status(500).json({
      error: {
        message: error.message || 'Failed to communicate with YandexGPT API',
        type: 'api_error',
        details: error.response?.data
      }
    });
  }
} 