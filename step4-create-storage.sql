-- Step 4: Create Storage Bucket
-- Run this AFTER step3-create-policies.sql succeeds

-- Create storage bucket for content files
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-files', 'content-files', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies for the content-files bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'content-files' AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Allow authenticated reads" ON storage.objects FOR SELECT USING (
  bucket_id = 'content-files' AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Allow authenticated updates" ON storage.objects FOR UPDATE USING (
  bucket_id = 'content-files' AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR DELETE USING (
  bucket_id = 'content-files' AND auth.uid()::text = (storage.foldername(name))[2]
);
