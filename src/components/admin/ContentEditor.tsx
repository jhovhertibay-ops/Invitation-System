import React, { useState, useEffect } from 'react';
import { InvitationData, EventDetail, Godparent, ProgramItem } from '../../types/invitation';
import { 
  saveInvitationDraft, 
  publishInvitation, 
  unpublishInvitation 
} from '../../lib/invitationService';
import { 
  Save, 
  Send, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Calendar, 
  Music, 
  AlertCircle, 
  CheckCircle2, 
  Copy,
  Clock,
  Sparkles
} from 'lucide-react';

interface ContentEditorProps {
  initialInvitation: InvitationData;
  onPreviewDraft: () => void;
  onSaved: (invitation: InvitationData) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  initialInvitation,
  onPreviewDraft,
  onSaved,
}) => {
  const [formData, setFormData] = useState<InvitationData>(initialInvitation);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeSubTab, setActiveSubTab] = useState<'basics' | 'venues' | 'godparents' | 'program' | 'theme' | 'rsvp'>('basics');
  const [unpublishConfirmOpen, setUnpublishConfirmOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-save debouncer
  useEffect(() => {
    const handler = setTimeout(() => {
      handleAutoSave();
    }, 2000);
    return () => clearTimeout(handler);
  }, [formData]);

  const handleAutoSave = async () => {
    // Only auto-save if something changed
    if (JSON.stringify(formData) === JSON.stringify(initialInvitation)) return;
    setSaveStatus('saving');
    try {
      const updated = await saveInvitationDraft(formData);
      setSaveStatus('saved');
      onSaved(updated);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  };

  const handleManualSave = async () => {
    setSaveStatus('saving');
    try {
      const updated = await saveInvitationDraft(formData);
      setSaveStatus('saved');
      onSaved(updated);
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err: any) {
      setSaveStatus('error');
      setErrorMessage(err?.message || 'Failed to save draft');
    }
  };

  const handlePublish = async () => {
    if (!formData.childName || !formData.parentsNames) {
      setErrorMessage('Please provide the child\'s name and parents\' names before publishing.');
      return;
    }

    setSaveStatus('saving');
    try {
      const { invitation: pubInv } = await publishInvitation(formData);
      setFormData(pubInv);
      setSaveStatus('saved');
      onSaved(pubInv);
      alert('🎉 Invitation published successfully! Guests can now view the public link.');
    } catch (err: any) {
      setSaveStatus('error');
      setErrorMessage(err?.message || 'Publishing failed');
    }
  };

  const handleUnpublish = async () => {
    try {
      const unpublished = await unpublishInvitation(formData.id);
      setFormData(unpublished);
      onSaved(unpublished);
      setUnpublishConfirmOpen(false);
      alert('Invitation has been unpublished. Public guests can no longer access it.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unpublish failed');
    }
  };

  // Godparent management
  const addGodparent = () => {
    const newGp: Godparent = {
      id: `gp-${Date.now()}`,
      name: 'New Godparent Name',
      role: 'Ninong',
    };
    setFormData(prev => ({ ...prev, godparents: [...prev.godparents, newGp] }));
  };

  const updateGodparent = (id: string, updates: Partial<Godparent>) => {
    setFormData(prev => ({
      ...prev,
      godparents: prev.godparents.map(g => g.id === id ? { ...g, ...updates } : g),
    }));
  };

  const removeGodparent = (id: string) => {
    setFormData(prev => ({
      ...prev,
      godparents: prev.godparents.filter(g => g.id !== id),
    }));
  };

  // Program schedule management
  const addProgramItem = () => {
    const newItem: ProgramItem = {
      id: `pr-${Date.now()}`,
      timeLabel: '04:00 PM',
      title: 'Activity Title',
      description: 'Activity details and notes',
    };
    setFormData(prev => ({ ...prev, program: [...prev.program, newItem] }));
  };

  const updateProgramItem = (id: string, updates: Partial<ProgramItem>) => {
    setFormData(prev => ({
      ...prev,
      program: prev.program.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  };

  const removeProgramItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      program: prev.program.filter(p => p.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${
            formData.status === 'published' 
              ? 'bg-[#E3EBE3] text-[#3D5241] border border-[#C5D7C5]'
              : 'bg-[#F2ECE1] text-[#7A6B53] border border-[#E0D4C0]'
          }`}>
            {formData.status === 'published' ? '● Published' : '○ Draft'}
          </span>

          <span className="text-xs text-[#827663]">
            {saveStatus === 'saving' && 'Autosaving draft...'}
            {saveStatus === 'saved' && '✓ Draft saved'}
            {saveStatus === 'error' && '⚠ Save error'}
            {saveStatus === 'idle' && 'Draft in sync'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleManualSave}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F2EDE2] hover:bg-[#E5DDCF] text-[#473F32] rounded-xl text-xs font-semibold tracking-wider transition-colors border border-[#DACDB8] cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={onPreviewDraft}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FAF7F2] hover:bg-[#F2EDE2] text-[#473F32] rounded-xl text-xs font-semibold tracking-wider transition-colors border border-[#DACDB8] cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#5F7D65]" />
            <span>Preview Draft</span>
          </button>

          {formData.status === 'published' ? (
            <button
              onClick={() => setUnpublishConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F9ECEB] hover:bg-[#F4DCDA] text-[#9E3933] rounded-xl text-xs font-semibold tracking-wider transition-colors border border-[#EACDCA] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Unpublish</span>
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5F7D65] hover:bg-[#4E6853] text-[#FAF7F2] rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Live</span>
            </button>
          )}

          {formData.status === 'published' && (
            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5F7D65] hover:bg-[#4E6853] text-[#FAF7F2] rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Republish Snapshot</span>
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Editor Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#F5EFE4] border border-[#DECDB7] rounded-xl overflow-x-auto text-xs font-medium">
        {[
          { id: 'basics', label: '1. Child & Dedication' },
          { id: 'venues', label: '2. Venues & Dates' },
          { id: 'godparents', label: '3. Godparents' },
          { id: 'program', label: '4. Program Timeline' },
          { id: 'theme', label: '5. Dress Code & Music' },
          { id: 'rsvp', label: '6. RSVP Capacity & Rules' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-[#5F7D65] text-white shadow-xs font-semibold'
                : 'text-[#645B4D] hover:text-[#2E352F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: BASICS */}
      {activeSubTab === 'basics' && (
        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-2xl text-[#2B332C] font-normal border-b border-[#EAE1D1] pb-3">
            Child & Family Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                Child's Full Name *
              </label>
              <input
                type="text"
                value={formData.childName}
                onChange={e => setFormData({ ...formData, childName: e.target.value })}
                className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                Parents' Names *
              </label>
              <input
                type="text"
                value={formData.parentsNames}
                onChange={e => setFormData({ ...formData, parentsNames: e.target.value })}
                className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                Cover Title
              </label>
              <input
                type="text"
                value={formData.coverTitle}
                onChange={e => setFormData({ ...formData, coverTitle: e.target.value })}
                className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                Custom URL Slug (for /invite/[slug])
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm font-mono text-[#5F7D65]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
              Child Portrait Photo URL
            </label>
            <input
              type="text"
              value={formData.childPhotoUrl}
              onChange={e => setFormData({ ...formData, childPhotoUrl: e.target.value })}
              className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
              Personalized Invitation Message
            </label>
            <textarea
              rows={4}
              value={formData.invitationMessage}
              onChange={e => setFormData({ ...formData, invitationMessage: e.target.value })}
              className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
              Bible Verse or Dedication Quote
            </label>
            <input
              type="text"
              value={formData.bibleVerse}
              onChange={e => setFormData({ ...formData, bibleVerse: e.target.value })}
              className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
            />
          </div>
        </div>
      )}

      {/* SUB-TAB 2: VENUES */}
      {activeSubTab === 'venues' && (
        <div className="space-y-6">
          {formData.events.map((evt, idx) => (
            <div key={evt.id} className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-xl text-[#2B332C] font-normal border-b border-[#EAE1D1] pb-2 flex items-center justify-between">
                <span>{evt.type === 'ceremony' ? 'Baptism Ceremony Details' : 'Birthday Reception Details'}</span>
                <span className="text-xs uppercase tracking-wider text-[#8C7B65] font-sans">Venue #{idx + 1}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={evt.title}
                    onChange={e => {
                      const updated = [...formData.events];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, events: updated });
                    }}
                    className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={evt.venueName}
                    onChange={e => {
                      const updated = [...formData.events];
                      updated[idx].venueName = e.target.value;
                      setFormData({ ...formData, events: updated });
                    }}
                    className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                  Complete Address
                </label>
                <input
                  type="text"
                  value={evt.venueAddress}
                  onChange={e => {
                    const updated = [...formData.events];
                    updated[idx].venueAddress = e.target.value;
                    setFormData({ ...formData, events: updated });
                  }}
                  className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={new Date(evt.dateTime).toISOString().slice(0, 16)}
                    onChange={e => {
                      const updated = [...formData.events];
                      updated[idx].dateTime = new Date(e.target.value).toISOString();
                      setFormData({ ...formData, events: updated });
                    }}
                    className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                    End Time Label
                  </label>
                  <input
                    type="text"
                    value={evt.endTime || ''}
                    onChange={e => {
                      const updated = [...formData.events];
                      updated[idx].endTime = e.target.value;
                      setFormData({ ...formData, events: updated });
                    }}
                    placeholder="e.g. 11:30 AM"
                    className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                    Google Maps Link
                  </label>
                  <input
                    type="url"
                    value={evt.mapUrl || ''}
                    onChange={e => {
                      const updated = [...formData.events];
                      updated[idx].mapUrl = e.target.value;
                      setFormData({ ...formData, events: updated });
                    }}
                    className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                    Parking / Directions Note
                  </label>
                  <input
                    type="text"
                    value={evt.directionsNote || ''}
                    onChange={e => {
                      const updated = [...formData.events];
                      updated[idx].directionsNote = e.target.value;
                      setFormData({ ...formData, events: updated });
                    }}
                    className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: GODPARENTS */}
      {activeSubTab === 'godparents' && (
        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAE1D1] pb-3">
            <div>
              <h2 className="font-serif text-2xl text-[#2B332C] font-normal">
                Godparents & Sponsors
              </h2>
              <p className="text-xs text-[#7B7160]">Principal Sponsors, Ninongs, and Ninangs</p>
            </div>
            <button
              onClick={addGodparent}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#5F7D65] hover:bg-[#4E6853] text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Godparent</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.godparents.map((gp) => (
              <div key={gp.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-[#F6F1E7] rounded-xl border border-[#DECDB7]">
                <input
                  type="text"
                  value={gp.name}
                  onChange={e => updateGodparent(gp.id, { name: e.target.value })}
                  placeholder="Godparent Name"
                  className="flex-1 px-3 py-1.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-lg text-sm"
                />

                <select
                  value={gp.role}
                  onChange={e => updateGodparent(gp.id, { role: e.target.value as any })}
                  className="px-3 py-1.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-lg text-xs font-medium"
                >
                  <option value="Principal Sponsor">Principal Sponsor</option>
                  <option value="Ninong">Ninong (Godfather)</option>
                  <option value="Ninang">Ninang (Godmother)</option>
                </select>

                <button
                  onClick={() => removeGodparent(gp.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PROGRAM */}
      {activeSubTab === 'program' && (
        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAE1D1] pb-3">
            <div>
              <h2 className="font-serif text-2xl text-[#2B332C] font-normal">
                Celebration Program & Schedule
              </h2>
              <p className="text-xs text-[#7B7160]">Chronological order of day activities</p>
            </div>
            <button
              onClick={addProgramItem}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#5F7D65] hover:bg-[#4E6853] text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Itinerary Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.program.map((item) => (
              <div key={item.id} className="p-4 bg-[#F6F1E7] rounded-xl border border-[#DECDB7] space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={item.timeLabel}
                    onChange={e => updateProgramItem(item.id, { timeLabel: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    className="w-32 px-3 py-1.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-lg text-xs font-bold"
                  />

                  <input
                    type="text"
                    value={item.title}
                    onChange={e => updateProgramItem(item.id, { title: e.target.value })}
                    placeholder="Activity Title"
                    className="flex-1 px-3 py-1.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-lg text-sm font-medium"
                  />

                  <button
                    onClick={() => removeProgramItem(item.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={item.description || ''}
                  onChange={e => updateProgramItem(item.id, { description: e.target.value })}
                  placeholder="Activity description (optional)"
                  className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-lg text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: THEME & MUSIC */}
      {activeSubTab === 'theme' && (
        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-2xl text-[#2B332C] font-normal border-b border-[#EAE1D1] pb-3">
            Attire, Palette & Ambient Music
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                Dress Code Title
              </label>
              <input
                type="text"
                value={formData.dressCodeTitle}
                onChange={e => setFormData({ ...formData, dressCodeTitle: e.target.value })}
                className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                Background Music Audio Stream URL
              </label>
              <input
                type="url"
                value={formData.backgroundMusicUrl || ''}
                onChange={e => setFormData({ ...formData, backgroundMusicUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
              Dress Code Guidelines & Advice
            </label>
            <textarea
              rows={3}
              value={formData.dressCodeDescription}
              onChange={e => setFormData({ ...formData, dressCodeDescription: e.target.value })}
              className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
              Palette Hex Colors (Comma-separated)
            </label>
            <input
              type="text"
              value={formData.dressCodeColors.join(', ')}
              onChange={e => setFormData({ 
                ...formData, 
                dressCodeColors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
              })}
              className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm font-mono"
            />
            <div className="flex items-center gap-3 mt-3">
              {formData.dressCodeColors.map((color, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: color }} />
                  <span className="text-[11px] font-mono text-stone-600">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAE1D1]">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
              Closing Thank You Title & Message
            </label>
            <input
              type="text"
              value={formData.closingTitle}
              onChange={e => setFormData({ ...formData, closingTitle: e.target.value })}
              className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm mb-3"
            />
            <textarea
              rows={3}
              value={formData.closingMessage}
              onChange={e => setFormData({ ...formData, closingMessage: e.target.value })}
              className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm resize-none"
            />
          </div>
        </div>
      )}

      {/* SUB-TAB 6: RSVP RULES */}
      {activeSubTab === 'rsvp' && (
        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-2xl text-[#2B332C] font-normal border-b border-[#EAE1D1] pb-3">
            RSVP Configuration & Guest Constraints
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                Maximum Guest Capacity (Hard Limit)
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                value={formData.maxCapacity}
                onChange={e => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm font-semibold"
              />
              <p className="text-[11px] text-[#7C7160] mt-1">
                The RSVP form will automatically reject submissions when this ceiling is reached.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                RSVP Confirmation Deadline
              </label>
              <input
                type="datetime-local"
                value={new Date(formData.rsvpDeadline).toISOString().slice(0, 16)}
                onChange={e => setFormData({ ...formData, rsvpDeadline: new Date(e.target.value).toISOString() })}
                className="w-full px-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm font-medium"
              />
              <p className="text-[11px] text-[#7C7160] mt-1">
                After this date, guests will be informed that online confirmations are closed.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#F5EFE5] rounded-xl border border-[#DECDB7]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isSeparateAttendanceAllowed}
                onChange={e => setFormData({ ...formData, isSeparateAttendanceAllowed: e.target.checked })}
                className="w-4 h-4 rounded text-[#5F7D65] focus:ring-[#5F7D65]"
              />
              <div>
                <p className="text-sm font-semibold text-[#3B443D]">
                  Allow Separate Ceremony & Reception Attendance Responses
                </p>
                <p className="text-xs text-[#7A705E]">
                  Enables guests to choose whether they are coming to the church ceremony, the reception feast, or both.
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Unpublish */}
      {unpublishConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FAF7F2] rounded-2xl border border-[#E3DAC8] shadow-2xl p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-[#9E3933] font-semibold mb-2">
              Unpublish Invitation?
            </h3>
            <p className="text-xs text-[#5D5546] leading-relaxed mb-6">
              This will immediately revoke public guest access. Your draft edits, versions, and all recorded RSVPs will remain completely safe. You can republish at any time using the exact same URL.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setUnpublishConfirmOpen(false)}
                className="px-4 py-2 bg-[#EDE5D6] hover:bg-[#E2D8C7] text-[#4F4638] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUnpublish}
                className="px-4 py-2 bg-[#9E3933] hover:bg-[#862E29] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Yes, Unpublish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
