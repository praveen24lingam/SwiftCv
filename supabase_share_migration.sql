-- Step 1: Add sharing columns to resumes table
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE DEFAULT gen_random_uuid()::text;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Step 2: Grant Read Access to public resumes for unauthenticated users
CREATE POLICY "Public resumes are viewable by everyone" ON resumes
FOR SELECT USING (is_public = true);

-- Step 3: Allow anyone to insert into resume_views
-- Since resume_views records anon metrics, we can allow anon inserts
CREATE POLICY "Anyone can insert resume_views" ON resume_views
FOR INSERT WITH CHECK (true);
