-- Run this on Supabase SQL Editor

CREATE TABLE public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'My Resume',
  data JSONB NOT NULL DEFAULT '{}',
  template TEXT DEFAULT 'classic',
  is_public BOOLEAN DEFAULT false,
  ats_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Resumes Policies
CREATE POLICY "Users can create their own resumes" 
ON public.resumes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own resumes" 
ON public.resumes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" 
ON public.resumes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" 
ON public.resumes FOR DELETE 
USING (auth.uid() = user_id);


-- Resume Views Table (Analytics)
CREATE TABLE public.resume_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  ip_hash TEXT
);

-- Note: You may want an unauthenticated read policy if you plan on generating public share links
CREATE POLICY "Public can view shared resumes" 
ON public.resumes FOR SELECT 
USING (is_public = true);
