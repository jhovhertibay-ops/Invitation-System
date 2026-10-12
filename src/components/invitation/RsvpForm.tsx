import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { RSVPStatus, RSVPRecord } from '../../types/invitation';
import { submitGuestRSVP } from '../../lib/invitationService';
import { Check, Heart, Users, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface RsvpFormProps {
  invitationId: string;
  isSeparateAttendanceAllowed: boolean;
  rsvpDeadline?: string;
  maxCapacity: number;
  childName: string;
}

export const RsvpForm: React.FC<RsvpFormProps> = ({
  invitationId,
  isSeparateAttendanceAllowed,
  rsvpDeadline,
  maxCapacity,
  childName,
}) => {
  const [status, setStatus] = useState<RSVPStatus>('attending');
  const [guestName, setGuestName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [attendeesCount, setAttendeesCount] = useState<number>(1);
  const [accompanyingGuests, setAccompanyingGuests] = useState<string>('');
  const [attendingCeremony, setAttendingCeremony] = useState<boolean>(true);
  const [attendingReception, setAttendingReception] = useState<boolean>(true);
  const [dietaryNotes, setDietaryNotes] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>(''); // Bot protection

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<RSVPRecord | null>(null);

  // Deadline check
  const isExpired = rsvpDeadline ? Date.now() > new Date(rsvpDeadline).getTime() : false;
  const formattedDeadline = rsvpDeadline 
    ? new Date(rsvpDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Bot trap check
    if (honeypot) {
      return;
    }

    if (!guestName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (status === 'attending' && isSeparateAttendanceAllowed && !attendingCeremony && !attendingReception) {
      setErrorMessage('Please indicate whether you will attend the ceremony, reception, or both.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitGuestRSVP({
        invitationId,
        guestName: guestName.trim(),
        email: email.trim() || undefined,
        contactNumber: contactNumber.trim() || undefined,
        status,
        attendingCeremony: status === 'attending' ? attendingCeremony : false,
        attendingReception: status === 'attending' ? attendingReception : false,
        attendeesCount: status === 'attending' ? Math.max(1, attendeesCount) : 0,
        accompanyingGuests: status === 'attending' ? accompanyingGuests.trim() : undefined,
        dietaryNotes: dietaryNotes.trim() || undefined,
        message: message.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Unable to submit RSVP. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSubmittedRecord(res.record || null);
      setIsSubmitting(false);

      if (status === 'attending') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5F7D65', '#BF9C68', '#FAF7F2', '#EBE3D3']
        });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'A network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isExpired) {
    return (
      <section id="rsvp" className="py-12 px-4 max-w-2xl mx-auto">
        <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-8 text-center shadow-xs">
          <Clock className="w-8 h-8 text-[#938573] mx-auto mb-3" />
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2C342D] font-normal mb-2">
            RSVP Closed
          </h2>
          <p className="text-sm text-[#666055] leading-relaxed">
            The deadline for RSVP confirmations was on <span className="font-semibold">{formattedDeadline}</span>.
            If you need to update your attendance, please reach out directly to the parents.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-12 px-4 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#86755E] mb-2 font-medium">
          Kindly Respond
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2B332C] font-normal">
          Guest RSVP
        </h2>
        {formattedDeadline && (
          <p className="text-xs text-[#7A7163] mt-2">
            Please respond on or before <span className="font-semibold text-[#5F7D65]">{formattedDeadline}</span>
          </p>
        )}
        <div className="w-12 h-px bg-[#D6C4A9] mx-auto mt-3" />
      </div>

      <div className="bg-[#FAF7F2] border border-[#E3DAC8] rounded-2xl p-6 sm:p-10 shadow-xs">
        {submittedRecord ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-14 h-14 bg-[#E5ECE5] text-[#4E6853] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#2E352F] font-medium mb-2">
              Thank You, {submittedRecord.guestName}!
            </h3>

            <p className="text-sm text-[#5C645E] mb-6 max-w-md mx-auto leading-relaxed">
              {submittedRecord.status === 'attending'
                ? `Your confirmation for ${submittedRecord.attendeesCount} guest(s) has been recorded with joy. We look forward to celebrating with you!`
                : submittedRecord.status === 'declined'
                ? 'We will miss you at the celebration, but your prayers and warm wishes mean everything to baby Lucas!'
                : 'Your response has been noted. We hope you can make it, and look forward to your final confirmation soon!'}
            </p>

            <div className="p-4 bg-[#F2EDE2] rounded-xl text-xs text-[#6B6356] max-w-sm mx-auto mb-6 text-left space-y-1.5 border border-[#E4DAC7]">
              <p><span className="font-medium text-[#363229]">Status:</span> {submittedRecord.status === 'attending' ? 'Joyfully Attending' : submittedRecord.status === 'declined' ? 'Regretfully Unable to Attend' : 'Will Confirm Later'}</p>
              {submittedRecord.status === 'attending' && isSeparateAttendanceAllowed && (
                <>
                  <p><span className="font-medium text-[#363229]">Ceremony:</span> {submittedRecord.attendingCeremony ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium text-[#363229]">Reception:</span> {submittedRecord.attendingReception ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium text-[#363229]">Total Seats:</span> {submittedRecord.attendeesCount}</p>
                </>
              )}
            </div>

            <button
              onClick={() => setSubmittedRecord(null)}
              className="text-xs uppercase tracking-wider text-[#5F7D65] hover:text-[#4B6350] font-semibold underline underline-offset-4 cursor-pointer"
            >
              Need to modify or submit another response?
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot for bot protection */}
            <input
              type="text"
              name="company_title_trap"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Attendance Status Selector (3 Options) */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-3">
                Will you be able to attend? *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'attending', label: "Yes, I'll be there!" },
                  { id: 'declined', label: "Sorry, I can't attend" },
                  { id: 'tentative', label: "I'll confirm later" },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id as RSVPStatus)}
                    className={`py-3 px-3 text-xs sm:text-sm font-medium rounded-xl border text-center transition-all cursor-pointer ${
                      status === opt.id
                        ? 'bg-[#5F7D65] text-white border-[#5F7D65] shadow-xs'
                        : 'bg-[#F5EFE5] text-[#444D45] border-[#DECDB7] hover:border-[#BF9C68]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Separate attendance options if attending */}
            {status === 'attending' && isSeparateAttendanceAllowed && (
              <div className="p-4 bg-[#F5EFE5] rounded-xl border border-[#DECDB7] space-y-3">
                <p className="text-xs font-semibold text-[#544C3F] uppercase tracking-wider">
                  Event Attendance
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-[#3E453F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attendingCeremony}
                      onChange={e => setAttendingCeremony(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5F7D65] focus:ring-[#5F7D65] border-stone-300"
                    />
                    <span>Holy Baptism Ceremony</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-[#3E453F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attendingReception}
                      onChange={e => setAttendingReception(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5F7D65] focus:ring-[#5F7D65] border-stone-300"
                    />
                    <span>Birthday Reception</span>
                  </label>
                </div>
              </div>
            )}

            {/* Guest Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                Full Name / Family Name *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="e.g. Mr. & Mrs. Juan Santos"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-xl text-sm text-[#2E352F] placeholder-[#A49989] focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/40"
              />
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                  Email Address <span className="text-[#968A78] font-normal">(for reminders)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="juan@example.com"
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-xl text-sm text-[#2E352F] placeholder-[#A49989] focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/40"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  placeholder="+63 917 123 4567"
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-xl text-sm text-[#2E352F] placeholder-[#A49989] focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/40"
                />
              </div>
            </div>

            {/* Attendees Count & Accompanying Guests (only if attending) */}
            {status === 'attending' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                      Number of Attendees
                    </label>
                    <select
                      value={attendeesCount}
                      onChange={e => setAttendeesCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-xl text-sm text-[#2E352F] focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/40"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'person' : 'people'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                      Accompanying Guests Names
                    </label>
                    <input
                      type="text"
                      value={accompanyingGuests}
                      onChange={e => setAccompanyingGuests(e.target.value)}
                      placeholder="e.g. Maria Santos, Leo Santos (child)"
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-xl text-sm text-[#2E352F] placeholder-[#A49989] focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                    Dietary Restrictions or Special Requirements
                  </label>
                  <input
                    type="text"
                    value={dietaryNotes}
                    onChange={e => setDietaryNotes(e.target.value)}
                    placeholder="e.g. Vegetarian, nut allergy, high chair needed"
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-xl text-sm text-[#2E352F] placeholder-[#A49989] focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/40"
                  />
                </div>
              </>
            )}

            {/* Blessing or Dedication Message */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#665D4F] mb-1.5">
                Message & Blessing for Baby {childName}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Share your prayers, birthday wishes, or warm thoughts for Lucas and the parents..."
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#DECDB7] rounded-xl text-sm text-[#2E352F] placeholder-[#A49989] focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/40 resize-none"
              />
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-[#5F7D65] hover:bg-[#4E6853] text-[#FAF7F2] rounded-xl font-medium text-sm tracking-wider uppercase transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Recording RSVP...' : 'Submit RSVP Response'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
