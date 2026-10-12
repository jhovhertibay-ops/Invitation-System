import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface DressCodeSectionProps {
  title: string;
  description: string;
  colors: string[];
}

export const DressCodeSection: React.FC<DressCodeSectionProps> = ({
  title,
  description,
  colors,
}) => {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto text-center">
      <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-10 shadow-xs">
        <p className="text-xs uppercase tracking-[0.25em] text-[#86755E] mb-2 font-medium">
          Attire & Color Palette
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2B332C] font-normal mb-3">
          {title}
        </h2>
        
        <p className="text-xs sm:text-sm text-[#5C645E] max-w-lg mx-auto leading-relaxed mb-8">
          {description}
        </p>

        {/* Color Palette Swatches */}
        <div className="flex flex-col items-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9A8D7B] mb-3 font-semibold">
            Suggested Color Palette
          </p>
          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            {colors.map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-sm ring-1 ring-[#D8CBBA] transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] font-mono text-[#837867] tracking-wider uppercase">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
