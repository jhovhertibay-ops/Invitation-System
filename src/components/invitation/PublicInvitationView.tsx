import React, { useState } from 'react';
import { InvitationData } from '../../types/invitation';
import { CoverEnvelope } from './CoverEnvelope';
import { MusicPlayer } from './MusicPlayer';
import { HeroSection } from './HeroSection';
import { CountdownTimer } from './CountdownTimer';
import { EventsSection } from './EventsSection';
import { GodparentsSection } from './GodparentsSection';
import { ProgramTimeline } from './ProgramTimeline';
import { GallerySection } from './GallerySection';
import { DressCodeSection } from './DressCodeSection';
import { RsvpForm } from './RsvpForm';
import { ClosingSection } from './ClosingSection';
import { ArrowLeft, Eye, ShieldAlert } from 'lucide-react';

interface PublicInvitationViewProps {
  invitation: InvitationData;
  isDraftPreview?: boolean;
  onBackToAdmin?: () => void;
}

export const PublicInvitationView: React.FC<PublicInvitationViewProps> = ({
  invitation,
  isDraftPreview = false,
  onBackToAdmin,
}) => {
  const [envelopeOpen, setEnvelopeOpen] = useState<boolean>(false);
  const [musicAutoplayTrigger, setMusicAutoplayTrigger] = useState<boolean>(false);

  const handleOpenEnvelope = () => {
    setEnvelopeOpen(true);
    setMusicAutoplayTrigger(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C332D] selection:bg-[#E4DCCE]">
      {/* Draft Preview Bar for Administrator */}
      {isDraftPreview && (
        <div className="sticky top-0 z-40 bg-[#BF9C68] text-white px-4 py-2.5 text-xs font-medium flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Administrator Preview Mode: Viewing latest draft changes (Not yet live until published)</span>
          </div>
          {onBackToAdmin && (
            <button
              onClick={onBackToAdmin}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          )}
        </div>
      )}

      {/* Envelope Opening Experience */}
      <CoverEnvelope
        childName={invitation.childName}
        coverTitle={invitation.coverTitle}
        eventDate={invitation.eventDate}
        isOpen={envelopeOpen}
        onOpen={handleOpenEnvelope}
      />

      {/* Ambient Music Player */}
      <MusicPlayer
        audioUrl={invitation.backgroundMusicUrl}
        autoPlayTrigger={musicAutoplayTrigger}
      />

      {/* Main Invitation Document */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Navigation jump bar */}
        <nav className="flex items-center justify-center gap-4 sm:gap-8 py-4 mb-4 text-xs tracking-wider uppercase text-[#736859] border-b border-[#EBE3D3] overflow-x-auto">
          <a href="#ceremony" className="hover:text-[#5F7D65] transition-colors whitespace-nowrap">Ceremony</a>
          <a href="#reception" className="hover:text-[#5F7D65] transition-colors whitespace-nowrap">Reception</a>
          <a href="#program" className="hover:text-[#5F7D65] transition-colors whitespace-nowrap">Program</a>
          <a href="#gallery" className="hover:text-[#5F7D65] transition-colors whitespace-nowrap">Gallery</a>
          <a href="#rsvp" className="text-[#5F7D65] font-semibold hover:underline transition-colors whitespace-nowrap">RSVP Now</a>
        </nav>

        {/* 1. Hero Dedication */}
        <HeroSection
          childName={invitation.childName}
          childPhotoUrl={invitation.childPhotoUrl}
          coverTitle={invitation.coverTitle}
          parentsNames={invitation.parentsNames}
          invitationMessage={invitation.invitationMessage}
          bibleVerse={invitation.bibleVerse}
        />

        {/* 2. Live Countdown Timer */}
        <CountdownTimer targetDate={invitation.eventDate} />

        {/* 3. Ceremony & Reception Venues */}
        <div id="ceremony">
          <EventsSection events={invitation.events} />
        </div>

        {/* 4. Godparents List */}
        <GodparentsSection godparents={invitation.godparents} />

        {/* 5. Program Schedule */}
        <div id="program">
          <ProgramTimeline program={invitation.program} />
        </div>

        {/* 6. Milestone Photo Gallery */}
        <div id="gallery">
          <GallerySection gallery={invitation.gallery} />
        </div>

        {/* 7. Dress Code & Color Palette */}
        <DressCodeSection
          title={invitation.dressCodeTitle}
          description={invitation.dressCodeDescription}
          colors={invitation.dressCodeColors}
        />

        {/* 8. RSVP Confirmation */}
        <RsvpForm
          invitationId={invitation.id}
          isSeparateAttendanceAllowed={invitation.isSeparateAttendanceAllowed}
          rsvpDeadline={invitation.rsvpDeadline}
          maxCapacity={invitation.maxCapacity}
          childName={invitation.childName}
        />

        {/* 9. Closing & Thank You */}
        <ClosingSection
          title={invitation.closingTitle}
          message={invitation.closingMessage}
          parentsNames={invitation.parentsNames}
          childName={invitation.childName}
        />
      </main>
    </div>
  );
};
