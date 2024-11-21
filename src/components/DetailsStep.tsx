import React from 'react';
import { useBouquetStore } from '../store/bouquetStore';

export const DetailsStep: React.FC = () => {
  const { bouquet, setBouquet, setStep } = useBouquetStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Occasion
        </label>
        <input
          type="text"
          required
          value={bouquet.occasion}
          onChange={(e) => setBouquet({ occasion: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
          placeholder="e.g., Birthday, Anniversary, Wedding"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipient
        </label>
        <input
          type="text"
          required
          value={bouquet.recipient}
          onChange={(e) => setBouquet({ recipient: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
          placeholder="e.g., Mom, Partner, Friend"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 transition-colors"
      >
        Next Step
      </button>
    </form>
  );
};