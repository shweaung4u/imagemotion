import { VideoGenerationParams, VideoGenerationResult } from '../types';

const API_KEYS = [
  "973dab1cb36a0de5a8ced9263af9d5b059e8c9f8cfab395bfb084a29dad32e66",
  "57ba28ee93e404ff2ec479cda0535182fd36559b6de682756aa41a420c12bb91",
  // Add more API keys as needed
];

let currentKeyIndex = 0;

const API_BASE_URL = 'https://api.wavespeed.ai/api/v2';
const MODEL_ENDPOINT = `${API_BASE_URL}/wavespeed-ai/wan-2.1/i2v-480p-ultra-fast`;
const RESULT_ENDPOINT = `${API_BASE_URL}/predictions`;

// Get the next API key using round-robin rotation
function getApiKey(): string {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

export const generateVideo = async (params: VideoGenerationParams): Promise<string> => {
  try {
    const apiKey = getApiKey();

    const response = await fetch(MODEL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.data.id;
  } catch (error) {
    console.error('Error submitting generation request:', error);
    throw error;
  }
};

export const checkGenerationStatus = async (requestId: string): Promise<VideoGenerationResult> => {
  try {
    const apiKey = getApiKey();

    const response = await fetch(
      `${RESULT_ENDPOINT}/${requestId}/result`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return {
      id: requestId,
      status: result.data.status,
      outputs: result.data.outputs,
      error: result.data.error
    };
  } catch (error) {
    console.error('Error checking generation status:', error);
    throw error;
  }
};