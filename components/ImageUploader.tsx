
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string;
  processImage: () => void;
  isProcessing: boolean;
}

const UploadIcon: React.FC = () => (
  <svg className="w-12 h-12 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
  </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl, processImage, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="w-full bg-base-200 rounded-xl p-8 shadow-2xl border border-base-300">
      <h2 className="text-3xl font-bold mb-2 text-text-primary">Find Your Next Bestseller</h2>
      <p className="text-lg text-text-secondary mb-6">Upload an image of a clothing item to get started.</p>
      
      <div 
        onClick={handleClick} 
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-base-300 border-dashed rounded-lg cursor-pointer bg-base-100 hover:bg-base-300/50 transition-colors"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon />
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
          </div>
        )}
        <input 
          ref={fileInputRef} 
          id="dropzone-file" 
          type="file" 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange} 
        />
      </div>
      
      {imageUrl && (
        <button
          onClick={processImage}
          disabled={isProcessing}
          className="mt-6 w-full bg-brand-primary hover:bg-brand-primary/80 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed shadow-lg"
        >
          {isProcessing ? 'Analyzing...' : 'Analyze Product'}
        </button>
      )}
    </div>
  );
};
