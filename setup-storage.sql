-- Create storage bucket for content files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content-files', 'content-files', false);

-- Create storage policies for content files
CREATE POLICY "Users can upload their own content files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'content-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own content files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'content-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own content files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'content-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own content files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'content-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
