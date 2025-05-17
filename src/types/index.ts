export type VideoGenerationParams = {
  duration: number;
  enable_safety_checker: boolean;
  flow_shift: number;
  guidance_scale: number;
  image: string;
  negative_prompt: string;
  num_inference_steps: number;
  prompt: string;
  seed: number;
  size: string;
};

export type VideoGenerationResult = {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputs?: string[];
  error?: string;
};

export type HistoryItem = {
  id: string;
  date: string;
  params: VideoGenerationParams;
  result?: VideoGenerationResult;
  videoUrl?: string;
};