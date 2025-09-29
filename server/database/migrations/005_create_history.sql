-- Create history table
CREATE TABLE IF NOT EXISTS history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
    event TEXT NOT NULL CHECK (length(event) > 0 AND length(event) <= 2000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_history_year ON history(year);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at);

-- Create updated_at trigger
CREATE TRIGGER update_history_updated_at 
    BEFORE UPDATE ON history 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

