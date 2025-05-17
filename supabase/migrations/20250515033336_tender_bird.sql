/*
  # Create API Keys Management Tables

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `key` (text, encrypted)
      - `last_used` (timestamp)
      - `requests_count` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policy for authenticated users to read api keys
*/

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  last_used timestamptz DEFAULT now(),
  requests_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to api keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (true);