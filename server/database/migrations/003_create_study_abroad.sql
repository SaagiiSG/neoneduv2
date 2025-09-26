-- Create study_abroad table
CREATE TABLE IF NOT EXISTS study_abroad (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_name VARCHAR(200) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT NOT NULL CHECK (length(description) <= 1000),
    link TEXT NOT NULL CHECK (link ~ '^https?://.+'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_abroad_program_name ON study_abroad(program_name);
CREATE INDEX IF NOT EXISTS idx_study_abroad_country ON study_abroad(country);
CREATE INDEX IF NOT EXISTS idx_study_abroad_created_at ON study_abroad(created_at);

-- Create updated_at trigger
CREATE TRIGGER update_study_abroad_updated_at 
    BEFORE UPDATE ON study_abroad 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();


