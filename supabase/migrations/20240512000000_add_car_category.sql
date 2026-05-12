-- Create car_category enum type
DO $$ BEGIN
    CREATE TYPE car_category AS ENUM ('economy', 'sports', 'suv', 'luxury', 'exotic');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add category column to cars table
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS category car_category;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
