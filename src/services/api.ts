import { Bouquet, GeneratedBouquet } from '../types';

interface OpenAIError {
  error?: {
    message: string;
    type?: string;
    code?: string;
  };
}

export async function generateSuggestions(bouquet: Bouquet): Promise<string[][]> {
  if (!bouquet.openaiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = await fetch('/api/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bouquet.openaiKey}`
      },
      body: JSON.stringify({
        model: bouquet.selectedModel,
        messages: [
          {
            role: 'system',
            content: 'You are a professional florist. Generate two different flower combinations. Each combination should contain 3-5 flowers that work well together. Return the response in the following format: {"suggestions": [["flower1", "flower2", "flower3"], ["flower1", "flower2", "flower3"]]}'
          },
          {
            role: 'user',
            content: `Create 2 different flower combinations for a ${bouquet.occasion} bouquet for ${bouquet.recipient}.`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Invalid API response format');
    }

    try {
      const parsedContent = JSON.parse(content);
      if (!Array.isArray(parsedContent.suggestions)) {
        throw new Error('Invalid suggestions format');
      }
      return parsedContent.suggestions;
    } catch (parseError) {
      throw new Error('Failed to parse API response');
    }
  } catch (error) {
    console.error('Suggestion generation error:', error);
    throw error instanceof Error ? error : new Error('Failed to generate suggestions');
  }
}

export async function generateBouquet(bouquet: Bouquet): Promise<GeneratedBouquet> {
  if (!bouquet.openaiKey) {
    throw new Error('OpenAI API key is required');
  }

  if (!bouquet.customFlowers.length) {
    throw new Error('At least one flower must be selected');
  }

  try {
    // Generate description
    const descriptionResponse = await fetch('/api/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bouquet.openaiKey}`
      },
      body: JSON.stringify({
        model: bouquet.selectedModel,
        messages: [
          {
            role: 'system',
            content: bouquet.systemPrompt
          },
          {
            role: 'user',
            content: `Create a beautiful description for a ${bouquet.occasion} bouquet for ${bouquet.recipient}. The bouquet contains: ${bouquet.customFlowers.join(', ')}.`
          }
        ],
        temperature: bouquet.temperature,
        max_tokens: 300
      })
    });

    if (!descriptionResponse.ok) {
      const errorData = await descriptionResponse.json();
      throw new Error(errorData.error?.message || `Description API Error: ${descriptionResponse.status}`);
    }

    const descriptionData = await descriptionResponse.json();
    const description = descriptionData.choices?.[0]?.message?.content;
    
    if (!description) {
      throw new Error('Invalid description response format');
    }

    // Generate images
    const apiKey = bouquet.dalleKey || bouquet.openaiKey;
    const imagePrompt = `A professional, high-quality photograph of a beautiful flower bouquet containing ${bouquet.customFlowers.join(', ')}. The bouquet is designed for ${bouquet.occasion} for ${bouquet.recipient}. Photorealistic style, studio lighting, white background.`;

    const imageResponse = await fetch('/api/openai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: bouquet.imageModel,
        prompt: imagePrompt,
        n: 3,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural'
      })
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.json();
      throw new Error(errorData.error?.message || `Image API Error: ${imageResponse.status}`);
    }

    const imageData = await imageResponse.json();
    const images = imageData.data?.map((img: { url: string }) => img.url) || [];
    
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error('No images were generated');
    }

    return {
      flowerList: bouquet.customFlowers,
      description,
      images
    };
  } catch (error) {
    console.error('Bouquet generation error:', error);
    throw error instanceof Error ? error : new Error('Failed to generate bouquet');
  }
}