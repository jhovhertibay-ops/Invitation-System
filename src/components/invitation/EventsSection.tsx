import React from 'react';
import { motion } from 'motion/react';
import { EventDetail } from '../../types/invitation';
import { MapPin, Clock, Calendar, ExternalLink, Navigation } from 'lucide-react';

interface EventsSectionProps {
  events: EventDetail[];
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const generateIcsCalendar = (event: EventDetail) => {
    const startDate = new Date(event.dateTime);
    // Format YYYYMMDDTHHmmssZ
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours default

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Baptism Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.directionsNote || ''}`,
      `LOCATION:${event.venueName}, ${event.venueAddress}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEventImage = (type: string) => {
    if (type === 'ceremony') {
      return '/src/assets/images/ceremony_church_venue_1791792175236.jpg';
    }
    return '/src/assets/images/reception_garden_venue_1791792188173.jpg';
  };

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#86755E] mb-2 font-medium">
          Venues & Schedules
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2B332C] font-normal">
          Celebration Locations
        </h2>
        <div className="w-12 h-px bg-[#D6C4A9] mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {events.map((evt, idx) => {
          const dateObj = new Date(evt.dateTime);
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
          const formattedTime = dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <motion.div
              key={evt.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex flex-col bg-[#FAF7F2] rounded-2xl border border-[#E3DAC8] overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300"
            >
              {/* Venue Photo Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-[#ECE4D5]">
                <img
                  src={getEventImage(evt.type)}
                  alt={evt.venueName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-103"
                />
                <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase text-[#5F7D65] border border-[#DECDB3]">
                  {evt.type === 'ceremony' ? 'Sacrament Ceremony' : 'Birthday Reception'}
                </div>
              </div>

              {/* Venue Details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-[#2C342D] font-medium leading-snug mb-3">
                    {evt.title}
                  </h3>

                  <div className="space-y-3 text-sm text-[#4F5550] mb-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-[#5F7D65] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#2C342D]">{formattedDate}</p>
                        <p className="text-xs text-[#7A7468]">{formattedTime} {evt.endTime ? `to ${evt.endTime}` : ''}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#5F7D65] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#2C342D]">{evt.venueName}</p>
                        <p className="text-xs text-[#7A7468] leading-relaxed">{evt.venueAddress}</p>
                      </div>
                    </div>

                    {evt.directionsNote && (
                      <div className="p-3 bg-[#F2EDE2] rounded-xl text-xs text-[#6B6456] leading-relaxed border border-[#E4DAC7]">
                        <span className="font-medium text-[#464033]">Note: </span>
                        {evt.directionsNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Map and Calendar */}
                <div className="pt-4 border-t border-[#E8DFC9] flex flex-wrap items-center gap-2">
                  {evt.mapUrl && (
                    <a
                      href={evt.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#5F7D65] hover:bg-[#4E6853] text-[#FAF7F2] rounded-xl text-xs font-medium tracking-wide transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Directions</span>
                    </a>
                  )}

                  <button
                    onClick={() => generateIcsCalendar(evt)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#ECE4D5] hover:bg-[#DFD4C0] text-[#3F4840] rounded-xl text-xs font-medium tracking-wide transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#5F7D65]" />
                    <span>Add to Calendar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
