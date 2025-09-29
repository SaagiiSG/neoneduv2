-- Add image column to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS image TEXT;

-- Add comment to the column
COMMENT ON COLUMN courses.image IS 'URL of the course image stored in Cloudinary';

