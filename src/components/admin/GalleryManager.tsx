import React, { useState } from 'react';
import { GalleryItem } from '../../types/invitation';
import { Plus, Trash2, Image, Upload } from 'lucide-react';

interface GalleryManagerProps {
  gallery: GalleryItem[];
  onUpdateGallery: (gallery: GalleryItem[]) => void;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  gallery,
  onUpdateGallery,
}) => {
  const [newUrl, setNewUrl] = useState<string>('');
  const [newCaption, setNewCaption] = useState<string>('');

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      imageUrl: newUrl.trim(),
      caption: newCaption.trim() || undefined,
    };

    onUpdateGallery([...gallery, newItem]);
    setNewUrl('');
    setNewCaption('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to Data URL for instant preview & persistence
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newItem: GalleryItem = {
          id: `gal-${Date.now()}`,
          imageUrl: reader.result,
          caption: file.name.replace(/\.[^/.]+$/, ''),
        };
        onUpdateGallery([...gallery, newItem]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (id: string) => {
    onUpdateGallery(gallery.filter(g => g.id !== id));
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    onUpdateGallery(gallery.map(g => g.id === id ? { ...g, caption } : g));
  };

  return (
    <div className="space-y-6">
      {/* Upload & Add Bar */}
      <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 shadow-xs">
        <h3 className="font-serif text-xl text-[#2B332C] font-normal mb-2">
          Add Photo to Gallery
        </h3>
        <p className="text-xs text-[#7A705F] mb-6">
          Photos will be displayed in the public invitation's milestone polaroid gallery.
        </p>

        <form onSubmit={handleAddPhoto} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1">
              Image URL or Cloud Link
            </label>
            <input
              type="url"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="https://images... or Supabase storage URL"
              className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-xs"
            />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1">
              Caption
            </label>
            <input
              type="text"
              value={newCaption}
              onChange={e => setNewCaption(e.target.value)}
              placeholder="e.g. 6 Months Baby Smile"
              className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-[#5F7D65] hover:bg-[#4E6853] text-white rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer shadow-xs"
          >
            Add URL
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#EAE1D1] flex items-center justify-between">
          <span className="text-xs text-[#8A7D6B]">Or select an image from your device:</span>
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2EDE2] hover:bg-[#E5DDCF] text-[#473E31] rounded-xl text-xs font-semibold cursor-pointer border border-[#DACDB8]">
            <Upload className="w-3.5 h-3.5 text-[#5F7D65]" />
            <span>Upload File</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Gallery Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map(item => (
          <div
            key={item.id}
            className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 bg-[#ECE4D5] overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.caption || 'Milestone photo'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemovePhoto(item.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                title="Delete photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3">
              <input
                type="text"
                value={item.caption || ''}
                onChange={e => handleUpdateCaption(item.id, e.target.value)}
                placeholder="Add caption..."
                className="w-full px-2.5 py-1.5 bg-[#F6F1E7] border border-[#DECDB7] rounded-lg text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
