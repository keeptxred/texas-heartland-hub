-- Public read access to article images (bucket stays private; access mediated via policy)
CREATE POLICY "Public can read article-images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'article-images');

-- Only service_role may write/update/delete objects in article-images
CREATE POLICY "Service role can insert article-images"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Service role can update article-images"
ON storage.objects
FOR UPDATE
TO service_role
USING (bucket_id = 'article-images')
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Service role can delete article-images"
ON storage.objects
FOR DELETE
TO service_role
USING (bucket_id = 'article-images');