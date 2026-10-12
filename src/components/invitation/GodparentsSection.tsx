import React from 'react';
import { motion } from 'motion/react';
import { Godparent } from '../../types/invitation';
import { ShieldCheck, Heart } from 'lucide-react';

interface GodparentsSectionProps {
  godparents: Godparent[];
}

export const GodparentsSection: React.FC<GodparentsSectionProps> = ({ godparents }) => {
  if (!godparents || godparents.length === 0) return null;

  const principalSponsors = godparents.filter(g => g.role === 'Principal Sponsor');
  const ninongs = godparents.filter(g => g.role === 'Ninong');
  const ninangs = godparents.filter(g => g.role === 'Ninang');

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#86755E] mb-2 font-medium">
          Spiritual Guardians & Mentors
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2B332C] font-normal">
          Beloved Godparents
        </h2>
        <p className="text-xs text-[#7A7163] max-w-md mx-auto mt-2 leading-relaxed">
          Chosen to guide and pray for our child on his journey of faith and life.
        </p>
        <div className="w-12 h-px bg-[#D6C4A9] mx-auto mt-3" />
      </div>

      <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
        {/* Principal Sponsors */}
        {principalSponsors.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
              <ShieldCheck className="w-4 h-4 text-[#BF9C68]" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C7A62]">
                Principal Sponsors
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {principalSponsors.map(sponsor => (
                <div 
                  key={sponsor.id}
                  className="py-2.5 px-4 bg-[#F5EFE5] rounded-xl text-sm font-medium text-[#2E352F] border border-[#E8DEC9]"
                >
                  {sponsor.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ninongs & Ninangs 2-column split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#EAE1D1]">
          {/* Ninongs */}
          {ninongs.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#5F7D65] mb-3 text-center sm:text-left">
                Ninongs (Godfathers)
              </h4>
              <ul className="space-y-2">
                {ninongs.map(ninong => (
                  <li 
                    key={ninong.id} 
                    className="text-sm text-[#444C44] py-1.5 px-3 bg-[#F8F5EE] rounded-lg border border-[#EDE5D6]"
                  >
                    {ninong.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ninangs */}
          {ninangs.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#5F7D65] mb-3 text-center sm:text-left">
                Ninangs (Godmothers)
              </h4>
              <ul className="space-y-2">
                {ninangs.map(ninang => (
                  <li 
                    key={ninang.id} 
                    className="text-sm text-[#444C44] py-1.5 px-3 bg-[#F8F5EE] rounded-lg border border-[#EDE5D6]"
                  >
                    {ninang.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
