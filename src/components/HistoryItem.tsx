import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { HistoryItem as HistoryItemType } from '../types';

interface HistoryItemProps {
  item: HistoryItemType;
  onSelect: (item: HistoryItemType) => void;
  isSelected: boolean;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onSelect, isSelected }) => {
  const date = new Date(item.date);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();
  
  // Truncate the prompt for display
  const truncatePrompt = (prompt: string, maxLength = 100) => {
    if (prompt.length <= maxLength) return prompt;
    return prompt.substring(0, maxLength) + '...';
  };

  return (
    <div 
      onClick={() => onSelect(item)}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-indigo-600/20 border border-indigo-500' 
          : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
      }`}
    >
      <div className="flex">
        {/* Thumbnail */}
        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-gray-900">
          {item.params.image && (
            <img 
              src={item.params.image} 
              alt="Source" 
              className="w-full h-full object-cover"
            />
          )}
          {item.videoUrl && (
            <div className="relative">
              {/* Video thumbnail preview on hover */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
                <video 
                  src={item.videoUrl} 
                  className="w-full h-full object-cover" 
                  muted 
                  loop
                  onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                  onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                />
              </div>
              <img 
                src={item.params.image} 
                alt="Source" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="ml-3 flex-1 overflow-hidden">
          <p className="text-white text-sm font-medium mb-1 line-clamp-2">
            {truncatePrompt(item.params.prompt)}
          </p>
          
          <div className="flex items-center text-gray-400 text-xs mt-2">
            <Calendar size={12} className="mr-1" />
            <span className="mr-3">{formattedDate}</span>
            <Clock size={12} className="mr-1" />
            <span>{formattedTime}</span>
          </div>
          
          {/* Status badge */}
          <div className="mt-2">
            {item.result?.status === 'completed' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900 text-green-300">
                Completed
              </span>
            )}
            {item.result?.status === 'failed' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300">
                Failed
              </span>
            )}
            {(item.result?.status === 'pending' || item.result?.status === 'processing') && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900 text-yellow-300">
                Processing
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;