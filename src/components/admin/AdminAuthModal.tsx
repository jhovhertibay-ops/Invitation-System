import React, { useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase';
import { Lock, Mail, Key, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  onSuccess: (email: string) => void;
  onCancel: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState<string>('admin@celebration.com');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasSupabase = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const supabase = getSupabase();

    if (supabase && hasSupabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          onSuccess(data.user.email || email);
          setIsSubmitting(false);
          return;
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Authentication error');
        setIsSubmitting(false);
        return;
      }
    }

    // Default admin passcode fallback (e.g. "admin2026" or any password in demo preview)
    if (password === 'admin2026' || password === 'baptism2026' || !hasSupabase) {
      // In local mode or preview, accept password or default
      if (password && password.length < 4) {
        setErrorMsg('Password must be at least 4 characters.');
        setIsSubmitting(false);
        return;
      }
      onSuccess(email.trim());
      setIsSubmitting(false);
    } else {
      setErrorMsg('Incorrect administrator credentials. Use "admin2026" for preview or configure Supabase Auth in Settings.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FAF7F2] rounded-2xl border border-[#E3DAC8] shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#E5ECE5] text-[#4E6853] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl text-[#2B332C] font-semibold">
            Administrator Access
          </h2>
          <p className="text-xs text-[#7A7163] mt-1">
            Sign in to manage drafts, publish invitations, and view guest RSVPs.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#998C7B] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@celebration.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm text-[#2E352F] focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#998C7B] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password (e.g. admin2026)"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm text-[#2E352F] focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/40"
              />
            </div>
            {!hasSupabase && (
              <p className="text-[11px] text-[#86755E] mt-1.5 italic">
                Demo Preview Mode: enter passcode <span className="font-semibold text-[#5F7D65]">admin2026</span>
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 bg-[#EDE5D6] hover:bg-[#E2D8C7] text-[#4F4638] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 bg-[#5F7D65] hover:bg-[#4E6853] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Verifying...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
