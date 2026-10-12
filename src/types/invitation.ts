export type InvitationStatus = 'draft' | 'published' | 'archived';
export type RSVPStatus = 'attending' | 'declined' | 'tentative';
export type EventType = 'ceremony' | 'reception';

export interface EventDetail {
  id: string;
  type: EventType;
  title: string;
  venueName: string;
  venueAddress: string;
  dateTime: string;
  endTime?: string;
  mapUrl?: string;
  directionsNote?: string;
}

export interface Godparent {
  id: string;
  name: string;
  role: 'Principal Sponsor' | 'Ninong' | 'Ninang';
}

export interface ProgramItem {
  id: string;
  timeLabel: string;
  title: string;
  description?: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption?: string;
}

export interface RSVPRecord {
  id: string;
  invitationId: string;
  guestName: string;
  contactNumber?: string;
  email?: string;
  status: RSVPStatus;
  attendingCeremony: boolean;
  attendingReception: boolean;
  attendeesCount: number;
  accompanyingGuests?: string;
  dietaryNotes?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationData {
  id: string;
  slug: string;
  childName: string;
  childPhotoUrl: string;
  coverTitle: string;
  parentsNames: string;
  invitationMessage: string;
  bibleVerse: string;
  eventDate: string; // ISO string of main event date
  rsvpDeadline: string; // ISO string
  maxCapacity: number;
  backgroundMusicUrl?: string;
  dressCodeTitle: string;
  dressCodeDescription: string;
  dressCodeColors: string[];
  isSeparateAttendanceAllowed: boolean;
  events: EventDetail[];
  godparents: Godparent[];
  program: ProgramItem[];
  gallery: GalleryItem[];
  closingTitle: string;
  closingMessage: string;
  status: InvitationStatus;
  lastPublishedAt?: string;
  version: number;
}

export interface PublishedSnapshot {
  id: string;
  invitationId: string;
  versionNumber: number;
  snapshotContent: InvitationData;
  publishedAt: string;
  publishedBy?: string;
}

export interface AdminAuthSession {
  isAuthenticated: boolean;
  userEmail?: string;
  adminName?: string;
  token?: string;
}
