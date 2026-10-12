import { InvitationData, RSVPRecord } from '../types/invitation';

export const SAMPLE_INVITATION: InvitationData = {
  id: 'inv-lucas-gabriel-01',
  slug: 'lucas-gabriel-baptism-and-first-birthday',
  childName: 'Lucas Gabriel',
  childPhotoUrl: '/src/assets/images/baby_hero_portrait_1791792162704.jpg',
  coverTitle: 'Holy Baptism & 1st Birthday',
  parentsNames: 'Mark Vincent & Sophia Marie Dela Cruz',
  invitationMessage: 'With immense gratitude to the Lord, we joyfully invite you to celebrate the Holy Sacrament of Baptism and the first birthday of our precious son, Lucas Gabriel. Your presence and prayers as we welcome him into the Christian community and commemorate his first milestone will make this day truly unforgettable.',
  bibleVerse: '“Every good and perfect gift is from above, coming down from the Father of the heavenly lights.” — James 1:17',
  eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days from now
  rsvpDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(), // 18 days from now
  maxCapacity: 120,
  backgroundMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=tender-piano-ambient-112191.mp3',
  dressCodeTitle: 'Garden Chic & Sunday Best',
  dressCodeDescription: 'We kindly request our guests to dress in light, comfortable semi-formal attire reflecting our soft botanical palette: Sage Green, Cream, Sand Beige, and Warm Champagne Gold. Please avoid neon or heavy black clothing.',
  dressCodeColors: ['#5F7D65', '#EBE3D3', '#BF9C68', '#F6F1E7'],
  isSeparateAttendanceAllowed: true,
  events: [
    {
      id: 'evt-01',
      type: 'ceremony',
      title: 'The Holy Sacrament of Baptism',
      venueName: 'Santuario de San Jose Parish',
      venueAddress: 'Duke St. & Buffalo St., Greenhills, Mandaluyong City',
      dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60 * 10).toISOString(), // 10:00 AM
      endTime: '11:30 AM',
      mapUrl: 'https://maps.google.com/?q=Santuario+de+San+Jose+Greenhills',
      directionsNote: 'Guests are encouraged to arrive 15 minutes before the rite. Church parking is available at the rear pavilion.'
    },
    {
      id: 'evt-02',
      type: 'reception',
      title: 'Birthday Celebration & Feast',
      venueName: 'The Veranda Garden & Glass Pavilion',
      venueAddress: '14 Magnolia Lane, San Juan City',
      dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60 * 12).toISOString(), // 12:00 PM
      endTime: '4:00 PM',
      mapUrl: 'https://maps.google.com/?q=The+Veranda+Garden+Pavilion',
      directionsNote: 'Complimentary valet parking provided at the main gate. A 10-minute drive from the church.'
    }
  ],
  godparents: [
    { id: 'gp-1', name: 'Atty. Rafael & Dr. Carmela Santos', role: 'Principal Sponsor' },
    { id: 'gp-2', name: 'Engr. Dominic & Patricia Reyes', role: 'Principal Sponsor' },
    { id: 'gp-3', name: 'Matthew Liam Dela Cruz', role: 'Ninong' },
    { id: 'gp-4', name: 'Christian Paul Ramos', role: 'Ninong' },
    { id: 'gp-5', name: 'Dr. Joshua Kenneth Alcantara', role: 'Ninong' },
    { id: 'gp-6', name: 'Gabriel Angelo Gomez', role: 'Ninong' },
    { id: 'gp-7', name: 'Alyssa Bianca Mendoza', role: 'Ninang' },
    { id: 'gp-8', name: 'Camille Beatrice Hernandez', role: 'Ninang' },
    { id: 'gp-9', name: 'Katrina Clarisse Tan', role: 'Ninang' },
    { id: 'gp-10', name: 'Marianne Nicole Rivera', role: 'Ninang' }
  ],
  program: [
    { id: 'pr-1', timeLabel: '10:00 AM', title: 'Arrival & Welcome at Church', description: 'Gathering of Godparents and family for registration and photo session.' },
    { id: 'pr-2', timeLabel: '10:30 AM', title: 'Sacrament of Baptism Rites', description: 'Solemn liturgical ceremony and blessing of baby Lucas.' },
    { id: 'pr-3', timeLabel: '11:45 AM', title: 'Transit to Reception Pavilion', description: 'Scenic drive to the garden reception with welcome refreshments.' },
    { id: 'pr-4', timeLabel: '12:15 PM', title: 'Grand Family Entrance & Welcome Toast', description: 'Welcome remarks by proud parents Mark and Sophia.' },
    { id: 'pr-5', timeLabel: '12:30 PM', title: 'Buffet Banquet & Acoustic Live Set', description: 'Curated artisanal lunch menu accompanied by soothing live acoustic melodies.' },
    { id: 'pr-6', timeLabel: '01:45 PM', title: 'Godparent Dedications & Milestone Video', description: 'A look back at Lucas’s first 365 days of joy and blessings.' },
    { id: 'pr-7', timeLabel: '02:15 PM', title: 'Cake Cutting & Birthday Wish', description: 'Singing happy 1st birthday and lighting Lucas’s milestone candle.' },
    { id: 'pr-8', timeLabel: '03:00 PM', title: 'Interactive Games, Souvenir Distribution & Photo Booth', description: 'Fun activities for kids and kids-at-heart with bespoke gift favors.' }
  ],
  gallery: [
    {
      id: 'gal-1',
      imageUrl: '/src/assets/images/baby_hero_portrait_1791792162704.jpg',
      caption: 'Pure innocence and joy on Lucas’s milestone portrait session'
    },
    {
      id: 'gal-2',
      imageUrl: '/src/assets/images/baby_milestone_cake_1791792199573.jpg',
      caption: 'Artisanal olive & vanilla botanical 1st birthday cake'
    },
    {
      id: 'gal-3',
      imageUrl: '/src/assets/images/ceremony_church_venue_1791792175236.jpg',
      caption: 'The serene sacred hall of Santuario de San Jose'
    },
    {
      id: 'gal-4',
      imageUrl: '/src/assets/images/reception_garden_venue_1791792188173.jpg',
      caption: 'The Veranda Garden Pavilion prepared for family and loved ones'
    }
  ],
  closingTitle: 'With Grateful Hearts',
  closingMessage: 'We are truly blessed to have you in Lucas’s life. Your love, wisdom, and guidance will be the pillars that nurture him into a kind, faithful, and generous soul. Thank you for celebrating this milestone with our family.',
  status: 'published',
  lastPublishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  version: 1
};

export const SAMPLE_INITIAL_RSVPS: RSVPRecord[] = [
  {
    id: 'rsvp-001',
    invitationId: 'inv-lucas-gabriel-01',
    guestName: 'Atty. Rafael & Dr. Carmela Santos',
    contactNumber: '+63 917 555 1234',
    email: 'rafael.santos@example.com',
    status: 'attending',
    attendingCeremony: true,
    attendingReception: true,
    attendeesCount: 2,
    accompanyingGuests: 'Rafael Santos, Carmela Santos',
    dietaryNotes: 'No seafood for Carmela',
    message: 'We are honored to be Lucas’s godparents! May our dear Lord shower your growing family with boundless grace.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
  },
  {
    id: 'rsvp-002',
    invitationId: 'inv-lucas-gabriel-01',
    guestName: 'Matthew Liam Dela Cruz',
    contactNumber: '+63 918 222 3456',
    email: 'matthew.delacruz@example.com',
    status: 'attending',
    attendingCeremony: true,
    attendingReception: true,
    attendeesCount: 2,
    accompanyingGuests: 'Matthew Dela Cruz, Maria Dela Cruz',
    dietaryNotes: '',
    message: 'So proud of my brother Mark and sister Sophia! Can’t wait to hug little Lucas on his special baptism day!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString()
  },
  {
    id: 'rsvp-003',
    invitationId: 'inv-lucas-gabriel-01',
    guestName: 'Camille Beatrice Hernandez',
    contactNumber: '+63 920 888 7766',
    email: 'camille.hernandez@example.com',
    status: 'attending',
    attendingCeremony: true,
    attendingReception: true,
    attendeesCount: 1,
    accompanyingGuests: '',
    dietaryNotes: 'Vegetarian',
    message: 'Ninang Camille will be there with so much love and presents for baby Lucas!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 'rsvp-004',
    invitationId: 'inv-lucas-gabriel-01',
    guestName: 'Carlos & Teresa Valenzuela',
    contactNumber: '+63 917 333 9900',
    email: 'carlos.valenzuela@example.com',
    status: 'declined',
    attendingCeremony: false,
    attendingReception: false,
    attendeesCount: 0,
    accompanyingGuests: '',
    dietaryNotes: '',
    message: 'Dearest Mark and Sophia, we will be out of the country for a prior commitment, but our prayers and love are with baby Lucas on his baptism!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString()
  },
  {
    id: 'rsvp-005',
    invitationId: 'inv-lucas-gabriel-01',
    guestName: 'Engr. Dominic & Patricia Reyes',
    contactNumber: '+63 919 444 6543',
    email: 'dominic.reyes@example.com',
    status: 'attending',
    attendingCeremony: true,
    attendingReception: true,
    attendeesCount: 3,
    accompanyingGuests: 'Dominic Reyes, Patricia Reyes, Lucas Reyes (toddler)',
    dietaryNotes: '',
    message: 'Blessed to guide little Lucas. See you all at the church and reception!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  }
];
