import React from 'react';
import { motion } from 'motion/react';
import { ProgramItem } from '../../types/invitation';
import { Clock } from 'lucide-react';

interface ProgramTimelineProps {
  program: ProgramItem[];
}

export const ProgramTimeline: React.FC<ProgramTimelineProps> = ({ program }) => {
  if (!program || program.length === 0) return null;

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#86755E] mb-2 font-medium">
          Order of the Celebration
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2B332C] font-normal">
          Program of Activities
        </h2>
        <div className="w-12 h-px bg-[#D6C4A9] mx-auto mt-3" />
      </div>

      <div className="relative pl-6 sm:pl-8 border-l border-[#D8C7AF] space-y-6 sm:space-y-8 ml-4 sm:ml-8">
        {program.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="relative"
          >
            {/* Timeline bullet knot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#FAF7F2] border-2 border-[#5F7D65]" />

            <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-xl p-4 sm:p-5 shadow-2xs hover:border-[#5F7D65]/40 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-[#5F7D65]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7D6B53]">
                  {item.timeLabel}
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#2E352F] font-medium leading-snug">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs sm:text-sm text-[#666E67] mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
