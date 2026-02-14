-- ═══════════════════════════════════════════════════════════════
-- HI WALL v2 — COMPLETE DATABASE SCHEMA
-- Run this in a FRESH Supabase project → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. WALLS
CREATE TABLE walls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  address TEXT,
  neighborhood TEXT,
  council TEXT,
  building_type TEXT,
  width_m NUMERIC,
  height_m NUMERIC,
  sqm NUMERIC GENERATED ALWAYS AS (width_m * height_m) STORED,
  traffic_level TEXT,
  condition TEXT,
  orientation TEXT,
  duration_months INTEGER DEFAULT 6,
  access_level TEXT,
  access_notes TEXT,
  heritage_listed BOOLEAN DEFAULT false,
  council_restrictions BOOLEAN DEFAULT false,
  strata_approval BOOLEAN DEFAULT false,
  color_restrictions BOOLEAN DEFAULT false,
  restriction_details TEXT,
  price_total NUMERIC,
  price_monthly NUMERIC,
  hw_fee_percent NUMERIC DEFAULT 25,
  primary_image_url TEXT,
  highlights TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  availability_status TEXT DEFAULT 'available',
  booked_until DATE,
  available_from DATE,
  contract_signed BOOLEAN DEFAULT false,
  contract_signature TEXT,
  contract_signed_at TIMESTAMPTZ,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE walls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved walls" ON walls FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners can view own walls" ON walls FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert walls" ON walls FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins full access" ON walls FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
);

-- 2. OWNER PROFILES (bank details etc)
CREATE TABLE owner_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  name TEXT,
  email TEXT,
  phone TEXT,
  account_name TEXT,
  bank_name TEXT,
  bank_bsb TEXT,
  bank_account TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE owner_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON owner_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own profile" ON owner_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. ENQUIRIES (booking briefs + council enquiries)
CREATE TABLE enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wall_id UUID REFERENCES walls(id),
  buyer_id UUID REFERENCES auth.users(id),
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  company_name TEXT,
  campaign_goal TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can insert enquiries" ON enquiries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anon can insert enquiries" ON enquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admins can view all enquiries" ON enquiries FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
);
CREATE POLICY "Owners can view enquiries on their walls" ON enquiries FOR SELECT TO authenticated USING (
  wall_id IN (SELECT id FROM walls WHERE owner_id = auth.uid())
);

-- 4. PARTNERS
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  services TEXT,
  portfolio_url TEXT,
  contact_email TEXT,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved partners" ON partners FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can apply" ON partners FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins full access partners" ON partners FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
);

-- 5. HERO IMAGES (admin-uploadable homepage backgrounds)
CREATE TABLE hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active hero images" ON hero_images FOR SELECT USING (active = true);
CREATE POLICY "Admins manage hero images" ON hero_images FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
);

-- 6. CONTRACT TERMS (admin-editable)
CREATE TABLE contract_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL DEFAULT '1.0',
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contract_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active terms" ON contract_terms FOR SELECT USING (active = true);
CREATE POLICY "Admins manage terms" ON contract_terms FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
);

-- 7. SEED DEFAULT CONTRACT TERMS
INSERT INTO contract_terms (version, content, active) VALUES ('1.0',
'HI WALL — WALL OWNER AGREEMENT

1. GRANT OF RIGHTS
The Owner grants Hi Wall Pty Ltd exclusive right to market, represent, and facilitate the use of the listed wall space ("The Wall") for approved advertising and mural campaigns for the agreed contract duration.

2. EXCLUSIVITY
During the contract period, the Owner agrees not to independently lease, license, or permit use of The Wall for advertising, signage, or mural purposes to any third party without prior written consent from Hi Wall.

3. ACCESS & PREPARATION
The Owner agrees to provide reasonable access to The Wall for site inspections, preparation, installation, and removal of campaign materials. Access arrangements will be coordinated at least 48 hours in advance.

4. CONDITION & MAINTENANCE
The Owner warrants that The Wall is structurally sound and suitable for mural/signage installation. Hi Wall will restore The Wall to its pre-campaign condition (or better) upon campaign completion.

5. PAYMENT TERMS
Hi Wall will pay the Owner the agreed monthly rate within 14 days of each calendar month during an active campaign.

6. CANCELLATION
a) Owner-initiated cancellation after a campaign has been sold requires 90 days written notice and may incur a cancellation fee equal to 3 months rental.
b) Hi Wall may cancel with 30 days notice if no campaign is placed within 6 months.

7. INSURANCE & LIABILITY
Hi Wall maintains public liability insurance covering installation and campaign activities.

8. TERM
This agreement continues for the listed duration unless terminated per Clause 6.

9. GOVERNING LAW
Governed by the laws of New South Wales, Australia.', true);

-- 8. CREATE ADMIN USER (run after creating your admin account via the Auth UI)
-- Replace YOUR_ADMIN_USER_ID with the actual UUID from Supabase Auth → Users
-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}' WHERE id = 'YOUR_ADMIN_USER_ID';
