import React from 'react';
import { Download, RefreshCw, Maximize2, ArrowLeft } from 'lucide-react';
import { useBouquetStore } from '../store/bouquetStore';
import { ImageModal } from './ImageModal';

export const PreviewStep: React.FC = () => {
  const { bouquet, generated, setStep } = useBouquetStore();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  
  if (!generated) {
    return null;
  }

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `bouquet-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const downloadAllImages = async () => {
    for (const url of generated.images) {
      await downloadImage(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button
        onClick={() => setStep(2)}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Generation
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Your Custom Bouquet</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Created for: <span className="font-medium text-gray-900">{bouquet.recipient}</span>
          </p>
          <p className="text-gray-600">
            Occasion: <span className="font-medium text-gray-900">{bouquet.occasion}</span>
          </p>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Selected Flowers:</h3>
            <div className="flex flex-wrap gap-2">
              {generated.flowerList.map((flower) => (
                <span
                  key={flower}
                  className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm"
                >
                  {flower}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Description:</h3>
            <p className="text-gray-600">{generated.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {generated.images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer">
              <img
                src={image}
                alt={`Bouquet variation ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setSelectedImage(image)}
              />
            </div>
            <button
              onClick={() => setSelectedImage(image)}
              className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Maximize2 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => downloadImage(image)}
              className="absolute bottom-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <Download className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={() => downloadImage(selectedImage)}
        />
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setStep(2)}
          className="py-2 px-6 border border-gray-300 rounded-md hover:border-rose-300 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Generate Again
        </button>
        <button
          onClick={downloadAllImages}
          className="bg-rose-500 text-white py-2 px-6 rounded-md hover:bg-rose-600 transition-colors inline-flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download All Images
        </button>
      </div>
    </div>
  );
};