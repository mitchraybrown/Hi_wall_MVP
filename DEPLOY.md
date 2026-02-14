# Hi Wall v2 — Fresh Deploy Guide

Complete setup from scratch: Supabase + Vercel + GitHub.

---

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `hiwall`, choose a password, pick the **Sydney** region
3. Wait for it to provision (~2 min)

### Run the schema

4. Go to **SQL Editor** → New Query
5. Open `SCHEMA.sql` from this package, paste the entire contents, click **Run**
6. You should see all tables created: `walls`, `owner_profiles`, `enquiries`, `partners`, `hero_images`, `contract_terms`

### Set up your admin account

7. Go to **Authentication → Users → Add User**
8. Create your admin account (e.g. `admin@hiwall.com.au` / strong password)
9. Copy the UUID of the user you just created
10. Go back to **SQL Editor** and run:

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
WHERE id = 'PASTE-YOUR-UUID-HERE';
```

### Get your API keys

11. Go to **Settings → API**
12. Copy **Project URL** and **anon/public key** — you'll need these next

---

## Step 2: Set Up the Code

### Option A: Push to a NEW GitHub repo

```bash
# Unzip the package
unzip hiwall-v2-complete.zip
cd hiwall-v2

# Create .env file
cp .env.example .env
# Edit .env and paste your Supabase URL and anon key

# Init git
git init
git add -A
git commit -m "Hi Wall v2 initial deploy"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/hiwall.git
git branch -M main
git push -u origin main
```

### Option B: Replace your existing repo

```bash
# In your existing hiwall repo
git checkout -b v2-clean

# Delete old src
rm -rf src/ index.html package.json vite.config.js

# Copy everything from the unzipped package
cp -r /path/to/hiwall-v2/* .

# Update .env with your Supabase keys
cp .env.example .env
# Edit .env

git add -A
git commit -m "Hi Wall v2 complete rebuild"
git checkout main
git merge v2-clean
git push origin main
```

---

## Step 3: Deploy to Vercel

### If connecting a new repo:

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework: **Vite**
4. Add environment variables:
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
5. Click **Deploy**

### If replacing your existing deploy:

1. Go to your project in Vercel
2. Go to **Settings → Environment Variables**
3. Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
4. Push to main — Vercel auto-deploys

---

## Step 4: Verify Everything Works

| Test | How |
|------|-----|
| **Homepage loads** | Visit your Vercel URL — browse page should render |
| **List a Wall (guest)** | Click "List a Wall" in nav → 5-step flow, no login needed |
| **Photo upload** | Step 1 → paste an image URL → should show preview |
| **Pricing breakdown** | Step 3 → should show owner earnings, campaign price, Hi Wall fee |
| **Account creation** | Step 4 → create account → Step 5 → sign terms → wall submitted |
| **About Us** | Click "About Us" → scroll to "Get in Touch" → council form opens |
| **Partners** | Click "Partners" → apply form works |
| **Admin login** | Click "Admin" in footer → login with your admin account |
| **Admin approve wall** | Click a pending wall → change status to Approved → Save |
| **Wall appears on browse** | Go back to homepage — approved wall should now show |
| **Admin fee control** | In admin wall detail → change Hi Wall Fee % → save |
| **Council filter** | Browse page → council dropdown in filter bar |
| **Enquiry/brief** | Click a wall → click book button → submit brief |

---

## Project Structure

```
hiwall-v2/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── SCHEMA.sql              ← Run in Supabase SQL Editor
├── src/
│   ├── main.jsx            ← Entry point
│   ├── App.jsx             ← Routes + auth
│   ├── supabase.js         ← Supabase client
│   ├── components/
│   │   ├── Nav.jsx         ← Navigation
│   │   ├── Footer.jsx      ← Footer with admin link
│   │   ├── ui.jsx          ← Shared UI components
│   │   └── EnquiryForm.jsx ← Booking brief modal
│   ├── lib/
│   │   └── pricing.js      ← Pricing engine ($10/sqm, campPrice, fee logic)
│   ├── pages/
│   │   ├── AboutPage.jsx   ← About + council enquiry form
│   │   ├── BrowsePage.jsx  ← Browse, filter, map, wall cards
│   │   ├── ListWallPage.jsx← 5-step public listing flow
│   │   ├── PartnersPage.jsx← Partner directory + apply
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       └── AdminDashboard.jsx
│   └── styles/
│       └── global.css
```

---

## Pricing Model

```
Owner Earnings = sqm × $10 × traffic × suburb × condition × orientation × access × duration_discount
Hi Wall Fee    = Owner Earnings × fee% (default 25%)
Campaign Price = Owner Earnings + Hi Wall Fee   ← this is what brands see

Admin can set fee% per wall: 0–50%
```

---

## Key URLs on Your Live Site

| Page | Path |
|------|------|
| Browse Walls | `/` |
| List a Wall | `/list` |
| About Us | `/about` |
| Partners | `/partners` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin` |

---

## Demo Accounts

After deploy, create test accounts through the UI:
- **Owner**: Sign up via "List a Wall" flow
- **Buyer**: Sign up via "Sign Up" button, or submit an enquiry
- **Admin**: Created in Step 1 above

---

## Troubleshooting

**"Invalid credentials" on admin login**
→ Make sure you ran the SQL to set the admin role metadata (Step 1, item 10)

**Walls don't show on browse page**
→ Walls must have `status = 'approved'` — approve them in Admin dashboard

**Prices showing as $0**
→ Check the wall has `price_total` set. Admin can edit this in the wall detail panel.

**Council filter empty**
→ Walls need the `council` field populated. New walls auto-populate from neighbourhood.

**Enquiry form doesn't submit**
→ Check RLS policies were created (they're in SCHEMA.sql). Anon inserts must be allowed on `enquiries`.
