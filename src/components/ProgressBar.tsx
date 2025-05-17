import React from 'react';

interface ProgressBarProps {
  progress: number;
  status: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  // Determine the status message
  const statusMessage = () => {
    switch (status) {
      case 'pending':
        return 'Initializing...';
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Completed!';
      case 'failed':
        return 'Failed';
      default:
        return 'Processing...';
    }
  };

  // Determine color based on status
  const getColor = () => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'failed') return 'bg-red-500';
    return 'bg-indigo-600';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">{statusMessage()}</span>
        <span className="text-sm font-medium text-gray-300">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-300 ${getColor()}`} 
          style={{ width: `${progress}%` }}
        >
          {/* Animated shine effect */}
          <div className="h-full w-full relative">
            <div className="absolute inset-0 bg-white opacity-20 animate-shine"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;