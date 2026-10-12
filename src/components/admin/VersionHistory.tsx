import React, { useState, useEffect } from 'react';
import { PublishedSnapshot } from '../../types/invitation';
import { getInvitationVersions } from '../../lib/invitationService';
import { History, CheckCircle2, Calendar, FileText } from 'lucide-react';

interface VersionHistoryProps {
  invitationId: string;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ invitationId }) => {
  const [versions, setVersions] = useState<PublishedSnapshot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVersion, setSelectedVersion] = useState<PublishedSnapshot | null>(null);

  useEffect(() => {
    loadVersions();
  }, [invitationId]);

  const loadVersions = async () => {
    setLoading(true);
    const list = await getInvitationVersions(invitationId);
    setVersions(list);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 shadow-xs">
        <h3 className="font-serif text-2xl text-[#2B332C] font-normal mb-1">
          Publication Snapshots & Version History
        </h3>
        <p className="text-xs text-[#7A705F] mb-6">
          Every time you click "Publish", a permanent snapshot is recorded. Public guests always see the active published snapshot, ensuring draft edits never leak before you are ready.
        </p>

        {loading ? (
          <p className="text-xs text-[#8C806F]">Loading version archive...</p>
        ) : versions.length === 0 ? (
          <div className="p-6 bg-[#F5EFE5] rounded-xl text-center text-xs text-[#7B715F]">
            No publication snapshots recorded yet. Publish your draft to create version 1.
          </div>
        ) : (
          <div className="divide-y divide-[#EAE1D1] border border-[#E5DAC8] rounded-xl overflow-hidden bg-[#FBF9F5]">
            {versions.map((ver, idx) => (
              <div
                key={ver.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F6F1E8] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E3EBE3] text-[#3D5241] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#2A312B]">
                        Snapshot Version {ver.versionNumber}
                      </span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 bg-[#5F7D65] text-white rounded text-[10px] font-semibold uppercase tracking-wider">
                          Active Public
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#786E5E] mt-0.5">
                      Published on {new Date(ver.publishedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVersion(ver)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2EDE2] hover:bg-[#E5DDCF] text-[#473E31] rounded-lg text-xs font-medium cursor-pointer border border-[#DACDB8]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#5F7D65]" />
                  <span>Inspect Snapshot</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Snapshot Inspect Modal */}
      {selectedVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#FAF7F2] rounded-2xl border border-[#E3DAC8] shadow-2xl p-6 max-h-[80vh] flex flex-col">
            <h3 className="font-serif text-2xl text-[#2B332C] font-semibold mb-2">
              Snapshot Version {selectedVersion.versionNumber}
            </h3>
            <p className="text-xs text-[#7A705F] mb-4">
              Published at: {new Date(selectedVersion.publishedAt).toLocaleString()}
            </p>

            <div className="overflow-y-auto flex-1 p-4 bg-[#F5EFE5] rounded-xl text-xs font-mono space-y-2 border border-[#E5DAC8]">
              <p><span className="font-bold">Child Name:</span> {selectedVersion.snapshotContent.childName}</p>
              <p><span className="font-bold">Title:</span> {selectedVersion.snapshotContent.coverTitle}</p>
              <p><span className="font-bold">Event Date:</span> {selectedVersion.snapshotContent.eventDate}</p>
              <p><span className="font-bold">Max Capacity:</span> {selectedVersion.snapshotContent.maxCapacity}</p>
              <p><span className="font-bold">Venues Count:</span> {selectedVersion.snapshotContent.events.length}</p>
              <p><span className="font-bold">Godparents Count:</span> {selectedVersion.snapshotContent.godparents.length}</p>
              <p><span className="font-bold">Program Items:</span> {selectedVersion.snapshotContent.program.length}</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setSelectedVersion(null)}
                className="px-4 py-2 bg-[#5F7D65] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
