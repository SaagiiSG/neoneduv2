-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    address TEXT NOT NULL CHECK (length(address) <= 500),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL CHECK (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_contact_info UNIQUE (id)
);

-- Create contact_info_socials table
CREATE TABLE IF NOT EXISTS contact_info_socials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_info_id UUID NOT NULL REFERENCES contact_info(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL CHECK (url ~ '^https?://.+'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contact_info_id, platform)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_info_socials_contact_info_id ON contact_info_socials(contact_info_id);
CREATE INDEX IF NOT EXISTS idx_contact_info_socials_platform ON contact_info_socials(platform);

-- Create updated_at trigger for contact_info
CREATE TRIGGER update_contact_info_updated_at 
    BEFORE UPDATE ON contact_info 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();


