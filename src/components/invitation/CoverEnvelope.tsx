import React from 'react';
import { motion } from 'motion/react';
import { Mail, Sparkles, ChevronDown } from 'lucide-react';

interface CoverEnvelopeProps {
  childName: string;
  coverTitle: string;
  eventDate: string;
  onOpen: () => void;
  isOpen: boolean;
}

export const CoverEnvelope: React.FC<CoverEnvelopeProps> = ({
  childName,
  coverTitle,
  eventDate,
  onOpen,
  isOpen,
}) => {
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#232B25]/85 backdrop-blur-md"
    >
      {/* Outer Envelope Container */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E3DAC9] p-8 sm:p-10 text-center overflow-hidden"
      >
        {/* Subtle decorative inner hairline border */}
        <div className="absolute inset-3 border border-[#E5DAC6] rounded-xl pointer-events-none" />

        {/* Vintage monogram emblem */}
        <div className="relative mx-auto w-16 h-16 mb-6 rounded-full bg-[#EFE8DC] border border-[#D5C2A5] flex items-center justify-center shadow-inner">
          <span className="font-serif text-2xl text-[#644B2C] italic font-semibold">
            {childName.slice(0, 1)}
          </span>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#5F7D65] flex items-center justify-center text-white text-[10px]">
            ✦
          </div>
        </div>

        {/* Header Kicker */}
        <p className="text-xs uppercase tracking-[0.25em] text-[#86755E] mb-2 font-medium">
          Cordially Invited to Celebrate
        </p>

        {/* Cover Title */}
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2C312E] font-medium leading-tight mb-2">
          {coverTitle}
        </h1>

        <div className="w-12 h-px bg-[#D6C5A9] mx-auto my-3" />

        {/* Child's Name */}
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5F7D65] italic font-normal mb-4">
          {childName}
        </h2>

        {/* Event Date */}
        <p className="text-sm text-[#666055] font-normal mb-8 tracking-wide">
          {formattedDate}
        </p>

        {/* Wax Seal Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="relative inline-flex items-center gap-3 px-8 py-3.5 bg-[#5F7D65] hover:bg-[#4E6853] text-[#FAF7F2] rounded-xl font-medium text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <Mail className="w-4 h-4 text-[#D8E6D8]" />
          <span>Open Invitation</span>
          <Sparkles className="w-4 h-4 text-[#E6CCA8]" />
        </motion.button>

        <p className="text-xs text-[#9B8F7C] mt-6 tracking-wide">
          Tap to view celebration details & RSVP
        </p>
      </motion.div>
    </motion.div>
  );
};
