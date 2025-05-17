import { useState, useEffect } from 'react';
import { VideoGenerationParams, VideoGenerationResult } from '../types';
import { generateVideo, checkGenerationStatus } from '../services/apiService';

export const useVideoGeneration = () => {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [result, setResult] = useState<VideoGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Start the generation process
  const startGeneration = async (params: VideoGenerationParams) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setResult(null);

    try {
      const id = await generateVideo(params);
      setRequestId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start generation');
      setIsGenerating(false);
    }
  };

  // Poll for generation status
  useEffect(() => {
    let timer: number | null = null;
    let statusCheckCount = 0;
    const maxStatusChecks = 100; // Safety limit
    const pollInterval = 1000; // 1 second

    const checkStatus = async () => {
      if (!requestId) return;

      try {
        statusCheckCount++;
        const statusResult = await checkGenerationStatus(requestId);
        setResult(statusResult);

        if (statusResult.status === 'completed') {
          setProgress(100);
          setIsGenerating(false);
        } else if (statusResult.status === 'failed') {
          setError(statusResult.error || 'Generation failed');
          setIsGenerating(false);
        } else {
          // Approximate progress based on time passed
          const progressEstimate = Math.min(90, statusCheckCount * 3);
          setProgress(progressEstimate);
          
          if (statusCheckCount < maxStatusChecks) {
            timer = window.setTimeout(checkStatus, pollInterval);
          } else {
            setError('Generation timed out');
            setIsGenerating(false);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check generation status');
        setIsGenerating(false);
      }
    };

    if (isGenerating && requestId) {
      checkStatus();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [requestId, isGenerating]);

  return {
    startGeneration,
    isGenerating,
    progress,
    result,
    error
  };
};