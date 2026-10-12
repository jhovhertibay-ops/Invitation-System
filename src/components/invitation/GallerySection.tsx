import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../../types/invitation';
import { X, ZoomIn } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#86755E] mb-2 font-medium">
          Captured Memories
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2B332C] font-normal">
          Milestone Photo Gallery
        </h2>
        <div className="w-12 h-px bg-[#D6C4A9] mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            onClick={() => setSelectedPhoto(item)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-[#ECE4D5] border border-[#E3DAC8] shadow-xs cursor-pointer"
          >
            <img
              src={item.imageUrl}
              alt={item.caption || 'Celebration photo'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Scrim and hover affordance */}
            <div className="absolute inset-0 bg-[#252E26]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
              <ZoomIn className="w-6 h-6 mb-1 text-[#E5D2B3]" />
              {item.caption && (
                <p className="text-[11px] font-medium line-clamp-2 leading-tight">
                  {item.caption}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl max-h-[90vh] bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E3DAC8] shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-hidden flex-1 bg-black/5">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.caption || 'Enlarged photo'}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[75vh] object-contain mx-auto"
                />
              </div>

              {selectedPhoto.caption && (
                <div className="p-4 text-center bg-[#FAF7F2] border-t border-[#E3DAC8]">
                  <p className="font-serif italic text-base text-[#3C443E]">
                    {selectedPhoto.caption}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
