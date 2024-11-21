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
  openaiKey: '',
  dalleKey: ''
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