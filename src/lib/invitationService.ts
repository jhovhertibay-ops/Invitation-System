import { 
  InvitationData, 
  RSVPRecord, 
  PublishedSnapshot 
} from '../types/invitation';
import { SAMPLE_INVITATION, SAMPLE_INITIAL_RSVPS } from '../data/sampleInvitation';
import { getSupabase, isSupabaseConfigured } from './supabase';

const INVITATIONS_STORAGE_KEY = 'baptism_invitations_v1';
const VERSIONS_STORAGE_KEY = 'baptism_invitation_versions_v1';
const RSVPS_STORAGE_KEY = 'baptism_rsvps_v1';

// Initialize local cache from storage or sample data
function initLocalStorage() {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(INVITATIONS_STORAGE_KEY)) {
    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify([SAMPLE_INVITATION]));
  }
  
  if (!localStorage.getItem(VERSIONS_STORAGE_KEY)) {
    const initialSnapshot: PublishedSnapshot = {
      id: 'ver-initial-1',
      invitationId: SAMPLE_INVITATION.id,
      versionNumber: 1,
      snapshotContent: SAMPLE_INVITATION,
      publishedAt: SAMPLE_INVITATION.lastPublishedAt || new Date().toISOString(),
    };
    localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify([initialSnapshot]));
  }
  
  if (!localStorage.getItem(RSVPS_STORAGE_KEY)) {
    localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify(SAMPLE_INITIAL_RSVPS));
  }
}

// Ensure storage is initialized on load
if (typeof window !== 'undefined') {
  initLocalStorage();
}

/**
 * Get active invitations list (for Admin)
 */
export async function getInvitations(): Promise<InvitationData[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(item => ({
          ...item.draft_content,
          id: item.id,
          slug: item.slug,
          status: item.status,
          lastPublishedAt: item.updated_at,
        }));
      }
    } catch {
      // Fall through to local storage
    }
  }

  // Local storage fallback
  try {
    const raw = localStorage.getItem(INVITATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [SAMPLE_INVITATION];
  } catch {
    return [SAMPLE_INVITATION];
  }
}

/**
 * Fetch invitation by slug.
 * - If forAdmin is false (public guest view), only the published snapshot is returned!
 * - If the invitation is in draft or unpublished, returns null.
 */
export async function getInvitationBySlug(
  slug: string, 
  options: { forAdmin?: boolean } = {}
): Promise<{ invitation: InvitationData | null; isPublished: boolean; isDraftPreview?: boolean }> {
  const { forAdmin = false } = options;
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data: invRow, error: invError } = await supabase
        .from('invitations')
        .select('*, invitation_versions(*)')
        .eq('slug', slug)
        .single();

      if (!invError && invRow) {
        const isPub = invRow.status === 'published';
        
        if (forAdmin) {
          // Admin sees full draft content
          return {
            invitation: {
              ...invRow.draft_content,
              id: invRow.id,
              slug: invRow.slug,
              status: invRow.status,
              lastPublishedAt: invRow.updated_at,
            },
            isPublished: isPub,
            isDraftPreview: true,
          };
        }

        // Public visitor: must be published
        if (!isPub) {
          return { invitation: null, isPublished: false };
        }

        // Return latest published version snapshot
        const versions = invRow.invitation_versions || [];
        const latestVer = versions.sort(
          (a: { version_number: number }, b: { version_number: number }) => b.version_number - a.version_number
        )[0];

        return {
          invitation: latestVer ? latestVer.snapshot_content : invRow.draft_content,
          isPublished: true,
        };
      }
    } catch {
      // Fall through
    }
  }

  // Local storage resolution
  const items = await getInvitations();
  const invitation = items.find(inv => inv.slug === slug);
  if (!invitation) {
    return { invitation: null, isPublished: false };
  }

  const isPub = invitation.status === 'published';
  if (!isPub && !forAdmin) {
    return { invitation: null, isPublished: false };
  }

  if (forAdmin) {
    return { invitation, isPublished: isPub, isDraftPreview: true };
  }

  // Find published snapshot
  try {
    const rawVersions = localStorage.getItem(VERSIONS_STORAGE_KEY);
    const versions: PublishedSnapshot[] = rawVersions ? JSON.parse(rawVersions) : [];
    const matched = versions
      .filter(v => v.invitationId === invitation.id)
      .sort((a, b) => b.versionNumber - a.versionNumber)[0];

    return {
      invitation: matched ? matched.snapshotContent : invitation,
      isPublished: true,
    };
  } catch {
    return { invitation, isPublished: true };
  }
}

/**
 * Save draft without altering the published version
 */
export async function saveInvitationDraft(data: InvitationData): Promise<InvitationData> {
  const supabase = getSupabase();
  const updated: InvitationData = {
    ...data,
    // Status stays as is or stays draft
  };

  if (supabase) {
    try {
      await supabase.from('invitations').upsert({
        id: updated.id,
        slug: updated.slug,
        child_name: updated.childName,
        child_photo_url: updated.childPhotoUrl,
        parents_names: updated.parentsNames,
        invitation_message: updated.invitationMessage,
        bible_verse: updated.bibleVerse,
        event_date: updated.eventDate,
        rsvp_deadline: updated.rsvpDeadline,
        max_capacity: updated.maxCapacity,
        status: updated.status,
        draft_content: updated,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Supabase save error, persisting locally:', err);
    }
  }

  // Persist locally
  const currentList = await getInvitations();
  const index = currentList.findIndex(inv => inv.id === updated.id);
  if (index >= 0) {
    currentList[index] = updated;
  } else {
    currentList.push(updated);
  }
  localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(currentList));
  return updated;
}

/**
 * Publish invitation: freezes snapshot, updates status, sets publication timestamp
 */
export async function publishInvitation(data: InvitationData): Promise<{ invitation: InvitationData; snapshot: PublishedSnapshot }> {
  const newVersion = (data.version || 1) + 1;
  const publishedAt = new Date().toISOString();

  const publishedData: InvitationData = {
    ...data,
    status: 'published',
    version: newVersion,
    lastPublishedAt: publishedAt,
  };

  const snapshot: PublishedSnapshot = {
    id: `ver-${Date.now()}`,
    invitationId: publishedData.id,
    versionNumber: newVersion,
    snapshotContent: JSON.parse(JSON.stringify(publishedData)),
    publishedAt,
    publishedBy: 'Administrator',
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      // Insert version snapshot
      await supabase.from('invitation_versions').insert({
        id: snapshot.id,
        invitation_id: publishedData.id,
        version_number: newVersion,
        snapshot_content: snapshot.snapshotContent,
        published_at: publishedAt,
      });

      // Update master invitation record
      await supabase.from('invitations').update({
        status: 'published',
        published_version_id: snapshot.id,
        draft_content: publishedData,
        updated_at: publishedAt,
      }).eq('id', publishedData.id);
    } catch (err) {
      console.warn('Supabase publish error, saving snapshot locally:', err);
    }
  }

  // Local storage save
  await saveInvitationDraft(publishedData);

  try {
    const rawVersions = localStorage.getItem(VERSIONS_STORAGE_KEY);
    const versions: PublishedSnapshot[] = rawVersions ? JSON.parse(rawVersions) : [];
    versions.unshift(snapshot);
    localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(versions));
  } catch (err) {
    console.error(err);
  }

  return { invitation: publishedData, snapshot };
}

/**
 * Unpublish invitation: blocks public access while preserving draft and RSVPs
 */
export async function unpublishInvitation(id: string): Promise<InvitationData> {
  const currentList = await getInvitations();
  const target = currentList.find(inv => inv.id === id);
  if (!target) throw new Error('Invitation not found');

  const unpublishedData: InvitationData = {
    ...target,
    status: 'draft',
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('invitations').update({
        status: 'draft',
        updated_at: new Date().toISOString(),
      }).eq('id', id);
    } catch (err) {
      console.warn('Supabase unpublish error:', err);
    }
  }

  await saveInvitationDraft(unpublishedData);
  return unpublishedData;
}

/**
 * Get Version Snapshots
 */
export async function getInvitationVersions(invitationId: string): Promise<PublishedSnapshot[]> {
  try {
    const raw = localStorage.getItem(VERSIONS_STORAGE_KEY);
    const versions: PublishedSnapshot[] = raw ? JSON.parse(raw) : [];
    return versions.filter(v => v.invitationId === invitationId);
  } catch {
    return [];
  }
}

/**
 * Get RSVPs (Admin only)
 */
export async function getRSVPs(invitationId: string): Promise<RSVPRecord[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          invitationId: item.invitation_id,
          guestName: item.guest_name,
          contactNumber: item.contact_number,
          email: item.email,
          status: item.status,
          attendingCeremony: item.attending_ceremony,
          attendingReception: item.attending_reception,
          attendeesCount: item.attendees_count,
          accompanyingGuests: item.accompanying_guests,
          dietaryNotes: item.dietary_notes,
          message: item.message,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
      }
    } catch {
      // Fall through to local storage
    }
  }

  try {
    const raw = localStorage.getItem(RSVPS_STORAGE_KEY);
    const list: RSVPRecord[] = raw ? JSON.parse(raw) : [];
    return list.filter(r => r.invitationId === invitationId);
  } catch {
    return [];
  }
}

/**
 * Submit Guest RSVP
 */
export async function submitGuestRSVP(
  input: Omit<RSVPRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; record?: RSVPRecord; error?: string }> {
  // 1. Check invitation status
  const invitations = await getInvitations();
  const invitation = invitations.find(i => i.id === input.invitationId);
  if (!invitation) {
    return { success: false, error: 'Invitation could not be located.' };
  }

  if (invitation.status !== 'published') {
    return { success: false, error: 'RSVP is closed because this invitation is not currently published.' };
  }

  // 2. Deadline check
  if (invitation.rsvpDeadline) {
    const deadlineDate = new Date(invitation.rsvpDeadline).getTime();
    if (Date.now() > deadlineDate) {
      return { success: false, error: 'The RSVP confirmation deadline for this celebration has passed.' };
    }
  }

  // 3. Existing RSVPs check & Capacity validation
  const existingList = await getRSVPs(input.invitationId);
  const currentAttendingCount = existingList
    .filter(r => r.status === 'attending')
    .reduce((sum, r) => sum + (r.attendeesCount || 1), 0);

  if (input.status === 'attending') {
    const requestedCount = input.attendeesCount || 1;
    if (currentAttendingCount + requestedCount > invitation.maxCapacity) {
      const remaining = Math.max(0, invitation.maxCapacity - currentAttendingCount);
      return { 
        success: false, 
        error: `We have reached venue capacity. Only ${remaining} seat(s) remaining for this event.` 
      };
    }
  }

  // Check if guest is updating their existing RSVP (by email or full name)
  const existingIndex = existingList.findIndex(
    r => (input.email && r.email && r.email.toLowerCase() === input.email.toLowerCase()) ||
         (r.guestName.toLowerCase().trim() === input.guestName.toLowerCase().trim())
  );

  const timestamp = new Date().toISOString();
  let finalRecord: RSVPRecord;

  if (existingIndex >= 0) {
    // Update existing
    finalRecord = {
      ...existingList[existingIndex],
      ...input,
      updatedAt: timestamp,
    };
  } else {
    // New submission
    finalRecord = {
      ...input,
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('rsvps').upsert({
        id: finalRecord.id,
        invitation_id: finalRecord.invitationId,
        guest_name: finalRecord.guestName,
        contact_number: finalRecord.contactNumber,
        email: finalRecord.email,
        status: finalRecord.status,
        attending_ceremony: finalRecord.attendingCeremony,
        attending_reception: finalRecord.attendingReception,
        attendees_count: finalRecord.attendeesCount,
        accompanying_guests: finalRecord.accompanyingGuests,
        dietary_notes: finalRecord.dietaryNotes,
        message: finalRecord.message,
        updated_at: timestamp,
      });
    } catch (err) {
      console.warn('Supabase RSVP insert error, stored locally:', err);
    }
  }

  // Save to local storage
  const raw = localStorage.getItem(RSVPS_STORAGE_KEY);
  let allRsvps: RSVPRecord[] = raw ? JSON.parse(raw) : [];
  const idx = allRsvps.findIndex(r => r.id === finalRecord.id);
  if (idx >= 0) {
    allRsvps[idx] = finalRecord;
  } else {
    allRsvps.unshift(finalRecord);
  }
  localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify(allRsvps));

  return { success: true, record: finalRecord };
}

/**
 * Delete RSVP (Admin only)
 */
export async function deleteRSVP(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('rsvps').delete().eq('id', id);
    } catch {
      // Local fallback
    }
  }

  const raw = localStorage.getItem(RSVPS_STORAGE_KEY);
  if (raw) {
    const list: RSVPRecord[] = JSON.parse(raw);
    const filtered = list.filter(r => r.id !== id);
    localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify(filtered));
  }
}
