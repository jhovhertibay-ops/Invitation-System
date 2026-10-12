import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  childName: string;
  childPhotoUrl: string;
  coverTitle: string;
  parentsNames: string;
  invitationMessage: string;
  bibleVerse: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  childName,
  childPhotoUrl,
  coverTitle,
  parentsNames,
  invitationMessage,
  bibleVerse,
}) => {
  return (
    <section className="relative pt-12 pb-16 px-4 max-w-3xl mx-auto text-center">
      {/* Decorative Cross / Monogram Seal */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center justify-center mb-6"
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#82715A] font-medium">
          <span className="w-8 h-px bg-[#D6C4A9]" />
          <span>Sacrament & First Milestone</span>
          <span className="w-8 h-px bg-[#D6C4A9]" />
        </div>
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2B332C] font-normal tracking-tight leading-[1.15] mb-2"
      >
        {coverTitle}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-xs uppercase tracking-[0.2em] text-[#7C6C58] mb-8 font-medium"
      >
        Celebrating the Gift of Life & Faith
      </motion.p>

      {/* Hero Child Photo Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative mx-auto w-64 sm:w-80 aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-[#FDFBF7] ring-1 ring-[#DECDB6] mb-8 group"
      >
        <img
          src={childPhotoUrl}
          alt={childName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
        />
        {/* Subtle vignette scrim */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-[#202721]/20 pointer-events-none" />
      </motion.div>

      {/* Child's Name Callout */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="text-xs uppercase tracking-[0.25em] text-[#86755E] mb-1 font-medium">
          Our Beloved Child
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#5F7D65] italic font-normal mb-3">
          {childName}
        </h2>
        <p className="text-xs sm:text-sm text-[#6A6357] font-medium tracking-wide">
          Son of <span className="font-serif italic text-base text-[#2E352F]">{parentsNames}</span>
        </p>
      </motion.div>

      {/* Botanical divider */}
      <div className="flex items-center justify-center gap-2 my-8 text-[#A8967E]">
        <span className="w-12 h-px bg-[#DFCEB6]" />
        <Sparkles className="w-3.5 h-3.5" />
        <span className="w-12 h-px bg-[#DFCEB6]" />
      </div>

      {/* Invitation Dedication Message */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-xl mx-auto bg-[#F8F4EC]/80 border border-[#E7DDCD] rounded-2xl p-6 sm:p-8 shadow-xs"
      >
        <p className="font-sans text-sm sm:text-base text-[#474B46] leading-relaxed mb-6 font-normal">
          {invitationMessage}
        </p>

        {bibleVerse && (
          <div className="pt-4 border-t border-[#DECDB7]/70">
            <p className="font-serif italic text-sm sm:text-base text-[#5F7D65] leading-relaxed">
              {bibleVerse}
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};
