-- 1. Create the storage bucket 'business-assets' if it doesn't exist already
-- We set it to public so images can be viewed by anyone on the website
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-assets', 'business-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS (Row Level Security) on storage.objects if not already enabled (usually is by default)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy: Allow Public View Access
-- This lets anyone (even visitors without accounts) see the company logos and documents
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'business-assets' );

-- 4. Create Policy: Allow Authenticated Uploads
-- This lets any logged-in user upload files to this bucket
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'business-assets'
);

-- 5. Create Policy: Allow Owners to Update/Delete
-- This ensures users can manage files they uploaded
CREATE POLICY "Owner Update"
ON storage.objects FOR UPDATE
USING (
  auth.uid() = owner AND
  bucket_id = 'business-assets'
);

CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
USING (
  auth.uid() = owner AND
  bucket_id = 'business-assets'
);
