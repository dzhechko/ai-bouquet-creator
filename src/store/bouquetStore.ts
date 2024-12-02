import { create } from 'zustand';
import { BouquetStore, Bouquet } from '../types';

const initialBouquet: Bouquet = {
  occasion: '',
  recipient: '',
  customFlowers: [],
  selectedModel: 'gpt-4',
  imageModel: 'dall-e-3',
  temperature: 0.7,
  systemPrompt: 'You are a professional florist with extensive knowledge of flower arrangements.',
  yandexGptPrompt: 'As a professional florist, suggest 2 different flower combinations for a {occasion} bouquet for {recipient}. Each combination should have 3-5 flowers. Return ONLY a raw JSON object with this exact structure: {"suggestions":[["flower1","flower2","flower3"],["flower1","flower2","flower3"]]}. Do not use any markdown formatting, code blocks, or additional text. Return only the JSON object.',
  yandexArtPrompt: 'A professional, high-quality photograph of a beautiful flower bouquet containing {flowers}. The bouquet is designed for {occasion} for {recipient}. Photorealistic style, studio lighting, white background.',
  openaiKey: '',
  dalleKey: '',
  yandexKey: '',
  yandexFolderId: ''
};

export const useBouquetStore = create<BouquetStore>((set) => ({
  bouquet: initialBouquet,
  generated: null,
  step: 0,
  setBouquet: (updates) => 
    set((state) => ({ 
      bouquet: { ...state.bouquet, ...updates }
    })),
  setGenerated: (generated) => set({ generated }),
  setStep: (step) => set({ step })
}));