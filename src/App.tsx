import React, { useState, useEffect } from 'react';
import { useVideoGeneration } from './hooks/useVideoGeneration';
import { useLocalStorage } from './hooks/useLocalStorage';
import ImageUploader from './components/ImageUploader';
import ParameterControls from './components/ParameterControls';
import ProgressBar from './components/ProgressBar';
import VideoPlayer from './components/VideoPlayer';
import HistoryItem from './components/HistoryItem';
import { VideoGenerationParams, HistoryItem as HistoryItemType } from './types';
import { Film, History, X, ChevronRight, ChevronLeft, PlayCircle } from 'lucide-react';

function App() {
  // Default parameters
  const defaultParams: VideoGenerationParams = {
    duration: 5,
    enable_safety_checker: true,
    flow_shift: 3,
    guidance_scale: 5,
    image: '',
    negative_prompt: '',
    num_inference_steps: 30,
    prompt: '',
    seed: -1,
    size: '832*480'
  };

  // State
  const [params, setParams] = useState<VideoGenerationParams>(defaultParams);
  const [history, setHistory] = useLocalStorage<HistoryItemType[]>('generation_history', []);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItemType | null>(null);
  
  // Video generation hook
  const { startGeneration, isGenerating, progress, result, error } = useVideoGeneration();

  // When an image is selected, update params
  const handleImageSelect = (imageUrl: string) => {
    setParams((prev) => ({ ...prev, image: imageUrl }));
  };

  // Load parameters from history item
  const loadFromHistory = (item: HistoryItemType) => {
    setSelectedHistoryItem(item);
    setParams(item.params);
  };

  // Start generation process
  const handleGenerate = () => {
    if (!params.image) {
      alert('Please select an image first');
      return;
    }

    if (!params.prompt) {
      alert('Please enter a prompt');
      return;
    }

    // Create a new history item
    const newHistoryItem: HistoryItemType = {
      id: Math.random().toString(36).substring(2, 15),
      date: new Date().toISOString(),
      params: { ...params }
    };

    setHistory([newHistoryItem, ...history]);
    startGeneration(params);
  };

  // Update history when result changes
  useEffect(() => {
    if (result && history.length > 0) {
      const updatedHistory = history.map((item, index) => {
        if (index === 0 && !item.result) {
          return {
            ...item,
            result: { ...result },
            videoUrl: result.outputs && result.outputs.length > 0 ? result.outputs[0] : undefined
          };
        }
        return item;
      });

      setHistory(updatedHistory);
    }
  }, [result, history, setHistory]);

  // Generate video with example parameters
  const handleExampleGenerate = () => {
    const exampleParams: VideoGenerationParams = {
      duration: 5,
      enable_safety_checker: true,
      flow_shift: 3,
      guidance_scale: 5,
      image: 'https://d2g64w682n9w0w.cloudfront.net/media/images/1745079024013078406_QT6jKNPZ.png',
      negative_prompt: '',
      num_inference_steps: 30,
      prompt: 'A girl stands in a lively 17th-century market. She holds a red tomato, looks gently into the camera and smiles briefly. Then, she glances at the tomato in her hand, slowly sets it back into the basket, turns around gracefully, and walks away with her back to the camera. The market around her is rich with colorful vegetables, meats hanging above, and bustling townsfolk. Golden-hour painterly lighting, subtle facial expressions, smooth cinematic motion, ultra-realistic detail, Vermeer-inspired style',
      seed: -1,
      size: '832*480'
    };

    setParams(exampleParams);

    // Create a new history item
    const newHistoryItem: HistoryItemType = {
      id: Math.random().toString(36).substring(2, 15),
      date: new Date().toISOString(),
      params: { ...exampleParams }
    };

    setHistory([newHistoryItem, ...history]);
    startGeneration(exampleParams);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Film className="text-indigo-500 mr-2" size={24} />
            <h1 className="text-xl font-bold">ImageMotion AI</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors ${
                showHistory 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <History size={16} className="mr-1.5" />
              History
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel (parameters and controls) */}
          <div className={`flex-1 ${showHistory ? 'lg:w-2/3' : 'w-full'}`}>
            {/* Welcome section */}
            {!isGenerating && !result && (
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 mb-6 border border-indigo-800/50">
                <h2 className="text-2xl font-bold mb-2">Transform Images into Videos</h2>
                <p className="text-gray-300 mb-4">
                  Upload an image, enter a descriptive prompt, adjust parameters, and let AI bring your image to life.
                </p>
                <button
                  onClick={handleExampleGenerate}
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <PlayCircle size={18} className="mr-1.5" />
                  Try with Example
                </button>
              </div>
            )}

            {/* Generation in progress */}
            {isGenerating && (
              <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Generating Video</h2>
                <ProgressBar 
                  progress={progress} 
                  status={result?.status || 'processing'} 
                />
                
                {error && (
                  <div className="mt-4 bg-red-900/40 border border-red-800 rounded-lg p-4 text-red-300">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Result video */}
            {result?.status === 'completed' && result.outputs && result.outputs.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Generated Video</h2>
                <VideoPlayer videoUrl={result.outputs[0]} />
              </div>
            )}

            {/* Image uploader */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">1. Select an Image</h2>
              <ImageUploader 
                onImageSelect={handleImageSelect} 
                initialImage={params.image}
              />
            </div>

            {/* Parameter controls */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">2. Configure Parameters</h2>
              <ParameterControls 
                params={params} 
                onChange={setParams} 
              />
            </div>

            {/* Generate button */}
            <div className="mb-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !params.image || !params.prompt}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3 rounded-lg transition-colors font-medium text-lg flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <PlayCircle size={20} className="mr-2" />
                    Generate Video
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right panel (history) */}
          <div className={`bg-gray-800 rounded-xl border border-gray-700 transition-all duration-300 overflow-hidden ${
            showHistory 
              ? 'lg:w-1/3 max-h-[2000px]' 
              : 'lg:w-0 max-h-0 lg:max-h-[2000px] opacity-0 lg:opacity-100'
          }`}>
            {showHistory && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Generation History</h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="lg:hidden text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {history.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    <History size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No generation history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
                    {history.map((item) => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        onSelect={loadFromHistory}
                        isSelected={selectedHistoryItem?.id === item.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile history panel toggle (only visible on mobile) */}
      {showHistory && (
        <button
          onClick={() => setShowHistory(false)}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full lg:hidden shadow-lg transition-colors z-10"
        >
          <ChevronRight size={24} />
        </button>
      )}
      
      {!showHistory && (
        <button
          onClick={() => setShowHistory(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full lg:hidden shadow-lg transition-colors z-10"
        >
          <ChevronLeft size={24} />
        </button>
      )}
    </div>
  );
}

export default App;