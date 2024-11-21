import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useBouquetStore } from '../store/bouquetStore';

const textModels = [
  { id: 'gpt-4', name: 'GPT-4 (Recommended)' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
];

const imageModels = [
  { id: 'dall-e-3', name: 'DALL-E 3 (Recommended)' },
  { id: 'dall-e-2', name: 'DALL-E 2' },
];

export const ModelSettings: React.FC = () => {
  const { bouquet, setBouquet } = useBouquetStore();
  const [showOpenAIKey, setShowOpenAIKey] = React.useState(false);
  const [showDALLEKey, setShowDALLEKey] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showOpenAIKey ? 'text' : 'password'}
                value={bouquet.openaiKey}
                onChange={(e) => setBouquet({ openaiKey: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500 pr-10"
                placeholder="sk-..."
              />
              <button
                type="button"
                onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showOpenAIKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DALL-E API Key (optional)
            </label>
            <div className="relative">
              <input
                type={showDALLEKey ? 'text' : 'password'}
                value={bouquet.dalleKey}
                onChange={(e) => setBouquet({ dalleKey: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500 pr-10"
                placeholder="sk-..."
              />
              <button
                type="button"
                onClick={() => setShowDALLEKey(!showDALLEKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showDALLEKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              If not provided, will use the OpenAI API key
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Text Generation Model</h3>
        <div className="space-y-3">
          {textModels.map(model => (
            <label
              key={model.id}
              className="flex items-center p-3 border rounded-md cursor-pointer transition-colors hover:border-rose-300"
            >
              <input
                type="radio"
                name="textModel"
                value={model.id}
                checked={bouquet.selectedModel === model.id}
                onChange={(e) => setBouquet({ selectedModel: e.target.value })}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span className="ml-3">{model.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Image Generation Model</h3>
        <div className="space-y-3">
          {imageModels.map(model => (
            <label
              key={model.id}
              className="flex items-center p-3 border rounded-md cursor-pointer transition-colors hover:border-rose-300"
            >
              <input
                type="radio"
                name="imageModel"
                value={model.id}
                checked={bouquet.imageModel === model.id}
                onChange={(e) => setBouquet({ imageModel: e.target.value })}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span className="ml-3">{model.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature ({bouquet.temperature})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={bouquet.temperature}
              onChange={(e) => setBouquet({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Conservative</span>
              <span>Creative</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Prompt
            </label>
            <textarea
              value={bouquet.systemPrompt}
              onChange={(e) => setBouquet({ systemPrompt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              placeholder="Customize the AI's behavior..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};