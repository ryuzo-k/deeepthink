-- Create thoughts table for the DeeepThink app
CREATE TABLE IF NOT EXISTS thoughts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL CHECK (category IN ('idea', 'task', 'note')),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS thoughts_user_id_idx ON thoughts(user_id);

-- Create an index on category for filtering
CREATE INDEX IF NOT EXISTS thoughts_category_idx ON thoughts(category);

-- Enable Row Level Security (RLS)
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own thoughts
CREATE POLICY "Users can only see their own thoughts" ON thoughts
  FOR ALL USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own thoughts
CREATE POLICY "Users can insert their own thoughts" ON thoughts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own thoughts
CREATE POLICY "Users can update their own thoughts" ON thoughts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own thoughts
CREATE POLICY "Users can delete their own thoughts" ON thoughts
  FOR DELETE USING (auth.uid() = user_id);
