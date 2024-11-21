export interface Bouquet {
  occasion: string;
  recipient: string;
  customFlowers: string[];
  selectedModel: string;
  imageModel: string;
  temperature: number;
  systemPrompt: string;
  openaiKey: string;
  dalleKey: string;
}

export interface GeneratedBouquet {
  flowerList: string[];
  description: string;
  images: string[];
}

export interface BouquetStore {
  bouquet: Bouquet;
  generated: GeneratedBouquet | null;
  step: number;
  setBouquet: (bouquet: Partial<Bouquet>) => void;
  setGenerated: (generated: GeneratedBouquet) => void;
  setStep: (step: number) => void;
}