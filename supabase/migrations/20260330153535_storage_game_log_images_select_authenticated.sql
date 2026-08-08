CREATE POLICY "authenticated_users_select_all_game_log_images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'game-log-images'
  AND auth.uid() IS NOT NULL
);
