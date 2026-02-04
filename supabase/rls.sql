-- Enable Row Level Security
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vouch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Activity" ENABLE ROW LEVEL SECURITY;

-- Policy: Profile Visibility
-- Anyone can view profiles (Public Trust Profile)
CREATE POLICY "Public profiles are viewable by everyone" 
ON "Profile" FOR SELECT 
USING (true);

-- Policy: Profile Editing
-- Users can only insert/update their own profile
-- Assuming 'id' matches the auth.uid() from Supabase
CREATE POLICY "Users can insert their own profile" 
ON "Profile" FOR INSERT 
WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" 
ON "Profile" FOR UPDATE 
USING (auth.uid()::text = id);

-- Policy: Vouch Visibility
-- Vouches are public proof
CREATE POLICY "Vouches are viewable by everyone" 
ON "Vouch" FOR SELECT 
USING (true);

-- Policy: Vouch Creation
-- Users can vouch for others, but business logic (no self-vouch) is strictly enforcing in app
-- Constraint: Sender must be the authenticated user
CREATE POLICY "Users can create vouches as sender" 
ON "Vouch" FOR INSERT 
WITH CHECK (auth.uid()::text = vouch_sender_id);

-- Policy: Activity Visibility
-- Public can see generic activity, or maybe restricted? 
-- Let's make it public for transparency in Trust Score
CREATE POLICY "Activity is viewable by everyone" 
ON "Activity" FOR SELECT 
USING (true);
