-- Add image column to study_abroad table
ALTER TABLE study_abroad 
ADD COLUMN IF NOT EXISTS image TEXT;

-- Add comment to the column
COMMENT ON COLUMN study_abroad.image IS 'URL of the study abroad program image stored in Cloudinary';

