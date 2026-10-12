import React, { useState } from 'react';
import { InvitationData, RSVPRecord } from '../../types/invitation';
import { 
  Users, 
  Calendar, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  Sparkles,
  Heart,
  TrendingUp,
  ShieldCheck,
  Send
} from 'lucide-react';

interface AdminOverviewProps {
  invitation: InvitationData;
  rsvps: RSVPRecord[];
  onNavigateTab: (tab: string) => void;
  onPreviewDraft: () => void;
  onOpenPublic: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  invitation,
  rsvps,
  onNavigateTab,
  onPreviewDraft,
  onOpenPublic,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Statistics calculations
  const totalResponses = rsvps.length;
  const attendingRsvps = rsvps.filter(r => r.status === 'attending');
  const totalAttendingGuests = attendingRsvps.reduce((sum, r) => sum + (r.attendeesCount || 1), 0);
  const declinedCount = rsvps.filter(r => r.status === 'declined').length;
  const tentativeCount = rsvps.filter(r => r.status === 'tentative').length;

  const ceremonyCount = attendingRsvps.filter(r => r.attendingCeremony).reduce((sum, r) => sum + (r.attendeesCount || 1), 0);
  const receptionCount = attendingRsvps.filter(r => r.attendingReception).reduce((sum, r) => sum + (r.attendeesCount || 1), 0);

  const capacityPct = Math.min(100, Math.round((totalAttendingGuests / (invitation.maxCapacity || 100)) * 100));

  const daysUntilEvent = Math.ceil((new Date(invitation.eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const copyShareLink = () => {
    const url = `${window.location.origin}/invite/${invitation.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Status Card */}
      <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8DEC9]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${
                invitation.status === 'published' 
                  ? 'bg-[#E3EBE3] text-[#3D5241] border border-[#C5D7C5]'
                  : 'bg-[#F2ECE1] text-[#7A6B53] border border-[#E0D4C0]'
              }`}>
                {invitation.status === 'published' ? '● Published & Live' : '○ Draft Mode'}
              </span>
              <span className="text-xs text-[#827663]">
                Version {invitation.version || 1}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#2B332C] font-normal">
              {invitation.childName}'s Celebration
            </h1>
            <p className="text-xs sm:text-sm text-[#6C6354] mt-1">
              {invitation.coverTitle} · {new Date(invitation.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#F2EDE2] hover:bg-[#E5DDCF] text-[#473F32] rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer border border-[#DACDB8]"
            >
              {copied ? <Check className="w-4 h-4 text-[#5F7D65]" /> : <Copy className="w-4 h-4 text-[#8C7A62]" />}
              <span>{copied ? 'Link Copied!' : 'Copy Public URL'}</span>
            </button>

            <button
              onClick={onPreviewDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#FAF7F2] hover:bg-[#F2EDE2] text-[#473F32] rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer border border-[#DACDB8]"
            >
              <span>Preview Draft</span>
            </button>

            <button
              onClick={onOpenPublic}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#5F7D65] hover:bg-[#4E6853] text-[#FAF7F2] rounded-xl text-xs font-semibold tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              <span>Visit Live Invitation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Share Link Banner */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#F4EFE5] rounded-xl border border-[#DECDB7] text-xs text-[#63594A]">
          <div className="truncate">
            <span className="font-semibold text-[#3D3528]">Public Guest Link: </span>
            <span className="font-mono text-[#5F7D65] select-all">
              {typeof window !== 'undefined' ? `${window.location.origin}/invite/${invitation.slug}` : `/invite/${invitation.slug}`}
            </span>
          </div>
          <span className="shrink-0 text-[11px] text-[#8C7F6C]">
            {invitation.status === 'published' ? 'Accessible by anyone with link' : 'Currently private (Draft)'}
          </span>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#827562] mb-2 font-medium">
            <span>Confirmed Guests</span>
            <Users className="w-4 h-4 text-[#5F7D65]" />
          </div>
          <div className="font-serif text-3xl text-[#2B332C] font-semibold tabular-nums">
            {totalAttendingGuests}
          </div>
          <p className="text-[11px] text-[#827562] mt-1">
            from {attendingRsvps.length} RSVP party responses
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#827562] mb-2 font-medium">
            <span>Capacity Utilization</span>
            <TrendingUp className="w-4 h-4 text-[#BF9C68]" />
          </div>
          <div className="font-serif text-3xl text-[#2B332C] font-semibold tabular-nums">
            {capacityPct}%
          </div>
          <p className="text-[11px] text-[#827562] mt-1">
            {totalAttendingGuests} of {invitation.maxCapacity} seats filled
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#827562] mb-2 font-medium">
            <span>Days Remaining</span>
            <Clock className="w-4 h-4 text-[#5F7D65]" />
          </div>
          <div className="font-serif text-3xl text-[#2B332C] font-semibold tabular-nums">
            {daysUntilEvent > 0 ? daysUntilEvent : '0'}
          </div>
          <p className="text-[11px] text-[#827562] mt-1">
            until celebration day
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#827562] mb-2 font-medium">
            <span>Regrets / Tentative</span>
            <Heart className="w-4 h-4 text-[#8C7D68]" />
          </div>
          <div className="font-serif text-3xl text-[#2B332C] font-semibold tabular-nums">
            {declinedCount} <span className="text-sm font-normal text-[#968975]">/ {tentativeCount}</span>
          </div>
          <p className="text-[11px] text-[#827562] mt-1">
            unable to attend / confirming later
          </p>
        </div>
      </div>

      {/* Attendance Split & Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Breakdown Card */}
        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 shadow-xs">
          <h3 className="font-serif text-xl text-[#2B332C] font-medium mb-4">
            Event Headcount Breakdown
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-[#4B534C] mb-1.5">
                <span>Holy Baptism Ceremony</span>
                <span className="tabular-nums font-semibold">{ceremonyCount} guests</span>
              </div>
              <div className="w-full bg-[#EAE2D3] h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#5F7D65] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (ceremonyCount / (invitation.maxCapacity || 100)) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-[#4B534C] mb-1.5">
                <span>Birthday Reception</span>
                <span className="tabular-nums font-semibold">{receptionCount} guests</span>
              </div>
              <div className="w-full bg-[#EAE2D3] h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#BF9C68] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (receptionCount / (invitation.maxCapacity || 100)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EAE1D1] flex items-center justify-between">
            <span className="text-xs text-[#7A7163]">Total Responses: {totalResponses}</span>
            <button
              onClick={() => onNavigateTab('rsvps')}
              className="text-xs text-[#5F7D65] hover:text-[#4A6450] font-semibold underline underline-offset-4 cursor-pointer"
            >
              View Full RSVP Roster →
            </button>
          </div>
        </div>

        {/* Modules Quick Access */}
        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl text-[#2B332C] font-medium mb-2">
              Invitation Administration
            </h3>
            <p className="text-xs text-[#786E5D] leading-relaxed mb-6">
              Manage draft content safely without altering what guests see until you publish.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigateTab('editor')}
                className="p-3 bg-[#F4EFE5] hover:bg-[#EBE2D4] rounded-xl text-left border border-[#DECDB7] transition-colors cursor-pointer"
              >
                <p className="text-xs font-semibold text-[#3B443D]">Content Editor</p>
                <p className="text-[11px] text-[#7E7464] mt-0.5">Details, venues & schedules</p>
              </button>

              <button
                onClick={() => onNavigateTab('rsvps')}
                className="p-3 bg-[#F4EFE5] hover:bg-[#EBE2D4] rounded-xl text-left border border-[#DECDB7] transition-colors cursor-pointer"
              >
                <p className="text-xs font-semibold text-[#3B443D]">RSVP Management</p>
                <p className="text-[11px] text-[#7E7464] mt-0.5">Responses, dietary & CSV</p>
              </button>

              <button
                onClick={() => onNavigateTab('gallery')}
                className="p-3 bg-[#F4EFE5] hover:bg-[#EBE2D4] rounded-xl text-left border border-[#DECDB7] transition-colors cursor-pointer"
              >
                <p className="text-xs font-semibold text-[#3B443D]">Photo Gallery</p>
                <p className="text-[11px] text-[#7E7464] mt-0.5">Milestone memories</p>
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                className="p-3 bg-[#F4EFE5] hover:bg-[#EBE2D4] rounded-xl text-left border border-[#DECDB7] transition-colors cursor-pointer"
              >
                <p className="text-xs font-semibold text-[#3B443D]">Cloud Database</p>
                <p className="text-[11px] text-[#7E7464] mt-0.5">Supabase sync & settings</p>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EAE1D1] text-[11px] text-[#8C806F]">
            Last modified: {invitation.lastPublishedAt ? new Date(invitation.lastPublishedAt).toLocaleString() : 'Just now'}
          </div>
        </div>
      </div>
    </div>
  );
};
