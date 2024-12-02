import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEBUG = process.env.DEBUG === 'true';

const log = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[Server Debug] ${new Date().toISOString()} ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

const logHeaders = (prefix: string, headers: any) => {
  if (DEBUG) {
    console.log(`[Header Debug] ${prefix}:`, {
      type: typeof headers,
      isArray: Array.isArray(headers),
      keys: Object.keys(headers),
      values: Object.entries(headers).map(([key, value]) => ({
        key,
        value,
        type: typeof value,
        isArray: Array.isArray(value)
      }))
    });
  }
};

const getHeaderValue = (value: string | string[] | undefined): string => {
  if (DEBUG) {
    console.log('[Header Value Debug]:', {
      value,
      type: typeof value,
      isArray: Array.isArray(value)
    });
  }
  
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return value || '';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    logHeaders('Incoming Request Headers', req.headers);

    const apiKey = getHeaderValue(req.headers.authorization)?.replace('Api-Key ', '');
    const folderId = getHeaderValue(req.headers['x-folder-id']);

    log('Processed Headers:', {
      hasApiKey: !!apiKey,
      apiKeyType: typeof apiKey,
      folderId,
      folderIdType: typeof folderId
    });

    if (!apiKey || !folderId) {
      log('Missing credentials', { hasApiKey: !!apiKey, hasFolderId: !!folderId });
      return res.status(400).json({ error: { message: 'API key and Folder ID are required' } });
    }

    // Create headers object with explicit string values
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Api-Key ${apiKey}`,
      'x-folder-id': String(folderId)
    } satisfies Record<string, string>;

    logHeaders('Outgoing Request Headers', requestHeaders);

    const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(req.body)
    });

    log('YandexART API initial response status:', response.status);

    const data = await response.json();
    log('YandexART API initial response data:', data);

    if (!response.ok) {
      log('YandexART API error response:', data);
      return res.status(response.status).json(data);
    }

    const operationId = data.id;
    if (!operationId) {
      log('Missing operation ID in response:', data);
      return res.status(500).json({ error: { message: 'Invalid response: missing operation ID' } });
    }

    log('Starting operation polling', { operationId });

    let operationResult;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      log(`Checking operation status (attempt ${attempts + 1}/${maxAttempts})`, { operationId });
      
      const operationResponse = await fetch(`https://llm.api.cloud.yandex.net/operations/${operationId}`, {
        headers: requestHeaders
      });

      if (!operationResponse.ok) {
        log('Operation status check failed:', {
          status: operationResponse.status,
          operationId
        });
        continue;
      }

      operationResult = await operationResponse.json();
      log('Operation status check result:', operationResult);

      if (operationResult.done) {
        log('Operation completed', { operationId, success: !operationResult.error });
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!operationResult?.done) {
      log('Operation timed out:', { operationId, attempts, operationResult });
      return res.status(408).json({ error: { message: 'Operation timed out' } });
    }

    if (operationResult.error) {
      log('Operation failed:', { operationId, error: operationResult.error });
      return res.status(400).json({ error: operationResult.error });
    }

    log('Operation completed successfully', {
      operationId,
      hasImage: !!operationResult.response?.image
    });
    
    return res.json(operationResult);
  } catch (error: any) {
    log('Server error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({ error: { message: error.message || 'Internal server error' } });
  }
} 