# History Table Setup

The history feature requires a database table to be created in Supabase. Follow these steps to set it up:

## Quick Setup

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the SQL**
   Copy and paste this SQL into the editor and click "Run":

```sql
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

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at trigger
CREATE TRIGGER update_history_updated_at 
    BEFORE UPDATE ON history 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO history (year, event) VALUES
(2024, 'Neon Edu was founded with a vision to provide quality education services'),
(2023, 'Initial planning and development of educational programs began'),
(2022, 'Research and market analysis for educational services completed');
```

4. **Refresh the Admin Page**
   - Go back to your admin history page
   - Refresh the browser
   - You should now see the sample history items

## Verification

After running the SQL, you can verify the table was created by:

1. Going to "Table Editor" in Supabase
2. Looking for the "history" table
3. You should see 3 sample records

## Troubleshooting

If you encounter any issues:

1. **Permission Error**: Make sure you're using the service role key in your environment variables
2. **Table Already Exists**: The SQL uses `IF NOT EXISTS` so it's safe to run multiple times
3. **Still Not Working**: Check the browser console for any error messages

## Next Steps

Once the table is created:
- The admin history page will show the sample data
- You can add, edit, and delete history items
- All changes will be saved to the database

