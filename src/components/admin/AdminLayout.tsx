import React, { useState, useEffect } from 'react';
import { InvitationData, RSVPRecord, AdminAuthSession } from '../../types/invitation';
import { getInvitations, getRSVPs } from '../../lib/invitationService';
import { AdminOverview } from './AdminOverview';
import { ContentEditor } from './ContentEditor';
import { RsvpManager } from './RsvpManager';
import { GalleryManager } from './GalleryManager';
import { VersionHistory } from './VersionHistory';
import { SettingsTab } from './SettingsTab';
import { AdminAuthModal } from './AdminAuthModal';
import { 
  LayoutDashboard, 
  FileEdit, 
  Users, 
  Image, 
  History, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Lock,
  ArrowLeft
} from 'lucide-react';

interface AdminLayoutProps {
  onOpenPublicSite: (slug: string) => void;
  onPreviewDraft: (slug: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onOpenPublicSite,
  onPreviewDraft,
}) => {
  const [session, setSession] = useState<AdminAuthSession>({ isAuthenticated: false });
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [currentInvitation, setCurrentInvitation] = useState<InvitationData | null>(null);
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);

  // Check persisted admin session in sessionStorage
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_session_auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.isAuthenticated) {
          setSession(parsed);
        }
      } catch {
        // Ignore
      }
    }
  }, []);

  // Load invitation & RSVP data
  const loadData = async () => {
    setLoading(true);
    const list = await getInvitations();
    setInvitations(list);
    if (list.length > 0) {
      const active = currentInvitation ? list.find(i => i.id === currentInvitation.id) || list[0] : list[0];
      setCurrentInvitation(active);
      const rsvpList = await getRSVPs(active.id);
      setRsvps(rsvpList);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLoginSuccess = (email: string) => {
    const newSession: AdminAuthSession = {
      isAuthenticated: true,
      userEmail: email,
    };
    setSession(newSession);
    sessionStorage.setItem('admin_session_auth', JSON.stringify(newSession));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session_auth');
    setSession({ isAuthenticated: false });
  };

  if (!session.isAuthenticated) {
    return (
      <AdminAuthModal
        onSuccess={handleLoginSuccess}
        onCancel={() => {
          if (currentInvitation) {
            onOpenPublicSite(currentInvitation.slug);
          }
        }}
      />
    );
  }

  if (loading || !currentInvitation) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-xs text-[#7A705E]">
        Loading administration console...
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'editor', label: 'Editor', icon: FileEdit },
    { id: 'rsvps', label: `RSVPs (${rsvps.length})`, icon: Users },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'versions', label: 'Versions', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#2D352F]">
      {/* Top Navigation Bar - Strict 3-zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E3DAC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl sm:text-2xl text-[#2B332C] font-semibold tracking-tight whitespace-nowrap shrink-0">
              Celebration Admin
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-[#5F7D65] px-2 py-0.5 bg-[#E3EBE3] rounded">
              v{currentInvitation.version || 1}
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#5F7D65] text-white shadow-xs font-semibold'
                      : 'text-[#615747] hover:text-[#282E29] hover:bg-[#F0E9DC]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Session */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenPublicSite(currentInvitation.slug)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5F7D65] hover:bg-[#4E6853] text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shadow-xs cursor-pointer"
            >
              <span>View Public</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 text-[#7A705F] hover:text-red-700 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Strip */}
        <div className="md:hidden flex items-center gap-1 px-4 py-2 bg-[#F2EDE2] border-t border-[#E3DAC8] overflow-x-auto text-xs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#5F7D65] text-white font-semibold'
                  : 'text-[#615747]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Administrative Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <AdminOverview
            invitation={currentInvitation}
            rsvps={rsvps}
            onNavigateTab={setActiveTab}
            onPreviewDraft={() => onPreviewDraft(currentInvitation.slug)}
            onOpenPublic={() => onOpenPublicSite(currentInvitation.slug)}
          />
        )}

        {activeTab === 'editor' && (
          <ContentEditor
            initialInvitation={currentInvitation}
            onPreviewDraft={() => onPreviewDraft(currentInvitation.slug)}
            onSaved={updated => {
              setCurrentInvitation(updated);
              setInvitations(prev => prev.map(i => i.id === updated.id ? updated : i));
            }}
          />
        )}

        {activeTab === 'rsvps' && (
          <RsvpManager
            invitationId={currentInvitation.id}
            rsvps={rsvps}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryManager
            gallery={currentInvitation.gallery}
            onUpdateGallery={newGallery => {
              const updated = { ...currentInvitation, gallery: newGallery };
              setCurrentInvitation(updated);
            }}
          />
        )}

        {activeTab === 'versions' && (
          <VersionHistory invitationId={currentInvitation.id} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </main>
    </div>
  );
};
