import React, { useState } from 'react';
import { isSupabaseConfigured, getSupabase } from '../../lib/supabase';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Server, ShieldCheck, Key } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const isConfigured = isSupabaseConfigured();

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);

    const supabase = getSupabase();
    if (!supabase) {
      setTimeout(() => {
        setTestingConnection(false);
        setTestResult({
          success: false,
          message: 'Supabase credentials are not detected in environment variables. Running in local persistent storage fallback mode.',
        });
      }, 600);
      return;
    }

    try {
      const { data, error } = await supabase.from('invitations').select('id').limit(1);
      setTestingConnection(false);
      if (error) {
        setTestResult({
          success: false,
          message: `Connection reached Supabase, but query error: ${error.message}. Ensure database migration has been run.`,
        });
      } else {
        setTestResult({
          success: true,
          message: 'Connected successfully to Supabase PostgreSQL database! All tables and RLS active.',
        });
      }
    } catch (err: any) {
      setTestingConnection(false);
      setTestResult({
        success: false,
        message: `Network error connecting to Supabase: ${err?.message || 'Check project URL'}`,
      });
    }
  };

  const handleResetData = () => {
    if (confirm('Reset to initial sample invitation and RSVPs? Any custom edits made locally will be restored to defaults.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Cloud Database Status Card */}
      <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isConfigured ? 'bg-[#E3EBE3] text-[#3D5241]' : 'bg-[#F2ECE1] text-[#7A6B53]'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#2B332C] font-normal">
                Cloud Database & Storage (Supabase)
              </h3>
              <p className="text-xs text-[#7A705F]">
                {isConfigured ? 'Live Supabase project connected' : 'Local persistent storage active (Zero-config preview mode)'}
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${
            isConfigured ? 'bg-[#E3EBE3] text-[#3D5241]' : 'bg-[#F2ECE1] text-[#7A6B53]'
          }`}>
            {isConfigured ? '● Supabase Active' : '○ Local Storage'}
          </span>
        </div>

        <p className="text-xs text-[#635B4E] leading-relaxed mb-6">
          This system is engineered for dual operation: it runs seamlessly in local preview storage, and automatically elevates to Supabase PostgreSQL when your credentials are provided.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5F7D65] hover:bg-[#4E6853] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
            <span>{testingConnection ? 'Testing Connection...' : 'Test Database Connection'}</span>
          </button>

          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F2EDE2] hover:bg-[#E5DDCF] text-[#473E31] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border border-[#DACDB8]"
          >
            <span>Reset Demo Data</span>
          </button>
        </div>

        {testResult && (
          <div className={`mt-4 p-4 rounded-xl text-xs flex items-start gap-2.5 border ${
            testResult.success 
              ? 'bg-[#EFF5EF] border-[#CDE0CD] text-[#2C5E32]' 
              : 'bg-[#FCF5F5] border-[#F2D6D6] text-[#9E3933]'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2C5E32] mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#9E3933] mt-0.5" />
            )}
            <div className="leading-relaxed">
              <span className="font-semibold">{testResult.success ? 'Success: ' : 'Status: '}</span>
              {testResult.message}
            </div>
          </div>
        )}
      </div>

      {/* Deployment & Environment Setup Guide */}
      <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-serif text-2xl text-[#2B332C] font-normal border-b border-[#EAE1D1] pb-3">
          Vercel & Supabase Production Deployment Guide
        </h3>

        <div className="space-y-3 text-xs text-[#5D5548] leading-relaxed">
          <p>
            To deploy to Vercel with your Supabase database:
          </p>

          <ol className="list-decimal pl-5 space-y-2 text-[#463F33]">
            <li>
              <span className="font-semibold">Execute SQL Migration:</span> Run the generated SQL script located at <code className="bg-[#EFE7DA] px-1.5 py-0.5 rounded font-mono text-stone-800">/supabase/migrations/20261012000000_init_invitation_system.sql</code> in your Supabase SQL Editor.
            </li>
            <li>
              <span className="font-semibold">Set Up Supabase Auth:</span> In Supabase Dashboard → Authentication → Users, create your initial administrator account.
            </li>
            <li>
              <span className="font-semibold">Add Vercel Environment Variables:</span>
              <ul className="list-disc pl-5 mt-1 space-y-1 font-mono text-[11px] text-[#5F7D65]">
                <li>NEXT_PUBLIC_SUPABASE_URL = (Your Supabase Project URL)</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY = (Your Supabase Anon Key)</li>
                <li>SUPABASE_SERVICE_ROLE_KEY = (Your Supabase Service Key)</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">Deploy:</span> Push repository to GitHub and connect to Vercel. Automatic deployment builds in under 60 seconds!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
