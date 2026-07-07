
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_signups;
CREATE POLICY "Anyone can subscribe with a valid email"
  ON public.newsletter_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 5 AND 254
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );
