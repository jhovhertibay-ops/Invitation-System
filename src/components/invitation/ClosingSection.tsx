import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface ClosingSectionProps {
  title: string;
  message: string;
  parentsNames: string;
  childName: string;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({
  title,
  message,
  parentsNames,
  childName,
}) => {
  return (
    <footer className="py-16 px-4 max-w-3xl mx-auto text-center border-t border-[#E5DAC8] mt-12">
      <div className="flex items-center justify-center gap-2 mb-4 text-[#BF9C68]">
        <Sparkles className="w-4 h-4" />
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl text-[#2B332C] font-normal mb-3">
        {title}
      </h2>

      <p className="font-serif italic text-base sm:text-lg text-[#555C54] max-w-xl mx-auto leading-relaxed mb-8">
        "{message}"
      </p>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-[#86755E] font-medium">
          With Love and Gratitude,
        </p>
        <p className="font-serif text-xl sm:text-2xl text-[#5F7D65] italic font-medium">
          {parentsNames} & Baby {childName}
        </p>
      </div>

      <div className="mt-12 pt-6 border-t border-[#EFE8DC] text-[11px] text-[#A69B8A] tracking-wider uppercase">
        Baptism & 1st Birthday Online Invitation System · Joyfully Designed for Family Milestones
      </div>
    </footer>
  );
};
