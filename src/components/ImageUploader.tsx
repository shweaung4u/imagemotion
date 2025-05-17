import React, { useState, useRef } from 'react';
import { Upload, ImageIcon, Link2, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  initialImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, initialImage }) => {
  const [imageUrl, setImageUrl] = useState<string>(initialImage || '');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isUrlMode, setIsUrlMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      setImageUrl(urlInput);
      onImageSelect(urlInput);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageUrl('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect('');
  };

  return (
    <div className="w-full">
      <div className="flex space-x-2 mb-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !isUrlMode
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setIsUrlMode(false)}
        >
          Upload Image
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isUrlMode
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setIsUrlMode(true)}
        >
          Image URL
        </button>
      </div>

      {isUrlMode ? (
        <form onSubmit={handleUrlSubmit} className="w-full">
          <div className="flex w-full">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors"
            >
              <Link2 size={18} />
            </button>
          </div>
        </form>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 transition-colors text-center cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-gray-700 hover:border-gray-500 bg-gray-800'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-col items-center">
            {!imageUrl ? (
              <>
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-gray-300 mb-1">Drag and drop an image here, or click to browse</p>
                <p className="text-gray-500 text-sm">PNG, JPG, WEBP up to 10MB</p>
              </>
            ) : (
              <div className="relative w-full">
                <img
                  src={imageUrl}
                  alt="Uploaded preview"
                  className="max-h-64 rounded-md mx-auto"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="absolute top-2 right-2 bg-gray-900/80 hover:bg-red-600 p-1 rounded-full transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isUrlMode && imageUrl && (
        <div className="mt-4 relative">
          <img
            src={imageUrl}
            alt="URL preview"
            className="max-h-64 rounded-md mx-auto"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-gray-900/80 hover:bg-red-600 p-1 rounded-full transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;