/*
  # Add initial API keys
  
  1. Changes
    - Insert initial API keys for load balancing
    
  2. Security
    - Keys are stored securely in the database
    - Only authenticated users can read keys
*/

-- Insert initial API keys (replace these with your actual API keys)
INSERT INTO api_keys (key) VALUES
  ('your-api-key-1'),
  ('your-api-key-2'),
  ('your-api-key-3')
ON CONFLICT (id) DO NOTHING;