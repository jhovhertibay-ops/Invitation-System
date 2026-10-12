# Baptismal & 1st Birthday Online Invitation System

A production-ready, full-stack **Online Baptismal and 1st Birthday Invitation & RSVP Management System** designed for effortless deployment on **Vercel** with **Supabase PostgreSQL & Storage**.

---

## Features

- **Public Mobile-First Invitation (`/invite/[slug]`)**:
  - Interactive wax seal "Open Invitation" envelope with smooth unfolding animation.
  - Baby's portrait, dedication scripture, and personalized parental invitation message.
  - Dedicated ceremony (Church) and reception (Feast) venue cards with directions and direct Google Maps navigation.
  - One-click **Add to Calendar (.ics)** for Apple Calendar, Google Calendar, and Outlook.
  - Live ticking event countdown (Days, Hours, Minutes, Seconds).
  - Spiritual Godparents & Sponsors list (Principal Sponsors, Ninongs, Ninangs).
  - Program itinerary and celebration order of activities.
  - High-resolution memory milestone polaroid photo gallery with lightbox viewer.
  - Dress code recommendations with interactive color palette swatches (Sage Green, Sand Beige, Cream, Champagne Gold).
  - Guest RSVP form with capacity safeguards, duplicate response updates, and dietary notes.
  - Ambient instrumental background music player with play/pause and volume controls.
  - Closing thank-you note and family signature.

- **Protected Administrator Dashboard (`/admin`)**:
  - **Overview**: Real-time RSVP tallies, ceremony vs. reception headcounts, capacity utilization %, countdown, and shareable link generator.
  - **Content Editor**: Edit all event details, parents' names, photos, schedules, and dress codes with auto-save indicators.
  - **Draft vs. Published Snapshots**: Edit drafts privately without affecting the live public version seen by guests. Clicking "Publish" freezes a versioned snapshot.
  - **Publish / Unpublish Controls**: Unpublishing revokes public access with confirmation while preserving all draft data and guest RSVP records.
  - **RSVP Management**: Filter by status, search guest names, view dietary notes, add manual responses, and export to CSV.
  - **Gallery Management**: Upload photos from local devices or add cloud URLs with captions.
  - **Settings & Database Diagnostics**: Live Supabase connection test, configuration checks, and demo data reset.

---

## Technology Stack

- **Framework**: React / Next.js compatible architecture with TypeScript
- **Styling**: Tailwind CSS with custom editorial fonts (`Cormorant Garamond` & `Plus Jakarta Sans`)
- **Database**: Supabase PostgreSQL with strict Row Level Security (RLS)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (`invitation-media` bucket)
- **Deployment**: Vercel Serverless

---

## Environment Variables

Copy the `.env.example` file to `.env`:

```env
# Supabase Project Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Vite Preview Client Aliases
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Complete Deployment Guide (10 Steps)

Follow these exact 10 steps to deploy your application to Vercel and Supabase:

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, select an organization, choose your preferred cloud region, and assign a strong database password.

### Step 2: Run the Generated SQL Migrations in the Supabase SQL Editor
1. In your Supabase Dashboard, open the **SQL Editor** tab from the left sidebar.
2. Open the file `supabase/migrations/20261012000000_init_invitation_system.sql` from this repository.
3. Paste the complete SQL script into the query editor and click **Run**.
4. This creates all necessary tables (`invitations`, `invitation_versions`, `invitation_events`, `invitation_gallery`, `invitation_program`, `rsvps`, `admin_profiles`) along with indexes, foreign keys, and Row Level Security policies.

### Step 3: Configure Database, Authentication, and Storage Policies
1. In the Supabase Dashboard, navigate to **Storage**.
2. Confirm the `invitation-media` bucket exists and is set to **Public** (the migration automatically creates it).
3. If creating manually, click **New Bucket**, name it `invitation-media`, and toggle **Public bucket: ON**.
4. Navigate to **Authentication → URL Configuration** and set the Site URL to your Vercel deployment URL (or `http://localhost:3000` for development).

### Step 4: Create the First Administrator Using the Secure Setup Procedure
1. In the Supabase Dashboard, navigate to **Authentication → Users**.
2. Click **Add User → Create User**.
3. Enter your administrator email (e.g., `admin@celebration.com`) and a secure password.
4. Check **Auto Confirm User?** so you can log in immediately without requiring email verification.
5. In the SQL Editor, link your administrator profile:
   ```sql
   INSERT INTO admin_profiles (id, email, full_name, role)
   SELECT id, email, 'Event Administrator', 'admin'
   FROM auth.users
   WHERE email = 'admin@celebration.com'
   ON CONFLICT (id) DO NOTHING;
   ```

### Step 5: Push the Project to GitHub
1. Initialize git in your local directory (if not already done):
   ```bash
   git add .
   git commit -m "feat: complete baptismal and 1st birthday invitation system"
   ```
2. Create a new repository on GitHub and push your main branch:
   ```bash
   git remote add origin https://github.com/your-username/baptismal-invitation-system.git
   git branch -M main
   git push -u origin main
   ```

### Step 6: Import the GitHub Repository into Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New... → Project**.
3. Select your GitHub repository `baptismal-invitation-system` and click **Import**.

### Step 7: Add the Required Environment Variables to the Vercel Project
In the Vercel project configuration screen, expand **Environment Variables** and add:
- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL (`https://xyz.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase public anon key
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase secret service-role key
- `VITE_SUPABASE_URL` = your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase public anon key

### Step 8: Deploy the Application
1. Click **Deploy**.
2. Vercel will build and deploy the project in approximately 30–60 seconds.

### Step 9: Test Administrator Login, Editing, Publishing, and RSVPs
1. Open your deployed URL and navigate to the admin console via `/admin` or `#admin`.
2. Sign in with the administrator account created in Step 4.
3. Edit invitation details in the **Content Editor** and click **Save Draft**.
4. Click **Publish Live** to create a frozen snapshot.
5. Test guest RSVP submission from a separate incognito browser window or phone.
6. Verify the response appears instantly in the **RSVP Management** roster.
7. Test the **Unpublish** feature to confirm public access is blocked while all draft data is preserved.

### Step 10: Copy the Published Invitation URL and Share with Guests
1. From the Admin Overview screen, click **Copy Public URL**.
2. Share the generated link (e.g. `https://your-domain.vercel.app/invite/lucas-gabriel-baptism-and-first-birthday`) via SMS, WhatsApp, Messenger, or email.

---

## Redeployment & Content Updates

Changes to celebration dates, venues, program schedules, godparents, and RSVP rules are managed directly through the `/admin` dashboard and do **not** require rebuilding or redeploying the application. Redeploy only when modifying application source code or styling.
