-- ==============================================================================
-- BAPTISMAL & 1ST BIRTHDAY ONLINE INVITATION SYSTEM
-- Supabase PostgreSQL Migration Script
-- Version: 1.0.0
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create ENUM types for statuses
DO $$ BEGIN
    CREATE TYPE invitation_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE rsvp_status AS ENUM ('attending', 'declined', 'tentative');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_type AS ENUM ('ceremony', 'reception');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Administrator Profiles Table
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'editor')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Invitations Table (Draft Master Records)
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    child_name TEXT NOT NULL,
    child_photo_url TEXT,
    cover_title TEXT DEFAULT 'Holy Baptism & 1st Birthday',
    parents_names TEXT NOT NULL,
    invitation_message TEXT,
    bible_verse TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    rsvp_deadline TIMESTAMPTZ,
    max_capacity INT DEFAULT 100,
    background_music_url TEXT,
    dress_code_title TEXT DEFAULT 'Sunday Best / Garden Chic',
    dress_code_description TEXT,
    dress_code_colors JSONB DEFAULT '["#5F7D65", "#EBE3D3", "#BF9C68", "#F6F1E7"]'::jsonb,
    status invitation_status DEFAULT 'draft',
    draft_content JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_separate_attendance_allowed BOOLEAN DEFAULT true,
    published_version_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup by slug
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);

-- 5. Published Snapshots Table (Separate Draft vs Published Isolation)
CREATE TABLE IF NOT EXISTS invitation_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    snapshot_content JSONB NOT NULL,
    published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    change_summary TEXT
);

CREATE INDEX IF NOT EXISTS idx_invitation_versions_invitation ON invitation_versions(invitation_id);

-- 6. Events Detail Table (Ceremony & Reception)
CREATE TABLE IF NOT EXISTS invitation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    event_type event_type NOT NULL,
    title TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    map_url TEXT,
    directions_note TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_invitation ON invitation_events(invitation_id);

-- 7. Program Schedule Table
CREATE TABLE IF NOT EXISTS invitation_program (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    time_label TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_program_invitation ON invitation_program(invitation_id);

-- 8. Gallery Photos Table
CREATE TABLE IF NOT EXISTS invitation_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_invitation ON invitation_gallery(invitation_id);

-- 9. Guest RSVPs Table
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    contact_number TEXT,
    email TEXT,
    status rsvp_status NOT NULL DEFAULT 'attending',
    attending_ceremony BOOLEAN DEFAULT true,
    attending_reception BOOLEAN DEFAULT true,
    attendees_count INT NOT NULL DEFAULT 1 CHECK (attendees_count >= 1),
    accompanying_guests TEXT,
    dietary_notes TEXT,
    message TEXT,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_invitation ON rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- ADMIN PROFILES POLICIES
CREATE POLICY "Admins can view profiles" 
    ON admin_profiles FOR SELECT 
    TO authenticated 
    USING (auth.uid() = id);

-- INVITATIONS POLICIES
-- 1. Public can only read published invitations
CREATE POLICY "Public can view published invitations" 
    ON invitations FOR SELECT 
    TO anon, authenticated 
    USING (status = 'published');

-- 2. Authenticated admins can manage invitations
CREATE POLICY "Admins have full access to invitations" 
    ON invitations FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- INVITATION VERSIONS POLICIES
-- 1. Public can read snapshot for published version
CREATE POLICY "Public can read published version snapshots" 
    ON invitation_versions FOR SELECT 
    TO anon, authenticated 
    USING (EXISTS (
        SELECT 1 FROM invitations 
        WHERE invitations.id = invitation_versions.invitation_id 
        AND invitations.status = 'published'
        AND invitations.published_version_id = invitation_versions.id
    ));

-- 2. Admins can view and create versions
CREATE POLICY "Admins have full access to versions" 
    ON invitation_versions FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- EVENTS POLICIES
CREATE POLICY "Public can view events for published invitations" 
    ON invitation_events FOR SELECT 
    TO anon, authenticated 
    USING (EXISTS (
        SELECT 1 FROM invitations 
        WHERE invitations.id = invitation_events.invitation_id 
        AND invitations.status = 'published'
    ));

CREATE POLICY "Admins have full access to events" 
    ON invitation_events FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- PROGRAM POLICIES
CREATE POLICY "Public can view program for published invitations" 
    ON invitation_program FOR SELECT 
    TO anon, authenticated 
    USING (EXISTS (
        SELECT 1 FROM invitations 
        WHERE invitations.id = invitation_program.invitation_id 
        AND invitations.status = 'published'
    ));

CREATE POLICY "Admins have full access to program" 
    ON invitation_program FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- GALLERY POLICIES
CREATE POLICY "Public can view gallery for published invitations" 
    ON invitation_gallery FOR SELECT 
    TO anon, authenticated 
    USING (EXISTS (
        SELECT 1 FROM invitations 
        WHERE invitations.id = invitation_gallery.invitation_id 
        AND invitations.status = 'published'
    ));

CREATE POLICY "Admins have full access to gallery" 
    ON invitation_gallery FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- RSVP POLICIES (Strict Security)
-- 1. Anonymous guests can submit an RSVP response only if the invitation is published
CREATE POLICY "Guests can insert RSVPs for published events" 
    ON rsvps FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (EXISTS (
        SELECT 1 FROM invitations 
        WHERE invitations.id = rsvps.invitation_id 
        AND invitations.status = 'published'
    ));

-- 2. Guests cannot query the whole table! Only the authenticated admin can SELECT or UPDATE
CREATE POLICY "Admins have full access to RSVPs" 
    ON rsvps FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET CREATION & POLICIES
-- ==============================================================================

-- Create 'invitation-media' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invitation-media', 'invitation-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images in 'invitation-media'
CREATE POLICY "Public media access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'invitation-media');

-- Authenticated admins can upload media
CREATE POLICY "Admins upload media" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'invitation-media');

-- Authenticated admins can update/delete media
CREATE POLICY "Admins modify media" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'invitation-media');

CREATE POLICY "Admins delete media" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'invitation-media');
