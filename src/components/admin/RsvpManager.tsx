import React, { useState } from 'react';
import { RSVPRecord, RSVPStatus } from '../../types/invitation';
import { submitGuestRSVP, deleteRSVP } from '../../lib/invitationService';
import { 
  Download, 
  Search, 
  Filter, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  MessageSquare, 
  Utensils 
} from 'lucide-react';

interface RsvpManagerProps {
  invitationId: string;
  rsvps: RSVPRecord[];
  onRefresh: () => void;
}

export const RsvpManager: React.FC<RsvpManagerProps> = ({
  invitationId,
  rsvps,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New manual entry state
  const [newGuestName, setNewGuestName] = useState<string>('');
  const [newStatus, setNewStatus] = useState<RSVPStatus>('attending');
  const [newCount, setNewCount] = useState<number>(1);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newCeremony, setNewCeremony] = useState<boolean>(true);
  const [newReception, setNewReception] = useState<boolean>(true);
  const [newNotes, setNewNotes] = useState<string>('');

  // Calculations
  const attendingList = rsvps.filter(r => r.status === 'attending');
  const totalAttendingSeats = attendingList.reduce((acc, r) => acc + (r.attendeesCount || 1), 0);
  const totalCeremonySeats = attendingList.filter(r => r.attendingCeremony).reduce((acc, r) => acc + (r.attendeesCount || 1), 0);
  const totalReceptionSeats = attendingList.filter(r => r.attendingReception).reduce((acc, r) => acc + (r.attendeesCount || 1), 0);

  // Filtered rows
  const filteredRows = rsvps.filter(r => {
    const matchesSearch = 
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.contactNumber && r.contactNumber.includes(searchTerm));

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && r.status === filterStatus;
  });

  const handleExportCSV = () => {
    const headers = [
      'Guest Name',
      'Status',
      'Attendees Count',
      'Attending Ceremony',
      'Attending Reception',
      'Contact Number',
      'Email',
      'Accompanying Guests',
      'Dietary Notes',
      'Message',
      'Submitted At'
    ];

    const rows = rsvps.map(r => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      r.status,
      r.attendeesCount,
      r.attendingCeremony ? 'Yes' : 'No',
      r.attendingReception ? 'Yes' : 'No',
      `"${r.contactNumber || ''}"`,
      `"${r.email || ''}"`,
      `"${(r.accompanyingGuests || '').replace(/"/g, '""')}"`,
      `"${(r.dietaryNotes || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      r.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RSVP_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove RSVP response for "${name}"?`)) {
      await deleteRSVP(id);
      onRefresh();
    }
  };

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    await submitGuestRSVP({
      invitationId,
      guestName: newGuestName.trim(),
      email: newEmail.trim() || undefined,
      contactNumber: newPhone.trim() || undefined,
      status: newStatus,
      attendingCeremony: newStatus === 'attending' ? newCeremony : false,
      attendingReception: newStatus === 'attending' ? newReception : false,
      attendeesCount: newStatus === 'attending' ? newCount : 0,
      dietaryNotes: newNotes.trim() || undefined,
    });

    setIsAddModalOpen(false);
    setNewGuestName('');
    setNewNotes('');
    setNewEmail('');
    setNewPhone('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-4 shadow-2xs">
          <p className="text-xs uppercase tracking-wider text-[#8A7D6B] font-medium">Total Responses</p>
          <p className="font-serif text-3xl font-semibold text-[#2D352F] tabular-nums mt-1">{rsvps.length}</p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-4 shadow-2xs">
          <p className="text-xs uppercase tracking-wider text-[#5F7D65] font-semibold">Total Attending Seats</p>
          <p className="font-serif text-3xl font-semibold text-[#5F7D65] tabular-nums mt-1">{totalAttendingSeats}</p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-4 shadow-2xs">
          <p className="text-xs uppercase tracking-wider text-[#8A7D6B] font-medium">Ceremony Headcount</p>
          <p className="font-serif text-3xl font-semibold text-[#3A433C] tabular-nums mt-1">{totalCeremonySeats}</p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-4 shadow-2xs">
          <p className="text-xs uppercase tracking-wider text-[#8A7D6B] font-medium">Reception Headcount</p>
          <p className="font-serif text-3xl font-semibold text-[#BF9C68] tabular-nums mt-1">{totalReceptionSeats}</p>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#9C8F7E] absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by guest name, email..."
              className="w-full pl-9 pr-4 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-xs text-[#2E352F] focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/40"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F5EFE4] p-1 rounded-xl border border-[#DECDB7]">
            {['all', 'attending', 'declined', 'tentative'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 text-xs rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                  filterStatus === s
                    ? 'bg-[#5F7D65] text-white font-semibold'
                    : 'text-[#675E51] hover:text-[#2E352F]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F5EFE4] hover:bg-[#EAE2D3] text-[#423A2D] rounded-xl text-xs font-semibold uppercase tracking-wider border border-[#DECDB7] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add RSVP</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#5F7D65] hover:bg-[#4E6853] text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* RSVP Table */}
      <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5EFE5] border-b border-[#E3DAC8] text-[#716654] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Guest Name</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Seats</th>
                <th className="py-3 px-4 font-semibold">Ceremony</th>
                <th className="py-3 px-4 font-semibold">Reception</th>
                <th className="py-3 px-4 font-semibold">Dietary / Notes</th>
                <th className="py-3 px-4 font-semibold">Contact Info</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC] text-[#3D453E]">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#8C806F]">
                    No RSVP records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map(row => (
                  <tr key={row.id} className="hover:bg-[#F7F3EA] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#262D27]">
                      <div>{row.guestName}</div>
                      {row.accompanyingGuests && (
                        <div className="text-[11px] text-[#867B6B] mt-0.5">
                          With: {row.accompanyingGuests}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {row.status === 'attending' && (
                        <span className="inline-flex items-center gap-1 text-[#3D5241] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5F7D65]" />
                          Attending
                        </span>
                      )}
                      {row.status === 'declined' && (
                        <span className="inline-flex items-center gap-1 text-[#9E3933] font-semibold">
                          <XCircle className="w-3.5 h-3.5 text-[#9E3933]" />
                          Declined
                        </span>
                      )}
                      {row.status === 'tentative' && (
                        <span className="inline-flex items-center gap-1 text-[#8C7A62] font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[#BF9C68]" />
                          Tentative
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums font-semibold">
                      {row.status === 'attending' ? row.attendeesCount : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {row.status === 'attending' ? (row.attendingCeremony ? '✓ Yes' : '✕ No') : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {row.status === 'attending' ? (row.attendingReception ? '✓ Yes' : '✕ No') : '—'}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      {row.dietaryNotes ? (
                        <span className="text-[#8C4331]">{row.dietaryNotes}</span>
                      ) : (
                        <span className="text-[#A29787]">None</span>
                      )}
                      {row.message && (
                        <div className="text-[11px] text-[#69726A] italic mt-0.5 truncate" title={row.message}>
                          "{row.message}"
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[11px]">
                      {row.email && <div>{row.email}</div>}
                      {row.contactNumber && <div className="text-[#7D7363]">{row.contactNumber}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(row.id, row.guestName)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual RSVP Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FAF7F2] rounded-2xl border border-[#E3DAC8] shadow-2xl p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-[#2B332C] font-semibold mb-4">
              Add Manual RSVP Entry
            </h3>

            <form onSubmit={handleCreateManual} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1">
                  Guest / Family Name *
                </label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={e => setNewGuestName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-xs"
                  >
                    <option value="attending">Attending</option>
                    <option value="declined">Declined</option>
                    <option value="tentative">Tentative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1">
                    Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCount}
                    onChange={e => setNewCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1">
                  Dietary / Special Notes
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="e.g. Vegetarian, High chair"
                  className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#DECDB7] rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#EDE5D6] hover:bg-[#E2D8C7] text-[#4F4638] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5F7D65] hover:bg-[#4E6853] text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
