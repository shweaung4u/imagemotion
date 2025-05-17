import React from 'react';
import { VideoGenerationParams } from '../types';
import { Sliders, Hash, Clock, Sparkles, Check, AlertCircle } from 'lucide-react';

interface ParameterControlsProps {
  params: VideoGenerationParams;
  onChange: (params: VideoGenerationParams) => void;
}

const ParameterControls: React.FC<ParameterControlsProps> = ({ params, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle different input types
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onChange({ ...params, [name]: checked });
    } else if (type === 'number') {
      onChange({ ...params, [name]: parseFloat(value) });
    } else {
      onChange({ ...params, [name]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Duration */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-300 font-medium">
              <Clock size={16} className="mr-2" />
              Duration (seconds)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                name="duration"
                min="1"
                max="10"
                step="1"
                value={params.duration}
                onChange={handleChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="bg-gray-800 px-2 py-1 rounded min-w-[40px] text-center">
                {params.duration}
              </span>
            </div>
          </div>

          {/* Guidance Scale */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-300 font-medium">
              <Sliders size={16} className="mr-2" />
              Guidance Scale
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                name="guidance_scale"
                min="1"
                max="10"
                step="0.1"
                value={params.guidance_scale}
                onChange={handleChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="bg-gray-800 px-2 py-1 rounded min-w-[40px] text-center">
                {params.guidance_scale}
              </span>
            </div>
          </div>

          {/* Flow Shift */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-300 font-medium">
              <Sparkles size={16} className="mr-2" />
              Flow Shift
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                name="flow_shift"
                min="1"
                max="5"
                step="0.1"
                value={params.flow_shift}
                onChange={handleChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="bg-gray-800 px-2 py-1 rounded min-w-[40px] text-center">
                {params.flow_shift}
              </span>
            </div>
          </div>

          {/* Inference Steps */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-300 font-medium">
              <Hash size={16} className="mr-2" />
              Inference Steps
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                name="num_inference_steps"
                min="20"
                max="50"
                step="1"
                value={params.num_inference_steps}
                onChange={handleChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="bg-gray-800 px-2 py-1 rounded min-w-[40px] text-center">
                {params.num_inference_steps}
              </span>
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-300 font-medium">
              Output Size
            </label>
            <select
              name="size"
              value={params.size}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="832*480">832×480</option>
              <option value="768*768">768×768</option>
              <option value="576*1024">576×1024</option>
            </select>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-gray-300 font-medium">Prompt</label>
            <textarea
              name="prompt"
              value={params.prompt}
              onChange={handleChange}
              rows={5}
              placeholder="Enter a descriptive prompt for your video"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Negative Prompt */}
          <div className="space-y-2">
            <label className="text-gray-300 font-medium">Negative Prompt</label>
            <textarea
              name="negative_prompt"
              value={params.negative_prompt}
              onChange={handleChange}
              rows={2}
              placeholder="Describe what you don't want in the video (optional)"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Seed */}
          <div className="space-y-2">
            <label className="text-gray-300 font-medium">
              Seed
              <span className="text-gray-500 text-sm ml-2">(set to -1 for random)</span>
            </label>
            <input
              type="number"
              name="seed"
              value={params.seed}
              onChange={handleChange}
              placeholder="-1"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Safety Checker */}
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="safety-checker"
              name="enable_safety_checker"
              checked={params.enable_safety_checker}
              onChange={handleChange}
              className="w-4 h-4 accent-indigo-600"
            />
            <label htmlFor="safety-checker" className="text-gray-300">
              Enable safety checker
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-start space-x-2">
          <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-gray-400 text-sm">
            Higher quality settings (more inference steps, longer duration) will take more time to process.
            Your API key will be stored only in your browser and never sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParameterControls;