/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InvitationData } from './types/invitation';
import { getInvitationBySlug, getInvitations } from './lib/invitationService';
import { PublicInvitationView } from './components/invitation/PublicInvitationView';
import { AdminLayout } from './components/admin/AdminLayout';
import { Shield, Sparkles, Lock, ArrowLeft, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'draft-preview'>('public');
  const [currentSlug, setCurrentSlug] = useState<string>('lucas-gabriel-baptism-and-first-birthday');
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  // Parse path or hash on initial load
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith('/admin') || hash === '#admin') {
        setCurrentView('admin');
      } else if (path.startsWith('/preview') || hash === '#preview') {
        setCurrentView('draft-preview');
      } else if (path.startsWith('/invite/')) {
        const slug = path.replace('/invite/', '').split('/')[0];
        if (slug) setCurrentSlug(slug);
        setCurrentView('public');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Fetch invitation whenever slug or view mode changes
  useEffect(() => {
    async function load() {
      setLoading(true);
      const forAdmin = currentView === 'draft-preview' || currentView === 'admin';
      const result = await getInvitationBySlug(currentSlug, { forAdmin });

      if (result.invitation) {
        setInvitation(result.invitation);
        setIsPublished(result.isPublished);
      } else {
        // Fallback to first invitation if slug not found
        const all = await getInvitations();
        if (all.length > 0) {
          setInvitation(all[0]);
          setCurrentSlug(all[0].slug);
          setIsPublished(all[0].status === 'published');
        }
      }
      setLoading(false);
    }
    load();
  }, [currentSlug, currentView]);

  // View Switcher Handlers
  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  const handleOpenPublic = (slug?: string) => {
    if (slug) setCurrentSlug(slug);
    window.location.hash = '';
    setCurrentView('public');
  };

  const handlePreviewDraft = (slug?: string) => {
    if (slug) setCurrentSlug(slug);
    window.location.hash = 'preview';
    setCurrentView('draft-preview');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C332D]">
      {/* Quick View Mode Switcher Header Bar for Preview & Evaluation */}
      <aside aria-label="Environment Mode Bar" className="bg-[#242A25] text-[#ECE7DF] px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-[#353D36]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#78A081]" />
          <span className="font-medium tracking-wide">
            Baptismal & 1st Birthday Invitation System
          </span>
          <span className="hidden sm:inline text-stone-500">·</span>
          <span className="hidden sm:inline text-stone-400">
            {currentView === 'admin' ? 'Administrator Mode' : currentView === 'draft-preview' ? 'Draft Preview Mode' : 'Guest Public View'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenPublic(currentSlug)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'public'
                ? 'bg-[#5F7D65] text-white'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            Guest View
          </button>

          <button
            onClick={() => handlePreviewDraft(currentSlug)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'draft-preview'
                ? 'bg-[#BF9C68] text-white'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            Draft Preview
          </button>

          <button
            onClick={handleOpenAdmin}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'admin'
                ? 'bg-[#5F7D65] text-white'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Admin Console</span>
          </button>
        </div>
      </aside>

      {/* Main Content Router */}
      {currentView === 'admin' ? (
        <AdminLayout
          onOpenPublicSite={handleOpenPublic}
          onPreviewDraft={handlePreviewDraft}
        />
      ) : loading ? (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
          <RefreshCw className="w-6 h-6 animate-spin text-[#5F7D65] mb-3" />
          <p className="font-serif italic text-lg text-[#5F7D65]">Preparing invitation...</p>
        </div>
      ) : !isPublished && currentView === 'public' ? (
        // Unpublished / Private state for public visitors
        <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-8 shadow-md">
            <div className="w-12 h-12 rounded-full bg-[#F2EDE2] text-[#86755E] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-[#2B332C] font-normal mb-2">
              Invitation Currently Private
            </h2>
            <p className="text-xs text-[#635A4B] leading-relaxed mb-6">
              This celebration invitation has not yet been published or is temporarily unlisted. Please contact the hosts for information.
            </p>
            <button
              onClick={handleOpenAdmin}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#5F7D65] hover:bg-[#4E6853] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Host Administrator Login</span>
            </button>
          </div>
        </div>
      ) : invitation ? (
        <PublicInvitationView
          invitation={invitation}
          isDraftPreview={currentView === 'draft-preview'}
          onBackToAdmin={handleOpenAdmin}
        />
      ) : (
        <div className="min-h-[70vh] flex items-center justify-center p-8 text-center text-xs text-stone-500">
          Invitation could not be found.
        </div>
      )}
    </div>
  );
}
